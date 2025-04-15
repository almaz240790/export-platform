'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Upload, Image as ImageIcon } from 'lucide-react';

// Схема валидации
const companySchema = z.object({
  name: z.string().min(2, 'Название компании должно содержать не менее 2 символов'),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Некорректный формат email').optional(),
  website: z.string().url('Некорректный формат URL').optional().or(z.literal('')),
  address: z.string().optional(),
  inn: z.string().regex(/^\d{10}$|^\d{12}$/, 'ИНН должен содержать 10 или 12 цифр').optional().or(z.literal('')),
  kpp: z.string().regex(/^\d{9}$/, 'КПП должен содержать 9 цифр').optional().or(z.literal('')),
  ogrn: z.string().regex(/^\d{13}$|^\d{15}$/, 'ОГРН должен содержать 13 или 15 цифр').optional().or(z.literal('')),
  bankAccount: z.string().regex(/^\d{20}$/, 'Расчетный счет должен содержать 20 цифр').optional().or(z.literal('')),
  bankName: z.string().optional(),
  bankBik: z.string().regex(/^\d{9}$/, 'БИК должен содержать 9 цифр').optional().or(z.literal('')),
  deliveryTime: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

export default function CompanyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      description: '',
      phone: '',
      email: '',
      website: '',
      address: '',
      inn: '',
      kpp: '',
      ogrn: '',
      bankAccount: '',
      bankName: '',
      bankBik: '',
      deliveryTime: '',
    },
  });

  // Загрузка данных компании при монтировании компонента
  useEffect(() => {
    async function fetchCompanyData() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/cabinet/company');
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Ошибка при получении данных компании');
        }

        const { company } = await response.json();
        
        if (company) {
          // Установка значений формы из полученных данных
          setValue('name', company.name || '');
          setValue('description', company.description || '');
          setValue('phone', company.phone || '');
          setValue('email', company.email || '');
          setValue('website', company.website || '');
          setValue('address', company.address || '');
          setValue('inn', company.inn || '');
          setValue('kpp', company.kpp || '');
          setValue('ogrn', company.ogrn || '');
          setValue('bankAccount', company.bankAccount || '');
          setValue('bankName', company.bankName || '');
          setValue('bankBik', company.bankBik || '');
          setValue('deliveryTime', company.deliveryTime || '');

          // Загрузка логотипа, если есть
          if (company.logoUrl) {
            setLogoPreview(company.logoUrl);
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки данных компании:', error);
        toast.error('Не удалось загрузить информацию о компании');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompanyData();
  }, [setValue]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, загрузите изображение');
      return;
    }

    // Проверка размера файла (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Размер файла не должен превышать 5MB');
      return;
    }

    setLogoFile(file);
    
    // Создаем URL для предпросмотра
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Сохранение данных компании
  const onSubmit = async (data: CompanyFormData) => {
    setIsSubmitting(true);
    try {
      // Создаем FormData для отправки файлов и данных
      const formData = new FormData();

      // Добавляем данные компании
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Добавляем логотип, если он был выбран
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const response = await fetch('/api/cabinet/company', {
        method: 'POST',
        body: formData,
        // Не устанавливаем Content-Type, браузер сам сделает это с правильной boundary для FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при сохранении данных компании');
      }

      toast.success('Информация о компании успешно обновлена');
    } catch (error) {
      console.error('Ошибка сохранения данных компании:', error);
      toast.error('Не удалось сохранить информацию о компании');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Информация о компании</h1>
      
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Логотип компании */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Логотип компании
                </label>
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Логотип компании"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="logo"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Загрузить логотип
                      </Button>
                      {logoPreview && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={handleRemoveLogo}
                        >
                          Удалить
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Рекомендуемый размер: 500x500px. Максимальный размер файла: 5MB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Название компании *
                </label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Введите название компании"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                  Описание компании
                </label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Введите описание компании"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Телефон
                  </label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+7 (XXX) XXX-XX-XX"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="company@example.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="website" className="block text-sm font-medium">
                    Веб-сайт
                  </label>
                  <Input
                    id="website"
                    {...register('website')}
                    placeholder="https://example.com"
                    className={errors.website ? 'border-red-500' : ''}
                  />
                  {errors.website && (
                    <p className="text-red-500 text-sm">{errors.website.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-medium">
                    Адрес
                  </label>
                  <Input
                    id="address"
                    {...register('address')}
                    placeholder="Город, улица, дом"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold border-b pb-2 mt-8">Юридическая информация</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="inn" className="block text-sm font-medium">
                    ИНН
                  </label>
                  <Input
                    id="inn"
                    {...register('inn')}
                    placeholder="1234567890"
                    className={errors.inn ? 'border-red-500' : ''}
                  />
                  {errors.inn && (
                    <p className="text-red-500 text-sm">{errors.inn.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="kpp" className="block text-sm font-medium">
                    КПП
                  </label>
                  <Input
                    id="kpp"
                    {...register('kpp')}
                    placeholder="123456789"
                    className={errors.kpp ? 'border-red-500' : ''}
                  />
                  {errors.kpp && (
                    <p className="text-red-500 text-sm">{errors.kpp.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="ogrn" className="block text-sm font-medium">
                    ОГРН
                  </label>
                  <Input
                    id="ogrn"
                    {...register('ogrn')}
                    placeholder="1234567890123"
                    className={errors.ogrn ? 'border-red-500' : ''}
                  />
                  {errors.ogrn && (
                    <p className="text-red-500 text-sm">{errors.ogrn.message}</p>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold border-b pb-2 mt-8">Банковские реквизиты</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="bankAccount" className="block text-sm font-medium">
                    Расчетный счет
                  </label>
                  <Input
                    id="bankAccount"
                    {...register('bankAccount')}
                    placeholder="40702810123456789012"
                    className={errors.bankAccount ? 'border-red-500' : ''}
                  />
                  {errors.bankAccount && (
                    <p className="text-red-500 text-sm">{errors.bankAccount.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="bankName" className="block text-sm font-medium">
                    Название банка
                  </label>
                  <Input
                    id="bankName"
                    {...register('bankName')}
                    placeholder="ПАО Сбербанк"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="bankBik" className="block text-sm font-medium">
                    БИК
                  </label>
                  <Input
                    id="bankBik"
                    {...register('bankBik')}
                    placeholder="044525225"
                    className={errors.bankBik ? 'border-red-500' : ''}
                  />
                  {errors.bankBik && (
                    <p className="text-red-500 text-sm">{errors.bankBik.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="deliveryTime" className="block text-sm font-medium">
                  Срок поставки
                </label>
                <Input
                  id="deliveryTime"
                  {...register('deliveryTime')}
                  placeholder="Например: 14-21 день"
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 