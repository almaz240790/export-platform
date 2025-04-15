import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface RegisterFormProps {
  className?: string;
}

export function RegisterForm({ className }: RegisterFormProps) {
  const router = useRouter();
  const [role, setRole] = useState<'client' | 'company' | 'supplier'>('client');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role }),
      });
      
      if (response.ok) {
        router.push('/login');
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred during registration' });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Role</label>
          <div className="flex space-x-3 mb-6">
            <Button
              type="button"
              onClick={() => setRole('client')}
              variant={role === 'client' ? 'primary' : 'outline'}
              className="flex-1"
            >
              Клиент
            </Button>
            <Button
              type="button"
              onClick={() => setRole('company')}
              variant={role === 'company' ? 'primary' : 'outline'}
              className="flex-1"
            >
              Компания
            </Button>
            <Button
              type="button"
              onClick={() => setRole('supplier')}
              variant={role === 'supplier' ? 'primary' : 'outline'}
              className="flex-1"
            >
              Поставщик
            </Button>
          </div>
        </div>
        
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={cn('mt-1', errors.name && 'border-destructive')}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-destructive">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={cn('mt-1', errors.email && 'border-destructive')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="phone" className="text-sm font-medium">
            Phone
          </label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={cn('mt-1', errors.phone && 'border-destructive')}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-destructive">{errors.phone}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={cn('mt-1', errors.password && 'border-destructive')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-destructive">{errors.password}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className={cn('mt-1', errors.confirmPassword && 'border-destructive')}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-destructive">{errors.confirmPassword}</p>
          )}
        </div>
      </div>
      
      {errors.submit && (
        <p className="text-sm text-destructive">{errors.submit}</p>
      )}
      
      <Button type="submit" className="w-full">
        Register
      </Button>
    </form>
  );
} 