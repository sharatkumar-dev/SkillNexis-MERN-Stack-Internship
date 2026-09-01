import React, { useState } from 'react';

export default function NewsletterSection({ onSubscribe }) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    onSubscribe(email.trim());
    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-card">
        <div className="newsletter-badge">
          <span>📬 WEEKLY TECH CHRONICLE</span>
        </div>

        <h3 className="newsletter-title">
          Stay Ahead of Modern Web Architecture
        </h3>

        <p className="newsletter-desc">
          Get curated deep dives into React 19, TypeScript design patterns, distributed systems, and modern CSS delivered straight to your inbox every Tuesday. No spam.
        </p>

        {isSubmitted ? (
          <div className="newsletter-success">
            <span>🎉 Thank you for subscribing! Check your inbox for the welcome issue.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your developer email address..."
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn--primary newsletter-submit-btn">
              Subscribe Now
            </button>
          </form>
        )}

        <div className="newsletter-stats">
          <span>⚡ 14,000+ Engineers</span>
          <span>•</span>
          <span>🔒 Unsubscribe Anytime</span>
          <span>•</span>
          <span>✨ 100% Free Forever</span>
        </div>
      </div>
    </section>
  );
}
