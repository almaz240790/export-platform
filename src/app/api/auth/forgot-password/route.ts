import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendResetCode as sendEmailCode } from '@/lib/email';
import { sendResetCode as sendSMSCode } from '@/lib/sms';

export async function POST(request: Request) {
  try {
    const { email, phone } = await request.json();

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email или телефон обязательны' },
        { status: 400 }
      );
    }

    // Проверяем существование пользователя
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { phone: phone || undefined }
        ]
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Генерируем 6-значный код
    const resetCode = crypto.randomInt(100000, 999999).toString();
    const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

    // Сохраняем код в базе
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetCode,
        resetCodeExpires
      }
    });

    // Отправляем код
    if (email) {
      const sent = await sendEmailCode(email, resetCode);
      if (!sent) {
        return NextResponse.json(
          { error: 'Ошибка при отправке email' },
          { status: 500 }
        );
      }
    } else if (phone) {
      const sent = await sendSMSCode(phone, resetCode);
      if (!sent) {
        return NextResponse.json(
          { error: 'Ошибка при отправке SMS' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: 'Код восстановления отправлен' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 