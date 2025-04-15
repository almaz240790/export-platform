import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/app/api/auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Схема валидации для обновления категории
const categoryUpdateSchema = z.object({
  name: z.string().min(2, 'Название должно содержать минимум 2 символа'),
  description: z.string().optional(),
});

// Функция для генерации слага из названия
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// PUT: Обновление категории
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const categoryId = params.id;

    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
      include: {
        company: true,
      },
    });

    if (!user || !user.company) {
      return NextResponse.json(
        { error: 'Компания не найдена' },
        { status: 404 }
      );
    }

    // Находим категорию
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      );
    }

    // Проверяем, что категория принадлежит компании пользователя
    if (category.companyId && category.companyId !== user.company.id) {
      return NextResponse.json(
        { error: 'Нет доступа к этой категории' },
        { status: 403 }
      );
    }

    // Получаем данные из запроса
    const body = await request.json();

    // Валидация входящих данных
    const result = categoryUpdateSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.format();
      return NextResponse.json(
        { error: 'Ошибка валидации', details: errors },
        { status: 400 }
      );
    }

    const { name, description } = result.data;
    const newSlug = generateSlug(name);

    // Проверяем уникальность слага, если он изменился
    if (newSlug !== category.slug) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          slug: newSlug,
          id: { not: categoryId },
        },
      });

      if (existingCategory) {
        return NextResponse.json(
          { error: 'Категория с таким названием уже существует' },
          { status: 409 }
        );
      }
    }

    // Обновляем категорию
    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        slug: newSlug,
        description,
      },
    });

    return NextResponse.json(
      { message: 'Категория успешно обновлена', category: updatedCategory },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при обновлении категории:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// DELETE: Удаление категории
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const categoryId = params.id;

    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
      include: {
        company: true,
      },
    });

    if (!user || !user.company) {
      return NextResponse.json(
        { error: 'Компания не найдена' },
        { status: 404 }
      );
    }

    // Находим категорию
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      );
    }

    // Проверяем, что категория принадлежит компании пользователя
    if (category.companyId && category.companyId !== user.company.id) {
      return NextResponse.json(
        { error: 'Нет доступа к этой категории' },
        { status: 403 }
      );
    }

    // Удаляем категорию
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(
      { message: 'Категория успешно удалена' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при удалении категории:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 