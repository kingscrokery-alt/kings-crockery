import Storefront from '../storefront';
import catalog from '../catalog.json';

const categories = [
  'Nonstick',
  'Pressure Cooker',
  'Electronics',
  'Bone China Dinner Set',
  'Marble Dinner Set',
  'Glassware Dinner Sets',
  'Water Sets',
  'Breakfast Set',
  'Soup Sets',
  'Coffee Sets',
  'Tea Sets',
  'Culture Sets',
  'Buffet Sets',
  'Hi Tea Platters',
  'Ice cream sets',
  'Cool sets',
  'Decor'
];

const slug = (s: string) => s.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');

export function generateStaticParams() {
  const routes: { path: string[] }[] = [
    { path: ['collections'] },
    { path: ['collections', 'all'] },
    ...categories.map(c => ({ path: ['collections', slug(c)] })),
    ...catalog.map(p => ({ path: ['products', p.id] })),
    { path: ['cart'] },
    { path: ['shop'] },
    { path: ['about'] },
    { path: ['contact'] },
    { path: ['faq'] },
    { path: ['terms'] },
    { path: ['privacy'] },
    { path: ['pages', 'about'] },
    { path: ['pages', 'our-story'] },
    { path: ['pages', 'craftsmanship'] },
    { path: ['pages', 'care-guide'] },
    { path: ['pages', 'faq'] },
    { path: ['pages', 'contact'] },
    { path: ['pages', 'shipping-returns'] },
    { path: ['pages', 'order-policy'] },
    { path: ['pages', 'privacy-policy'] },
    { path: ['pages', 'terms-of-use'] },
    { path: ['pages', 'accessibility'] },
    { path: ['pages', 'our-hours-blog'] },
    { path: ['pages', 'build-your-bundle'] },
    { path: ['pages', 'setting-the-everyday-table'] },
    { path: ['pages', 'mixing-your-colours'] },
    { path: ['pages', 'caring-for-your-crockery'] },
  ];
  return routes;
}

export default async function Page({ params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  return <Storefront path={'/' + path.join('/')} />;
}
