'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Trash2, ExternalLink, ImagePlus } from 'lucide-react';

interface Image {
  id: string;
  url: string;
  isLogo: boolean;
  createdAt: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cabinet/gallery');
      if (!response.ok) {
        throw new Error('Не удалось загрузить изображения');
      }
      const data = await response.json();
      setImages(data.images);
    } catch (error) {
      console.error('Ошибка при загрузке изображений:', error);
      toast.error('Не удалось загрузить изображения');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      
      // Добавляем все выбранные файлы
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Проверка типа файла
        if (!file.type.startsWith('image/')) {
          toast.error(`Файл "${file.name}" не является изображением`);
          continue;
        }
        
        // Проверка размера файла (5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Файл "${file.name}" превышает максимальный размер (5MB)`);
          continue;
        }
        
        formData.append('images', file);
      }
      
      const response = await fetch('/api/cabinet/gallery', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Не удалось загрузить изображения');
      }
      
      const data = await response.json();
      setImages((prevImages) => [...prevImages, ...data.images]);
      
      // Очищаем поле выбора файлов
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.success('Изображения успешно загружены');
    } catch (error) {
      console.error('Ошибка при загрузке изображений:', error);
      toast.error(error instanceof Error ? error.message : 'Не удалось загрузить изображения');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Вы уверены, что хотите удалить это изображение?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/cabinet/gallery/${imageId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Не удалось удалить изображение');
      }
      
      setImages(images.filter(img => img.id !== imageId));
      toast.success('Изображение успешно удалено');
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
      toast.error('Не удалось удалить изображение');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Галерея изображений</h1>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            id="gallery-images"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Загрузка...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Загрузить изображения
              </>
            )}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : images.length === 0 ? (
        <div className="bg-muted rounded-lg p-12 text-center">
          <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Нет изображений</h3>
          <p className="text-muted-foreground mb-6">
            Загрузите изображения товаров или услуг вашей компании
          </p>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Загрузить изображения
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative aspect-square group">
                <img
                  src={image.url}
                  alt="Изображение компании"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white"
                    onClick={() => window.open(image.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                {image.isLogo && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                    Логотип
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <p className="text-xs text-muted-foreground truncate">
                  Загружено: {new Date(image.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 