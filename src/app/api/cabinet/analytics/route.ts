import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/app/api/auth/[...nextauth]/auth.config';
import { prisma } from '@/lib/prisma';

// GET: Получение аналитических данных компании
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    // Получаем параметр временного диапазона
    const url = new URL(request.url);
    const range = url.searchParams.get('range') || 'week';

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

    // Получаем данные аналитики
    // В реальном проекте здесь можно добавить интеграцию со сторонними сервисами аналитики
    // или запросы к соответствующим таблицам в базе данных

    // Для демонстрации генерируем примерные данные
    const analyticsData = generateMockAnalyticsData(range, user.company.id);

    return NextResponse.json(analyticsData, { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении данных аналитики:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// Функция для генерации примерных данных аналитики
function generateMockAnalyticsData(range: string, companyId: string) {
  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  let viewsData: number[] = [];
  let messagesData: number[] = [];
  let dataLength = 0;

  // Задаем длину массивов в зависимости от временного диапазона
  switch (range) {
    case 'week':
      dataLength = 7; // 7 дней
      break;
    case 'month':
      dataLength = 30; // 30 дней
      break;
    case 'year':
      dataLength = 12; // 12 месяцев
      break;
    default:
      dataLength = 7;
  }

  // Генерируем случайные данные для просмотров и сообщений
  for (let i = 0; i < dataLength; i++) {
    viewsData.push(getRandomInt(10, 100));
    messagesData.push(getRandomInt(0, 15));
  }

  // Генерируем распределение оценок
  const reviewDistribution = [
    getRandomInt(5, 20), // 5 звезд
    getRandomInt(3, 15), // 4 звезды
    getRandomInt(1, 10), // 3 звезды
    getRandomInt(0, 5),  // 2 звезды
    getRandomInt(0, 3)   // 1 звезда
  ];

  // Рассчитываем средний рейтинг
  const totalReviews = reviewDistribution.reduce((sum, count) => sum + count, 0);
  const weightedSum = reviewDistribution.reduce((sum, count, index) => sum + count * (5 - index), 0);
  const averageRating = totalReviews > 0 ? weightedSum / totalReviews : 0;

  // Данные о географии просмотров
  const locations = [
    { name: 'Москва', value: getRandomInt(30, 50) },
    { name: 'Санкт-Петербург', value: getRandomInt(15, 30) },
    { name: 'Казань', value: getRandomInt(5, 15) },
    { name: 'Екатеринбург', value: getRandomInt(5, 15) },
    { name: 'Другие', value: getRandomInt(10, 25) },
  ];

  return {
    views: viewsData,
    messages: messagesData,
    reviews: {
      average: averageRating,
      count: totalReviews,
      distribution: reviewDistribution
    },
    locations: locations
  };
} 