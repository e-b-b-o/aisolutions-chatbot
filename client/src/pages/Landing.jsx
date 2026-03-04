import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { BookOpen, Brain, Zap, ArrowRight, ShieldCheck, Clock, FileText, CheckCircle2 } from 'lucide-react';

function Landing() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleCTA = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="nav-content">
          <Link to="/" className="logo">
            <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.03em', color: 'var(--purple-accent)' }}>
              AI Study Kit
            </span>
          </Link>

          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
            <a href="#pricing">Pricing</a>

            {user ? (
              <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                Go to Dashboard
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
                <Link to="/login" className="nav-link-auth">Log In</Link>
                <Link to="/register" className="btn btn-primary">Sign Up Free</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

        {/* ── HERO (Two-Column Layout) ── */}
        <section className="hero">
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 60%)',
            opacity: 0.6, zIndex: 0, pointerEvents: 'none'
          }} />

          <div className="hero-grid" style={{ position: 'relative', zIndex: 1 }}>

            {/* LEFT — Text Content */}
            <div className="hero-text">
              <span className="hero-badge" style={{ marginBottom: '1.5rem' }}>✨ Powered by Deterministic AI</span>

              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                fontWeight: 900,
                color: 'var(--text-primary)',
                lineHeight: 1.12,
                letterSpacing: '-0.035em',
                marginBottom: '1.5rem'
              }}>
                A smarter way to study{' '}
                <span className="text-gradient">Lecture Materials</span>.
              </h1>

              <p style={{
                fontSize: '1.15rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: '2.5rem',
                maxWidth: '34rem'
              }}>
                Upload your syllabus or PDFs. Instantly generate zero-hallucination academic summaries and multi-choice quizzes.
              </p>

              <div className="hero-actions">
                <button onClick={handleCTA} className="btn btn-primary" style={{ fontWeight: 700 }}>
                  Get Started for Free <ArrowRight style={{ marginLeft: '0.5rem', width: 18, height: 18, display: 'inline' }} />
                </button>
                <a href="#how-it-works" className="btn btn-outline" style={{ fontWeight: 600 }}>
                  See How it Works
                </a>
              </div>

              <div className="hero-trust-badges">
                <span><ShieldCheck style={{ width: 17, height: 17, color: 'var(--purple-accent)' }} /> Strict RAG Constraints</span>
                <span><Clock style={{ width: 17, height: 17, color: 'var(--purple-accent)' }} /> Save Hours of Reading</span>
              </div>
            </div>

            {/* RIGHT — App Mockup */}
            <div className="hero-visual">
              <div className="hero-mockup">
                <div className="hero-mockup-titlebar">
                  <div className="hero-mockup-dot" style={{ background: '#FC5F57' }} />
                  <div className="hero-mockup-dot" style={{ background: '#FEBD2E' }} />
                  <div className="hero-mockup-dot" style={{ background: '#2BC840' }} />
                  <div style={{ flex: 1, height: 20, borderRadius: 6, background: 'var(--border-light)', marginLeft: '0.75rem' }} />
                </div>
                <div className="hero-mockup-body">
                  <div className="hero-mockup-sidebar">
                    <div className="hero-skel-line" style={{ width: '60%' }} />
                    <div className="hero-skel-block">
                      <FileText style={{ color: '#7C3AED', width: 22, height: 22 }} />
                      <div className="hero-skel-line" style={{ width: '70%', background: '#c4b5fd' }} />
                      <div className="hero-skel-line" style={{ width: '50%', background: '#c4b5fd' }} />
                    </div>
                    <div className="hero-skel-line" style={{ width: '80%' }} />
                    <div className="hero-skel-line" style={{ width: '65%' }} />
                  </div>
                  <div className="hero-mockup-main">
                    <div className="hero-skel-header">
                      <div className="hero-skel-line" style={{ width: '40%' }} />
                    </div>
                    <div className="hero-skel-card">
                      <div className="hero-skel-line" style={{ width: '30%', background: '#d1c4fd', height: 12 }} />
                      <div className="hero-skel-line" />
                      <div className="hero-skel-line" />
                      <div className="hero-skel-line" style={{ width: '85%' }} />
                      <div style={{ marginTop: '0.5rem' }} />
                      <div className="hero-skel-line" />
                      <div className="hero-skel-line" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{
                position: 'absolute', top: '-24px', right: '-24px',
                width: 96, height: 96, borderRadius: '50%',
                background: 'rgba(167, 139, 250, 0.3)', filter: 'blur(40px)', zIndex: -1
              }} />
              <div style={{
                position: 'absolute', bottom: '-32px', left: '-32px',
                width: 128, height: 128, borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.2)', filter: 'blur(64px)', zIndex: -1
              }} />
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" style={{
          width: '100%', background: 'var(--bg-section)',
          padding: '6rem 2rem', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', minHeight: '75vh'
        }}>
          <div className="container">
            <div className="section-header">
              <h2>Learn deeply, remember perfectly.</h2>
              <p>We've stripped away conversational chatbots to give you a pure, structured, and distraction-free study environment tailored strictly to your uploaded curriculum.</p>
            </div>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon"><BookOpen size={26} /></div>
                <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Academic Summaries</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>Instantly parse hundreds of pages into a synthesized outline highlighting core concepts, definitions, and required formulas.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon"><Brain size={26} /></div>
                <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Zero Hallucinations</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>If the answer isn't in your slides, the engine won't guess. Strict algorithmic constraints ensure you study only real facts.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon"><CheckCircle2 size={26} /></div>
                <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>10-Question Quizzes</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>Validate your knowledge immediately. Hit generate to extract ten multiple-choice questions directly from your text context.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" style={{
          width: '100%', background: 'var(--bg-main)',
          padding: '6rem 2rem', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', minHeight: '75vh'
        }}>
          <div className="container">
            <div className="section-header">
              <h2>From Upload to Mastery in seconds.</h2>
              <p>Our pipeline uses secure vector embeddings to guarantee accuracy without the bloated interface of a standard chatbot.</p>
            </div>
            <div className="steps-container">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-icon-wrapper"><FileText size={30} /></div>
                <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Upload PDF</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, textAlign: 'center' }}>Securely ingest your syllabus or lecture slides.</p>
              </div>
              <div className="step-connector" />
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-icon-wrapper"><Zap size={30} /></div>
                <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Vector Search</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, textAlign: 'center' }}>We securely embed your text into isolated searchable chunks.</p>
              </div>
              <div className="step-connector" />
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-icon-wrapper"><BookOpen size={30} /></div>
                <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Master Concepts</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, textAlign: 'center' }}>Review the generated Academic Summary and Quiz.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{
          width: '100%', background: 'var(--bg-section)',
          padding: '6rem 2rem', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', minHeight: '75vh'
        }}>
          <div className="container">
            <div className="section-header">
              <h2>Trusted by top students.</h2>
              <p>Join thousands of students who study smarter, not harder.</p>
            </div>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-content">"I was tired of generic AI chatbots hallucinating answers that weren't on my syllabus. The strict constraints here ensure I'm actually studying the right material."</div>
                <div className="testimonial-author">
                  <div className="author-avatar" style={{ background: '#E0E7FF', color: 'var(--purple-dark)' }}>SJ</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Sarah Jenkins</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Medical Student</div>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-content">"The 10-question quiz generator is basically a cheat code for active recall. I upload my slide decks right after class and test myself immediately."</div>
                <div className="testimonial-author">
                  <div className="author-avatar" style={{ background: '#F3E8FF', color: 'var(--purple-accent)' }}>MC</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Marcus Chen</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Computer Science, MSc</div>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-content">"As a TA, I use this tool to quickly generate cohesive summaries of reading materials for my undergraduate classes. It saves me hours every week."</div>
                <div className="testimonial-author">
                  <div className="author-avatar" style={{ background: '#F3F4F6', color: 'var(--text-primary)' }}>ER</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Dr. Elena Rostova</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>University Professor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" style={{
          width: '100%', background: 'var(--bg-main)',
          padding: '5rem 2rem', borderTop: '1px solid var(--border-light)'
        }}>
          <div className="container">
            <div className="section-header">
              <h2>Simple, transparent pricing.</h2>
              <p>Start studying smarter today. Upgrade when you need more bandwidth.</p>
            </div>
            <div className="pricing-grid">
              <div className="pricing-card">
                <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Basic</h3>
                <div className="pricing-price"><span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>$0</span><span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>/mo</span></div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Perfect for testing the waters and light reading.</p>
                <ul className="pricing-features">
                  <li><CheckCircle2 size={16} style={{ color: 'var(--purple-accent)', flexShrink: 0 }} /> Up to 5 PDFs per month</li>
                  <li><CheckCircle2 size={16} style={{ color: 'var(--purple-accent)', flexShrink: 0 }} /> Standard Summaries</li>
                  <li><CheckCircle2 size={16} style={{ color: 'var(--purple-accent)', flexShrink: 0 }} /> 10-Question Quizzes</li>
                </ul>
                <button onClick={handleCTA} className="btn btn-outline" style={{ width: '100%', fontWeight: 700 }}>Start for Free</button>
              </div>
              <div className="pricing-card pricing-card-featured">
                <div className="pricing-badge">Most Popular</div>
                <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Scholar Pro</h3>
                <div className="pricing-price"><span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>$9</span><span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>/mo</span></div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Everything you need to master your entire semester.</p>
                <ul className="pricing-features">
                  <li><CheckCircle2 size={16} style={{ color: 'var(--purple-accent)', flexShrink: 0 }} /> Unlimited PDFs</li>
                  <li><CheckCircle2 size={16} style={{ color: 'var(--purple-accent)', flexShrink: 0 }} /> Instant Vector Processing</li>
                  <li><CheckCircle2 size={16} style={{ color: 'var(--purple-accent)', flexShrink: 0 }} /> Advanced Quiz Generation</li>
                  <li><CheckCircle2 size={16} style={{ color: 'var(--purple-accent)', flexShrink: 0 }} /> Priority Support</li>
                </ul>
                <button onClick={handleCTA} className="btn btn-primary" style={{ width: '100%', fontWeight: 700 }}>Get Scholar Pro</button>
              </div>
              <div className="pricing-card">
                <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>University</h3>
                <div className="pricing-price"><span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Custom</span></div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>For educators and organizations needing bulk access.</p>
                <ul className="pricing-features">
                  <li><CheckCircle2 size={16} style={{ color: 'var(--purple-accent)', flexShrink: 0 }} /> Unlimited Everything</li>
                  <li><CheckCircle2 size={16} style={{ color: 'var(--purple-accent)', flexShrink: 0 }} /> Local Deployment Options</li>
                  <li><CheckCircle2 size={16} style={{ color: 'var(--purple-accent)', flexShrink: 0 }} /> Custom Guardrails</li>
                </ul>
                <button onClick={handleCTA} className="btn btn-outline" style={{ width: '100%', fontWeight: 700 }}>Contact Us</button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="logo" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.03em', color: 'var(--purple-accent)' }}>AI Study Kit</span>
              </Link>
              <p>Built as a modern SaaS tool for strict, zero-hallucination PDF studying. Stop chatting, start learning.</p>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <Link to="/login" className="footer-link">Log In</Link>
              <Link to="/register" className="footer-link">Sign Up</Link>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
          <div className="footer-divider">
            <span>© {new Date().getFullYear()} AI Study Kit Generator. All rights reserved.</span>
            <div className="footer-divider-links">
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Landing;
