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
    <div className="flex flex-col min-h-screen">
      {/* 1. Navbar */}
      <nav className="navbar w-full shadow-sm sticky top-0 z-50 bg-main bg-opacity-95 backdrop-blur">
        <div className="container nav-content flex justify-between items-center w-full py-4">
          <Link to="/" className="logo cursor-pointer flex items-center gap-3">
            <div className="logo-icon"></div>
            <span className="font-bold text-xl tracking-tight text-primary">AI Study Kit</span>
          </Link>
          
          <div className="nav-links flex items-center gap-6">
            <a href="#features" className="text-secondary hover:text-primary font-medium hidden md:block transition-colors">Features</a>
            <a href="#how-it-works" className="text-secondary hover:text-primary font-medium hidden md:block transition-colors">How it Works</a>
            <a href="#pricing" className="text-secondary hover:text-primary font-medium hidden md:block transition-colors">Pricing</a>
            
            {user ? (
              <button onClick={() => navigate('/dashboard')} className="btn btn-primary ml-4">Go to Dashboard</button>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link to="/login" className="text-secondary hover:text-primary font-medium transition-colors px-2">Log In</Link>
                <Link to="/register" className="btn btn-primary shadow-sm hover:-translate-y-0.5 transition-transform">Sign Up Free</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full flex flex-col items-center">
        
        {/* 1. Hero Section */}
        <section className="hero w-full bg-main overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-white opacity-50 z-0 pointer-events-none" />
          <div className="container relative z-10 flex flex-col items-center text-center py-20 md:py-32 px-4 max-w-5xl">
            <span className="hero-badge mb-6 animate-fade-in-up">✨ Powered by Deterministic AI</span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-primary leading-tight mb-8 tracking-tight">
              A smarter way to study <br className="hidden sm:block" /> 
              your <span className="text-gradient">Lecture Materials</span>.
            </h1>
            <p className="text-xl md:text-2xl text-secondary mb-10 max-w-3xl leading-relaxed">
              Upload your syllabus or PDFs. Instantly generate zero-hallucination academic summaries and multi-choice quizzes.
            </p>
            <div className="hero-actions flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
              <button onClick={handleCTA} className="btn btn-primary text-lg px-8 py-4 w-full sm:w-auto font-bold shadow-lg">
                Get Started for Free <ArrowRight className="ml-2 w-5 h-5 inline" />
              </button>
              <a href="#how-it-works" className="btn btn-outline text-lg px-8 py-4 w-full sm:w-auto font-medium">
                See How it Works
              </a>
            </div>
            
            <div className="mt-16 text-sm font-medium text-secondary flex items-center justify-center gap-6 flex-wrap">
              <span className="flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-accent" /> Strict RAG Constraints</span>
              <span className="flex items-center"><Clock className="w-5 h-5 mr-2 text-accent" /> Save Hours of Reading</span>
            </div>
          </div>
        </section>

        {/* 2. "Learn Anything, Remember Everything" - Benefit Cards Grid */}
        <section id="features" className="section bg-section w-full px-6 py-24">
          <div className="container">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-4xl font-extrabold text-primary mb-6 tracking-tight">Learn deeply, remember perfectly.</h2>
              <p className="text-xl text-secondary leading-relaxed">
                We've stripped away conversational chatbots to give you a pure, structured, and distraction-free study environment tailored strictly to your uploaded curriculum.
              </p>
            </div>

            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">
                  <BookOpen size={28} />
                </div>
                <h3 className="font-bold text-2xl mb-3 text-primary tracking-tight">Academic Summaries</h3>
                <p className="text-secondary leading-relaxed text-lg">
                  Instantly parse hundreds of pages into a synthesized Markdown outline highlighting only the core concepts, definitions, and required formulas.
                </p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">
                  <Brain size={28} />
                </div>
                <h3 className="font-bold text-2xl mb-3 text-primary tracking-tight">Zero Hallucinations</h3>
                <p className="text-secondary leading-relaxed text-lg">
                  If the answer isn't in your slides, the engine won't guess. We utilize strict algorithmic constraints to ensure you are only studying real facts.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="font-bold text-2xl mb-3 text-primary tracking-tight">10-Question Quizzes</h3>
                <p className="text-secondary leading-relaxed text-lg">
                  Validate your knowledge immediately. Hit generate to extract exactly ten multiple-choice questions directly from your provided text context.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. "From Upload to Mastery" - Horizontal Steps */}
        <section id="how-it-works" className="section w-full px-6 py-24 bg-main">
          <div className="container">
            <div className="text-center mb-20 max-w-3xl mx-auto">
              <h2 className="text-4xl font-extrabold text-primary mb-6 tracking-tight">From Upload to Mastery in seconds.</h2>
              <p className="text-xl text-secondary leading-relaxed">
                Our pipeline uses secure vector embeddings to guarantee accuracy without the bloated interface of a standard chatbot.
              </p>
            </div>

            <div className="steps-container">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-icon-wrapper"><FileText size={32} /></div>
                <h4 className="font-bold text-xl mb-2 text-primary">Upload PDF</h4>
                <p className="text-secondary text-center">Securely ingest your syllabus or lecture slides.</p>
              </div>
              
              <div className="step-connector hidden lg:block"></div>

              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-icon-wrapper"><Zap size={32} /></div>
                <h4 className="font-bold text-xl mb-2 text-primary">Vector Search</h4>
                <p className="text-secondary text-center">We securely embed your text into isolated chunks.</p>
              </div>

              <div className="step-connector hidden lg:block"></div>

              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-icon-wrapper"><BookOpen size={32} /></div>
                <h4 className="font-bold text-xl mb-2 text-primary">Master Concepts</h4>
                <p className="text-secondary text-center">Review the generated Academic Summary and Quiz.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Testimonial Section */}
        <section className="section bg-section w-full px-6 py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-primary mb-6 tracking-tight">Trusted by top students.</h2>
            </div>
            
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-content">
                  "I was tired of generic AI chatbots hallucinating answers that weren't on my syllabus. The strict constraints here ensure I'm actually studying the right material."
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar bg-indigo-100 text-purple-dark pt-2.5">SJ</div>
                  <div>
                    <div className="font-bold text-primary">Sarah Jenkins</div>
                    <div className="text-sm text-secondary">Medical Student</div>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-content">
                  "The 10-question quiz generator is basically a cheat code for active recall tracking. I upload my slide decks right after class and test myself immediately."
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar bg-purple-100 text-purple-accent pt-2.5">MC</div>
                  <div>
                    <div className="font-bold text-primary">Marcus Chen</div>
                    <div className="text-sm text-secondary">Computer Science, MSc</div>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-content">
                  "As a TA, I use this tool to quickly generate cohesive summaries of reading materials to provide to my undergraduate classes. It saves me hours every week."
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar bg-gray-200 text-primary pt-2.5">EP</div>
                  <div>
                    <div className="font-bold text-primary">Dr. Elena Rostova</div>
                    <div className="text-sm text-secondary">University Professor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Pricing Section */}
        <section id="pricing" className="section w-full px-6 py-24 bg-main">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-primary mb-6 tracking-tight">Simple, transparent pricing.</h2>
              <p className="text-xl text-secondary mb-10 max-w-2xl mx-auto">Start studying smarter today. Upgrade when you need more bandwidth.</p>
            </div>

            <div className="pricing-grid">
              {/* Free Tier */}
              <div className="pricing-card">
                <h3 className="font-bold text-2xl text-primary mb-2">Basic</h3>
                <div className="pricing-price mb-6"><span className="text-5xl font-extrabold text-primary">$0</span><span className="text-secondary">/mo</span></div>
                <p className="text-secondary mb-8">Perfect for testing the waters and light reading.</p>
                <ul className="pricing-features mb-8">
                  <li><CheckCircle2 size={18} className="text-accent" /> Up to 5 PDFs per month</li>
                  <li><CheckCircle2 size={18} className="text-accent" /> Standard Summaries</li>
                  <li><CheckCircle2 size={18} className="text-accent" /> 10-Question Quizzes</li>
                </ul>
                <button onClick={handleCTA} className="btn w-full btn-outline py-3 font-bold">Start for Free</button>
              </div>

              {/* Pro Tier */}
              <div className="pricing-card pricing-card-featured">
                <div className="pricing-badge">Most Popular</div>
                <h3 className="font-bold text-2xl text-primary mb-2">Scholar Pro</h3>
                <div className="pricing-price mb-6"><span className="text-5xl font-extrabold text-primary">$9</span><span className="text-secondary">/mo</span></div>
                <p className="text-secondary mb-8">Everything you need to master your entire semester.</p>
                <ul className="pricing-features mb-8">
                  <li><CheckCircle2 size={18} className="text-accent" /> Unlimited PDFs</li>
                  <li><CheckCircle2 size={18} className="text-accent" /> Instant Vector Processing</li>
                  <li><CheckCircle2 size={18} className="text-accent" /> Advanced Quiz Generation</li>
                  <li><CheckCircle2 size={18} className="text-accent" /> Priority Support</li>
                </ul>
                <button onClick={handleCTA} className="btn w-full btn-primary py-3 font-bold">Get Scholar Pro</button>
              </div>

              {/* Enterprise Tier */}
              <div className="pricing-card">
                <h3 className="font-bold text-2xl text-primary mb-2">University</h3>
                <div className="pricing-price mb-6"><span className="text-5xl font-extrabold text-primary">Custom</span></div>
                <p className="text-secondary mb-8">For educators and organizations needing bulk access.</p>
                <ul className="pricing-features mb-8">
                  <li><CheckCircle2 size={18} className="text-accent" /> Unlimited Everything</li>
                  <li><CheckCircle2 size={18} className="text-accent" /> Local Deployment Options</li>
                  <li><CheckCircle2 size={18} className="text-accent" /> Custom Guardrails</li>
                </ul>
                <button onClick={handleCTA} className="btn w-full btn-outline py-3 font-bold">Contact Us</button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 6. Footer Layout */}
      <footer className="footer w-full border-t border-light mt-auto bg-section pt-16 pb-8">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-12 px-6 mb-12">
          
          <div className="col-span-1 md:col-span-2 flex flex-col items-start">
            <Link to="/" className="logo cursor-pointer mb-6 flex items-center gap-3">
              <div className="logo-icon scale-90"></div>
              <span className="text-xl font-bold tracking-tight text-primary">AI Study Kit</span>
            </Link>
            <p className="text-sm text-secondary max-w-sm leading-relaxed mb-6">
              Built as a modern SaaS tool for strict, zero-hallucination PDF studying. Stop chatting, start learning.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-primary mb-2">Product</h4>
            <a href="#features" className="text-sm text-secondary hover:text-accent transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-secondary hover:text-accent transition-colors">How it works</a>
            <a href="#pricing" className="text-sm text-secondary hover:text-accent transition-colors">Pricing</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-primary mb-2">Company</h4>
            <Link to="/login" className="text-sm text-secondary hover:text-accent transition-colors">Log In</Link>
            <Link to="/register" className="text-sm text-secondary hover:text-accent transition-colors">Sign Up</Link>
            <a href="#" className="text-sm text-secondary hover:text-accent transition-colors">Privacy Policy</a>
          </div>

        </div>
        
        <div className="border-t border-light w-full">
          <div className="container px-6 pt-8 text-sm text-secondary flex flex-col md:flex-row justify-between items-center text-center">
             <span>© {new Date().getFullYear()} AI Study Kit Generator. All rights reserved.</span>
             <span className="mt-4 md:mt-0 flex gap-4">
               <a href="#" className="hover:text-primary transition-colors">Terms</a>
               <a href="#" className="hover:text-primary transition-colors">Privacy</a>
             </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
