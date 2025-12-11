import React from 'react';
import { Camera, TrendingUp, Zap, Shield, ArrowRight } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="landing-page">
      <div className="landing-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content centered">
            <h1 className="app-name">CalTrack</h1>
            <h2 className="hero-title">
              Track Your Nutrition with
              <span className="gradient-text"> AI Vision</span>
            </h2>
            <p className="hero-description">
              Simply snap a photo of your meal and let our AI instantly analyze the nutritional content.
              Track calories, macros, and achieve your health goals effortlessly.
            </p>
            <button className="cta-button" onClick={onGetStarted}>
              Get Started Free
              <ArrowRight size={20} />
            </button>
            <img src="diet.png" alt="Healthy Diet" style={{ display: 'block', margin: '20px auto', width: '300px' }} />
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Camera size={32} />
              </div>
              <h3>AI Food Recognition</h3>
              <p>Advanced computer vision powered by Google Gemini instantly identifies foods and portions from your photos.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Track Progress</h3>
              <p>Monitor your daily calorie intake and macro nutrients with beautiful, easy-to-understand visualizations.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={32} />
              </div>
              <h3>Lightning Fast</h3>
              <p>Get instant nutritional breakdowns in seconds. No manual entry, no hassle - just snap and track.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>Secure & Private</h3>
              <p>Your data is encrypted and stored securely. Your API key stays private and is never shared.</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Create your free account in seconds</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Add API Key</h3>
              <p>Connect your Google Gemini API key</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Take Photo</h3>
              <p>Snap a picture of your meal</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Track & Thrive</h3>
              <p>View nutrition data and reach your goals</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to Transform Your Nutrition?</h2>
          <p>Join and start tracking your meals with AI today</p>
          <button className="cta-button secondary" onClick={onGetStarted}>
            Start Tracking Now
            <ArrowRight size={20} />
          </button>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <p>Powered by Google Gemini AI • Built with React & Supabase</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
