import Link from 'next/link';

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
        <span className="text-white text-xl font-bold">EP</span>
      </div>
      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Export Platform
      </span>
    </Link>
  );
}; 