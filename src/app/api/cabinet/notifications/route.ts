import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/app/api/auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';

// GET: Получение уведомлений пользователя
export async function GET(request: Request) {
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

    // Получаем уведомления пользователя
    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      { notifications },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при получении уведомлений:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// POST: Создание нового уведомления (используется системой)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);

    // Только аутентифицированные запросы (и в идеале с правами админа)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    // Получаем данные из запроса
    const body = await request.json();
    const { userId, type, title, text } = body;

    // Проверка обязательных полей
    if (!userId || !type || !title || !text) {
      return NextResponse.json(
        { error: 'Не все обязательные поля указаны' },
        { status: 400 }
      );
    }

    // Создаем новое уведомление
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message: text,
      },
    });

    return NextResponse.json(
      { message: 'Уведомление успешно создано', notification },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка при создании уведомления:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 