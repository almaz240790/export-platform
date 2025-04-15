'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Briefcase, MessageSquare, File, Settings, LogOut, Users, Image, Star, BarChart, Tag, Bell, ShieldAlert } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const NavItem = ({ href, label, icon, isActive }: NavItemProps) => {
  return (
    <Link 
      href={href}
      className={cn(
        'flex items-center gap-2 py-2 px-3 rounded-md transition-colors', 
        isActive 
          ? 'bg-primary text-primary-foreground font-medium' 
          : 'hover:bg-muted'
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default function CabinetLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const navigationItems = [
    { href: '/cabinet/company', label: 'Компания', icon: <Briefcase size={18} /> },
    { href: '/cabinet/employees', label: 'Сотрудники', icon: <Users size={18} /> },
    { href: '/cabinet/gallery', label: 'Галерея', icon: <Image size={18} /> },
    { href: '/cabinet/categories', label: 'Категории', icon: <Tag size={18} /> },
    { href: '/cabinet/reviews', label: 'Отзывы', icon: <Star size={18} /> },
    { href: '/cabinet/messages', label: 'Сообщения', icon: <MessageSquare size={18} /> },
    { href: '/cabinet/notifications', label: 'Уведомления', icon: <Bell size={18} /> },
    { href: '/cabinet/documents', label: 'Документы', icon: <File size={18} /> },
    { href: '/cabinet/analytics', label: 'Аналитика', icon: <BarChart size={18} /> },
    { href: '/cabinet/settings', label: 'Настройки', icon: <Settings size={18} /> },
    ...(session?.user?.role === 'ADMIN' ? [
      { href: '/cabinet/admin', label: 'Администрирование', icon: <ShieldAlert size={18} /> }
    ] : []),
  ];

  if (!session) {
    return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Боковая навигация */}
      <aside className="w-64 border-r bg-card">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="font-semibold">Личный кабинет</h2>
            <p className="text-sm text-muted-foreground">{session.user?.email}</p>
          </div>
          
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <NavItem 
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={pathname === item.href}
              />
            ))}
            
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 py-2 px-3 rounded-md text-destructive hover:bg-destructive/10 w-full mt-10"
            >
              <LogOut size={18} />
              <span>Выйти</span>
            </button>
          </nav>
        </div>
      </aside>
      
      {/* Основной контент */}
      <main className="flex-1 p-6 bg-background">{children}</main>
    </div>
  );
} 