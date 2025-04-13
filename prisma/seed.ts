import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('test123', 10);

  // Создаем тестового пользователя
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      phone: '+79991234567',
      name: 'Test User',
      hashedPassword, // Используем захэшированный пароль
      role: 'CLIENT',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 