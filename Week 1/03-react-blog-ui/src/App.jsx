import React, { useState, useEffect, useMemo } from 'react';
import initialPostsData from './data/posts.json';
import Navbar from './components/Navbar';
import HeroFeatured from './components/HeroFeatured';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import PostCard from './components/PostCard';
import PostModal from './components/PostModal';
import CreatePostModal from './components/CreatePostModal';
import BookmarksDrawer from './components/BookmarksDrawer';
import NewsletterSection from './components/NewsletterSection';
import Footer from './components/Footer';
import Toast from './components/Toast';
import './App.css';

export default function App() {
  // Theme State (Dark / Light)
  const [theme, setTheme] = useState('dark');

  // Master Posts State (Loaded directly from JSON file)
  const [posts, setPosts] = useState(initialPostsData);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Bookmarks State (Array of Post IDs)
  const [bookmarkedIds, setBookmarkedIds] = useState(['post-1', 'post-3']);

  // Modal & Drawer States
  const [activeReaderPost, setActiveReaderPost] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState('');

  // Apply Theme to Document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3200);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // State Handler: Increment Post Likes
  const handleLikePost = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );

    // Keep active reader post in sync if open
    if (activeReaderPost && activeReaderPost.id === postId) {
      setActiveReaderPost((prev) => ({ ...prev, likes: prev.likes + 1 }));
    }
  };

  // State Handler: Toggle Bookmark
  const handleToggleBookmark = (postId) => {
    setBookmarkedIds((prev) => {
      const isSaved = prev.includes(postId);
      if (isSaved) {
        showToast('Article removed from saved bookmarks.');
        return prev.filter((id) => id !== postId);
      } else {
        showToast('Article saved to bookmarks! 🔖');
        return [...prev, postId];
      }
    });
  };

  const handleClearAllBookmarks = () => {
    setBookmarkedIds([]);
    showToast('Cleared all saved bookmarks.');
  };

  // State Handler: Create New Post from Modal
  const handleCreatePost = (newPost) => {
    setPosts([newPost, ...posts]);
    showToast(`Published article: "${newPost.title}"! 🚀`);
  };

  // State Handler: Share Post Link
  const handleSharePost = (post) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(`Copied share link for "${post.title}"! 🔗`);
    } else {
      showToast(`Link ready: ${post.title}`);
    }
  };

  // Handle Newsletter Subscribe
  const handleSubscribeNewsletter = (email) => {
    showToast(`Subscribed ${email} to weekly updates! ✨`);
  };

  // Scroll to Top Helper
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Categories with Dynamic Item Counts
  const categoriesList = useMemo(() => {
    const rawCategories = ['React', 'JavaScript', 'CSS & UI', 'Backend', 'AI & Cloud', 'System Design'];
    const list = [
      { name: 'ALL', count: posts.length },
      ...rawCategories.map((catName) => ({
        name: catName,
        count: posts.filter((p) => p.category === catName).length,
      })),
    ];
    return list;
  }, [posts]);

  // Featured Post (First with featured: true, or first item)
  const featuredPost = useMemo(() => {
    return posts.find((p) => p.featured) || posts[0];
  }, [posts]);

  // Dynamic Filtering & Sorting Pipeline
  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    // 1. Category Filter
    if (activeCategory !== 'ALL') {
      result = result.filter((post) => post.category === activeCategory);
    }

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((post) => {
        const inTitle = post.title.toLowerCase().includes(q);
        const inExcerpt = post.excerpt.toLowerCase().includes(q);
        const inContent = post.content.toLowerCase().includes(q);
        const inAuthor = post.author.name.toLowerCase().includes(q);
        const inTags = post.tags.some((tag) => tag.toLowerCase().includes(q));
        const inCategory = post.category.toLowerCase().includes(q);
        return inTitle || inExcerpt || inContent || inAuthor || inTags || inCategory;
      });
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.publishDate) - new Date(a.publishDate);
      }
      if (sortBy === 'popular') {
        return b.likes - a.likes;
      }
      if (sortBy === 'readTimeAsc') {
        const timeA = parseInt(a.readTime, 10) || 5;
        const timeB = parseInt(b.readTime, 10) || 5;
        return timeA - timeB;
      }
      if (sortBy === 'readTimeDesc') {
        const timeA = parseInt(a.readTime, 10) || 5;
        const timeB = parseInt(b.readTime, 10) || 5;
        return timeB - timeA;
      }
      return 0;
    });

    return result;
  }, [posts, activeCategory, searchQuery, sortBy]);

  // Bookmarked Posts list
  const bookmarkedPosts = useMemo(() => {
    return posts.filter((p) => bookmarkedIds.includes(p.id));
  }, [posts, bookmarkedIds]);

  const isFiltered = activeCategory !== 'ALL' || Boolean(searchQuery.trim());

  const handleResetFilters = () => {
    setActiveCategory('ALL');
    setSearchQuery('');
    setSortBy('newest');
  };

  return (
    <div className="app-layout">
      {/* 1. STICKY NAVBAR */}
      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        bookmarksCount={bookmarkedIds.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenCreatePost={() => setIsCreateModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="main-container">
        {/* 2. HERO FEATURED STORY (Shown when no search/filter is active) */}
        {!isFiltered && featuredPost && (
          <HeroFeatured
            post={featuredPost}
            onReadPost={(post) => setActiveReaderPost(post)}
            isBookmarked={bookmarkedIds.includes(featuredPost.id)}
            onToggleBookmark={handleToggleBookmark}
            onLikePost={handleLikePost}
          />
        )}

        {/* 3. SEARCH BAR & TRENDING TAGS */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectTag={(tag) => setSearchQuery(tag)}
        />

        {/* 4. CATEGORY FILTER & SORT CONTROLS */}
        <FilterBar
          categories={categoriesList}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalResults={filteredAndSortedPosts.length}
          onResetFilters={handleResetFilters}
          isFiltered={isFiltered}
        />

        {/* 5. DYNAMIC POST CARDS GRID */}
        {filteredAndSortedPosts.length > 0 ? (
          <section className="posts-grid">
            {filteredAndSortedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onReadPost={(p) => setActiveReaderPost(p)}
                isBookmarked={bookmarkedIds.includes(post.id)}
                onToggleBookmark={handleToggleBookmark}
                onLikePost={handleLikePost}
                onSharePost={handleSharePost}
              />
            ))}
          </section>
        ) : (
          <div className="empty-state">
            <span className="empty-state__icon">🔍</span>
            <h3 className="empty-state__title">No matching tech articles found</h3>
            <p className="empty-state__desc">
              We couldn't find any articles matching your search query "{searchQuery}" or category filter "{activeCategory}".
            </p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleResetFilters}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* 6. NEWSLETTER & COMMUNITY SUBSCRIPTION */}
        <NewsletterSection onSubscribe={handleSubscribeNewsletter} />
      </main>

      {/* 7. SEMANTIC FOOTER */}
      <Footer
        onSelectCategory={setActiveCategory}
        onScrollToTop={handleScrollToTop}
      />

      {/* 8. ARTICLE READER MODAL */}
      {activeReaderPost && (
        <PostModal
          post={activeReaderPost}
          allPosts={posts}
          onClose={() => setActiveReaderPost(null)}
          isBookmarked={bookmarkedIds.includes(activeReaderPost.id)}
          onToggleBookmark={handleToggleBookmark}
          onLikePost={handleLikePost}
          onSelectRelatedPost={(related) => setActiveReaderPost(related)}
          onSharePost={handleSharePost}
        />
      )}

      {/* 9. CREATE NEW POST MODAL */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitPost={handleCreatePost}
      />

      {/* 10. BOOKMARKS SLIDE-OVER DRAWER */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedPosts={bookmarkedPosts}
        onReadPost={(post) => setActiveReaderPost(post)}
        onRemoveBookmark={handleToggleBookmark}
        onClearAllBookmarks={handleClearAllBookmarks}
      />

      {/* 11. TOAST NOTIFICATION */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
}
