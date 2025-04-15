import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/app/api/auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';

// DELETE: Удаление изображения
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

    const imageId = params.id;

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

    // Находим изображение
    const image = await prisma.image.findUnique({
      where: {
        id: imageId,
      },
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Изображение не найдено' },
        { status: 404 }
      );
    }

    // Проверяем, что изображение принадлежит компании пользователя
    if (image.companyId !== user.company.id) {
      return NextResponse.json(
        { error: 'Нет доступа к этому изображению' },
        { status: 403 }
      );
    }

    // Не позволяем удалить логотип через этот API
    if (image.isLogo) {
      return NextResponse.json(
        { error: 'Логотип нельзя удалить. Используйте API компании для смены логотипа.' },
        { status: 400 }
      );
    }

    // Удаляем файл с диска
    try {
      const filePath = join(process.cwd(), 'public', image.url);
      await unlink(filePath);
    } catch (fileError) {
      console.error('Ошибка при удалении файла с диска:', fileError);
      // Продолжаем, даже если файл не удалось удалить с диска
    }

    // Удаляем запись из базы данных
    await prisma.image.delete({
      where: {
        id: imageId,
      },
    });

    return NextResponse.json(
      { message: 'Изображение успешно удалено' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при удалении изображения:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 