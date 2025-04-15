'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { BarChart, LineChart, PieChart } from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Регистрируем компоненты ChartJS
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  BarElement
);

interface AnalyticsData {
  views: number[];
  messages: number[];
  reviews: ReviewData;
  locations: LocationData[];
}

interface ReviewData {
  average: number;
  count: number;
  distribution: number[];
}

interface LocationData {
  name: string;
  value: number;
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/cabinet/analytics?range=${timeRange}`);
      if (!response.ok) {
        throw new Error('Не удалось загрузить аналитику');
      }
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Ошибка при загрузке аналитики:', error);
      toast.error('Не удалось загрузить данные аналитики');
    } finally {
      setIsLoading(false);
    }
  };

  const getLabelsByTimeRange = () => {
    if (timeRange === 'week') {
      return ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    } else if (timeRange === 'month') {
      return Array.from({ length: 30 }, (_, i) => `${i + 1}`);
    } else {
      return ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    }
  };

  const viewsData = {
    labels: getLabelsByTimeRange(),
    datasets: [
      {
        label: 'Просмотры профиля',
        data: analyticsData?.views || [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const messagesData = {
    labels: getLabelsByTimeRange(),
    datasets: [
      {
        label: 'Сообщения',
        data: analyticsData?.messages || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const reviewsData = {
    labels: ['5★', '4★', '3★', '2★', '1★'],
    datasets: [
      {
        label: 'Распределение оценок',
        data: analyticsData?.reviews.distribution || [0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const locationsData = {
    labels: analyticsData?.locations.map(item => item.name) || [],
    datasets: [
      {
        label: 'Регионы просмотров',
        data: analyticsData?.locations.map(item => item.value) || [],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Опции для графиков
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Аналитика компании</h1>
          <div className="flex mb-6 space-x-2">
            <Button
              onClick={() => setTimeRange('week')}
              variant={timeRange === 'week' ? 'primary' : 'outline'}
              size="sm"
            >
              Неделя
            </Button>
            <Button
              onClick={() => setTimeRange('month')}
              variant={timeRange === 'month' ? 'primary' : 'outline'}
              size="sm"
            >
              Месяц
            </Button>
            <Button
              onClick={() => setTimeRange('year')}
              variant={timeRange === 'year' ? 'primary' : 'outline'}
              size="sm"
            >
              Год
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Основные показатели */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Всего просмотров</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData?.views.reduce((a, b) => a + b, 0) || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    За выбранный период
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Полученные сообщения</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData?.messages.reduce((a, b) => a + b, 0) || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    За выбранный период
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Рейтинг компании</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline">
                    <div className="text-2xl font-bold">
                      {analyticsData?.reviews.average.toFixed(1) || "0.0"}
                    </div>
                    <div className="ml-2 text-xs text-muted-foreground">
                      из 5.0
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    На основе {analyticsData?.reviews.count || 0} отзывов
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Графики */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="h-5 w-5 mr-2" />
                    Просмотры профиля
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Line 
                      options={chartOptions} 
                      data={viewsData} 
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="h-5 w-5 mr-2" />
                    Сообщения
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Line 
                      options={chartOptions} 
                      data={messagesData} 
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2" />
                    Распределение оценок
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Bar 
                      options={chartOptions} 
                      data={reviewsData} 
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    География просмотров
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Pie 
                      options={chartOptions} 
                      data={locationsData} 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 