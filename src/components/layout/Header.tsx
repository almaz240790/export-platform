'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { NotificationsButton } from '@/components/ui/NotificationsButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, UserPlus, Settings, ChevronDown } from 'lucide-react';
import { signOut } from 'next-auth/react';

export function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  return (
    <header className="py-3 border-b bg-background">
      <Container>
        <div className="flex items-center justify-between">
          <Link href="/" className="font-bold text-xl">
            Export Platform
          </Link>

          {isLoading ? (
            <div className="animate-pulse h-10 w-20 bg-muted rounded-md"></div>
          ) : isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <NotificationsButton />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-sm">
                      {(session?.user?.name?.[0] || session?.user?.email?.[0] || '?').toUpperCase()}
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {session?.user?.name || session?.user?.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/cabinet/company" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Личный кабинет</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/cabinet/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Настройки</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Выйти</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Войти
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Регистрация
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
} 