"use client";

import Link from 'next/link';
import { Container } from '@/components/layout/Container';

export default function DocsPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Документация</h1>
          <p className="text-lg text-muted-foreground mb-10">
            Здесь вы найдете все необходимые документы и руководства для успешного экспорта
          </p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
            <DocSection
              title="Руководства пользователя"
              docs={[
                { title: "Для экспортеров", href: "/docs/exporter-guide" },
                { title: "Для клиентов", href: "/docs/client-guide" },
                { title: "Часто задаваемые вопросы", href: "/docs/faq" },
              ]}
            />
            
            <DocSection
              title="Юридические документы"
              docs={[
                { title: "Политика конфиденциальности", href: "/docs/privacy-policy" },
                { title: "Условия использования", href: "/docs/terms" },
                { title: "Обработка персональных данных", href: "/docs/gdpr" },
              ]}
            />
            
            <DocSection
              title="Экспортная документация"
              docs={[
                { title: "Шаблоны договоров", href: "/docs/contract-templates" },
                { title: "Спецификации товаров", href: "/docs/product-specs" },
                { title: "Таможенное оформление", href: "/docs/customs" },
                { title: "Международная логистика", href: "/docs/logistics" },
              ]}
            />
            
            <DocSection
              title="Техническая документация"
              docs={[
                { title: "API-документация", href: "/docs/api" },
                { title: "Руководство по интеграции", href: "/docs/integration" },
              ]}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

interface DocSectionProps {
  title: string;
  docs: { title: string; href: string }[];
}

function DocSection({ title, docs }: DocSectionProps) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ul className="space-y-3">
        {docs.map((doc) => (
          <li key={doc.href}>
            <Link href={doc.href} className="text-primary hover:text-primary/80 hover:underline">
              {doc.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 