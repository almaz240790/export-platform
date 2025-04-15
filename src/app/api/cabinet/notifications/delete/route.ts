import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/app/api/auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';

// POST: Удаление уведомления или всех уведомлений
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Получаем данные из запроса
    const body = await request.json();
    const { notificationId, deleteAll } = body;

    // Если запрошено удаление всех уведомлений
    if (deleteAll) {
      await prisma.notification.deleteMany({
        where: {
          userId: user.id,
        },
      });

      return NextResponse.json(
        { message: 'Все уведомления удалены' },
        { status: 200 }
      );
    } 
    // Если запрошено удаление конкретного уведомления
    else if (notificationId) {
      // Проверяем, что уведомление принадлежит пользователю
      const notification = await prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId: user.id,
        },
      });

      if (!notification) {
        return NextResponse.json(
          { error: 'Уведомление не найдено' },
          { status: 404 }
        );
      }

      // Удаляем уведомление
      await prisma.notification.delete({
        where: {
          id: notificationId,
        },
      });

      return NextResponse.json(
        { message: 'Уведомление удалено' },
        { status: 200 }
      );
    }
    // Если ни один из параметров не передан
    else {
      return NextResponse.json(
        { error: 'Не указан ID уведомления или флаг удаления всех уведомлений' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Ошибка при удалении уведомлений:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 