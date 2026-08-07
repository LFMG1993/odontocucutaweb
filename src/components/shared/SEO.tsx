import { Helmet } from 'react-helmet-async';
import { siteConfig, sedesConfig, siteKeywords, type SedeConfig } from '@/data/siteConfig';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    canonicalUrl?: string;
    ogImage?: string;
    noIndex?: boolean;
}

const buildOpeningHours = (sede: SedeConfig) =>
    sede.horarios.map((rango) =>
        rango.bloques.map((bloque) => ({
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': rango.diaInicial === rango.diaFinal
                ? rango.diaInicial
                : [rango.diaInicial, rango.diaFinal],
            'opens': bloque.abre,
            'closes': bloque.cierra,
        }))
    ).flat();

const buildBranchSchema = (sede: SedeConfig) => ({
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    'name': `${sede.nombre} - OdontoCúcuta S.A.`,
    '@id': `${siteConfig.siteUrl}/#${sede.id}`,
    'url': siteConfig.siteUrl,
    'image': siteConfig.defaultOgImage,
    'telephone': `+57${sede.celular}`,
    'address': {
        '@type': 'PostalAddress',
        'streetAddress': sede.direccion,
        'addressLocality': 'Cúcuta',
        'addressRegion': 'Norte de Santander',
        'addressCountry': 'CO',
    },
    'openingHoursSpecification': buildOpeningHours(sede),
});

const getCurrentLang = () => {
  if (typeof document !== 'undefined' && document.documentElement.lang) {
    return document.documentElement.lang.startsWith('en') ? 'en' : 'es';
  }
  return 'es';
};

/**
 * Componente reutilizable para gestionar las etiquetas de SEO de cada página.
 * Configuración de marca centralizada en src/data/siteConfig.ts
 */
export const SEO = ({ title, description, keywords, canonicalUrl, ogImage, noIndex }: SEOProps) => {
    const currentLang = getCurrentLang();
    const ogLocale = currentLang === 'en' ? 'en_US' : 'es_CO';
    const ogLocaleAlternate = currentLang === 'en' ? 'es_CO' : 'en_US';

    const { name: siteName, slogan, siteUrl } = siteConfig;

    const fullTitle = `${title} | ${siteName}`;
    const finalDescription = description || `${siteName}: ${slogan}. Clínica odontológica en Cúcuta con 4 sedes en Norte de Santander. Agendamos tu cita.`;
    const finalOgImage = ogImage || siteConfig.defaultOgImage;
    const finalCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;
    const finalKeywords = keywords ? `${siteKeywords}, ${keywords}` : siteKeywords;

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Dentist',
        'name': `${siteName} - ${slogan}`,
        'alternateName': [
            'OdontoCúcuta',
            'Clínica Odontológica OdontoCúcuta',
            'Odontólogo en Cúcuta',
            'Clínica dental Cúcuta',
        ],
        'description': description,
        'slogan': slogan,
        'image': siteConfig.defaultOgImage,
        '@id': siteUrl,
        'url': siteUrl,
        'telephone': `+57${siteConfig.whatsappNumber}`,
        'email': siteConfig.email,
        'priceRange': siteConfig.priceRange,
        'address': {
            '@type': 'PostalAddress',
            'streetAddress': siteConfig.address.streetAddress,
            'addressLocality': siteConfig.address.addressLocality,
            'addressRegion': siteConfig.address.addressRegion,
            'postalCode': siteConfig.address.postalCode,
            'addressCountry': siteConfig.address.addressCountry,
        },
        'areaServed': siteConfig.areaServed,
        'geo': {
            '@type': 'GeoCoordinates',
            'latitude': siteConfig.geo.latitude,
            'longitude': siteConfig.geo.longitude,
        },
        'openingHoursSpecification': buildOpeningHours(sedesConfig[0]),
        'sameAs': siteConfig.sameAs,
        'contactPoint': {
            '@type': 'ContactPoint',
            'contactType': 'customer service',
            'telephone': `+57${siteConfig.whatsappNumber}`,
            'areaServed': 'CO',
            'availableLanguage': ['Spanish'],
        },
        'department': sedesConfig.slice(1).map((sede) => ({
            '@type': 'Dentist',
            'name': sede.nombre,
            '@id': `${siteUrl}/#${sede.id}`,
            'telephone': `+57${sede.celular}`,
            'address': {
                '@type': 'PostalAddress',
                'streetAddress': sede.direccion,
                'addressLocality': 'Cúcuta',
                'addressRegion': 'Norte de Santander',
                'addressCountry': 'CO',
            },
            'openingHoursSpecification': buildOpeningHours(sede),
        })),
        'serviceType': siteConfig.serviceType,
    };

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': siteName,
        'alternateName': slogan,
        'url': siteUrl,
        'description': `${siteName}: ${slogan}. Clínica odontológica en Cúcuta con 4 sedes en Norte de Santander.`,
        'inLanguage': currentLang,
    };

    const branchSchemas = sedesConfig.map(buildBranchSchema);

    return (
        <Helmet htmlAttributes={{ lang: currentLang }}>
            {noIndex && <meta name="robots" content="noindex, nofollow" />}
            <title>{fullTitle}</title>
            <meta name="description" content={finalDescription} />
            <meta name="keywords" content={finalKeywords} />
            <link rel="canonical" href={finalCanonicalUrl} />
            <link rel="alternate" hrefLang="es" href={siteUrl} />
            <link rel="alternate" hrefLang="es-CO" href={siteUrl} />
            <link rel="alternate" hrefLang="x-default" href={siteUrl} />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:locale" content={ogLocale} />
            <meta property="og:locale:alternate" content={ogLocaleAlternate} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalOgImage} />
            <meta property="og:image:alt" content={siteName} />
            <meta property="og:url" content={finalCanonicalUrl} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@odontocucuta1" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={finalOgImage} />

            {/* Schema.org JSON-LD */}
            <script type="application/ld+json">{JSON.stringify(schema)}</script>
            <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
            {branchSchemas.map((branch, i) => (
                <script key={i} type="application/ld+json">{JSON.stringify(branch)}</script>
            ))}
        </Helmet>
    );
};
