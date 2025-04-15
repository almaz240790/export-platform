'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import { PlusCircle, XCircle, Edit, Trash, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });
  
  const [editCategory, setEditCategory] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cabinet/categories');
      if (!response.ok) {
        throw new Error('Не удалось загрузить категории');
      }
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
      toast.error('Не удалось загрузить категории');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isEdit = false
  ) => {
    const { name, value } = e.target;
    
    if (isEdit && editCategory) {
      setEditCategory({
        ...editCategory,
        [name]: value
      });
    } else {
      setNewCategory({
        ...newCategory,
        [name]: value
      });
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      toast.error('Название категории обязательно');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/cabinet/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Не удалось создать категорию');
      }
      
      const data = await response.json();
      setCategories([...categories, data.category]);
      setNewCategory({ name: '', description: '' });
      toast.success('Категория успешно создана');
    } catch (error) {
      console.error('Ошибка при создании категории:', error);
      toast.error(error instanceof Error ? error.message : 'Не удалось создать категорию');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editCategory) return;
    
    if (!editCategory.name.trim()) {
      toast.error('Название категории обязательно');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/cabinet/categories/${editCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editCategory.name,
          description: editCategory.description
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Не удалось обновить категорию');
      }
      
      const data = await response.json();
      
      setCategories(categories.map(cat => 
        cat.id === editCategory.id ? data.category : cat
      ));
      
      setEditCategory(null);
      toast.success('Категория успешно обновлена');
    } catch (error) {
      console.error('Ошибка при обновлении категории:', error);
      toast.error(error instanceof Error ? error.message : 'Не удалось обновить категорию');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/cabinet/categories/${categoryId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Не удалось удалить категорию');
      }
      
      setCategories(categories.filter(cat => cat.id !== categoryId));
      
      if (editCategory?.id === categoryId) {
        setEditCategory(null);
      }
      
      toast.success('Категория успешно удалена');
    } catch (error) {
      console.error('Ошибка при удалении категории:', error);
      toast.error('Не удалось удалить категорию');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Управление категориями</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="bg-muted rounded-lg p-6 text-center">
              <p className="text-muted-foreground">У вас еще нет категорий. Создайте первую категорию.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <Card key={category.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    {editCategory?.id === category.id ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Название категории
                          </label>
                          <Input
                            name="name"
                            value={editCategory.name}
                            onChange={(e) => handleInputChange(e, true)}
                            placeholder="Название категории"
                            className="mb-2"
                          />
                          <label className="block text-sm font-medium mb-1">
                            Описание (опционально)
                          </label>
                          <Input
                            name="description"
                            value={editCategory.description}
                            onChange={(e) => handleInputChange(e, true)}
                            placeholder="Краткое описание категории"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditCategory(null)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Отмена
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleUpdateCategory}
                            disabled={isSubmitting}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Сохранить
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{category.name}</h3>
                            <Badge variant="outline">{category.slug}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {category.description || 'Нет описания'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditCategory({
                              id: category.id,
                              name: category.name,
                              description: category.description || ''
                            })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4 flex items-center">
                <PlusCircle className="h-5 w-5 mr-2" />
                Добавить категорию
              </h3>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Название категории *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={newCategory.name}
                    onChange={handleInputChange}
                    placeholder="Например: Электроника"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium">
                    Описание (опционально)
                  </label>
                  <Input
                    id="description"
                    name="description"
                    value={newCategory.description}
                    onChange={handleInputChange}
                    placeholder="Краткое описание категории"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Создание...' : 'Создать категорию'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 