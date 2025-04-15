'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Users, 
  Building2, 
  Bell, 
  Settings, 
  Plus,
  Search,
  Trash,
  CheckCircle,
  XCircle,
  Send,
  RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'COMPANY' | 'CLIENT';
  company?: Company;
  createdAt: string;
}

interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  verified: boolean;
}

interface SystemNotification {
  id: string;
  title: string;
  text: string;
  recipientType: 'ALL' | 'COMPANIES' | 'CLIENTS' | 'USER';
  recipientId?: string;
  sent: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Состояние для новых уведомлений
  const [newNotification, setNewNotification] = useState({
    title: '',
    text: '',
    recipientType: 'ALL',
    recipientId: ''
  });

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'companies') {
      fetchCompanies();
    } else if (activeTab === 'notifications') {
      fetchNotifications();
    }
  }, [activeTab]);

  // Мок-функции для запросов к API
  const fetchUsers = async () => {
    setIsLoading(true);
    // В реальном проекте здесь был бы запрос к API
    setTimeout(() => {
      const mockUsers = [
        { 
          id: '1', 
          name: 'Иван Иванов', 
          email: 'ivan@example.com', 
          role: 'ADMIN', 
          createdAt: '2023-01-15T10:30:00Z' 
        },
        { 
          id: '2', 
          name: 'Петр Петров', 
          email: 'petr@company.com', 
          role: 'COMPANY',
          company: { 
            id: '1', 
            name: 'ООО "Экспорт"', 
            email: 'info@export.com', 
            phone: '+79001234567',
            verified: true
          }, 
          createdAt: '2023-02-20T14:15:00Z' 
        },
        { 
          id: '3', 
          name: 'Мария Сидорова', 
          email: 'maria@client.com', 
          role: 'CLIENT', 
          createdAt: '2023-03-10T09:45:00Z' 
        },
        { 
          id: '4', 
          name: 'Алексей Смирнов', 
          email: 'alex@business.com', 
          role: 'COMPANY',
          company: { 
            id: '2', 
            name: 'ИП Смирнов', 
            email: 'smirnov@business.com', 
            phone: '+79009876543',
            verified: false
          }, 
          createdAt: '2023-03-25T11:20:00Z' 
        },
      ] as User[];
      setUsers(mockUsers);
      setIsLoading(false);
    }, 800);
  };

  const fetchCompanies = async () => {
    setIsLoading(true);
    // В реальном проекте здесь был бы запрос к API
    setTimeout(() => {
      const mockCompanies = [
        { 
          id: '1', 
          name: 'ООО "Экспорт"', 
          email: 'info@export.com', 
          phone: '+79001234567',
          verified: true 
        },
        { 
          id: '2', 
          name: 'ИП Смирнов', 
          email: 'smirnov@business.com', 
          phone: '+79009876543',
          verified: false 
        },
        { 
          id: '3', 
          name: 'ООО "ГлобалТрейд"', 
          email: 'info@globaltrade.ru', 
          phone: '+79005557799',
          verified: true 
        },
        { 
          id: '4', 
          name: 'ООО "ЭкоЭкспорт"', 
          email: 'contact@ecoexport.com', 
          phone: '+79001112233',
          verified: false 
        },
      ] as Company[];
      setCompanies(mockCompanies);
      setIsLoading(false);
    }, 800);
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    // В реальном проекте здесь был бы запрос к API
    setTimeout(() => {
      const mockNotifications = [
        { 
          id: '1', 
          title: 'Обновление платформы', 
          text: 'Мы обновили функциональность платформы. Теперь доступны новые возможности для экспортеров.',
          recipientType: 'ALL',
          sent: true,
          createdAt: '2023-04-05T10:30:00Z' 
        },
        { 
          id: '2', 
          title: 'Акция для экспортеров', 
          text: 'Для всех компаний доступна новая программа продвижения товаров на международном рынке.',
          recipientType: 'COMPANIES',
          sent: true,
          createdAt: '2023-04-10T14:15:00Z' 
        },
        { 
          id: '3', 
          title: 'Верификация аккаунта', 
          text: 'Ваш аккаунт успешно прошел верификацию. Теперь вам доступны все функции платформы.',
          recipientType: 'USER',
          recipientId: '2',
          sent: true,
          createdAt: '2023-04-15T09:45:00Z' 
        },
      ] as SystemNotification[];
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 800);
  };

  const handleVerifyCompany = (companyId: string) => {
    // В реальном проекте здесь был бы запрос к API
    setCompanies(
      companies.map(company => 
        company.id === companyId ? { ...company, verified: true } : company
      )
    );
    toast.success('Компания верифицирована');
  };

  const handleDeleteUser = (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить пользователя?')) {
      return;
    }
    // В реальном проекте здесь был бы запрос к API
    setUsers(users.filter(user => user.id !== userId));
    toast.success('Пользователь удален');
  };

  const handleChangeUserRole = (userId: string, newRole: 'ADMIN' | 'COMPANY' | 'CLIENT') => {
    // В реальном проекте здесь был бы запрос к API
    setUsers(
      users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    toast.success('Роль пользователя изменена');
  };

  const handleDeleteCompany = (companyId: string) => {
    if (!confirm('Вы уверены, что хотите удалить компанию?')) {
      return;
    }
    // В реальном проекте здесь был бы запрос к API
    setCompanies(companies.filter(company => company.id !== companyId));
    toast.success('Компания удалена');
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewNotification(prev => ({ ...prev, [name]: value }));
  };

  const handleSendNotification = () => {
    // Валидация
    if (!newNotification.title.trim() || !newNotification.text.trim()) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    // В реальном проекте здесь был бы запрос к API
    const newNotificationObj = {
      id: `temp-${Date.now()}`,
      title: newNotification.title,
      text: newNotification.text,
      recipientType: newNotification.recipientType,
      recipientId: newNotification.recipientId,
      sent: true,
      createdAt: new Date().toISOString()
    } as SystemNotification;

    setNotifications([newNotificationObj, ...notifications]);
    setNewNotification({
      title: '',
      text: '',
      recipientType: 'ALL',
      recipientId: ''
    });
    toast.success('Уведомление отправлено');
  };

  // Функции для фильтрации по поиску
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (company.email && company.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Административная панель</h1>
      
      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="users" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Пользователи
          </TabsTrigger>
          <TabsTrigger value="companies" className="flex items-center">
            <Building2 className="h-4 w-4 mr-2" />
            Компании
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Уведомления
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Настройки
          </TabsTrigger>
        </TabsList>
        
        <div className="mb-6 flex items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`Поиск ${activeTab === 'users' ? 'пользователей' : activeTab === 'companies' ? 'компаний' : ''}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (activeTab === 'users') fetchUsers();
              else if (activeTab === 'companies') fetchCompanies();
              else if (activeTab === 'notifications') fetchNotifications();
            }}
            className="ml-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <TabsContent value="users">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-muted rounded-lg p-6 text-center">
              <p className="text-muted-foreground">Пользователи не найдены</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Имя</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Компания</TableHead>
                    <TableHead>Дата регистрации</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleChangeUserRole(user.id, value as any)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Администратор</SelectItem>
                            <SelectItem value="COMPANY">Компания</SelectItem>
                            <SelectItem value="CLIENT">Клиент</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {user.company ? (
                          <div className="flex items-center">
                            <span>{user.company.name}</span>
                            {user.company.verified ? (
                              <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                                Верифицирована
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">
                                Не верифицирована
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="companies">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="bg-muted rounded-lg p-6 text-center">
              <p className="text-muted-foreground">Компании не найдены</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell>{company.email || '—'}</TableCell>
                      <TableCell>{company.phone || '—'}</TableCell>
                      <TableCell>
                        {company.verified ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Верифицирована
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            Не верифицирована
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {!company.verified && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleVerifyCompany(company.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCompany(company.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="notifications">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold mb-4">История уведомлений</h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="bg-muted rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">Уведомления не найдены</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <Card key={notification.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{notification.title}</h3>
                              <Badge variant="outline" className="text-xs font-normal">
                                {notification.recipientType === 'ALL' ? 'Всем' : 
                                 notification.recipientType === 'COMPANIES' ? 'Компаниям' : 
                                 notification.recipientType === 'CLIENTS' ? 'Клиентам' : 'Отдельному пользователю'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{notification.text}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Отправлено: {formatDate(notification.createdAt)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Отправить новое уведомление</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Заголовок *</label>
                      <Input
                        name="title"
                        value={newNotification.title}
                        onChange={handleNotificationChange}
                        placeholder="Введите заголовок"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Текст уведомления *</label>
                      <Textarea
                        name="text"
                        value={newNotification.text}
                        onChange={handleNotificationChange}
                        placeholder="Введите текст уведомления"
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Получатели</label>
                      <Select
                        name="recipientType"
                        defaultValue="ALL"
                        onValueChange={(value) => 
                          setNewNotification(prev => ({ ...prev, recipientType: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">Все пользователи</SelectItem>
                          <SelectItem value="COMPANIES">Только компании</SelectItem>
                          <SelectItem value="CLIENTS">Только клиенты</SelectItem>
                          <SelectItem value="USER">Конкретный пользователь</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {newNotification.recipientType === 'USER' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">ID пользователя *</label>
                        <Input
                          name="recipientId"
                          value={newNotification.recipientId}
                          onChange={handleNotificationChange}
                          placeholder="Введите ID пользователя"
                        />
                      </div>
                    )}
                    
                    <Button 
                      type="button" 
                      className="w-full"
                      onClick={handleSendNotification}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Отправить уведомление
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Настройки платформы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Название платформы</label>
                    <Input defaultValue="Export Platform" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email для контактов</label>
                    <Input defaultValue="support@export-platform.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Модерация новых компаний</label>
                    <Select defaultValue="manual">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Автоматическая</SelectItem>
                        <SelectItem value="manual">Ручная</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="w-full">
                    Сохранить настройки
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Техническое обслуживание</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-yellow-50 text-yellow-800 border-yellow-200">
                    <h3 className="font-medium mb-2">Важное предупреждение</h3>
                    <p className="text-sm">
                      Перед выполнением любых действий в этом разделе рекомендуется создать резервную копию данных.
                    </p>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Очистить кэш
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    Создать резервную копию данных
                  </Button>
                  
                  <Button variant="destructive" className="w-full">
                    <XCircle className="h-4 w-4 mr-2" />
                    Режим технического обслуживания
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 