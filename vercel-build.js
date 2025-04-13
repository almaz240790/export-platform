const { execSync } = require('child_process');

// Определяем, запущены ли мы в Vercel Production или Preview
const isProd = process.env.VERCEL_ENV === 'production';
const isPreview = process.env.VERCEL_ENV === 'preview';

console.log(`Running in Vercel ${process.env.VERCEL_ENV} environment`);

try {
  // Генерируем Prisma клиент
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Применяем миграции только в Production и Preview окружениях
  if (isProd || isPreview) {
    console.log('Applying database migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('Migrations applied successfully');
  }
  
  // Запуск обычной сборки Next.js
  console.log('Starting Next.js build...');
} catch (error) {
  console.error('Build script failed:', error);
  process.exit(1);
}