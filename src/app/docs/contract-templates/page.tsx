"use client";

import { Container } from '@/components/layout/Container';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function ContractTemplatesPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Link href="/docs" className="text-primary hover:text-primary/80 hover:underline mb-6 inline-block">
            ← Назад к документации
          </Link>
          
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Шаблоны договоров для экспорта</h1>
          <p className="text-muted-foreground mb-8">Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
          
          <div className="prose prose-lg max-w-none mb-12">
            <p>
              Здесь вы найдете готовые шаблоны документов, необходимых для осуществления экспортной деятельности. 
              Вы можете скачать их, адаптировать под ваши нужды и использовать в своей работе.
            </p>
            <p>
              <strong>Внимание:</strong> Шаблоны предоставляются в ознакомительных целях. Рекомендуем проконсультироваться с юристом перед использованием документов в коммерческих целях.
            </p>
          </div>
          
          <div className="space-y-8">
            <DocumentSection 
              title="Внешнеторговые контракты" 
              description="Основные типы контрактов для осуществления международной торговли."
              documents={[
                {
                  title: "Экспортный контракт (базовый)",
                  description: "Универсальный шаблон договора международной купли-продажи товаров.",
                  fileName: "export-contract-basic.docx"
                },
                {
                  title: "Экспортный контракт (расширенный)",
                  description: "Детализированный договор с расширенными пунктами об ответственности и форс-мажоре.",
                  fileName: "export-contract-extended.docx"
                },
                {
                  title: "Дистрибьюторское соглашение",
                  description: "Договор с иностранным дистрибьютором на представление товаров за рубежом.",
                  fileName: "distribution-agreement.docx"
                },
                {
                  title: "Агентское соглашение",
                  description: "Договор с агентом для представления интересов на зарубежном рынке.",
                  fileName: "agency-agreement.docx"
                }
              ]}
            />
            
            <DocumentSection 
              title="Коммерческие документы" 
              description="Документы, необходимые для коммерческого сопровождения экспортных операций."
              documents={[
                {
                  title: "Коммерческий инвойс",
                  description: "Счет-фактура для оплаты товаров покупателем.",
                  fileName: "commercial-invoice.docx"
                },
                {
                  title: "Проформа-инвойс",
                  description: "Предварительный счет для согласования условий поставки и оплаты.",
                  fileName: "proforma-invoice.docx"
                },
                {
                  title: "Упаковочный лист",
                  description: "Документ с описанием содержимого отправляемого груза.",
                  fileName: "packing-list.docx"
                },
                {
                  title: "Спецификация товара",
                  description: "Детальное описание поставляемых товаров с их характеристиками.",
                  fileName: "product-specification.docx"
                }
              ]}
            />
            
            <DocumentSection 
              title="Транспортные документы" 
              description="Документы для оформления транспортировки товаров на экспорт."
              documents={[
                {
                  title: "Международная товарно-транспортная накладная CMR",
                  description: "Для автомобильных перевозок в международном сообщении.",
                  fileName: "cmr-waybill.docx"
                },
                {
                  title: "Морская накладная",
                  description: "Для морских грузоперевозок (Bill of Lading).",
                  fileName: "bill-of-lading.docx"
                },
                {
                  title: "Авианакладная",
                  description: "Для авиаперевозок грузов (Air Waybill).",
                  fileName: "air-waybill.docx"
                },
                {
                  title: "Железнодорожная накладная",
                  description: "Для перевозок грузов железнодорожным транспортом.",
                  fileName: "railway-bill.docx"
                }
              ]}
            />
            
            <DocumentSection 
              title="Таможенные документы" 
              description="Документы для таможенного оформления экспорта."
              documents={[
                {
                  title: "Декларация на товары (образец)",
                  description: "Пример заполнения экспортной декларации.",
                  fileName: "export-declaration.pdf"
                },
                {
                  title: "Сертификат происхождения товара (форма СТ-1)",
                  description: "Для подтверждения страны происхождения товара.",
                  fileName: "certificate-of-origin.docx"
                },
                {
                  title: "Заявление на получение сертификата происхождения",
                  description: "Для оформления сертификата происхождения в ТПП.",
                  fileName: "origin-certificate-application.docx"
                }
              ]}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

interface Document {
  title: string;
  description: string;
  fileName: string;
}

interface DocumentSectionProps {
  title: string;
  description: string;
  documents: Document[];
}

function DocumentSection({ title, description, documents }: DocumentSectionProps) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{description}</p>
      
      <div className="divide-y">
        {documents.map((doc, index) => (
          <div key={index} className="py-4 first:pt-0 last:pb-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium">{doc.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 w-full sm:w-auto">
                Скачать
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 