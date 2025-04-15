import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Схема валидации входящих данных
const registerSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать не менее 2 символов'),
  email: z.string().email('Некорректный формат email'),
  password: z.string().min(8, 'Пароль должен содержать не менее 8 символов'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Валидация входящих данных
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.format();
      return NextResponse.json(
        { error: 'Ошибка валидации', details: errors },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Проверка, существует ли пользователь с таким email
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      );
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role: 'CLIENT',
      },
    });

    // Удаляем hashedPassword из ответа для безопасности
    const { hashedPassword: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: 'Пользователь успешно зарегистрирован', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 