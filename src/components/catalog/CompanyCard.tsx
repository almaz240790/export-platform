import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CompanyCardProps {
  id: string;
  name: string;
  description: string;
  logo: string;
  country: string;
  category: string;
}

export function CompanyCard({
  id,
  name,
  description,
  logo,
  country,
  category,
}: CompanyCardProps) {
  return (
    <div className="group relative rounded-lg border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={logo}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <h3 className="font-semibold leading-none tracking-tight">
              <Link
                href={`/companies/${id}`}
                className="hover:text-primary"
              >
                {name}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground">{country}</p>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              {category}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
        >
          <Link href={`/companies/${id}`}>
            View Details
          </Link>
        </Button>
      </div>
    </div>
  );
} 