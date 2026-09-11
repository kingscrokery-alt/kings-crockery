'use client';
/* oxlint-disable next/no-img-element, react/react-compiler, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-static-element-interactions -- Images use responsive CSS; tabs support mouse drag-scrolling. */
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  ShoppingBag,
  Menu,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  MessageCircle
} from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import catalog from './catalog.json';
import { shopConfig } from './shop-config';
import StoreImage from './store-image';

type Product = typeof catalog[number];
type Item = { id: string; color: string; qty: number };

const img = (s: string) => '/images/' + s;
const assets = {
  hero: img('kings-table-hero.png'),
  flatware: img('YD_082626_5050_Flatware_v01_a2732651-fd90-4413-a108-783da09422e6.jpg'),
  ceramic: img('YD_051526_CeramicCore_v2.jpg'),
  bundle: img('YD_052626_Bundle-main_v01.jpg'),
  splatter: img('YD_052626_MediaText-1_v01.jpg'),
  palm: img('YD_052626_MediaText-2_v01.jpg')
};

export const categories = [
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

export const categoryImages: Record<string, string> = {
  'Nonstick': '/images/categories/nonstick.jpg',
  'Pressure Cooker': '/images/categories/pressure-cooker.jpg',
  'Electronics': '/images/categories/electronics.jpg',
  'Bone China Dinner Set': '/images/categories/bone-china-dinner-set.jpg',
  'Marble Dinner Set': '/images/categories/marble-dinner-set.jpg',
  'Glassware Dinner Sets': '/images/categories/glassware-dinner-sets.jpg',
  'Water Sets': '/images/categories/water-sets.jpg',
  'Breakfast Set': '/images/categories/breakfast-set.jpg',
  'Soup Sets': '/images/categories/soup-sets.jpg',
  'Coffee Sets': '/images/categories/coffee-sets.jpg',
  'Tea Sets': '/images/categories/tea-sets.jpg',
  'Culture Sets': '/images/categories/culture-sets.jpg',
  'Buffet Sets': '/images/categories/buffet-sets.jpg',
  'Hi Tea Platters': '/images/categories/hi-tea-platters.jpg',
  'Ice cream sets': '/images/categories/ice-cream-sets.jpg',
  'Cool sets': '/images/categories/cool-sets.jpg',
  'Decor': '/images/categories/decor.jpg'
};

const navDepartments = [
  {
    label: 'Cookware',
    items: ['Nonstick', 'Pressure Cooker', 'Electronics'],
    image: '/images/categories/nonstick.jpg',
    blurb: 'Built for culinary passion and everyday performance'
  },
  {
    label: 'Dinner Sets',
    items: ['Bone China Dinner Set', 'Marble Dinner Set', 'Glassware Dinner Sets', 'Breakfast Set', 'Buffet Sets'],
    image: '/images/categories/bone-china-dinner-set.jpg',
    blurb: 'Complete tableware settings for family and festive gatherings'
  },
  {
    label: 'Drinkware & Tea',
    items: ['Tea Sets', 'Coffee Sets', 'Water Sets', 'Cool sets'],
    image: '/images/categories/tea-sets.jpg',
    blurb: 'Fine teapots, cups, espresso sets and chilled beverage servers'
  },
  {
    label: 'Serving & Dining',
    items: ['Soup Sets', 'Hi Tea Platters', 'Ice cream sets', 'Culture Sets'],
    image: '/images/categories/hi-tea-platters.jpg',
    blurb: 'Artisanal platters, traditional heritage thalis and dessert sets'
  },
  {
    label: 'Decor',
    items: ['Decor'],
    image: '/images/categories/decor.jpg',
    blurb: 'Sculptural vases, brass candle holders and table accents'
  }
];

export const slug = (s: string) => s.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
export const categoryUrl = (s: string) => '/collections/' + (s === 'Shop All' ? 'all' : slug(s));

const colors: Record<string, string> = {
  Moon: '#f5f3ed',
  Palm: '#c2c1a0',
  Plum: '#573647',
  Balsam: '#485949',
  Midnight: '#3c465c',
  Fog: '#b3b4b4',
  Canyon: '#ba7655',
  Daybreak: '#e8c4b7',
  Dune: '#cfb8a0',
  'Matte Gold': '#b89c5d',
  'Vintage Gold': '#a58d51',
  'Matte Black': '#292a2b',
  'Polished Steel': '#c5c6c7',
  'Matte Steel': '#acadaf',
  Clear: '#e1ebed',
  'Gold & White': '#dfbe71',
  'Platinum & White': '#d1d5db',
  'Carrara White': '#f3f4f6',
  'Clear Crystal': '#e0f2fe',
  'Botanical Floral': '#86efac',
  'Ivory Gold': '#fef08a',
  'Hammered Copper': '#b45309',
  'White Marble & Gold': '#e2e8f0',
  'Sandstone': '#d6d3d1'
};

function collectionProducts(key: string) {
  const q = key.toLowerCase();
  if (['all', 'new-arrivals', 'best-sellers', 'sale'].includes(q)) return catalog;
  return catalog.filter(p => {
    const slugName = slug(p.type);
    const searchTarget = (p.type + ' ' + p.name + ' ' + p.tags.join(' ')).toLowerCase();
    const queryNormalized = q.replace('-collection', '').replaceAll('-', ' ');
    return slugName === q || searchTarget.includes(queryNormalized);
  });
}

const bestIds = [
  'imperial-gold-bone-china-dinner-set',
  'royal-granite-nonstick-cookware-set',
  'royal-heritage-afternoon-tea-set',
  'tiered-marble-and-gold-hi-tea-platter',
  'the-core-set',
  'glossy-big-bowls'
];
const best = bestIds.map(id => catalog.find(p => p.id === id)).filter(Boolean) as Product[];

function photo(p: Product, color: string) {
  return p.variants.find(v => v.color === color)?.image || p.images[0];
}

function Swatches({ p, value, onChange }: { p: Product; value: string; onChange: (v: string) => void }) {
  return (
    <div className="swatches" aria-label="Choose colour">
      {p.colors.filter(c => c !== 'Default Title').map(c => (
        <button
          key={c}
          aria-label={c}
          aria-pressed={value === c}
          title={c}
          onClick={() => onChange(c)}
          className={value === c ? 'selected' : ''}
          style={{ background: colors[c] || '#ddd5c9' }}
        />
      ))}
    </div>
  );
}

function Card({ p, add }: { p: Product; add: (p: Product, c: string) => void }) {
  const [color, setColor] = useState(p.colors[0] || '');
  return (
    <article className="product-card">
      <Link href={'/products/' + p.id} className="product-image">
        <StoreImage src={photo(p, color)} alt={p.name + ' in ' + color} loading="lazy" />
        {p.images[1] && <StoreImage className="hover-image" src={p.images[1]} alt="" loading="lazy" />}
      </Link>
      <div className="card-top">
        <Link href={'/products/' + p.id}>{p.name}</Link>
        <span>Price on request</span>
      </div>
      <Swatches p={p} value={color} onChange={setColor} />
      <div className="card-bottom">
        <span>{color === 'Default Title' ? '' : color}</span>
        <button onClick={() => add(p, color)} aria-label={'Add ' + p.name + ' to cart'}>
          Add to cart <Plus size={15} />
        </button>
      </div>
    </article>
  );
}

function Grid({ items, add }: { items: Product[]; add: (p: Product, c: string) => void }) {
  return (
    <div className="product-grid">
      {items.map(p => (
        <Card key={p.id} p={p} add={add} />
      ))}
    </div>
  );
}

export default function Storefront({ path }: { path: string }) {
  const [cart, setCart] = useState<Item[]>([]);
  const [ready, setReady] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [menu, setMenu] = useState('');
  const [mobile, setMobile] = useState(false);
  const [order, setOrder] = useState(false);
  const [notice, setNotice] = useState('');
  const [homeCategory, setHomeCategory] = useState('all');

  // Hydrate the browser-owned cart after SSR.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('kings-cart') || '[]');
      setCart(saved.filter((i: Item) => catalog.some(p => p.id === i.id) && Number.isInteger(i.qty) && i.qty > 0));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem('kings-cart', JSON.stringify(cart));
  }, [cart, ready]);

  const add = (p: Product, color: string, qty = 1) => {
    setCart(old => {
      const existing = old.find(i => i.id === p.id && i.color === color);
      return existing ? old.map(i => (i === existing ? { ...i, qty: i.qty + qty } : i)) : [...old, { id: p.id, color, qty }];
    });
    setDrawer(true);
  };

  const update = (idx: number, delta: number) =>
    setCart(c => c.map((i, n) => (n === idx ? { ...i, qty: i.qty + delta } : i)).filter(i => i.qty > 0));

  const count = cart.reduce((n, i) => n + i.qty, 0);

  const orderNow = () => {
    setDrawer(false);
    setOrder(true);
    setNotice('');
  };

  const submitOrder = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!shopConfig.whatsappNumber) {
      setNotice('WhatsApp ordering will be available soon. Your selection is saved in your cart.');
      return;
    }
    const f = new FormData(e.currentTarget);
    const field = (name: string) => {
      const value = f.get(name);
      return typeof value === 'string' ? value : '';
    };
    const message = [
      'Hello Kings Crockery! I would like to order:',
      ...cart.map(i => `${catalog.find(p => p.id === i.id)?.name} — ${i.color} × ${i.qty}`),
      `Name: ${field('name')}`,
      `Phone: ${field('phone')}`,
      `Delivery address: ${field('address')}`,
      `Please confirm availability, the total price and payment instructions for the Rs 250 advance.`
    ].join('\n');
    window.location.href = `https://wa.me/${shopConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const normalizedPath = (path || '/').replace(/\/+$/, '') || '/';
  const mainKey = normalizedPath.split('/').pop() || '';
  const p = catalog.find(p => p.id === mainKey);

  const activeDepartment = navDepartments.find(d => d.label === menu);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="announcement">{shopConfig.policy}</div>

      <header className="site-header" onMouseLeave={() => setMenu('')}>
        <div className="header-main">
          <div className="header-left">
            <button className="mobile-menu icon-button" aria-label="Open menu" onClick={() => setMobile(true)}>
              <Menu />
            </button>
            <button className="icon-button" aria-label="Search products" onClick={() => setSearch(true)}>
              <Search />
            </button>
          </div>

          <Link className="wordmark" href="/">KINGS CROCKERY</Link>

          <button className="cart-button" aria-label={`Open cart, ${count} items`} onClick={() => setDrawer(true)}>
            <ShoppingBag size={23} />
            <span>{count}</span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link
            href="/collections/all"
            className="nav-link-btn"
            aria-expanded={menu === 'All Categories'}
            onMouseEnter={() => setMenu('All Categories')}
            onClick={() => setMenu('')}
          >
            All Categories <ChevronDown size={13} />
          </Link>
          {navDepartments.map(d => (
            <Link
              key={d.label}
              href={categoryUrl(d.items[0])}
              className="nav-link-btn"
              aria-expanded={menu === d.label}
              onMouseEnter={() => setMenu(d.label)}
              onClick={() => setMenu('')}
            >
              {d.label} <ChevronDown size={13} />
            </Link>
          ))}
          <Link
            href="/pages/our-story"
            className="nav-link-btn"
            aria-expanded={menu === 'About'}
            onMouseEnter={() => setMenu('About')}
            onClick={() => setMenu('')}
          >
            About <ChevronDown size={13} />
          </Link>
        </nav>

        {/* Dynamic Mega Menu */}
        {menu && (
          <div className="mega-menu">
            {menu === 'All Categories' ? (
              <>
                <div>
                  <h3>Cookware & Dinner Sets</h3>
                  {categories.slice(0, 6).map(n => (
                    <Link key={n} href={categoryUrl(n)} onClick={() => setMenu('')}>{n}</Link>
                  ))}
                </div>
                <div>
                  <h3>Tea, Serving & Decor</h3>
                  {categories.slice(6).map(n => (
                    <Link key={n} href={categoryUrl(n)} onClick={() => setMenu('')}>{n}</Link>
                  ))}
                  <Link href="/pages/build-your-bundle" onClick={() => setMenu('')} style={{ fontWeight: 600, marginTop: '8px' }}>
                    Build Your Own Bundle →
                  </Link>
                </div>
                <Link className="menu-feature" href="/collections/all" onClick={() => setMenu('')}>
                  <StoreImage src="/images/categories/bone-china-dinner-set.jpg" alt="All Kings Crockery Collections" />
                  <span>Explore All 17 Collections <ArrowRight size={18} /></span>
                </Link>
              </>
            ) : activeDepartment ? (
              <>
                <div>
                  <h3>{activeDepartment.label}</h3>
                  {activeDepartment.items.map(n => (
                    <Link key={n} href={categoryUrl(n)} onClick={() => setMenu('')}>{n}</Link>
                  ))}
                </div>
                <div>
                  <h3>Discover More</h3>
                  <Link href="/collections/all" onClick={() => setMenu('')}>View All Collections</Link>
                  <Link href="/pages/build-your-bundle" onClick={() => setMenu('')}>Build Your Bundle</Link>
                  <Link href="/pages/care-guide" onClick={() => setMenu('')}>Care & Handling Guide</Link>
                </div>
                <Link className="menu-feature" href={categoryUrl(activeDepartment.items[0])} onClick={() => setMenu('')}>
                  <StoreImage src={activeDepartment.image} alt={activeDepartment.label} />
                  <span>{activeDepartment.blurb} <ArrowRight size={18} /></span>
                </Link>
              </>
            ) : menu === 'About' ? (
              <>
                <div>
                  <h3>About Kings Crockery</h3>
                  {['Our Story', 'Craftsmanship', 'Care Guide', 'Our Hours Blog'].map(n => (
                    <Link key={n} href={'/pages/' + slug(n)} onClick={() => setMenu('')}>{n}</Link>
                  ))}
                </div>
                <div>
                  <h3>Customer Service</h3>
                  {['Contact', 'FAQ', 'Shipping & Returns', 'Order Policy'].map(n => (
                    <Link key={n} href={'/pages/' + slug(n)} onClick={() => setMenu('')}>{n === 'FAQ' ? 'Help & FAQ' : n}</Link>
                  ))}
                </div>
                <Link className="menu-feature" href="/pages/our-story" onClick={() => setMenu('')}>
                  <StoreImage src={assets.ceramic} alt="Kings Crockery Craftsmanship" />
                  <span>Good days begin around a beautiful table <ArrowRight size={18} /></span>
                </Link>
              </>
            ) : null}
          </div>
        )}
      </header>

      <main id="main">
        {path === '/' ? (
          <>
            {/* Hero Banner */}
            <section className="hero">
              <StoreImage className="hero-photo" src={assets.hero} alt="A beautifully set table" loading="eager" />
              <div className="hero-copy">
                <p>Make every gathering a little more special</p>
                <h1>A Beautiful Table.<br className="mobile-only" /> Every Day.</h1>
                <Link className="button white" href="/collections/all">Shop the collection</Link>
              </div>
              <div className="advance-seal">RS 250<span>ADVANCE<br />TO CONFIRM</span></div>
            </section>

            {/* Marquee Banner */}
            <div className="marquee" aria-label="Thoughtfully chosen for your table">
              <div>
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i}>
                    YOUR TABLE, YOUR WAY <span className="star">✳</span> KINGS CROCKERY <span className="star">✳</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Best Sellers */}
            <section className="section">
              <h2>Best Sellers & New Arrivals</h2>
              <Grid items={best} add={add} />
            </section>

            {/* Interactive All 17 Collections Explorer on Main Website */}
            <section className="section home-categories-explorer" style={{ paddingTop: '10px' }}>
              <div className="collection-heading" style={{ background: 'transparent', padding: '0 0 28px' }}>
                <p className="eyebrow">Explore Kings Crockery</p>
                <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', marginBottom: '12px' }}>
                  {homeCategory === 'all' ? 'All 17 Collections' : (categories.find(c => slug(c) === homeCategory) || homeCategory)}
                </h2>
                <p>Browse dining essentials, fine dinner sets, cookware, tea sets and serving pieces right here.</p>
              </div>

              <CategoryTabs
                collection={homeCategory}
                onSelectCategory={(s) => setHomeCategory(s)}
              />

              <div className="collection-grid-wrap" key={homeCategory} style={{ marginTop: '30px' }}>
                <Grid items={collectionProducts(homeCategory).slice(0, 16)} add={add} />
              </div>

              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Link className="button" href={categoryUrl(homeCategory)}>
                  View Full {homeCategory === 'all' ? 'Catalogue (150+ Items)' : (categories.find(c => slug(c) === homeCategory) || homeCategory)} Collection <ArrowRight size={17} />
                </Link>
              </div>
            </section>

            {/* Split Section: Nonstick & Cookware */}
            <section className="split">
              <StoreImage src="/images/categories/nonstick.jpg" alt="Royal Granite Nonstick Cookware" loading="lazy" />
              <div>
                <h2>Culinary Excellence.<br />Every Single Day.</h2>
                <p>Premium nonstick cookware and pressure cookers crafted for effortless cooking and enduring kitchen beauty.</p>
                <Link className="button" href="/collections/nonstick">Shop Cookware</Link>
              </div>
            </section>

            {/* Split Section: Fine Dinner Sets */}
            <section className="split reverse">
              <StoreImage src="/images/categories/bone-china-dinner-set.jpg" alt="Imperial Gold Bone China Dinner Set" loading="lazy" />
              <div>
                <h2>Timeless Elegance<br />For Your Table.</h2>
                <p>Discover our fine bone china, marble, and glassware dinner sets. Designed for memorable family dinners and festive gatherings.</p>
                <Link className="button" href="/collections/bone-china-dinner-set">Shop Dinner Sets</Link>
              </div>
            </section>

            {/* Bundle & Serving Feature */}
            <section className="bundle-section">
              <div className="bundle-heading">
                <h2>Afternoon Tea, Platters & Heritage Sets</h2>
                <p>Elevate your celebrations with tiered high tea platters, fine porcelain tea sets and handcrafted heritage sets.</p>
                <Link className="text-link" href="/collections/tea-sets">Explore Serving Pieces <ArrowRight size={18} /></Link>
              </div>
              <div className="bundle-layout">
                <StoreImage src="/images/categories/hi-tea-platters.jpg" alt="Hi Tea Platters and Tea Sets" loading="lazy" />
                <Grid items={catalog.filter(p => ['Tea Sets', 'Hi Tea Platters', 'Culture Sets', 'Coffee Sets'].includes(p.type)).slice(0, 4)} add={add} />
              </div>
            </section>

            {/* Editorial Pair */}
            <section className="editorial-pair">
              {[
                ['Artisanal Culture Sets', '/images/categories/culture-sets.jpg', 'culture-sets'],
                ['Summer Cool & Water Sets', '/images/categories/cool-sets.jpg', 'cool-sets']
              ].map(([title, url, to]) => (
                <Link key={to} href={'/collections/' + to}>
                  <StoreImage src={url} alt={title} loading="lazy" />
                  <div>
                    <h2>{title}</h2>
                    <span className="button white">Explore collection</span>
                  </div>
                </Link>
              ))}
            </section>

            {/* 17 Categories Showcase Strip */}
            <CategoryStrip />
          </>
        ) : normalizedPath.includes('/products/') ? (
          p ? (
            <ProductPage key={p.id} p={p} add={add} orderNow={(color, qty) => { add(p, color, qty); setDrawer(false); setOrder(true); }} />
          ) : (
            <Missing />
          )
        ) : normalizedPath.startsWith('/collections') || normalizedPath === '/shop' ? (
          <Collection collection={mainKey === 'collections' || mainKey === 'shop' || !mainKey ? 'all' : mainKey} add={add} />
        ) : normalizedPath === '/cart' ? (
          <section className="section cart-page">
            <h1>Your Shopping Cart</h1>
            {renderCart()}
            <button className="button" disabled={!count} onClick={orderNow}>Order Now on WhatsApp</button>
          </section>
        ) : mainKey === 'build-your-bundle' ? (
          <BundleBuilder add={add} />
        ) : (
          <InfoPage page={mainKey === 'about' ? 'our-story' : mainKey} orderNow={orderNow} />
        )}
      </main>

      {/* Footer */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="wordmark">KINGS<br />CROCKERY</Link>
            <p>A beautiful table.<br />Every day.</p>
          </div>
          <div>
            <h3>All Categories</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 18px' }}>
              {categories.map(n => (
                <Link key={n} href={categoryUrl(n)} style={{ fontSize: '13px', margin: '4px 0', color: '#e4e5eb' }}>{n}</Link>
              ))}
            </div>
          </div>
          <div>
            <h3>Customer Service</h3>
            {['Contact', 'FAQ', 'Shipping & Returns', 'Order Policy', 'Privacy Policy', 'Terms of Use', 'Accessibility'].map(n => (
              <Link key={n} href={'/pages/' + slug(n)}>{n === 'FAQ' ? 'Help & FAQ' : n}</Link>
            ))}
          </div>
          <div>
            <h3>About</h3>
            {['Our Story', 'Our Hours Blog', 'Craftsmanship', 'Care Guide'].map(n => (
              <Link key={n} href={'/pages/' + slug(n)}>{n}</Link>
            ))}
            <button className="footer-order" onClick={orderNow}>
              <MessageCircle size={18} /> Order Now
            </button>
          </div>
        </div>
        <div className="footer-policy">{shopConfig.policy}</div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Kings Crockery</span>
          <span>Pakistan · PKR</span>
          <a href="#main">Back to top ↑</a>
        </div>
      </footer>

      {/* Cart Drawer */}
      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent className="store-sheet">
          <SheetTitle>Your Cart ({count})</SheetTitle>
          <SheetDescription>Choose your favourites, then confirm your order on WhatsApp.</SheetDescription>
          {renderCart()}
          {count > 0 && (
            <div className="cart-checkout">
              <p className="total-line"><span>Order total</span><span>Confirmed on WhatsApp</span></p>
              <p className="advance-note">{shopConfig.policy}</p>
              <button className="button" onClick={orderNow}>Order Now <MessageCircle size={19} /></button>
              <Link href="/cart" className="text-link" onClick={() => setDrawer(false)}>View cart</Link>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Search Sheet */}
      <Sheet open={search} onOpenChange={setSearch}>
        <SheetContent side="top" className="search-sheet">
          <SheetTitle>Find your everyday favourites</SheetTitle>
          <SheetDescription>Search by product name, colour, category or finish.</SheetDescription>
          <label className="search-input">
            <Search />
            <input aria-label="Search products" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search dinner sets, tea sets, nonstick cookware…" />
          </label>
          <div className="search-results">
            {(query
              ? catalog.filter(p => (p.name + ' ' + p.type + ' ' + p.colors.join(' ')).toLowerCase().includes(query.toLowerCase()))
              : best
            ).slice(0, 8).map(p => (
              <Link onClick={() => setSearch(false)} key={p.id} href={'/products/' + p.id}>
                <StoreImage src={p.images[0]} alt="" />
                <span>{p.name}<small>{p.type}</small></span>
                <ArrowRight size={18} />
              </Link>
            ))}
            {query && !catalog.some(p => (p.name + ' ' + p.type + ' ' + p.colors.join(' ')).toLowerCase().includes(query.toLowerCase())) && (
              <p>No products found. Try “dinner set”, “nonstick”, or “tea”.</p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Drawer Navigation */}
      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent side="left" className="store-sheet">
          <SheetTitle>Kings Crockery</SheetTitle>
          <SheetDescription>Browse our 17 bespoke tableware & kitchenware categories.</SheetDescription>
          <div style={{ marginTop: '15px' }}>
            <Link className="mobile-nav-link" onClick={() => setMobile(false)} href="/collections/all">
              <strong>Shop All Pieces</strong>
              <ArrowRight size={18} />
            </Link>
            {categories.map(n => (
              <Link className="mobile-nav-link" onClick={() => setMobile(false)} href={categoryUrl(n)} key={n}>
                <span>{n}</span>
                <ArrowRight size={18} />
              </Link>
            ))}
          </div>
          <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
            <Link href="/pages/our-story" onClick={() => setMobile(false)} style={{ display: 'block', margin: '8px 0' }}>Our Story</Link>
            <Link href="/pages/care-guide" onClick={() => setMobile(false)} style={{ display: 'block', margin: '8px 0' }}>Care Guide</Link>
            <Link href="/pages/faq" onClick={() => setMobile(false)} style={{ display: 'block', margin: '8px 0' }}>Help & FAQ</Link>
          </div>
        </SheetContent>
      </Sheet>

      {/* WhatsApp Order Form */}
      <Sheet open={order} onOpenChange={setOrder}>
        <SheetContent className="store-sheet">
          <SheetTitle>Order on WhatsApp</SheetTitle>
          <SheetDescription>Share your selection and delivery details with Kings Crockery.</SheetDescription>
          <p className="advance-note">{shopConfig.policy} Payment details and the full order amount will be confirmed on WhatsApp.</p>
          {!shopConfig.whatsappNumber && (
            <p className="setup-notice">WhatsApp ordering is coming soon. You can still browse and save items to your cart.</p>
          )}
          <form onSubmit={submitOrder} className="order-form">
            <label>Your name<input required name="name" autoComplete="name" /></label>
            <label>Phone number<input required name="phone" type="tel" autoComplete="tel" /></label>
            <label>Delivery address<textarea required name="address" autoComplete="street-address" rows={3} /></label>
            <p>{count} item{count === 1 ? '' : 's'} in your order. No payment is taken on this website.</p>
            <button className="button" type="submit">Continue to WhatsApp <MessageCircle size={18} /></button>
            <output>{notice}</output>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );

  function renderCart() {
    return (
      <div className="cart-items">
        {!count ? (
          <div className="empty-cart">
            <ShoppingBag size={42} />
            <h2>A table waiting to happen.</h2>
            <p>Your cart is currently empty.</p>
            <Link onClick={() => setDrawer(false)} className="button" href="/collections/all">Explore the collection</Link>
          </div>
        ) : (
          cart.map((i, idx) => {
            const prod = catalog.find(x => x.id === i.id);
            if (!prod) return null;
            return (
              <div className="cart-item" key={i.id + i.color}>
                <StoreImage src={photo(prod, i.color)} alt={prod.name} />
                <div>
                  <Link href={'/products/' + prod.id} onClick={() => setDrawer(false)}>{prod.name}</Link>
                  <p>{i.color === 'Default Title' ? '' : i.color}</p>
                  <div className="quantity">
                    <button aria-label={'Decrease ' + prod.name + ' quantity'} onClick={() => update(idx, -1)}>
                      <Minus size={14} />
                    </button>
                    <span>{i.qty}</span>
                    <button aria-label={'Increase ' + prod.name + ' quantity'} onClick={() => update(idx, 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <button className="remove" onClick={() => setCart(c => c.filter((_, n) => n !== idx))}>Remove</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  }
}

/* Category Strip Carousel (Homepage) */
function CategoryStrip() {
  const scroll = useRef<HTMLDivElement>(null);
  return (
    <section className="section categories">
      <div className="section-heading">
        <div>
          <h2>Shop by Category</h2>
          <p style={{ marginTop: '6px', color: '#636775', fontSize: '15px' }}>
            Explore all 17 bespoke collections crafted for your dining, cooking, and entertaining.
          </p>
        </div>
        <div>
          <button aria-label="Previous categories" onClick={() => scroll.current?.scrollBy({ left: -450, behavior: 'smooth' })}>
            <ArrowLeft />
          </button>
          <button aria-label="Next categories" onClick={() => scroll.current?.scrollBy({ left: 450, behavior: 'smooth' })}>
            <ArrowRight />
          </button>
        </div>
      </div>
      <div className="category-strip" ref={scroll}>
        {categories.map(n => (
          <Link key={n} href={categoryUrl(n)}>
            <StoreImage src={categoryImages[n] || assets.ceramic} alt={n} loading="lazy" />
            <h3>{n}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* Interactive Category Navigation Carousel with Left/Right Arrows & Touch-Swipe */
let persistentCategoryScrollLeft = 0;

function CategoryTabs({
  collection,
  onSelectCategory
}: {
  collection: string;
  onSelectCategory?: (slug: string, url: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftVal = useRef(0);
  const isDragging = useRef(false);
  const isInitial = useRef(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    persistentCategoryScrollLeft = el.scrollLeft;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el && persistentCategoryScrollLeft > 0) {
      el.scrollLeft = persistentCategoryScrollLeft;
    }
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // When collection changes, ONLY gently scroll if the pill is cut off or outside visible area
  useEffect(() => {
    const track = scrollRef.current;
    const activeEl = activeRef.current;
    if (!track || !activeEl) return;

    if (isInitial.current) {
      isInitial.current = false;
      const trackRect = track.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      if (elRect.left < trackRect.left + 20 || elRect.right > trackRect.right - 20) {
        const offset = activeEl.offsetLeft - track.offsetLeft - 80;
        track.scrollLeft = Math.max(0, offset);
      }
      checkScroll();
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const elRect = activeEl.getBoundingClientRect();
    const buffer = typeof window !== 'undefined' && window.innerWidth <= 768 ? 20 : 70;

    // Only scroll if the active pill is clipped on the right
    if (elRect.right > trackRect.right - buffer) {
      const diff = elRect.right - (trackRect.right - buffer);
      track.scrollBy({ left: diff, behavior: 'smooth' });
    }
    // Only scroll if the active pill is clipped on the left
    else if (elRect.left < trackRect.left + buffer) {
      const diff = (trackRect.left + buffer) - elRect.left;
      track.scrollBy({ left: -diff, behavior: 'smooth' });
    }
    // If it's already comfortably in view: DO NOT SCROLL AT ALL! (Smooth, stable)

    const timer = setTimeout(checkScroll, 350);
    return () => clearTimeout(timer);
  }, [collection]);

  const handleScroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = dir === 'left' ? -380 : 380;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 350);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDown.current = true;
    isDragging.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftVal.current = scrollRef.current.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 5) {
      isDragging.current = true;
    }
    scrollRef.current.scrollLeft = scrollLeftVal.current - walk;
    checkScroll();
  };

  const onMouseUp = () => {
    isDown.current = false;
    setTimeout(checkScroll, 80);
  };

  const tabs = [
    { name: 'Shop All', url: '/collections/all', slug: 'all', image: assets.hero },
    ...categories.map(c => ({
      name: c,
      url: categoryUrl(c),
      slug: slug(c),
      image: categoryImages[c] || assets.ceramic
    }))
  ];

  return (
    <div className={`category-tabs-carousel ${canScrollLeft ? 'has-left' : ''} ${canScrollRight ? 'has-right' : ''}`}>
      <button
        type="button"
        className={`tab-arrow-btn left ${!canScrollLeft ? 'is-disabled' : ''}`}
        onClick={() => handleScroll('left')}
        aria-label="Previous categories"
        disabled={!canScrollLeft}
      >
        <ChevronLeft size={20} />
      </button>

      <div
        className="category-tabs-track"
        ref={scrollRef}
        onScroll={checkScroll}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {tabs.map(item => {
          const isActive = item.slug === collection || (collection === 'all' && item.slug === 'all');
          return (
            <Link
              key={item.name}
              href={item.url}
              scroll={false}
              ref={isActive ? activeRef : undefined}
              className={`category-tab-pill ${isActive ? 'active' : ''}`}
              onClick={e => {
                if (isDragging.current) {
                  e.preventDefault();
                  return;
                }
                if (onSelectCategory) {
                  e.preventDefault();
                  onSelectCategory(item.slug, item.url);
                }
              }}
            >
              <span className="tab-pill-thumb-wrap">
                <StoreImage src={item.image} alt="" className="tab-pill-thumb" />
              </span>
              <span className="tab-pill-title">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        className={`tab-arrow-btn right ${!canScrollRight ? 'is-disabled' : ''}`}
        onClick={() => handleScroll('right')}
        aria-label="Next categories"
        disabled={!canScrollRight}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

/* Collection View */
function Collection({ collection: initialCollection, add }: { collection: string; add: (p: Product, c: string) => void }) {
  const [currentCollection, setCurrentCollection] = useState(initialCollection);
  const [sort, setSort] = useState('Featured');
  const [color, setColor] = useState('All colours');
  const [limit, setLimit] = useState(24);

  useEffect(() => {
    setCurrentCollection(initialCollection);
    setColor('All colours');
    setLimit(24);
  }, [initialCollection]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const seg = window.location.pathname.split('/').pop() || 'all';
      setCurrentCollection(seg);
      setColor('All colours');
      setLimit(24);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const selectCategory = (newSlug: string, newUrl: string) => {
    if (newSlug === currentCollection) return;
    setCurrentCollection(newSlug);
    setColor('All colours');
    setLimit(24);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', newUrl);
    }
  };

  const list = collectionProducts(currentCollection).filter(p => color === 'All colours' || p.colors.includes(color));
  const sorted =
    sort === 'Name A–Z'
      ? [...list].sort((a, b) => a.name.localeCompare(b.name))
      : sort === 'Name Z–A'
      ? [...list].sort((a, b) => b.name.localeCompare(a.name))
      : list;

  const matchedCat = categories.find(c => slug(c) === currentCollection);
  const title = currentCollection === 'all' ? 'Shop All' : matchedCat || currentCollection.split('-').map(s => s[0]?.toUpperCase() + s.slice(1)).join(' ');

  return (
    <>
      <div className="collection-heading">
        <p className="eyebrow">Kings Crockery / The Collection</p>
        <h1>{title}</h1>
        <p>Thoughtfully designed pieces for everyday dining and special occasions.</p>
      </div>

      {/* Stable Category Tabs (Never shifts vertically) */}
      <CategoryTabs collection={currentCollection} onSelectCategory={selectCategory} />

      <section className="section collection">
        <div className="filter-bar">
          <span>{list.length} product{list.length === 1 ? '' : 's'}</span>
          <div>
            <Select value={color} onValueChange={v => { setColor(v || 'All colours'); setLimit(24); }}>
              <SelectTrigger aria-label="Filter by colour"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['All colours', ...new Set(collectionProducts(currentCollection).flatMap(p => p.colors))].filter(c => c !== 'Default Title').map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={v => setSort(v || 'Featured')}>
              <SelectTrigger aria-label="Sort products"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Featured', 'Name A–Z', 'Name Z–A'].map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="collection-grid-wrap" key={currentCollection}>
          <Grid items={sorted.slice(0, limit)} add={add} />
        </div>

        {!list.length && (
          <div className="empty-cart">
            <h2>This collection is taking shape.</h2>
            <p>Please contact us on WhatsApp to enquire about pieces and availability in this category.</p>
            <button className="button" onClick={() => selectCategory('all', '/collections/all')}>Shop all pieces</button>
          </div>
        )}

        {limit < list.length && (
          <button className="button load-more" onClick={() => setLimit(v => v + 24)}>
            Load more ({list.length - limit} remaining)
          </button>
        )}
      </section>
    </>
  );
}

function ProductPage({ p, add, orderNow }: { p: Product; add: (p: Product, c: string, q?: number) => void; orderNow: (c: string, q: number) => void }) {
  const [color, setColor] = useState(p.colors[0] || '');
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState('');

  return (
    <>
      <div className="breadcrumb">
        <Link href="/collections/all">Shop</Link> / <Link href={categoryUrl(p.type)}>{p.type}</Link> / {p.name}
      </div>
      <section className="product-detail">
        <div className="gallery">
          <StoreImage className="main-product" src={active || photo(p, color)} alt={p.name + ' ' + color} />
          <div className="thumbnails">
            {p.images.map((url, i) => (
              <button key={url} onClick={() => setActive(url)} aria-label={'View product photo ' + (i + 1)}>
                <StoreImage src={url} alt={p.name + ' detail ' + (i + 1)} />
              </button>
            ))}
          </div>
        </div>
        <div className="product-info">
          <p className="eyebrow">Kings Crockery · {p.type}</p>
          <h1>{p.name}</h1>
          <p className="product-price">Price confirmed on WhatsApp</p>
          <p>Bring your own style to the table. Choose your favourite finish and add this piece to your collection.</p>
          <div className="product-options">
            <p>Colour: <strong>{color === 'Default Title' ? 'Standard' : color}</strong></p>
            <Swatches p={p} value={color} onChange={v => { setColor(v); setActive(''); }} />
          </div>
          <div className="buy-row">
            <div className="quantity">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">
                <Minus size={16} />
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)} aria-label="Increase quantity">
                <Plus size={16} />
              </button>
            </div>
            <button className="button" onClick={() => add(p, color, qty)}>Add to cart</button>
          </div>
          <button className="button outline order-product" onClick={() => orderNow(color, qty)}>
            Order Now <MessageCircle size={18} />
          </button>
          <p className="advance-note">{shopConfig.policy}</p>
          <details open>
            <summary>Product details <Plus size={16} /></summary>
            <p>{p.name}. Select the finish shown above. Please confirm current stock, set contents, dimensions and pricing with us before payment.</p>
          </details>
          <details>
            <summary>Care guide <Plus size={16} /></summary>
            <p>Handle with care. Use a soft sponge and mild detergent. Confirm whether this particular item is dishwasher, oven or microwave safe before use.</p>
            <Link className="text-link" href="/pages/care-guide">Read the care guide</Link>
          </details>
          <details>
            <summary>Delivery & ordering <Plus size={16} /></summary>
            <p>Send your cart and address through WhatsApp. Pay the Rs 250 advance using the payment details we provide. Your order is dispatched after payment confirmation.</p>
          </details>
        </div>
      </section>
      <section className="section">
        <h2>Complete Your Table</h2>
        <Grid items={catalog.filter(v => v.type === p.type && v.id !== p.id).slice(0, 4)} add={add} />
      </section>
    </>
  );
}

function BundleBuilder({ add }: { add: (p: Product, c: string) => void }) {
  return (
    <>
      <div className="collection-heading">
        <p className="eyebrow">Make it your own</p>
        <h1>Build Your Own Bundle</h1>
        <p>Mix colours, shapes and finishes. Add your pieces, then review your selection in the cart.</p>
      </div>
      <section className="section">
        <Grid items={catalog.filter(p => /plate|bowl|mug|cookware|tea|set/i.test(p.name)).slice(0, 24)} add={add} />
      </section>
    </>
  );
}

function Missing() {
  return (
    <div className="empty-cart">
      <h1>We couldn’t find that page.</h1>
      <Link className="button" href="/collections/all">Explore the collection</Link>
    </div>
  );
}

function InfoPage({ page, orderNow }: { page: string; orderNow: () => void }) {
  const pageKey = page === 'about' ? 'our-story' : page === 'terms' ? 'terms-of-use' : page === 'privacy' ? 'privacy-policy' : page === 'help' ? 'faq' : page;
  const title = pageKey.split('-').map(s => s[0]?.toUpperCase() + s.slice(1)).join(' ');
  if (['our-story', 'craftsmanship', 'about'].includes(pageKey)) {
    return (
      <>
        <section className="story-hero">
          <StoreImage src={assets.ceramic} alt="A thoughtfully set table" />
          <div>
            <p className="eyebrow">Kings Crockery</p>
            <h1>{pageKey === 'craftsmanship' ? 'The Details Make the Difference.' : 'Good Days Begin Around a Table.'}</h1>
            <p>From everyday meals to your most memorable gatherings, the pieces on your table become part of the moment.</p>
          </div>
        </section>
        <section className="prose">
          <h2>A place at your table.</h2>
          <p>Kings Crockery brings together pieces for the way you eat, gather and celebrate. Explore ceramics, cookware, tea sets and finishing touches, and put together a setting that feels like you.</p>
          <p>For product materials, dimensions and availability, speak with us before ordering. We’ll help you find the right pieces for your home.</p>
          <Link className="button" href="/collections/all">Find your favourites</Link>
        </section>
      </>
    );
  }
  if (pageKey === 'our-hours-blog') {
    return (
      <>
        <div className="collection-heading">
          <p className="eyebrow">At the Kings Crockery table</p>
          <h1>Our Hours</h1>
          <p>Ideas for the moments you make at home.</p>
        </div>
        <div className="journal-grid">
          {[
            ['setting-the-everyday-table', 'Setting the Everyday Table', '/images/categories/bone-china-dinner-set.jpg'],
            ['mixing-your-colours', 'A Table in Your Colours', '/images/categories/tea-sets.jpg'],
            ['caring-for-your-crockery', 'Care for the Pieces You Love', '/images/categories/nonstick.jpg']
          ].map(([s, t, i]) => (
            <Link href={'/pages/' + s} key={s}>
              <StoreImage src={i} alt={t} />
              <h2>{t}</h2>
              <span className="text-link">Read the story <ArrowRight size={17} /></span>
            </Link>
          ))}
        </div>
      </>
    );
  }
  if (pageKey === 'setting-the-everyday-table' || pageKey === 'mixing-your-colours') {
    return (
      <section className="prose" style={{ paddingTop: '60px' }}>
        <p className="eyebrow">At the Kings Crockery table</p>
        <h1 style={{ fontSize: '38px', marginBottom: '20px' }}>{pageKey === 'setting-the-everyday-table' ? 'Setting the Everyday Table' : 'A Table in Your Colours'}</h1>
        <StoreImage
          src={pageKey === 'setting-the-everyday-table' ? '/images/categories/bone-china-dinner-set.jpg' : '/images/categories/tea-sets.jpg'}
          alt=""
          style={{ margin: '30px 0', borderRadius: '4px' }}
        />
        <p>Creating a beautiful table setting brings everyday warmth into any home. Whether you are arranging an intimate family dinner or an afternoon tea, thoughtful dinnerware makes every gathering special.</p>
        <Link className="button" href="/collections/all">Explore Collections</Link>
      </section>
    );
  }
  const faqs = [
    ['How do I place an order?', 'Add your chosen items to the cart, select Order Now, and share your delivery details through WhatsApp. We will confirm stock, the full price and payment instructions.'],
    ['What is the Rs 250 advance?', 'A Rs 250 advance payment is required to confirm every order. We dispatch your order to your provided address after confirming receipt of the payment.'],
    ['How do I pay?', 'Payment instructions are provided on WhatsApp when your order is confirmed. This website does not collect payment details or process payments.'],
    ['When will my order arrive?', 'The dispatch schedule, delivery estimate and any delivery charges will be confirmed on WhatsApp before you pay.'],
    ['Can I change my order or return an item?', 'Contact us through WhatsApp with your order details. Confirm the applicable cancellation and return terms with us before paying.']
  ];
  const care = [
    ['Nonstick Cookware', 'Use wooden or silicone utensils to protect the nonstick surface. Avoid high heat when empty and wash with a soft sponge.'],
    ['Bone China & Dinner Sets', 'Wash gently with mild detergent. Handle with care and confirm microwave/dishwasher safety before use.'],
    ['Tea & Coffee Sets', 'Rinse teapots after use to avoid tannin staining. Dry with a soft cloth to preserve gold and platinum detailing.'],
    ['Buffet & Pressure Cookers', 'Ensure gaskets and pressure valves are kept clean and free from food residue. Dry thoroughly after washing.']
  ];

  return (
    <section className="info-page">
      <p className="eyebrow">Kings Crockery</p>
      <h1>{pageKey === 'faq' ? 'How Can We Help?' : title}</h1>
      {['faq', 'help', 'shipping-returns', 'order-policy'].includes(pageKey) ? (
        <div className="faq-list">
          {faqs.map(([q, a]) => (
            <details key={q} open={pageKey !== 'faq'}>
              <summary>{q}<Plus size={18} /></summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      ) : pageKey === 'care-guide' || pageKey === 'caring-for-your-crockery' ? (
        <div className="faq-list">
          {care.map(([q, a]) => (
            <details key={q} open>
              <summary>{q}<Plus size={18} /></summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      ) : pageKey === 'contact' ? (
        <>
          <p>Need help choosing a piece or placing an order? Share your selection with us on WhatsApp ({shopConfig.displayPhone}).</p>
          <button className="button" onClick={orderNow}>Contact on WhatsApp <MessageCircle size={18} /></button>
          <p className="advance-note">{shopConfig.policy}</p>
        </>
      ) : ['privacy', 'privacy-policy'].includes(pageKey) ? (
        <>
          <p>Your cart is saved in this browser so you can return to your selection. Delivery details entered in the order form are included in a WhatsApp message only when you continue to WhatsApp.</p>
          <p>This website does not collect payment card details. WhatsApp processes information under its own privacy policy. Contact Kings Crockery about information shared when placing an order.</p>
        </>
      ) : ['terms', 'terms-of-use'].includes(pageKey) ? (
        <>
          <p>Product availability, specifications, prices and delivery terms must be confirmed with Kings Crockery through WhatsApp before payment. A cart selection is an order enquiry until accepted by Kings Crockery.</p>
          <p>{shopConfig.policy}</p>
        </>
      ) : pageKey === 'accessibility' ? (
        <p>You can navigate this store using your keyboard, browse at larger text sizes, and use reduced-motion settings. If you need help with an order, contact us through WhatsApp.</p>
      ) : (
        <Missing />
      )}
    </section>
  );
}
