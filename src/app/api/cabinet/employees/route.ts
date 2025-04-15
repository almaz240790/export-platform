import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/app/api/auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Схема валидации для добавления сотрудника
const employeeSchema = z.object({
  email: z.string().email('Некорректный формат email'),
  role: z.enum(['ADMIN', 'COMPANY']),
});

// GET: Получение списка сотрудников компании
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    // Находим текущего пользователя и его компанию
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
      include: {
        company: true,
      },
    });

    if (!currentUser || !currentUser.company) {
      return NextResponse.json(
        { error: 'Компания не найдена' },
        { status: 404 }
      );
    }

    // Получаем всех сотрудников компании
    const employees = await prisma.user.findMany({
      where: {
        companyId: currentUser.company.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      { employees },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при получении списка сотрудников:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// POST: Добавление нового сотрудника
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    // Находим текущего пользователя и его компанию
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
      include: {
        company: true,
      },
    });

    if (!currentUser || !currentUser.company) {
      return NextResponse.json(
        { error: 'Компания не найдена' },
        { status: 404 }
      );
    }

    // Проверяем права доступа (только ADMIN может добавлять сотрудников)
    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Недостаточно прав для выполнения операции' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Валидация входящих данных
    const result = employeeSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.format();
      return NextResponse.json(
        { error: 'Ошибка валидации', details: errors },
        { status: 400 }
      );
    }

    const { email, role } = result.data;

    // Проверяем, существует ли пользователь с таким email
    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      // Если пользователь уже связан с этой компанией
      if (user.companyId === currentUser.company.id) {
        return NextResponse.json(
          { error: 'Пользователь уже является сотрудником компании' },
          { status: 409 }
        );
      }

      // Если пользователь уже связан с другой компанией
      if (user.companyId) {
        return NextResponse.json(
          { error: 'Пользователь уже связан с другой компанией' },
          { status: 409 }
        );
      }

      // Обновляем существующего пользователя, связывая его с компанией
      user = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          companyId: currentUser.company.id,
          role,
        },
      });
    } else {
      // Создаем нового пользователя, если такого нет
      user = await prisma.user.create({
        data: {
          email,
          role,
          company: {
            connect: {
              id: currentUser.company.id,
            },
          },
        },
      });

      // TODO: Отправить приглашение пользователю по email
    }

    return NextResponse.json(
      { 
        message: 'Сотрудник успешно добавлен', 
        employee: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          image: user.image,
          role: user.role,
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка при добавлении сотрудника:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 