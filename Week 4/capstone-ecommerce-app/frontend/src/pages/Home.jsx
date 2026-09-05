import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import {
  Sparkles,
  Filter,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ShoppingBag,
  Star,
  ArrowRight,
  ArrowUpRight,
  Monitor,
  Cpu,
  Box,
  Radio,
  Zap,
  CheckCircle2,
  Mail,
} from 'lucide-react';

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Sync state if URL query changes
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  // Fetch unique categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/products/categories');
        if (data.data) {
          setCategories(['All', ...data.data]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever search, category, sort, or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 8,
          sort: sortBy,
        };
        if (search) params.search = search;
        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }

        const { data } = await API.get('/products', { params });
        setProducts(data.data.products || []);
        setTotalPages(data.data.pages || 1);
        setTotalCount(data.data.totalProducts || 0);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, selectedCategory, sortBy, page]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);

    // Smooth scroll to catalog section
    const catalogElement = document.getElementById('catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchParams({});
    setPage(1);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  // Helper to map category names to rich icon and description metadata
  const getCategoryDetails = (catName) => {
    switch (catName?.toLowerCase()) {
      case 'electronics':
        return {
          icon: <Cpu size={24} />,
          desc: 'High-end audio, custom keyboards, 4K displays & silicon hardware',
          badge: 'POPULAR',
        };
      case 'fashion':
        return {
          icon: <Zap size={24} />,
          desc: 'Commuter backpacks, minimalist linen & luxury chronographs',
          badge: 'LIFESTYLE',
        };
      case 'home & living':
        return {
          icon: <Box size={24} />,
          desc: 'Ergonomic mesh chairs, pour-over sets & desk accessories',
          badge: 'WORKPLACE',
        };
      case 'fitness':
        return {
          icon: <RotateCcw size={24} />,
          desc: 'Smart hydrators, recovery foam rollers & wellness kits',
          badge: 'WELLNESS',
        };
      case 'workstations':
        return {
          icon: <Monitor size={24} />,
          desc: 'High-throughput towers & multi-GPU developer systems',
          badge: 'PRO SERIES',
        };
      case 'compute enclosures':
        return {
          icon: <Box size={24} />,
          desc: '19" rack chassis, acoustic dampening & cooling bays',
          badge: 'STORAGE',
        };
      case 'avionics':
        return {
          icon: <Radio size={24} />,
          desc: 'High-reliability telemetry kits, transceivers & flight hardware',
          badge: 'AEROSPACE',
        };
      case 'accessories':
        return {
          icon: <Zap size={24} />,
          desc: 'Mechanical keyboards, ergonomic mounts & studio cables',
          badge: 'ESSENTIALS',
        };
      default:
        return {
          icon: <Sparkles size={24} />,
          desc: 'Premium curated hardware & essential lifestyle gear',
          badge: 'FEATURED',
        };
    }
  };

  // Derive categories list for showcase tiles dynamically from DB, or fallback
  const dbCategories = categories.filter((c) => c !== 'All');
  const activeCategoriesList = dbCategories.length > 0
    ? dbCategories
    : ['Electronics', 'Workstations', 'Compute Enclosures', 'Avionics', 'Accessories'];

  const categoryMeta = activeCategoriesList.map((catName) => ({
    name: catName,
    ...getCategoryDetails(catName),
  }));

  // Pick top 3 featured products for the spotlight
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 3);
  const showcaseProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3);

  return (
    <div>
      {/* 1. STUNNING HERO SECTION (SPLIT LAYOUT) */}
      <div className="hero-banner" style={{ marginBottom: '3.5rem' }}>
        <div className="hero-split">
          {/* Left Column: Value Prop & CTA */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span className="spec-chip">
                <Sparkles size={13} /> NEXT-GEN PERFORMANCE HARDWARE
              </span>
              <span className="spec-chip" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderColor: 'var(--border-emerald)' }}>
                <span className="status-ping" style={{ width: '6px', height: '6px' }}></span> 100% GENUINE WARRANTY
              </span>
            </div>

            <h1 className="hero-title" style={{ maxWidth: '650px' }}>
              Precision Hardware Built for <span>Creators &amp; Engineers.</span>
            </h1>
            <p className="hero-subtitle" style={{ maxWidth: '560px', lineHeight: 1.6 }}>
              From multi-threaded custom workstations and compute enclosures to ultra-low latency avionics, explore hardware tuned for absolute reliability and zero downtime.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              <a href="#catalog" className="btn btn-primary btn-lg">
                <ShoppingBag size={18} /> Explore Catalog
              </a>
              <Link to="/register" className="btn btn-secondary btn-lg">
                <Zap size={18} /> Join NexisStore
              </Link>
            </div>

            {/* Trust metrics strip */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>GUARANTEE: </span>
                <strong style={{ color: '#ffffff' }}>100% Certified Genuine</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>WARRANTY: </span>
                <strong style={{ color: '#ffffff' }}>1-Year Included</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>CATALOG: </span>
                <strong style={{ color: 'var(--text-amber)' }}>{totalCount} PRODUCTS</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>DISPATCH: </span>
                <strong style={{ color: 'var(--success)' }}>SAME-DAY DISPATCH</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Flagship Spotlight Card */}
          <div>
            <div className="flagship-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="spec-chip" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--text-amber)' }}>
                  🔥 FLAGSHIP SPOTLIGHT
                </span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  SKU-WS-09X
                </span>
              </div>

              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', height: '220px', background: '#090a0f', border: '1px solid var(--border-subtle)' }}>
                <img
                  src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80"
                  alt="Titan-X9 Studio Workstation"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(9, 10, 15, 0.85)', backdropFilter: 'blur(8px)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-amber)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-amber)', fontSize: '0.78rem', fontWeight: 700 }}>
                    ₹4,25,000
                  </span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>
                Titan-X9 Studio Workstation
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '0.85rem' }}>
                64-Core Threadripper PRO • 128GB DDR5 ECC • Dual RTX 4090 • Liquid Cooled
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-amber)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <Star size={14} fill="var(--text-amber)" /> 4.9 <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem', fontWeight: 400 }}>(128 reviews)</span>
                </div>
                <a href="#catalog" className="btn btn-primary btn-sm">
                  View in Catalog <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CORE STORE GUARANTEES / TRUST BADGES */}
      <div className="trust-badges-grid">
        <div className="trust-badge-item">
          <div className="trust-badge-icon">
            <Truck size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.15rem' }}>Free Express Shipping</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Complimentary on orders above ₹50,000</div>
          </div>
        </div>

        <div className="trust-badge-item">
          <div className="trust-badge-icon">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.15rem' }}>1-Year Comprehensive Warranty</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>100% genuine certified components</div>
          </div>
        </div>

        <div className="trust-badge-item">
          <div className="trust-badge-icon">
            <RotateCcw size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.15rem' }}>30-Day Easy Returns</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Hassle-free replacement guarantee</div>
          </div>
        </div>

        <div className="trust-badge-item">
          <div className="trust-badge-icon">
            <Headphones size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.15rem' }}>24/7 Dedicated Support</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Direct engineering assistance</div>
          </div>
        </div>
      </div>

      {/* 3. VISUAL "SHOP BY CATEGORY" SHOWCASE */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div className="section-heading-wrapper">
          <div>
            <span className="spec-chip" style={{ marginBottom: '0.4rem' }}>CURATED PRODUCT FAMILIES</span>
            <h2 style={{ fontSize: '1.8rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
              Shop By Category
            </h2>
          </div>
          <button
            onClick={() => handleCategoryClick('All')}
            className="btn btn-secondary btn-sm"
          >
            View All Categories ({categories.length - 1}) <ArrowRight size={14} />
          </button>
        </div>

        <div className="category-showcase-grid">
          {categoryMeta.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <div
                key={cat.name}
                className={`category-tile ${isActive ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat.name)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ color: isActive ? 'var(--text-amber)' : 'var(--color-primary)' }}>
                    {cat.icon}
                  </div>
                  <span className="spec-chip" style={{ fontSize: '0.65rem' }}>{cat.badge}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem', color: isActive ? 'var(--text-amber)' : '#ffffff' }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.85rem' }}>
                  {cat.desc}
                </p>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-amber)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: 'auto' }}>
                  Browse Collection <ArrowUpRight size={12} />
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. FEATURED PRODUCTS SPOTLIGHT */}
      {showcaseProducts.length > 0 && (
        <div style={{ marginBottom: '3.5rem' }}>
          <div className="section-heading-wrapper">
            <div>
              <span className="spec-chip" style={{ marginBottom: '0.4rem' }}>HAND-PICKED HARDWARE</span>
              <h2 style={{ fontSize: '1.8rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                Featured Collections
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Top-rated systems tested &amp; certified by our lab
            </span>
          </div>

          <div className="products-grid">
            {showcaseProducts.map((product) => (
              <ProductCard key={`featured-${product._id}`} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* 5. PROMOTIONAL TECH DEAL BANNER */}
      <div className="promo-banner">
        <div>
          <span className="spec-chip" style={{ background: 'rgba(245, 158, 11, 0.18)', color: 'var(--text-amber)', marginBottom: '0.6rem' }}>
            SPECIAL LAUNCH INCENTIVE // LIMITED TIME
          </span>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            Get 10% Off Your Entire First Order
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '540px' }}>
            Upgrade your engineering lab or workstation setup. Use code <strong style={{ color: 'var(--text-amber)', fontFamily: 'var(--font-mono)' }}>NEXIS10</strong> at checkout for instant savings.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              padding: '0.6rem 1.2rem',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px dashed var(--border-amber)',
              borderRadius: 'var(--radius-xs)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--text-amber)',
            }}
          >
            NEXIS10
          </div>
          <a href="#catalog" className="btn btn-primary">
            Shop The Sale <ArrowRight size={15} />
          </a>
        </div>
      </div>

      {/* 6. FULL DYNAMIC PRODUCT CATALOG (WITH SEARCH & FILTERS) */}
      <div id="catalog" style={{ paddingTop: '1.5rem', marginBottom: '3.5rem' }}>
        <div className="section-heading-wrapper">
          <div>
            <span className="spec-chip" style={{ marginBottom: '0.4rem' }}>COMPLETE INVENTORY</span>
            <h2 style={{ fontSize: '1.8rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
              All Products &amp; Hardware Modules
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Filter by category, search by specs, or sort by pricing and ratings.
            </p>
          </div>

          {/* Results counter */}
          <span className="spec-chip" style={{ color: 'var(--text-amber)' }}>
            {totalCount} ITEMS IN CATALOG
          </span>
        </div>

        {/* Filter and Control Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {/* Category Pills */}
          <div className="category-pills" style={{ marginBottom: 0 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Sort Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <SlidersHorizontal size={15} color="var(--text-muted)" />
            <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>SORT BY:</span>
            <select
              className="form-control"
              style={{ width: 'auto', padding: '0.45rem 0.9rem', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicators */}
        {search && (
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '0.6rem 1rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Showing search results for: <strong style={{ color: 'var(--text-amber)' }}>"{search}"</strong> ({totalCount} items found)
            </span>
            <button
              onClick={handleClearFilters}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
            >
              CLEAR SEARCH
            </button>
          </div>
        )}

        {/* Product Grid / Loading State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
            <div className="status-ping" style={{ width: '12px', height: '12px', margin: '0 auto 1rem' }}></div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', letterSpacing: '0.05em' }}>
              LOADING PRODUCTS &amp; INVENTORY...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div
            className="card"
            style={{ textAlign: 'center', padding: '4rem 2rem', margin: '2rem 0' }}
          >
            <Filter size={38} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No Products Found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '440px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              We couldn't find any products matching your current search or category filters.
            </p>
            <button className="btn btn-primary" onClick={handleClearFilters}>
              RESET ALL FILTERS
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-wrapper" style={{ marginTop: '2.5rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={15} /> PREV
            </button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0 0.8rem' }}>
              PAGE {page} OF {totalPages}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              NEXT <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>

      {/* 7. CUSTOMER SOCIAL PROOF / VERIFIED REVIEWS */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div className="section-heading-wrapper">
          <div>
            <span className="spec-chip" style={{ marginBottom: '0.4rem' }}>COMMUNITY VALIDATION</span>
            <h2 style={{ fontSize: '1.8rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
              Trusted by Engineers &amp; Creators
            </h2>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Real reviews from verified hardware builders
          </span>
        </div>

        <div className="reviews-grid">
          <div className="review-card">
            <div>
              <div style={{ display: 'flex', gap: '0.2rem', color: 'var(--text-amber)', marginBottom: '0.85rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="var(--text-amber)" />
                ))}
              </div>
              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.25rem' }}>
                "The Titan-X9 handled our LLM fine-tuning workload with zero thermal throttling. Build quality, acoustics, and internal cable routing are truly masterclass."
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Dr. Aris Thorne"
                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-amber)' }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Dr. Aris Thorne</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Lead AI Architect, NeuroVector Labs</div>
              </div>
            </div>
          </div>

          <div className="review-card">
            <div>
              <div style={{ display: 'flex', gap: '0.2rem', color: 'var(--text-amber)', marginBottom: '0.85rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="var(--text-amber)" />
                ))}
              </div>
              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.25rem' }}>
                "NexisStore is the first hardware supplier that genuinely delivers on its same-day dispatch promise. The avionics telemetry kit worked straight out of the box."
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="Kavya Patel"
                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-amber)' }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Kavya Patel</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Senior Robotics Researcher, AeroTech</div>
              </div>
            </div>
          </div>

          <div className="review-card">
            <div>
              <div style={{ display: 'flex', gap: '0.2rem', color: 'var(--text-amber)', marginBottom: '0.85rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="var(--text-amber)" />
                ))}
              </div>
              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.25rem' }}>
                "The 19-inch compute enclosure was machined to millimeter perfection. Their engineering support helped us confirm PSU form factor in under 5 minutes."
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                alt="Marcus Sterling"
                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-amber)' }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Marcus Sterling</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Infrastructure Lead, CloudScale Inc.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. NEWSLETTER / TECH ALERTS CARD */}
      <div className="newsletter-card">
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-xs)', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--text-amber)' }}>
            <Mail size={22} />
          </div>
          <span className="spec-chip" style={{ marginBottom: '0.5rem' }}>EXCLUSIVE HARDWARE DISPATCHES</span>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Stay Ahead of the Hardware Curve
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Receive confidential release notes, sudden SKU restock alerts, and exclusive subscriber-only discounts.
          </p>

          {newsletterSubscribed ? (
            <div style={{ padding: '0.9rem 1.25rem', background: 'var(--success-bg)', border: '1px solid #10b981', color: '#a7f3d0', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
              <CheckCircle2 size={18} color="var(--success)" /> You're subscribed! Check your inbox for the latest hardware drops.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email"
                required
                className="form-control"
                style={{ maxWidth: '340px', background: 'var(--bg-surface)' }}
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ textTransform: 'uppercase' }}>
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
