import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { ArrowUpDown, Sparkles, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

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
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchParams({});
    setPage(1);
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner">
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--color-primary-light)',
            color: '#818cf8',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '1rem',
          }}
        >
          <Sparkles size={14} /> New Season Arrivals
        </span>
        <h1 className="hero-title">
          Curated Essentials, Engineered for <span>Modern Living</span>
        </h1>
        <p className="hero-subtitle">
          Discover hand-crafted accessories, performance electronics, and timeless minimalist apparel with seamless global dispatch.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
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
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowUpDown size={16} color="var(--text-muted)" />
          <select
            className="form-control"
            style={{ width: 'auto', padding: '0.45rem 1rem', fontSize: '0.88rem' }}
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
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Showing results for: <strong style={{ color: '#fff' }}>"{search}"</strong> ({totalCount} items found)
          </span>
          <button
            onClick={handleClearFilters}
            className="btn btn-outline btn-sm"
            style={{ padding: '0.2rem 0.6rem' }}
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Product Grid / Loading State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.1rem' }}>Loading catalog items...</p>
        </div>
      ) : products.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: 'center', padding: '4rem 2rem', margin: '2rem 0' }}
        >
          <Filter size={42} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Products Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            We couldn't find any products matching your current search or category filters.
          </p>
          <button className="btn btn-primary" onClick={handleClearFilters}>
            Reset All Filters
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
        <div className="pagination-wrapper">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', padding: '0 0.5rem' }}>
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
