'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Mail, Phone, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'COMPANY' | 'CLIENT';
  image?: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    email: '',
    role: 'COMPANY'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cabinet/employees');
      if (!response.ok) {
        throw new Error('Не удалось загрузить список сотрудников');
      }
      const data = await response.json();
      setEmployees(data.employees);
    } catch (error) {
      console.error('Ошибка при загрузке сотрудников:', error);
      toast.error('Не удалось загрузить список сотрудников');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: value
    });
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/cabinet/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEmployee)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Не удалось добавить сотрудника');
      }
      
      const data = await response.json();
      setEmployees([...employees, data.employee]);
      setNewEmployee({ email: '', role: 'COMPANY' });
      setShowAddForm(false);
      toast.success('Сотрудник успешно добавлен');
    } catch (error) {
      console.error('Ошибка при добавлении сотрудника:', error);
      toast.error(error instanceof Error ? error.message : 'Не удалось добавить сотрудника');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveEmployee = async (employeeId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/cabinet/employees/${employeeId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Не удалось удалить сотрудника');
      }
      
      setEmployees(employees.filter(emp => emp.id !== employeeId));
      toast.success('Сотрудник успешно удален');
    } catch (error) {
      console.error('Ошибка при удалении сотрудника:', error);
      toast.error('Не удалось удалить сотрудника');
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Администратор';
      case 'COMPANY':
        return 'Сотрудник компании';
      case 'CLIENT':
        return 'Клиент';
      default:
        return role;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Сотрудники компании</h1>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant={showAddForm ? "outline" : "primary"}
          className="mb-4"
        >
          {showAddForm ? "Отменить" : "Добавить сотрудника"}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email сотрудника *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  placeholder="employee@example.com"
                />
                <p className="text-sm text-muted-foreground">
                  Если сотрудник не зарегистрирован, ему будет отправлено приглашение.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-medium">
                  Роль сотрудника *
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  value={newEmployee.role}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="COMPANY">Сотрудник компании</option>
                  <option value="ADMIN">Администратор</option>
                </select>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Добавление...' : 'Добавить сотрудника'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-muted rounded-lg p-6 text-center">
          <p className="text-muted-foreground">Ещё не добавлено ни одного сотрудника.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {employees.map((employee) => (
            <Card key={employee.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-muted flex items-center justify-center">
                      {employee.image ? (
                        <img 
                          src={employee.image} 
                          alt={employee.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-muted-foreground">
                          {employee.name ? employee.name[0].toUpperCase() : '?'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{employee.name || 'Сотрудник не зарегистрирован'}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Shield className="h-3.5 w-3.5 mr-1" />
                          <span>{getRoleName(employee.role)}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-3.5 w-3.5 mr-1" />
                          <span>{employee.email}</span>
                        </div>
                        {employee.phone && (
                          <div className="flex items-center">
                            <Phone className="h-3.5 w-3.5 mr-1" />
                            <span>{employee.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleRemoveEmployee(employee.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 