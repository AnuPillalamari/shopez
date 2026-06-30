import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaFilter, FaRedoAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProductCard from '../components/ProductCard.jsx';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState(['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Dell', 'Canon', 'Bose', 'Logitech', 'Casio']);
  
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

  // Sync state with url search parameters changes
  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
    setCategory(searchParams.get('category') || '');
    setBrand(searchParams.get('brand') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setMinRating(searchParams.get('minRating') || '');
    setSortBy(searchParams.get('sortBy') || 'newest');
    setPage(parseInt(searchParams.get('page')) || 1);
  }, [searchParams]);

  // Load Categories on boot
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err.message);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products based on parameters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (keyword) params.keyword = keyword;
        if (category) params.category = category;
        if (brand) params.brand = brand;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (minRating) params.minRating = minRating;
        if (sortBy) params.sortBy = sortBy;
        params.page = page;
        params.limit = 9;

        const { data } = await axios.get('/api/products', { params });
        setProducts(data.products);
        setPages(data.pages);
        setTotal(data.total);
      } catch (err) {
        console.error('Error loading products:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, category, brand, minPrice, maxPrice, minRating, sortBy, page]);

  // Update query params helper
  const updateQuery = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter
    setSearchParams(newParams);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  return (
    <div className="container py-5">
      {/* Page Title & Stats */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="display-font fw-bold mb-0">Browse Products</h2>
          <span className="text-muted" style={{ fontSize: '0.9rem' }}>Found {total} products matching your selections</span>
        </div>
        
        {/* Sorter */}
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted text-nowrap" style={{ fontSize: '0.85rem' }}>Sort by:</span>
          <select 
            className="form-select custom-input py-1.5 px-3" 
            style={{ width: '180px', fontSize: '0.9rem', borderRadius: '10px' }}
            value={sortBy}
            onChange={(e) => updateQuery('sortBy', e.target.value)}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Popularity</option>
          </select>
        </div>
      </div>

      <div className="row g-4">
        {/* Filters Sidebar */}
        <div className="col-lg-3">
          <div className="card border-0 glass-panel p-4 rounded-4 position-sticky" style={{ top: '100px' }}>
            <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-light pb-2">
              <span className="fw-bold d-flex align-items-center gap-2 display-font">
                <FaFilter className="text-primary" /> Filter Options
              </span>
              <button 
                onClick={handleResetFilters} 
                className="btn btn-link btn-sm text-danger p-0 d-flex align-items-center gap-1 text-decoration-none"
                style={{ fontSize: '0.8rem' }}
              >
                <FaRedoAlt /> Clear
              </button>
            </div>

            {/* Keyword Filter (visible on mobile sidebar) */}
            <div className="mb-4">
              <label className="form-label fw-semibold text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem' }}>Keyword</label>
              <input 
                type="text" 
                className="form-control custom-input py-2"
                placeholder="Search..."
                value={keyword}
                onChange={(e) => updateQuery('keyword', e.target.value)}
                style={{ fontSize: '0.9rem' }}
              />
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <label className="form-label fw-semibold text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem' }}>Category</label>
              <select 
                className="form-select custom-input py-2"
                value={category}
                onChange={(e) => updateQuery('category', e.target.value)}
                style={{ fontSize: '0.9rem', textTransform: 'capitalize' }}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div className="mb-4">
              <label className="form-label fw-semibold text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem' }}>Brand</label>
              <select 
                className="form-select custom-input py-2"
                value={brand}
                onChange={(e) => updateQuery('brand', e.target.value)}
                style={{ fontSize: '0.9rem' }}
              >
                <option value="">All Brands</option>
                {brands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="mb-4">
              <label className="form-label fw-semibold text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem' }}>Price Range</label>
              <div className="d-flex align-items-center gap-2">
                <input 
                  type="number" 
                  className="form-control custom-input py-1.5 px-2"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateQuery('minPrice', e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                />
                <span className="text-muted">-</span>
                <input 
                  type="number" 
                  className="form-control custom-input py-1.5 px-2"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateQuery('maxPrice', e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-2">
              <label className="form-label fw-semibold text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem' }}>Minimum Rating</label>
              <select 
                className="form-select custom-input py-2"
                value={minRating}
                onChange={(e) => updateQuery('minRating', e.target.value)}
                style={{ fontSize: '0.9rem' }}
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="col-lg-9">
          {loading ? (
            <div className="row g-4">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="col-md-4">
                  <div className="skeleton" style={{ height: '350px' }}></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5 glass-panel rounded-4">
              <h4 className="fw-bold mb-2 display-font">No Products Found</h4>
              <p className="text-muted mb-4">Try clearing some of your search parameters or check spelling</p>
              <button onClick={handleResetFilters} className="btn btn-primary-glow px-4 py-2">
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {products.map(product => (
                  <div key={product._id} className="col-sm-6 col-md-4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
                  <button 
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="btn btn-outline-secondary custom-input py-2 px-3 d-flex align-items-center gap-1"
                    style={{ borderRadius: '10px' }}
                  >
                    <FaChevronLeft /> Previous
                  </button>

                  {Array.from({ length: pages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePageChange(idx + 1)}
                      className={`btn py-2 px-3 fw-semibold ${page === idx + 1 ? 'btn-primary' : 'btn-outline-secondary custom-input'}`}
                      style={{ borderRadius: '10px' }}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button 
                    disabled={page === pages}
                    onClick={() => handlePageChange(page + 1)}
                    className="btn btn-outline-secondary custom-input py-2 px-3 d-flex align-items-center gap-1"
                    style={{ borderRadius: '10px' }}
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
