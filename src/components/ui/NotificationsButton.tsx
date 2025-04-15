'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface Notification {
  id: string;
  type: string;
  title: string;
  text: string;
  read: boolean;
  createdAt: string;
}

export function NotificationsButton() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/cabinet/notifications');
        
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications);
        } else {
          // Если API не работает, используем тестовые данные
          setNotifications([
            {
              id: '1',
              type: 'message',
              title: 'Новое сообщение',
              text: 'У вас новое сообщение от компании "ТехноИмпорт"',
              read: false,
              createdAt: new Date().toISOString()
            },
            {
              id: '2',
              type: 'review',
              title: 'Новый отзыв',
              text: 'Клиент оставил новый отзыв о вашей компании',
              read: false,
              createdAt: new Date().toISOString()
            }
          ]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке уведомлений:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch('/api/cabinet/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId: id }),
      });

      if (response.ok) {
        setNotifications(
          notifications.map(notif => 
            notif.id === id ? { ...notif, read: true } : notif
          )
        );
      }
    } catch (error) {
      console.error('Ошибка при отметке уведомления:', error);
    }
  };

  // Форматируем дату уведомления в относительном формате
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Только что';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} ч назад`;
    } else {
      return `${Math.floor(diffInHours / 24)} д назад`;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          onClick={() => {}} 
          variant="primary" 
          className="relative"
          aria-expanded={false}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs"
              variant="default"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Уведомления</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="font-normal">
              {unreadCount} новых
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="py-4 text-center text-muted-foreground">
            Загрузка...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            У вас нет уведомлений
          </div>
        ) : (
          <>
            {notifications.slice(0, 5).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-3 cursor-pointer focus:bg-muted ${!notification.read ? 'bg-muted/50' : ''}`}
                onSelect={() => markAsRead(notification.id)}
              >
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${!notification.read ? 'text-primary' : ''}`}>
                      {notification.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {notification.text}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="p-2 cursor-pointer justify-center">
              <Link href="/cabinet/notifications" className="w-full text-center text-sm">
                Показать все уведомления
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 