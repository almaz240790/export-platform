import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/app/api/auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';

// POST: Отметить уведомление как прочитанное
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
    const { notificationId } = body;

    // Если передан конкретный ID уведомления
    if (notificationId) {
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

      // Обновляем уведомление
      await prisma.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          read: true,
        },
      });

      return NextResponse.json(
        { message: 'Уведомление отмечено как прочитанное' },
        { status: 200 }
      );
    } 
    // Если notificationId не передан, отмечаем все уведомления как прочитанные
    else {
      await prisma.notification.updateMany({
        where: {
          userId: user.id,
          read: false,
        },
        data: {
          read: true,
        },
      });

      return NextResponse.json(
        { message: 'Все уведомления отмечены как прочитанные' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Ошибка при отметке уведомлений как прочитанных:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 