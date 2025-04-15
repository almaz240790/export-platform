import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/app/api/auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Схема валидации для ответа на отзыв
const responseSchema = z.object({
  response: z.string().min(3, 'Ответ должен содержать не менее 3 символов'),
});

// POST: Ответ на отзыв
export async function POST(
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

    const reviewId = params.id;

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

    // Находим отзыв
    const review = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Отзыв не найден' },
        { status: 404 }
      );
    }

    // Проверяем, что отзыв относится к компании пользователя
    if (review.companyId !== user.company.id) {
      return NextResponse.json(
        { error: 'Нет доступа к этому отзыву' },
        { status: 403 }
      );
    }

    // Получаем данные из запроса
    const body = await request.json();

    // Валидация входящих данных
    const result = responseSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.format();
      return NextResponse.json(
        { error: 'Ошибка валидации', details: errors },
        { status: 400 }
      );
    }

    // Обновляем отзыв, добавляя ответ
    const updatedReview = await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        response: result.data.response,
      },
    });

    return NextResponse.json(
      { message: 'Ответ успешно добавлен', review: updatedReview },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при ответе на отзыв:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 