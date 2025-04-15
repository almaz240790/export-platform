"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState<'en' | 'ru'>('en');
  
  const languages = [
    { code: 'en' as const, label: 'EN' },
    { code: 'ru' as const, label: 'RU' },
  ];
  
  const handleLanguageChange = (lang: 'en' | 'ru') => {
    setCurrentLang(lang);
    // Update the URL with the new language
    const currentPath = window.location.pathname;
    const newPath = currentPath.startsWith('/en/')
      ? currentPath.replace('/en/', `/${lang}/`)
      : currentPath.startsWith('/ru/')
      ? currentPath.replace('/ru/', `/${lang}/`)
      : `/${lang}${currentPath}`;
    
    router.push(newPath);
  };
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {languages.map((lang) => (
        <Button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          variant={currentLang === lang.code ? 'primary' : 'ghost'}
          size="sm"
          className="px-2"
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
} 