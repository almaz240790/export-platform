'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Lock, Bell, Globe, User } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  
  const tabs = [
    { id: 'profile', label: 'Профиль', icon: <User size={18} /> },
    { id: 'security', label: 'Безопасность', icon: <Lock size={18} /> },
    { id: 'notifications', label: 'Уведомления', icon: <Bell size={18} /> },
    { id: 'language', label: 'Язык и регион', icon: <Globe size={18} /> }
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Настройки</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Боковая панель с вкладками */}
        <div className="md:col-span-1">
          <div className="bg-card rounded-lg border p-4 sticky top-6">
            <div className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 w-full p-2 rounded-md hover:bg-muted transition-colors ${
                    activeTab === tab.id ? 'bg-muted font-medium' : ''
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Содержимое активной вкладки */}
        <div className="md:col-span-3">
          <div className="bg-card rounded-lg border p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Настройки профиля</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Имя</label>
                      <input 
                        type="text" 
                        defaultValue={session?.user?.name || ''}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input 
                        type="email" 
                        defaultValue={session?.user?.email || ''}
                        className="w-full p-2 border rounded-md"
                        disabled
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Email нельзя изменить, так как он используется для входа в систему
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Телефон</label>
                      <input 
                        type="tel" 
                        placeholder="+7 (___) ___-__-__"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Должность</label>
                      <input 
                        type="text" 
                        placeholder="Например: Менеджер по экспорту"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Фото профиля</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-muted rounded-full overflow-hidden">
                        {session?.user?.image ? (
                          <img 
                            src={session.user.image} 
                            alt="Фото профиля" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <User size={24} />
                          </div>
                        )}
                      </div>
                      <input type="file" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      Сохранить изменения
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Безопасность</h2>
                <form className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Изменение пароля</h3>
                    <div>
                      <label className="block text-sm font-medium mb-1">Текущий пароль</label>
                      <input 
                        type="password" 
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Новый пароль</label>
                      <input 
                        type="password" 
                        className="w-full p-2 border rounded-md"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Пароль должен содержать минимум 8 символов, включая буквы и цифры
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Подтверждение пароля</label>
                      <input 
                        type="password" 
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">История входов</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-muted rounded-md">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">Москва, Россия</p>
                            <p className="text-sm text-muted-foreground">Chrome на Windows</p>
                          </div>
                          <div className="text-right">
                            <p>Текущая сессия</p>
                            <p className="text-sm text-muted-foreground">15 июня 2023, 10:30</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted rounded-md">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">Москва, Россия</p>
                            <p className="text-sm text-muted-foreground">Safari на iOS</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">10 июня 2023, 15:45</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      Сохранить изменения
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Настройки уведомлений</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Системные уведомления</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">Новые сообщения</p>
                          <p className="text-sm text-muted-foreground">Получать уведомления о новых сообщениях</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">Новые запросы</p>
                          <p className="text-sm text-muted-foreground">Получать уведомления о новых запросах от клиентов</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">Обновления системы</p>
                          <p className="text-sm text-muted-foreground">Получать уведомления об обновлениях и новых функциях</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Способы уведомлений</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">Email-уведомления</p>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                        <input 
                          type="email" 
                          value={session?.user?.email || ''}
                          className="w-full p-2 border rounded-md"
                          disabled
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">SMS-уведомления</p>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                        <input 
                          type="tel" 
                          placeholder="+7 (___) ___-__-__"
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      Сохранить изменения
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'language' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Язык и региональные настройки</h2>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Язык интерфейса</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                      <option value="fr">Français</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Формат даты</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="dd.mm.yyyy">ДД.ММ.ГГГГ (31.12.2023)</option>
                      <option value="mm.dd.yyyy">ММ.ДД.ГГГГ (12.31.2023)</option>
                      <option value="yyyy.mm.dd">ГГГГ.ММ.ДД (2023.12.31)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Часовой пояс</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="Europe/Moscow">Москва (GMT+3)</option>
                      <option value="Europe/London">Лондон (GMT+0)</option>
                      <option value="America/New_York">Нью-Йорк (GMT-5)</option>
                      <option value="Asia/Tokyo">Токио (GMT+9)</option>
                      <option value="Australia/Sydney">Сидней (GMT+11)</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      Сохранить изменения
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 