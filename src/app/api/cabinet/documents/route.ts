import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/app/api/auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Создаем модель документа в Prisma, если ее нет
// Это можно сделать позже через миграцию

// GET: Получение всех документов компании
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

    // Получаем все документы компании
    const documents = await prisma.document.findMany({
      where: {
        companyId: user.company.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      { documents },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при получении документов:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// POST: Загрузка нового документа
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

    // Получаем данные из формы
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Файл не выбран' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Название документа обязательно' },
        { status: 400 }
      );
    }

    // Проверка размера файла (максимум 10MB)
    const fileSize = file.size;
    if (fileSize > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Размер файла не должен превышать 10MB' },
        { status: 400 }
      );
    }

    // Создаем директорию для загрузки, если она не существует
    const uploadDir = join(process.cwd(), 'public/uploads/documents');
    await mkdir(uploadDir, { recursive: true });

    try {
      // Генерируем уникальное имя файла
      const fileExt = file.name.split('.').pop() || '';
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = join(uploadDir, fileName);

      // Читаем содержимое файла
      const fileBuffer = await file.arrayBuffer();

      // Записываем файл
      await writeFile(filePath, Buffer.from(fileBuffer));

      // Формируем URL для доступа к файлу
      const fileUrl = `/uploads/documents/${fileName}`;

      // Сохраняем информацию о документе в базе данных
      const document = await prisma.document.create({
        data: {
          name,
          url: fileUrl,
          type: file.type,
          size: fileSize,
          company: {
            connect: {
              id: user.company.id,
            },
          },
        },
      });

      return NextResponse.json(
        { message: 'Документ успешно загружен', document },
        { status: 201 }
      );
    } catch (fileError) {
      console.error('Ошибка при сохранении файла:', fileError);
      return NextResponse.json(
        { error: 'Не удалось сохранить документ' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Ошибка при загрузке документа:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 