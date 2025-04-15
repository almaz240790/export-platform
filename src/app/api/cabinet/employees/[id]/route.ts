import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/app/api/auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';

// DELETE: Удаление сотрудника из компании
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

    const employeeId = params.id;

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

    // Проверяем права доступа (только ADMIN может удалять сотрудников)
    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Недостаточно прав для выполнения операции' },
        { status: 403 }
      );
    }

    // Не даем удалить самого себя
    if (employeeId === currentUser.id) {
      return NextResponse.json(
        { error: 'Вы не можете удалить свою учетную запись' },
        { status: 400 }
      );
    }

    // Находим сотрудника, которого нужно удалить
    const employee = await prisma.user.findUnique({
      where: {
        id: employeeId,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Сотрудник не найден' },
        { status: 404 }
      );
    }

    // Проверяем, что сотрудник принадлежит компании текущего пользователя
    if (employee.companyId !== currentUser.company.id) {
      return NextResponse.json(
        { error: 'Сотрудник не принадлежит вашей компании' },
        { status: 403 }
      );
    }

    // Отвязываем сотрудника от компании (не удаляем пользователя)
    await prisma.user.update({
      where: {
        id: employeeId,
      },
      data: {
        companyId: null,
        role: 'CLIENT', // Сбрасываем роль на CLIENT
      },
    });

    return NextResponse.json(
      { message: 'Сотрудник успешно удален из компании' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при удалении сотрудника:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 