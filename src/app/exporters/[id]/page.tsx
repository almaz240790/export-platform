import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ExporterPage({ params }: { params: { id: string } }) {
  // В реальном приложении данные будут загружаться из API
  const exporter = {
    id: 1,
    name: 'Korea Auto Export',
    logo: '🚗',
    location: 'Сеул, Южная Корея',
    rating: 4.9,
    description: 'Прямые поставки автомобилей из Южной Кореи. Более 10 лет опыта работы с российским рынком.',
    fullDescription: `
      Мы специализируемся на подборе и экспорте автомобилей из Южной Кореи. Наша компания работает с 2010 года и за это время мы успешно доставили более 5000 автомобилей клиентам из России и стран СНГ.

      Наши преимущества:
      - Прямые контракты с производителями
      - Собственные площадки в Корее
      - Полное таможенное оформление
      - Доставка до вашего города
      - Гарантия на все автомобили
    `,
    stats: {
      deals: '5000+',
      experience: '13 лет',
      clients: '1000+',
      satisfaction: '99%'
    },
    services: [
      'Подбор автомобилей под заказ',
      'Проверка технического состояния',
      'Оформление документов',
      'Таможенное оформление',
      'Доставка до клиента',
      'Гарантийное обслуживание'
    ],
    team: [
      {
        name: 'Ким Джи Вон',
        position: 'Генеральный директор',
        photo: '👨‍💼'
      },
      {
        name: 'Пак Мин Су',
        position: 'Главный менеджер',
        photo: '👨‍💼'
      }
    ],
    reviews: [
      {
        author: 'Александр К.',
        rating: 5,
        text: 'Отличный сервис! Помогли подобрать и доставить Genesis G80 в отличном состоянии.',
        date: '15.03.2024'
      },
      {
        author: 'Ирина М.',
        rating: 5,
        text: 'Заказывала KIA K5. Все четко, в срок, без проблем. Рекомендую!',
        date: '10.03.2024'
      }
    ]
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
            <div className="flex items-start gap-8">
              <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center text-6xl">
                {exporter.logo}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{exporter.name}</h1>
                    <p className="text-gray-500">{exporter.location}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-2xl mr-2">⭐</span>
                    <span className="text-2xl font-medium">{exporter.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 whitespace-pre-line">{exporter.fullDescription}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Object.entries(exporter.stats).map(([key, value]) => (
              <div key={key} className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="text-2xl font-bold text-primary mb-1">{value}</div>
                <div className="text-gray-500 capitalize">{key.replace('_', ' ')}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Services */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
                <h2 className="text-2xl font-bold mb-6">Услуги</h2>
                <div className="grid gap-4">
                  {exporter.services.map((service, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        ✓
                      </div>
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team */}
              <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
                <h2 className="text-2xl font-bold mb-6">Команда</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {exporter.team.map((member, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                        {member.photo}
                      </div>
                      <div>
                        <div className="font-semibold">{member.name}</div>
                        <div className="text-gray-500">{member.position}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Отзывы</h2>
                <div className="grid gap-6">
                  {exporter.reviews.map((review, index) => (
                    <div key={index} className="border-b last:border-0 pb-6 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold">{review.author}</div>
                        <div className="text-gray-500">{review.date}</div>
                      </div>
                      <div className="flex items-center mb-2">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i} className="text-yellow-400">⭐</span>
                        ))}
                      </div>
                      <p className="text-gray-600">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-8 shadow-sm sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Оставить заявку</h2>
                <form className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ваше имя
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Интересующий автомобиль
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Сообщение
                    </label>
                    <textarea
                      rows={4}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <Button variant="gradient" size="lg">
                    Отправить заявку
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 