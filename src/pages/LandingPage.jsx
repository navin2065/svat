import React, { useState, useEffect } from 'react';
import { Truck, Lock, Phone, Mail, BadgeCheck, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Exactly 3 AI-generated premium horizontal logistics truck slides
  const slides = [
    { src: '/slider_truck_one.png', alt: 'SVAT Transport Fleet 1' },
    { src: '/slider_truck_two.png', alt: 'SVAT Cargo Logistics 2' },
    { src: '/slider_truck_three.png', alt: 'SVAT Freight Supply 3' }
  ];

  const branches = [
    {
      id: 'tirupur-hq',
      label: 'TIRUPUR (HQ)',
      name: 'TIRUPUR HEAD OFFICE',
      zone: 'AMMAN NAGAR HQ ZONE',
      address: 'NO 228/1, AMMAN NAGAR, RAKKIYAPALAYAM, AVINASHI, TIRUPUR - 641 654',
      dial: '+91 96552 37104',
      email: 'vaarahitpt',
      badge1: 'CENTRAL OPERATIONS COMMAND',
      badge2: '150 ALLOCATED LORRIES',
      mapQuery: 'Rakkiyapalayam,Tirupur'
    },
    {
      id: 'vavipalayam',
      label: 'TIRUPUR (VAVIPALAYAM)',
      name: 'VAVIPALAYAM OFFICE',
      zone: 'RING ROAD LOGISTICS ZONE',
      address: 'NO 384/4, NETTIPATTAN KUTTAI, VAVIPALAYAM RING ROAD, TIRUPUR - 641 666',
      dial: '+91 96552 35088',
      email: 'vaarahitpt104',
      badge1: 'TRANSIT & CARGO ROUTING',
      badge2: '85 ALLOCATED LORRIES',
      mapQuery: 'Vavipalayam,Tirupur'
    },
    {
      id: 'chennai',
      label: 'CHENNAI',
      name: 'CHENNAI OFFICE',
      zone: 'PORT LOGISTICS HUB',
      address: 'NO 45, G.N.T. ROAD, MADHAVARAM, CHENNAI - 600 110',
      dial: '+91 95859 07007',
      email: 'vaarahimsn',
      badge1: 'METRO CONSIGNMENT CENTER',
      badge2: '95 ALLOCATED LORRIES',
      mapQuery: 'Madhavaram,Chennai'
    },
    {
      id: 'coimbatore',
      label: 'COIMBATORE',
      name: 'COIMBATORE OFFICE',
      zone: 'WESTERN ZONE LOGISTICS GATEWAY',
      address: 'NO 112, LORRY STAND ROAD, UKKADAM, COIMBATORE - 641 001',
      dial: '+91 96552 37104',
      email: 'vaarahicbe',
      badge1: 'REGIONAL DEPOT COMMAND',
      badge2: '70 ALLOCATED LORRIES',
      mapQuery: 'Ukkadam,Coimbatore'
    },
    {
      id: 'bangalore',
      label: 'BANGALORE',
      name: 'BANGALORE OFFICE',
      zone: 'SOUTHERN TECH-INDUSTRIAL ZONE',
      address: 'NO 14 3RD CROSS, ERAPPA REDDY CHIKKA BANASWADI, BANGALORE - 560 043',
      dial: '+91 95667 38884',
      email: 'vaarahiblr',
      badge1: 'PREMIUM INTERSTATE HUB GATEWAY',
      badge2: '110 ALLOCATED LORRIES',
      mapQuery: 'Banaswadi,Bangalore'
    }
  ];

  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [prevSlideIndex, setPrevSlideIndex] = useState(slides.length - 1);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevSlideIndex(currentSlide);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [currentSlide, slides.length]);

  const nextSlide = () => {
    setPrevSlideIndex(currentSlide);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setPrevSlideIndex(currentSlide);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleDotClick = (idx) => {
    setPrevSlideIndex(currentSlide);
    setCurrentSlide(idx);
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section" style={{ paddingBottom: '0rem' }}>
        <div className="hero-content">
          <p className="hero-subtitle">Certified Logistics</p>
          <h1 className="hero-title">Connecting People.<br />Improving lives.</h1>
          <p className="hero-description">
            Your trusted South-India cargo logistics partner delivering safety, certified transport excellence, and premium goods forwarding across South India.
          </p>
          <button onClick={() => onNavigate('login')} className="btn-primary" style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
            Access Portal <ArrowRight size={14} />
          </button>
        </div>

        {/* Trucks Banner Box - Bleeds full left-to-right view */}
        <div className="hero-banner-container">
          <div className="slider-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
            {slides.map((slide, idx) => {
              let slideClass = "slide-item";
              if (idx === currentSlide) {
                slideClass = "slide-item active";
              } else if (idx === prevSlideIndex) {
                slideClass = "slide-item exit";
              } else {
                slideClass = "slide-item next";
              }
              return (
                <div key={idx} className={slideClass}>
                  <img 
                    src={slide.src} 
                    alt={slide.alt} 
                    className="slide-img-new"
                  />
                </div>
              );
            })}
            
            {/* Slide Arrows */}
            <button className="slider-btn prev" onClick={prevSlide} aria-label="Previous Slide">
              <ChevronLeft size={20} />
            </button>
            <button className="slider-btn next" onClick={nextSlide} aria-label="Next Slide">
              <ChevronRight size={20} />
            </button>

            {/* Slider Dots */}
            <div className="slider-dots">
              {slides.map((_, idx) => (
                <div 
                  key={idx}
                  className={`slider-dot ${idx === currentSlide ? 'active' : ''}`}
                  onClick={() => handleDotClick(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Spacing for overlapping hero content */}
      <div className="hero-spacer"></div>

      {/* SELECT BRANCH OFFICE INFO (Mockup matching the uploaded photo) */}
      <section className="branch-info-section">
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)', textTransform: 'uppercase', marginBottom: '1.5rem', textAlign: 'left', letterSpacing: '0.5px' }}>
          Select Branch Office Info
        </h2>
        
        {/* Branch pill selectors */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {branches.map((b) => {
            const isSelected = selectedBranch.id === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBranch(b)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '50px',
                  border: isSelected ? '1.5px solid var(--text-dark)' : '1.5px solid rgba(0, 0, 0, 0.1)',
                  backgroundColor: isSelected ? 'var(--text-dark)' : 'rgba(255, 255, 255, 0.45)',
                  color: isSelected ? 'var(--text-light)' : 'var(--text-dark)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isSelected ? '0 8px 20px rgba(15, 23, 42, 0.15)' : 'none'
                }}
              >
                {b.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Branch Card Grid */}
        <div className="branch-card-grid">
          
          {/* Left: Google Maps Live view mock */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-premium)',
            position: 'relative',
            minHeight: '380px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              color: '#FFFFFF',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              zIndex: 5,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(8px)'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E', display: 'inline-block' }}></span>
              GOOGLE MAPS LIVE
            </div>
            
            {/* Real Interactive Google Maps Iframe */}
            <iframe
              title="Branch Location Map"
              width="100%"
              height="100%"
              style={{ border: 0, flex: 1, minHeight: '340px' }}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedBranch.mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              allowFullScreen
            ></iframe>
          </div>

          {/* Right: Selected Office details */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.18) 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.7)',
            borderRadius: '28px',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-premium), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(45px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            textAlign: 'left'
          }}>
            <div>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#D97706',
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                padding: '4px 12px',
                borderRadius: '50px',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                {selectedBranch.zone}
              </span>

              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck style={{ color: 'var(--primary)' }} size={28} />
                {selectedBranch.name}
              </h3>

              <div style={{ borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  Physical Layout Address
                </p>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)', lineHeight: '1.5' }}>
                  {selectedBranch.address}
                </p>
              </div>

              <div className="branch-details-row-grid">
                <div style={{ padding: '12px 16px', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.45)' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Dispatcher Dial
                  </p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} style={{ color: 'var(--primary)' }} />
                    {selectedBranch.dial}
                  </p>
                </div>

                <div style={{ padding: '12px 16px', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.45)' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Email Desk
                  </p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} style={{ color: 'var(--primary)' }} />
                    {selectedBranch.email}@gmail.com
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#16A34A',
                backgroundColor: 'rgba(22, 163, 74, 0.08)',
                border: '1px solid rgba(22, 163, 74, 0.15)',
                padding: '6px 14px',
                borderRadius: '50px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <BadgeCheck size={14} />
                {selectedBranch.badge1}
              </div>

              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#EA580C',
                backgroundColor: 'rgba(234, 88, 12, 0.08)',
                border: '1px solid rgba(234, 88, 12, 0.15)',
                padding: '6px 14px',
                borderRadius: '50px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Truck size={14} />
                {selectedBranch.badge2}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom notice alert panel */}
        <div className="branch-bottom-notice">
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.95rem',
            flexShrink: 0
          }}>
            ?
          </div>
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
            Have cargo dispatching out of an unlisted small town or bypass corridor in Tamil Nadu? Call our central Coimbatore billing office to request customized on-road pick logs.
          </p>
        </div>
      </section>
    </div>
  );
}
