'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Star, MessageSquare, User } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  text: string;
  authorName?: string;
  authorEmail?: string;
  createdAt: string;
  response?: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeReview, setActiveReview] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cabinet/reviews');
      if (!response.ok) {
        throw new Error('Не удалось загрузить отзывы');
      }
      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error('Ошибка при загрузке отзывов:', error);
      toast.error('Не удалось загрузить отзывы');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponseSubmit = async (reviewId: string) => {
    if (!response.trim()) {
      toast.error('Введите текст ответа');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const apiResponse = await fetch(`/api/cabinet/reviews/${reviewId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response }),
      });
      
      if (!apiResponse.ok) {
        throw new Error('Не удалось отправить ответ');
      }
      
      // Обновляем локальное состояние
      setReviews(reviews.map(rev => 
        rev.id === reviewId ? { ...rev, response } : rev
      ));
      
      setActiveReview(null);
      setResponse('');
      toast.success('Ответ успешно отправлен');
    } catch (error) {
      console.error('Ошибка при отправке ответа:', error);
      toast.error('Не удалось отправить ответ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index} 
        className={`h-5 w-5 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Отзывы о компании</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-muted rounded-lg p-6 text-center">
          <p className="text-muted-foreground">У вас пока нет отзывов от клиентов</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {review.authorName || 'Анонимный пользователь'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  
                  <p className="text-sm leading-relaxed">{review.text}</p>
                  
                  {review.response ? (
                    <div className="mt-4 bg-muted rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                        <span className="font-medium">Ваш ответ:</span>
                      </div>
                      <p className="text-sm">{review.response}</p>
                    </div>
                  ) : (
                    activeReview === review.id ? (
                      <div className="mt-4">
                        <Textarea
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                          placeholder="Введите ваш ответ на отзыв..."
                          rows={3}
                          className="mb-2"
                        />
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setActiveReview(null);
                              setResponse('');
                            }}
                          >
                            Отмена
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleResponseSubmit(review.id)}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Отправка...' : 'Ответить'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveReview(review.id)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Ответить на отзыв
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 