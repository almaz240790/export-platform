import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/app/api/auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';

// GET: Получение всех отзывов о компании
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

    // Получаем все отзывы о компании
    const reviews = await prisma.review.findMany({
      where: {
        companyId: user.company.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      { reviews },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при получении отзывов:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 