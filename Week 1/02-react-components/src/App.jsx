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

  // Active Category Filter State
  const [activeCategory, setActiveCategory] = useState('All');

  // Interactive Demo States for Reusable Button Component
  const [btnCounter, setBtnCounter] = useState(0);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
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
    setIsLoadingDemo(true);
    setTimeout(() => {
      setIsLoadingDemo(false);
      showToast('Async operation completed!');
    }, 1500);
  };

  // Unique categories for filtering
  const categories = ['All', ...new Set(cards.map((c) => c.category))];

  // Filtered cards list based on selected category state
  const filteredCards =
    activeCategory === 'All'
      ? cards
      : cards.filter((card) => card.category === activeCategory);

  // Computed summary metrics
  const totalCards = cards.length;
  const completedCount = cards.filter((c) => c.completed).length;
  const totalLikes = cards.reduce((acc, curr) => acc + curr.likes, 0);

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
          { label: 'All Items', count: totalCards, active: activeCategory === 'All', onClick: () => setActiveCategory('All') },
          { label: 'Completed', count: completedCount, active: false, onClick: () => setActiveCategory('Frontend') },
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
            <div className="stat-pill">
              <span className="stat-pill__number">{totalCards}</span>
              <span className="stat-pill__label">Active Cards</span>
            </div>
            <div className="stat-pill">
              <span className="stat-pill__number">{completedCount}</span>
              <span className="stat-pill__label">Completed</span>
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
                Demonstrating variant props (<code>primary</code>, <code>secondary</code>, <code>outline</code>, <code>success</code>, <code>danger</code>), sizes, states, and event handling.
              </p>
            </div>
          </div>

          <div className="button-matrix-card">
            <div className="button-matrix-group">
              <span className="button-matrix-group__label">Variants:</span>
              <Button variant="primary" onClick={() => setBtnCounter((c) => c + 1)}>
                Primary (Count: {btnCounter})
              </Button>
              <Button variant="secondary" onClick={() => showToast('Secondary Button Clicked')}>
                Secondary
              </Button>
              <Button variant="outline" onClick={() => showToast('Outline Button Clicked')}>
                Outline
              </Button>
              <Button variant="success" onClick={() => showToast('Success Action Triggered')}>
                ✓ Success
              </Button>
              <Button variant="danger" onClick={() => setBtnCounter(0)}>
                🗑️ Reset Count
              </Button>
            </div>

            <div className="button-matrix-group">
              <span className="button-matrix-group__label">Sizes & States:</span>
              <Button size="sm" variant="primary">Small (sm)</Button>
              <Button size="md" variant="primary">Medium (md)</Button>
              <Button size="lg" variant="primary">Large (lg)</Button>
              <Button
                variant="primary"
                isLoading={isLoadingDemo}
                onClick={handleTriggerLoading}
              >
                {isLoadingDemo ? 'Processing...' : '⚡ Test Async Loader'}
              </Button>
              <Button variant="secondary" disabled>
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
              {/* Category Filter Buttons */}
              <div className="filter-bar">
                <span className="filter-bar__label">🔍 Filter Category:</span>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={activeCategory === cat ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setActiveCategory(cat)}
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
                    <h4 className="empty-state__title">No cards found in category "{activeCategory}"</h4>
                    <p className="empty-state__desc">Use the form on the left to add a new card or clear your filter.</p>
                    <Button variant="outline" size="sm" onClick={() => setActiveCategory('All')}>
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
