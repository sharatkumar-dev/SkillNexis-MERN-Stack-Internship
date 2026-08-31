import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Button from './components/Button';
import Card from './components/Card';
import Form from './components/Form';
import { initialCardsData } from './data/initialCards';
import './App.css';

export default function App() {
  // Theme State (Dark / Light)
  const [theme, setTheme] = useState('dark');

  // Cards State (Dynamic rendering via .map())
  const [cards, setCards] = useState(initialCardsData);

  // Active Category & Status Filter State ('ALL', 'COMPLETED', 'PENDING', or Category Name)
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Interactive Demo States for Reusable Button Component Showcase
  const [primaryCount, setPrimaryCount] = useState(0);
  const [lastButtonClicked, setLastButtonClicked] = useState('None (Click any button below!)');
  const [activeDemoSize, setActiveDemoSize] = useState('md');
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [totalButtonClicks, setTotalButtonClicks] = useState(0);
  const [toastMessage, setToastMessage] = useState('');

  // Apply theme to body dataset
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Helper to record any button click interaction
  const handleButtonClickDemo = (buttonName, actionCallback) => {
    setTotalButtonClicks((c) => c + 1);
    setLastButtonClicked(buttonName);
    if (actionCallback) actionCallback();
  };

  // State Handler: Add new card from Form component
  const handleAddCard = (newCardData) => {
    const newId = cards.length > 0 ? Math.max(...cards.map((c) => c.id)) + 1 : 1;
    const cardWithId = { ...newCardData, id: newId };
    setCards([cardWithId, ...cards]);
    showToast(`Added card "${newCardData.title}" to state!`);
  };

  // State Handler: Increment card likes
  const handleLikeCard = (id) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, likes: card.likes + 1 } : card
      )
    );
  };

  // State Handler: Toggle card completion status
  const handleToggleComplete = (id) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, completed: !card.completed } : card
      )
    );
  };

  // State Handler: Delete card from state
  const handleDeleteCard = (id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    showToast('Card deleted from state.');
  };

  // Demo Handler: Loading button simulation
  const handleTriggerLoading = () => {
    handleButtonClickDemo('⚡ Async Loader Button', () => {
      setIsLoadingDemo(true);
      setTimeout(() => {
        setIsLoadingDemo(false);
        setLastButtonClicked('⚡ Async Task Completed Successfully!');
        showToast('Async operation completed!');
      }, 1500);
    });
  };

  // Computed summary metrics
  const totalCards = cards.length;
  const completedCards = cards.filter((c) => c.completed);
  const completedCount = completedCards.length;
  const pendingCount = totalCards - completedCount;
  const totalLikes = cards.reduce((acc, curr) => acc + curr.likes, 0);

  // Available unique categories
  const categories = ['ALL', ...new Set(cards.map((c) => c.category))];

  // Dynamic Filtering Logic based on activeFilter state
  const filteredCards = cards.filter((card) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'COMPLETED') return card.completed;
    if (activeFilter === 'PENDING') return !card.completed;
    return card.category === activeFilter;
  });

  return (
    <div className="app-container">
      {/* 1. REUSABLE HEADER COMPONENT */}
      <Header
        title="React Components Practice"
        subtitle="SkillNexis MERN Stack Internship • Week 1 Submission"
        badgeText="Assignment 2"
        theme={theme}
        onThemeToggle={toggleTheme}
        navTabs={[
          {
            label: 'All Items',
            count: totalCards,
            active: activeFilter === 'ALL',
            onClick: () => setActiveFilter('ALL'),
          },
          {
            label: 'Completed',
            count: completedCount,
            active: activeFilter === 'COMPLETED',
            onClick: () => setActiveFilter('COMPLETED'),
          },
          {
            label: 'In Progress',
            count: pendingCount,
            active: activeFilter === 'PENDING',
            onClick: () => setActiveFilter('PENDING'),
          },
        ]}
      />

      <main className="main-content">
        {/* HERO BANNER & METRICS */}
        <section className="hero-banner">
          <div className="hero-banner__content">
            <span className="hero-banner__tag">⚛️ React 19 + Vite Architecture</span>
            <h2 className="hero-banner__title">
              Mastering <span>Components, Props & State</span>
            </h2>
            <p className="hero-banner__desc">
              Demonstrating the 5 core reusable React components (<code>Header</code>, <code>Footer</code>, <code>Button</code>, <code>Card</code>, <code>Form</code>) with dynamic rendering, bidirectional prop passing, and reactive state management.
            </p>
          </div>

          <div className="stats-bar">
            <div
              className={`stat-pill ${activeFilter === 'ALL' ? 'stat-pill--active' : ''}`}
              onClick={() => setActiveFilter('ALL')}
              style={{ cursor: 'pointer' }}
              title="Click to view all cards"
            >
              <span className="stat-pill__number">{totalCards}</span>
              <span className="stat-pill__label">Total Cards</span>
            </div>
            <div
              className={`stat-pill ${activeFilter === 'COMPLETED' ? 'stat-pill--active' : ''}`}
              onClick={() => setActiveFilter('COMPLETED')}
              style={{ cursor: 'pointer' }}
              title="Click to filter completed cards"
            >
              <span className="stat-pill__number">{completedCount}</span>
              <span className="stat-pill__label">Completed ({completedCount})</span>
            </div>
            <div
              className={`stat-pill ${activeFilter === 'PENDING' ? 'stat-pill--active' : ''}`}
              onClick={() => setActiveFilter('PENDING')}
              style={{ cursor: 'pointer' }}
              title="Click to filter pending cards"
            >
              <span className="stat-pill__number">{pendingCount}</span>
              <span className="stat-pill__label">In Progress</span>
            </div>
            <div className="stat-pill">
              <span className="stat-pill__number">{totalLikes}</span>
              <span className="stat-pill__label">Total Likes</span>
            </div>
          </div>
        </section>

        {/* 3. REUSABLE BUTTON COMPONENT SHOWCASE */}
        <section>
          <div className="section-header">
            <div>
              <h3 className="section-title">
                <span>🔘</span> 3. Reusable Button Component Showcase
              </h3>
              <p className="section-subtitle">
                Demonstrating variant props (<code>primary</code>, <code>secondary</code>, <code>outline</code>, <code>success</code>, <code>danger</code>), sizes, loading states, and reactive click handlers.
              </p>
            </div>
          </div>

          <div className="button-matrix-card">
            {/* Live Visual Feedback Display Box */}
            <div className="button-matrix-feedback">
              <div className="feedback-item">
                <span className="feedback-label">Last Clicked Action:</span>
                <strong className="feedback-value">{lastButtonClicked}</strong>
              </div>
              <div className="feedback-stats">
                <span className="feedback-badge">Total Clicks: {totalButtonClicks}</span>
                <span className="feedback-badge">Primary Count: {primaryCount}</span>
                <span className="feedback-badge">Selected Size: {activeDemoSize.toUpperCase()}</span>
              </div>
            </div>

            {/* Variants Group */}
            <div className="button-matrix-group">
              <span className="button-matrix-group__label">Variants:</span>
              <Button
                variant="primary"
                onClick={() =>
                  handleButtonClickDemo('Primary Button (Incremented Count)', () =>
                    setPrimaryCount((c) => c + 1)
                  )
                }
              >
                Primary Button (Clicks: {primaryCount})
              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  handleButtonClickDemo('Secondary Button Clicked', () =>
                    showToast('Secondary Button Action Triggered')
                  )
                }
              >
                Secondary Button
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  handleButtonClickDemo('Outline Button Clicked', () =>
                    showToast('Outline Button Action Triggered')
                  )
                }
              >
                Outline Button
              </Button>

              <Button
                variant="success"
                onClick={() =>
                  handleButtonClickDemo('Success Button (Marked Status OK)', () =>
                    showToast('Success Status Confirmed')
                  )
                }
              >
                ✓ Success Button
              </Button>

              <Button
                variant="danger"
                onClick={() =>
                  handleButtonClickDemo('Danger Button (Reset Primary Counter)', () => {
                    setPrimaryCount(0);
                    showToast('Primary counter reset to 0');
                  })
                }
              >
                🗑️ Reset Count
              </Button>
            </div>

            {/* Sizes & States Group */}
            <div className="button-matrix-group">
              <span className="button-matrix-group__label">Sizes & States:</span>
              <Button
                size="sm"
                variant={activeDemoSize === 'sm' ? 'primary' : 'outline'}
                onClick={() =>
                  handleButtonClickDemo('Selected Small Size (sm)', () =>
                    setActiveDemoSize('sm')
                  )
                }
              >
                Small (sm)
              </Button>

              <Button
                size="md"
                variant={activeDemoSize === 'md' ? 'primary' : 'outline'}
                onClick={() =>
                  handleButtonClickDemo('Selected Medium Size (md)', () =>
                    setActiveDemoSize('md')
                  )
                }
              >
                Medium (md)
              </Button>

              <Button
                size="lg"
                variant={activeDemoSize === 'lg' ? 'primary' : 'outline'}
                onClick={() =>
                  handleButtonClickDemo('Selected Large Size (lg)', () =>
                    setActiveDemoSize('lg')
                  )
                }
              >
                Large (lg)
              </Button>

              <Button
                variant="primary"
                isLoading={isLoadingDemo}
                onClick={handleTriggerLoading}
              >
                {isLoadingDemo ? 'Processing...' : '⚡ Test Async Loader'}
              </Button>

              <Button
                variant="secondary"
                disabled
                title="This button is disabled via props"
              >
                Disabled State
              </Button>
            </div>
          </div>
        </section>

        {/* 4 & 5. FORM & CARDS DYNAMIC WORKFLOW */}
        <section>
          <div className="section-header">
            <div>
              <h3 className="section-title">
                <span>⚡</span> 4 & 5. Controlled Form & Dynamic Cards Grid
              </h3>
              <p className="section-subtitle">
                Submit the <code>Form</code> to dynamically append data into the React state array, rendered via reusable <code>Card</code> components.
              </p>
            </div>
          </div>

          <div className="showcase-grid">
            {/* 5. REUSABLE FORM COMPONENT */}
            <div>
              <Form onSubmit={handleAddCard} />
            </div>

            {/* 4. REUSABLE CARD COMPONENTS (DYNAMIC MAP RENDERING) */}
            <div>
              {/* Filter Controls Bar */}
              <div className="filter-bar">
                <span className="filter-bar__label">🔍 Filter View:</span>

                {/* Status Shortcuts */}
                <Button
                  variant={activeFilter === 'ALL' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('ALL')}
                >
                  All ({totalCards})
                </Button>

                <Button
                  variant={activeFilter === 'COMPLETED' ? 'success' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('COMPLETED')}
                >
                  ✓ Completed ({completedCount})
                </Button>

                <Button
                  variant={activeFilter === 'PENDING' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('PENDING')}
                >
                  ○ In Progress ({pendingCount})
                </Button>

                <div className="filter-bar__divider" />

                {/* Category Filters */}
                {categories
                  .filter((cat) => cat !== 'ALL')
                  .map((cat) => (
                    <Button
                      key={cat}
                      variant={activeFilter === cat ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setActiveFilter(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
              </div>

              {/* Cards Grid */}
              <div className="cards-grid">
                {filteredCards.length > 0 ? (
                  filteredCards.map((card) => (
                    <Card
                      key={card.id}
                      id={card.id}
                      title={card.title}
                      category={card.category}
                      priority={card.priority}
                      description={card.description}
                      tags={card.tags}
                      icon={card.icon}
                      likes={card.likes}
                      completed={card.completed}
                      onLike={handleLikeCard}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteCard}
                    />
                  ))
                ) : (
                  <div className="empty-state">
                    <span className="empty-state__icon">📭</span>
                    <h4 className="empty-state__title">
                      No cards matching filter "{activeFilter}"
                    </h4>
                    <p className="empty-state__desc">
                      Try selecting another filter or adding a new card using the form.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveFilter('ALL')}
                    >
                      Show All Cards
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 2. REUSABLE FOOTER COMPONENT */}
      <Footer
        author="Alex Morgan"
        year={2026}
        organization="SkillNexis MERN Stack Internship"
        statusText="Assignment 2 Completed • 5 Components Implemented"
      />

      {/* Dynamic Toast Feedback */}
      {toastMessage && <div className="toast-notice">✓ {toastMessage}</div>}
    </div>
  );
}
