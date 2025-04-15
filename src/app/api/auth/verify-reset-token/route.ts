import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Отсутствует токен сброса пароля' },
        { status: 400 }
      );
    }

    // Проверяем, существует ли пользователь с таким токеном и не истек ли срок его действия
    const user = await prisma.user.findFirst({
      where: {
        resetCode: token,
        resetCodeExpires: {
          gt: new Date() // Токен еще не истек
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Недействительный или истекший токен сброса пароля' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { valid: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при проверке токена сброса пароля:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 