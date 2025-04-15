'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { Bell, Check, Eye, X, MessageSquare, Star, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  type: 'message' | 'review' | 'order' | 'system';
  title: string;
  text: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/cabinet/notifications');
      
      // Если сервер недоступен или база данных не настроена, 
      // используем тестовые данные
      if (!response.ok) {
        console.warn('Не удалось получить уведомления, используем тестовые данные');
        
        // Тестовые данные
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'message',
            title: 'Новое сообщение',
            text: 'У вас новое сообщение от компании "ТехноИмпорт"',
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 минут назад
          },
          {
            id: '2',
            type: 'review',
            title: 'Новый отзыв',
            text: 'Клиент оставил новый отзыв о вашей компании',
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 часа назад
          },
          {
            id: '3',
            type: 'order',
            title: 'Новый заказ',
            text: 'Компания "ГлобалТрейд" разместила новый заказ на поставку',
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() // 12 часов назад
          },
          {
            id: '4',
            type: 'system',
            title: 'Обновление платформы',
            text: 'Мы обновили функциональность платформы. Узнайте о новых возможностях!',
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 дня назад
          },
          {
            id: '5',
            type: 'message',
            title: 'Новое сообщение',
            text: 'У вас новое сообщение от компании "ЭкоЭкспорт"',
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // 3 дня назад
          }
        ];
        
        setNotifications(mockNotifications);
      } else {
        const data = await response.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Ошибка при загрузке уведомлений:', error);
      toast.error('Не удалось загрузить уведомления');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch('/api/cabinet/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId: id }),
      });

      if (!response.ok) {
        throw new Error('Не удалось отметить уведомление как прочитанное');
      }

      // Обновляем локальное состояние после успешного API-запроса
      setNotifications(
        notifications.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      
      toast.success('Уведомление отмечено как прочитанное');
    } catch (error) {
      console.error('Ошибка:', error);
      toast.error('Не удалось отметить уведомление как прочитанное');
    }
  };
  
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/cabinet/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Не удалось отметить уведомления как прочитанные');
      }

      // Обновляем локальное состояние после успешного API-запроса
      setNotifications(
        notifications.map(notif => ({ ...notif, read: true }))
      );
      
      toast.success('Все уведомления отмечены как прочитанные');
    } catch (error) {
      console.error('Ошибка:', error);
      toast.error('Не удалось отметить уведомления как прочитанные');
    }
  };
  
  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch('/api/cabinet/notifications/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId: id }),
      });

      if (!response.ok) {
        throw new Error('Не удалось удалить уведомление');
      }

      // Обновляем локальное состояние после успешного API-запроса
      setNotifications(
        notifications.filter(notif => notif.id !== id)
      );
      
      toast.success('Уведомление удалено');
    } catch (error) {
      console.error('Ошибка:', error);
      toast.error('Не удалось удалить уведомление');
    }
  };
  
  const clearAllNotifications = async () => {
    if (!confirm('Вы уверены, что хотите удалить все уведомления?')) {
      return;
    }
    
    try {
      const response = await fetch('/api/cabinet/notifications/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deleteAll: true }),
      });

      if (!response.ok) {
        throw new Error('Не удалось удалить уведомления');
      }

      // Обновляем локальное состояние после успешного API-запроса
      setNotifications([]);
      
      toast.success('Все уведомления удалены');
    } catch (error) {
      console.error('Ошибка:', error);
      toast.error('Не удалось удалить уведомления');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'review':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'order':
        return <ShoppingBag className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-purple-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      // Сегодня, показываем время
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      // Вчера
      return 'Вчера, ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else {
      // Более 2-х дней назад, показываем дату
      return date.toLocaleDateString('ru-RU');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Уведомления</h1>
          {unreadCount > 0 && (
            <Badge className="ml-3 bg-primary text-primary-foreground">
              {unreadCount} новых
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <Check className="h-4 w-4 mr-2" />
            Отметить все как прочитанные
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
          >
            <X className="h-4 w-4 mr-2" />
            Очистить все
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-muted rounded-lg p-6 text-center">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">У вас нет уведомлений</h3>
          <p className="text-muted-foreground">
            Здесь будут отображаться уведомления о новых сообщениях, отзывах и других событиях
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`overflow-hidden ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className={`font-medium ${!notification.read ? 'text-primary' : ''}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <Badge variant="secondary" className="ml-2 text-xs">Новое</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.text}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => markAsRead(notification.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 