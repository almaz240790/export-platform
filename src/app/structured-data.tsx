import Script from 'next/script';

export function OrganizationSchema() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Export Platform',
    url: 'https://export-platform.vercel.app',
    logo: 'https://export-platform.vercel.app/logo.png',
    sameAs: [
      'https://twitter.com/exportplatform', 
      'https://facebook.com/exportplatform',
      'https://linkedin.com/company/exportplatform'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+7-XXX-XXX-XXXX',
      contactType: 'customer service',
      availableLanguage: ['Russian', 'English']
    },
    description: 'Платформа для экспортеров и бизнеса. Найдите надежных партнеров для экспорта товаров и услуг.'
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteSchema() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Export Platform',
    url: 'https://export-platform.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://export-platform.vercel.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 