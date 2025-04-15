import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/app/api/auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Проверка типа файла
const isValidImage = (mimetype: string) => {
  return ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mimetype);
};

// GET: Получение всех изображений компании
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

    // Получаем все изображения компании
    const images = await prisma.image.findMany({
      where: {
        companyId: user.company.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      { images },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при получении изображений:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// POST: Загрузка новых изображений
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
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Не выбрано ни одного файла' },
        { status: 400 }
      );
    }

    // Создаем директорию для загрузки, если она не существует
    const uploadDir = join(process.cwd(), 'public/uploads');
    await mkdir(uploadDir, { recursive: true });

    // Массив для хранения загруженных изображений
    const uploadedImages = [];

    // Обрабатываем каждый файл
    for (const file of files) {
      const fileSize = file.size; // размер в байтах
      const mimetype = file.type;

      // Проверка размера (5MB)
      if (fileSize > 5 * 1024 * 1024) {
        continue; // Пропускаем слишком большие файлы
      }

      // Проверка типа файла
      if (!isValidImage(mimetype)) {
        continue; // Пропускаем неподдерживаемые типы файлов
      }

      try {
        // Генерируем уникальное имя файла
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = join(uploadDir, fileName);

        // Читаем содержимое файла
        const fileBuffer = await file.arrayBuffer();

        // Записываем файл
        await writeFile(filePath, Buffer.from(fileBuffer));

        // Формируем URL для доступа к файлу
        const fileUrl = `/uploads/${fileName}`;

        // Сохраняем информацию о файле в базе данных
        const image = await prisma.image.create({
          data: {
            url: fileUrl,
            isLogo: false, // Обычное изображение, не логотип
            company: {
              connect: {
                id: user.company.id,
              },
            },
          },
        });

        uploadedImages.push(image);
      } catch (fileError) {
        console.error('Ошибка при обработке файла:', fileError);
        // Продолжаем с другими файлами в случае ошибки
      }
    }

    return NextResponse.json(
      { 
        message: `Успешно загружено ${uploadedImages.length} изображений`, 
        images: uploadedImages
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка при загрузке изображений:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 