import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'blocked';
  createdAt: string;
}

interface Company {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'blocked' | 'pending';
  createdAt: string;
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'companies' | 'logs'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load data based on active tab
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === 'users') {
          const response = await fetch('/api/admin/users');
          const data = await response.json();
          setUsers(data);
        } else if (activeTab === 'companies') {
          const response = await fetch('/api/admin/companies');
          const data = await response.json();
          setCompanies(data);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [activeTab]);
  
  const handleUserAction = async (userId: string, action: 'block' | 'unblock') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      
      if (response.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId
              ? { ...user, status: action === 'block' ? 'blocked' : 'active' }
              : user
          )
        );
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };
  
  const handleCompanyAction = async (companyId: string, action: 'approve' | 'block' | 'unblock') => {
    try {
      const response = await fetch(`/api/admin/companies/${companyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      
      if (response.ok) {
        setCompanies((prev) =>
          prev.map((company) =>
            company.id === companyId
              ? { ...company, status: action === 'block' ? 'blocked' : 'active' }
              : company
          )
        );
      }
    } catch (error) {
      console.error('Failed to update company:', error);
    }
  };
  
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex space-x-2 mb-4">
            <Button
              onClick={() => setActiveTab('users')}
              variant={activeTab === 'users' ? 'primary' : 'ghost'}
              size="sm"
            >
              Пользователи
            </Button>
            <Button
              onClick={() => setActiveTab('companies')}
              variant={activeTab === 'companies' ? 'primary' : 'ghost'}
              size="sm"
            >
              Компании
            </Button>
            <Button
              onClick={() => setActiveTab('logs')}
              variant={activeTab === 'logs' ? 'primary' : 'ghost'}
              size="sm"
            >
              Логи
            </Button>
          </div>
        </div>
        
        <div className="w-64">
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : activeTab === 'users' ? (
        <div className="rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'rounded-full px-2 py-1 text-xs font-medium',
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      )}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleUserAction(user.id, user.status === 'active' ? 'block' : 'unblock')
                      }
                    >
                      {user.status === 'active' ? 'Block' : 'Unblock'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === 'companies' ? (
        <div className="rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="border-b">
                  <td className="px-4 py-3">{company.name}</td>
                  <td className="px-4 py-3">{company.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'rounded-full px-2 py-1 text-xs font-medium',
                        company.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : company.status === 'blocked'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      )}
                    >
                      {company.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    {company.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCompanyAction(company.id, 'approve')}
                      >
                        Approve
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleCompanyAction(
                          company.id,
                          company.status === 'active' ? 'block' : 'unblock'
                        )
                      }
                    >
                      {company.status === 'active' ? 'Block' : 'Unblock'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-medium">Activity Logs</h3>
          <p className="text-sm text-muted-foreground">
            Logs will be displayed here...
          </p>
        </div>
      )}
    </div>
  );
} 