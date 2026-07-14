import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './PublicLandingPage.css';

const slides = [
  {
    title: "KOLTUĞUNUZU AYIRTIN",
    subtitle: "İstediğiniz saati ve berberi seçin."
  },
  {
    title: "TARZINIZI BELİRLEYİN",
    subtitle: "Size en uygun hizmeti seçin."
  },
  {
    title: "ONAYLAYIN VE GELİN",
    subtitle: "Randevunuz anında cebinizde."
  }
];

const textVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    scale: 1.02,
    transition: { duration: 0.5, ease: "easeIn" }
  }
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { delay: 0.5, duration: 0.8, ease: "easeOut" }
  }
};

const PublicLandingPage = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = () => {
      setTimeout(() => setStep(1), 3000); // 0s -> 3s
      setTimeout(() => setStep(2), 5000); // 3s -> 5s
    };

    sequence(); // Start first sequence
    // const interval = setInterval(() => {
    //   setStep(0);
    //   sequence();
    // }, 9000); // Loop every 9 seconds

    return () => {
      // clearInterval(interval);
    };
  }, []);

  return (
    <div className="public-landing">
      <nav className="navbar">
        <div className="logo">
          <span className="icon">✂</span>
          <div className="logo-text">
            <strong>THE GENTLEMAN'S CUT</strong>
            <span>Premium Barber Experience</span>
          </div>
        </div>
        <ul className="nav-links">
          <li><a href="#why-us">Neden Biz?</a></li>
        </ul>
        <div className="nav-buttons">
          <Link to="/login" className="btn-login">Log In</Link>
          <Link to="/register" className="btn-gold">Kayıt Ol</Link>
        </div>
      </nav>

      {/* Cinematic Hero Section */}
      <div className="cinematic-hero">
        {/* Left-side Social Icons */}
        <div className="side-elements left">
            <a href="#">IG</a>
            <a href="#">FB</a>
            <a href="#">TW</a>
        </div>

        <div className="background-overlay" />
        <video autoPlay muted playsInline className="background-image">
          <source src="/bg-video.mp4" type="video/mp4" />
          Tarayıcınız video etiketini desteklemiyor.
        </video>
        
        <div className="cinematic-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="text-container"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h1>{slides[step].title}</h1>
              <p>{slides[step].subtitle}</p>
            </motion.div>
          </AnimatePresence>

          <motion.div 
            className="button-container"
            variants={buttonVariants}
            initial="hidden"
            animate={step === 2 ? "visible" : "hidden"}
          >
            <Link to="/login" className="btn-glow">Randevu Al</Link>
          </motion.div>
        </div>

        <div className="pagination-lines">
          {slides.map((_, index) => (
            <div key={index} className="line-container" onClick={() => setStep(index)}>
              <div className={`line ${step === index ? 'active' : ''}`} />
            </div>
          ))}
        </div>

        {/* Right-side Contact Info */}
        <div className="side-elements right">
            <a href="mailto:info@barbersync.com">info@barbersync.com</a>
        </div>
      </div>

      <section id="why-us" className="why-us-section">
        <h2>Neden Barber-Sync?</h2>
        <p className="why-us-subtitle">Müşteriler ve Berberler İçin Mükemmel Çözüm</p>
        <div className="features-grid">
            <div className="feature-card">
                <div className="feature-icon">📅</div>
                <h3>Kolayca Randevu Al</h3>
                <p>Yakınınızdaki en iyi berberleri keşfedin, müsaitlik durumlarını anında görün ve saniyeler içinde randevunuzu oluşturun.</p>
            </div>
            <div className="feature-card">
                <div className="feature-icon">📈</div>
                <h3>İşinizi Büyütün</h3>
                <p>Randevu takviminizi yönetin, hizmetlerinizi listeleyin ve ciro raporları ile iş performansınızı takip edin. Her şey tek bir yerde.</p>
            </div>
            <div className="feature-card">
                <div className="feature-icon">🔔</div>
                <h3>Anında Bildirimler</h3>
                <p>Randevunuz onaylandığında, iptal edildiğinde veya yaklaştığında anında bildirimler alarak her zaman haberdar olun.</p>
            </div>
        </div>
        <Link to="/register" className="btn-gold large">Hemen Başla</Link>
      </section>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} The Gentleman's Cut. Tüm Hakları Saklıdır.</p>
      </footer>
    </div>
  );
};

export default PublicLandingPage;