import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/app/api/auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';

// DELETE: Удаление документа
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

    const documentId = params.id;

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

    // Находим документ
    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Документ не найден' },
        { status: 404 }
      );
    }

    // Проверяем, что документ принадлежит компании пользователя
    if (document.companyId !== user.company.id) {
      return NextResponse.json(
        { error: 'Нет доступа к этому документу' },
        { status: 403 }
      );
    }

    // Удаляем файл с диска
    try {
      const filePath = join(process.cwd(), 'public', document.url);
      await unlink(filePath);
    } catch (fileError) {
      console.error('Ошибка при удалении файла с диска:', fileError);
      // Продолжаем, даже если файл не удалось удалить с диска
    }

    // Удаляем запись из базы данных
    await prisma.document.delete({
      where: {
        id: documentId,
      },
    });

    return NextResponse.json(
      { message: 'Документ успешно удален' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при удалении документа:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 