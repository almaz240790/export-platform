# Export Platform

Платформа для экспортеров с функциями аутентификации, восстановления пароля и управления профилем.

## Технологии

- Next.js 14
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- NextAuth.js
- TailwindCSS
- Twilio (SMS)
- Nodemailer (Email)

## Установка и Запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/almaz240790/export-platform.git
cd export-platform
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` и настройте переменные окружения:
```env
# Database
DATABASE_URL="your_database_url"

# NextAuth
NEXTAUTH_SECRET="your_secret"
NEXTAUTH_URL="http://localhost:3000"

# Email
EMAIL_USER="your_email"
EMAIL_PASSWORD="your_email_password"

# Twilio (опционально)
TWILIO_ACCOUNT_SID="your_sid"
TWILIO_AUTH_TOKEN="your_token"
TWILIO_PHONE_NUMBER="your_phone"
```

4. Примените миграции базы данных:
```bash
npx prisma migrate deploy
```

5. Запустите проект:
```bash
npm run dev
```

## Структура Проекта

- `/src/app` - Роуты и страницы приложения
- `/src/components` - React компоненты
- `/src/lib` - Утилиты и конфигурации
- `/prisma` - Схема и миграции базы данных

## Основные Функции

1. Аутентификация:
   - Регистрация
   - Вход
   - Восстановление пароля через email/SMS

2. Профиль пользователя:
   - Просмотр и редактирование данных
   - Управление ролями

## Деплой

Проект развернут на Vercel: https://export-platform.vercel.app

### Настройка Vercel

1. Подключите GitHub репозиторий
2. Настройте переменные окружения
3. Настройте домен (если необходимо)

## База Данных

Проект использует PostgreSQL от Neon. Схема базы данных:

```prisma
model User {
  id             String    @id @default(cuid())
  name           String?
  email          String?   @unique
  phone          String?   @unique
  hashedPassword String?
  role           String    @default("user")
  resetCode      String?
  resetCodeExpires DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}
```

## API Endpoints

1. Аутентификация:
   - POST `/api/auth/[...nextauth]` - NextAuth endpoints
   - POST `/api/auth/forgot-password` - Восстановление пароля

## Разработка

1. Создание новой ветки:
```bash
git checkout -b feature/your-feature
```

2. Коммит изменений:
```bash
git add .
git commit -m "feat: add new feature"
```

3. Пуш и создание PR:
```bash
git push origin feature/your-feature
```

## Поддержка

По вопросам и проблемам создавайте issues в GitHub репозитории.
