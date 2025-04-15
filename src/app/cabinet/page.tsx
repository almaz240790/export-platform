'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Briefcase, MessageSquare, File, Settings } from 'lucide-react';

export default function CabinetPage() {
  const { data: session } = useSession();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Добро пожаловать, {session?.user?.name || 'Пользователь'}!
      </h1>
      
      <p className="text-muted-foreground mb-8">
        Здесь вы можете управлять информацией о вашей компании, вести переписку с партнерами, 
        работать с документами и изменять настройки профиля.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg shadow-sm p-6 border">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="text-primary" size={24} />
            <h2 className="text-xl font-semibold">Компания</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Управляйте информацией о вашей компании, редактируйте профиль и 
            контактные данные.
          </p>
          <Link href="/cabinet/company" className="text-primary hover:underline inline-block">
            Перейти →
          </Link>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm p-6 border">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="text-primary" size={24} />
            <h2 className="text-xl font-semibold">Сообщения</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Общайтесь с клиентами и партнерами, отвечайте на запросы и ведите 
            переговоры.
          </p>
          <Link href="/cabinet/messages" className="text-primary hover:underline inline-block">
            Перейти →
          </Link>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm p-6 border">
          <div className="flex items-center gap-2 mb-4">
            <File className="text-primary" size={24} />
            <h2 className="text-xl font-semibold">Документы</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Хранение, управление и обмен документами, необходимыми для
            экспортной деятельности.
          </p>
          <Link href="/cabinet/documents" className="text-primary hover:underline inline-block">
            Перейти →
          </Link>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm p-6 border">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="text-primary" size={24} />
            <h2 className="text-xl font-semibold">Настройки</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Настройки учетной записи, безопасность, уведомления и
            другие параметры профиля.
          </p>
          <Link href="/cabinet/settings" className="text-primary hover:underline inline-block">
            Перейти →
          </Link>
        </div>
      </div>
    </div>
  );
} 