import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/app/api/auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Схема валидации для обновления компании
const companyUpdateSchema = z.object({
  name: z.string().min(2, 'Название компании должно содержать не менее 2 символов'),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Некорректный формат email').optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  inn: z.string().regex(/^\d{10}$|^\d{12}$/, 'ИНН должен содержать 10 или 12 цифр').optional().or(z.literal('')),
  kpp: z.string().regex(/^\d{9}$/, 'КПП должен содержать 9 цифр').optional().or(z.literal('')),
  ogrn: z.string().regex(/^\d{13}$|^\d{15}$/, 'ОГРН должен содержать 13 или 15 цифр').optional().or(z.literal('')),
  bankAccount: z.string().regex(/^\d{20}$/, 'Расчетный счет должен содержать 20 цифр').optional().or(z.literal('')),
  bankName: z.string().optional(),
  bankBik: z.string().regex(/^\d{9}$/, 'БИК должен содержать 9 цифр').optional().or(z.literal('')),
  deliveryTime: z.string().optional(),
});

// Проверка типа файла
const isValidImage = (mimetype: string) => {
  return ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mimetype);
};

// GET: Получение информации о компании пользователя
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
        company: {
          include: {
            images: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Если есть компания, добавляем URL логотипа
    let company = user.company;
    let logoUrl;
    
    if (company) {
      // Находим изображение, которое помечено как логотип (можно добавить в схему prisma поле isLogo)
      const logoImage = company.images.find(img => img.isLogo);
      if (logoImage) {
        logoUrl = logoImage.url;
      }
    }

    return NextResponse.json(
      { company, logoUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при получении информации о компании:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// POST: Обновление информации о компании
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    // Получаем данные из формы
    const formData = await request.formData();
    
    // Извлекаем файл логотипа, если он был отправлен
    const logoFile = formData.get('logo') as File | null;
    
    // Собираем остальные данные компании
    const companyData: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (key !== 'logo' && typeof value === 'string') {
        companyData[key] = value;
      }
    });

    // Валидация входящих данных о компании
    const result = companyUpdateSchema.safeParse(companyData);
    if (!result.success) {
      const errors = result.error.format();
      return NextResponse.json(
        { error: 'Ошибка валидации', details: errors },
        { status: 400 }
      );
    }

    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
      include: {
        company: {
          include: {
            images: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Переменная для хранения URL логотипа
    let logoUrl: string | undefined;

    // Обрабатываем загрузку логотипа, если файл был отправлен
    if (logoFile) {
      const fileSize = logoFile.size; // размер в байтах
      const mimetype = logoFile.type;
      
      // Проверка размера (5MB)
      if (fileSize > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Размер файла не должен превышать 5MB' },
          { status: 400 }
        );
      }
      
      // Проверка типа файла
      if (!isValidImage(mimetype)) {
        return NextResponse.json(
          { error: 'Недопустимый формат файла. Разрешены только изображения (JPEG, PNG, WebP, GIF)' },
          { status: 400 }
        );
      }
      
      try {
        // Создаем директорию для загрузки, если она не существует
        const uploadDir = join(process.cwd(), 'public/uploads');
        
        // Генерируем уникальное имя файла
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = join(uploadDir, fileName);
        
        // Читаем содержимое файла
        const fileBuffer = await logoFile.arrayBuffer();
        
        // Записываем файл
        await writeFile(filePath, Buffer.from(fileBuffer));
        
        // Формируем URL для доступа к файлу
        logoUrl = `/uploads/${fileName}`;
      } catch (error) {
        console.error('Ошибка при сохранении файла:', error);
        return NextResponse.json(
          { error: 'Не удалось сохранить логотип' },
          { status: 500 }
        );
      }
    }

    // Подготавливаем данные для обновления или создания компании
    const companyUpdateData = {
      ...result.data,
      // Добавляем deliveryTime, потому что это обязательное поле, но могло быть не передано (установим дефолтное значение)
      deliveryTime: result.data.deliveryTime || 'По договоренности',
    };

    // Обновляем или создаем компанию
    let company;
    let logoImage;

    if (user.company) {
      // Обновляем существующую компанию
      company = await prisma.company.update({
        where: {
          id: user.company.id,
        },
        data: companyUpdateData,
      });

      // Если был загружен новый логотип
      if (logoUrl) {
        // Проверяем, есть ли уже логотип
        const existingLogo = user.company.images.find(img => img.isLogo);
        
        if (existingLogo) {
          // Обновляем существующий логотип
          logoImage = await prisma.image.update({
            where: {
              id: existingLogo.id,
            },
            data: {
              url: logoUrl,
            },
          });
        } else {
          // Создаем новый логотип
          logoImage = await prisma.image.create({
            data: {
              url: logoUrl,
              isLogo: true,
              company: {
                connect: {
                  id: company.id,
                },
              },
            },
          });
        }
      }
    } else {
      // Создаем новую компанию
      company = await prisma.company.create({
        data: {
          ...companyUpdateData,
          employees: {
            connect: {
              id: user.id,
            }
          }
        },
      });

      // Если был загружен логотип, создаем запись в базе
      if (logoUrl) {
        logoImage = await prisma.image.create({
          data: {
            url: logoUrl,
            isLogo: true,
            company: {
              connect: {
                id: company.id,
              },
            },
          },
        });
      }
    }

    // Добавляем URL логотипа в ответ
    const responseCompany = {
      ...company,
      logoUrl: logoImage ? logoImage.url : undefined,
    };

    return NextResponse.json(
      { message: 'Информация о компании успешно обновлена', company: responseCompany },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при обновлении информации о компании:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 