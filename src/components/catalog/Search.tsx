import { useState, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface SearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
  className?: string;
}

interface SearchFilters {
  country?: string;
  category?: string;
  language?: string;
}

export function Search({ onSearch, onFilterChange, className }: SearchProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query, onSearch]);
  
  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const clearFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search companies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2"
            onClick={() => setQuery('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <select
          value={filters.country || ''}
          onChange={(e) => handleFilterChange('country', e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All Countries</option>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="DE">Germany</option>
          {/* Add more countries */}
        </select>
        
        <select
          value={filters.category || ''}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          <option value="tech">Technology</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="agriculture">Agriculture</option>
          {/* Add more categories */}
        </select>
        
        <select
          value={filters.language || ''}
          onChange={(e) => handleFilterChange('language', e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All Languages</option>
          <option value="en">English</option>
          <option value="ru">Russian</option>
          <option value="de">German</option>
          {/* Add more languages */}
        </select>
      </div>
      
      {Object.entries(filters).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
            >
              <span className="capitalize">{key}: {value}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4"
                onClick={() => clearFilter(key as keyof SearchFilters)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 