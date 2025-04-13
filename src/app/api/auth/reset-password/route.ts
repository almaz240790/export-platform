import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { code, password, email, phone } = await request.json();

    if (!code || !password) {
      return NextResponse.json(
        { error: 'Код и пароль обязательны' },
        { status: 400 }
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email или телефон обязательны' },
        { status: 400 }
      );
    }

    // Ищем пользователя
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { phone: phone || undefined }
        ],
        resetCode: code,
        resetCodeExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Неверный код или срок его действия истек' },
        { status: 400 }
      );
    }

    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Обновляем пароль и очищаем код
    await prisma.user.update({
      where: { id: user.id },
      data: {
        hashedPassword,
        resetCode: null,
        resetCodeExpires: null
      }
    });

    return NextResponse.json(
      { message: 'Пароль успешно изменен' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in reset password:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 