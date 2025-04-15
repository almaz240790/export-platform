'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Send } from 'lucide-react';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

interface Contact {
  id: number;
  name: string;
  lastMessage: string;
  unread: number;
  avatar: string;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [activeContact, setActiveContact] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState('');
  
  // Демо-данные
  const contacts: Contact[] = [
    {
      id: 1,
      name: 'ООО "Импорт Групп"',
      lastMessage: 'Здравствуйте! Интересует ваша продукция.',
      unread: 0,
      avatar: '/placeholder.jpg'
    },
    {
      id: 2,
      name: 'ZHG International',
      lastMessage: 'Thank you for your offer.',
      unread: 2,
      avatar: '/placeholder.jpg'
    },
    {
      id: 3,
      name: 'Tech Solutions Ltd',
      lastMessage: 'Can you provide a quote for 500 units?',
      unread: 0,
      avatar: '/placeholder.jpg'
    }
  ];
  
  const messages: Message[] = [
    {
      id: 1,
      sender: 'ООО "Импорт Групп"',
      content: 'Здравствуйте! Интересует ваша продукция. Можете предоставить информацию о ценах и условиях поставки?',
      timestamp: new Date('2023-06-10T10:30:00'),
      isOwn: false
    },
    {
      id: 2,
      sender: 'Я',
      content: 'Добрый день! Конечно, мы можем предоставить вам всю необходимую информацию. Какой именно товар вас интересует?',
      timestamp: new Date('2023-06-10T11:15:00'),
      isOwn: true
    },
    {
      id: 3,
      sender: 'ООО "Импорт Групп"',
      content: 'Нас интересует промышленное оборудование, в частности модели XYZ-100 и ABC-200. Нужна информация о стоимости, сроках поставки и гарантийных условиях.',
      timestamp: new Date('2023-06-10T14:22:00'),
      isOwn: false
    }
  ];
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // В реальном приложении здесь будет отправка сообщения через API
    console.log('Sending message:', newMessage);
    
    // Очистка поля ввода
    setNewMessage('');
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Сообщения</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px] bg-card rounded-lg border overflow-hidden">
        {/* Список контактов */}
        <div className="md:col-span-1 border-r overflow-y-auto">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Поиск..."
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div className="divide-y">
            {contacts.map(contact => (
              <div
                key={contact.id}
                className={`p-4 cursor-pointer hover:bg-muted flex items-center ${activeContact === contact.id ? 'bg-muted' : ''}`}
                onClick={() => setActiveContact(contact.id)}
              >
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">{contact.name}</h3>
                    {contact.unread > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {contact.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Окно переписки */}
        <div className="md:col-span-2 flex flex-col">
          {activeContact ? (
            <>
              {/* Заголовок чата */}
              <div className="p-4 border-b flex items-center">
                <img
                  src={contacts.find(c => c.id === activeContact)?.avatar || ''}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full mr-3"
                />
                <h3 className="font-medium">
                  {contacts.find(c => c.id === activeContact)?.name}
                </h3>
              </div>
              
              {/* Сообщения */}
              <div className="flex-1 p-4 overflow-y-auto">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.isOwn
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : 'bg-muted rounded-tl-none'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 text-right ${message.isOwn ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {formatDate(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Форма отправки */}
              <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Введите сообщение..."
                  className="flex-1 p-2 border rounded-md"
                />
                <button
                  type="submit"
                  className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Выберите контакт для начала переписки
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 