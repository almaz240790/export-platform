'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import { Upload, Trash2, Download, File, FileText, FileSpreadsheet } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cabinet/documents');
      if (!response.ok) {
        throw new Error('Не удалось загрузить документы');
      }
      const data = await response.json();
      setDocuments(data.documents);
    } catch (error) {
      console.error('Ошибка при загрузке документов:', error);
      toast.error('Не удалось загрузить документы');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    // Устанавливаем имя файла в поле ввода, если оно пустое
    if (!documentName) {
      setDocumentName(file.name.split('.')[0]); // Имя файла без расширения
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Выберите файл для загрузки');
      return;
    }
    
    if (!documentName.trim()) {
      toast.error('Введите название документа');
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', documentName);
      
      const response = await fetch('/api/cabinet/documents', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Не удалось загрузить документ');
      }
      
      const data = await response.json();
      setDocuments([data.document, ...documents]);
      
      // Очищаем форму
      setDocumentName('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.success('Документ успешно загружен');
    } catch (error) {
      console.error('Ошибка при загрузке документа:', error);
      toast.error(error instanceof Error ? error.message : 'Не удалось загрузить документ');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот документ?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/cabinet/documents/${documentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Не удалось удалить документ');
      }
      
      setDocuments(documents.filter(doc => doc.id !== documentId));
      toast.success('Документ успешно удален');
    } catch (error) {
      console.error('Ошибка при удалении документа:', error);
      toast.error('Не удалось удалить документ');
    }
  };

  // Функция для форматирования размера файла
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Байт';
    const k = 1024;
    const sizes = ['Байт', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Функция для получения иконки в зависимости от типа файла
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) {
      return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
    } else if (type.includes('document') || type.includes('word')) {
      return <FileText className="h-8 w-8 text-blue-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Документы компании</h1>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Название документа *
              </label>
              <Input
                id="name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Введите название документа"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="file" className="block text-sm font-medium">
                Файл документа *
              </label>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Выбрать файл
                </Button>
                {selectedFile && (
                  <span className="text-sm text-muted-foreground">
                    {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </span>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Загрузка...
                </>
              ) : (
                'Загрузить документ'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-muted rounded-lg p-6 text-center">
          <p className="text-muted-foreground">У вас еще нет загруженных документов</p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((document) => (
            <Card key={document.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    {getFileIcon(document.type)}
                    <div>
                      <h3 className="font-medium">{document.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="mr-3">{formatFileSize(document.size)}</span>
                        <span>Загружен: {new Date(document.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(document.url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteDocument(document.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 