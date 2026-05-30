import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css';

// Simple helper to join classes dynamically
const clsx = (...classes) => classes.filter(Boolean).join(' ');


const HomePage = () => {
  const { user } = useAuth();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Directly query the DOM to observe elements, bypassing React ref complexity
    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    // Force visible immediately if observer fails to attach
    setTimeout(() => {
      const checkElements = document.querySelectorAll('.reveal-on-scroll');
      checkElements.forEach(el => {
        if (!el.classList.contains('is-visible')) {
          // Failsafe: if an element is high up, ensure it's visible. 
          // Only forced if it's near the top of the window
          if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('is-visible');
          }
        }
      });
    }, 500);

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  const steps = [
    { n: '01', title: 'Create your account', text: 'Register with your details so we can verify you as an engineering student.' },
    { n: '02', title: 'Sign in securely', text: 'Log in anytime to access payments and your student profile.' },
    { n: '03', title: 'Pay fees online', text: 'Complete dues safely with Paystack — card, bank, or transfer.' },
  ];

  const comments = [
    { name: 'Emmanuel A.', role: 'Computer Engineering, 400L', text: 'The new payment portal makes paying dues so much easier. I used to stand in lines for hours!', rating: 5 },
    { name: 'Sarah O.', role: 'Civil Engineering, 300L', text: 'NUESA ACU really stepped up! The platform is gorgeous and completely seamless to use on my phone.', rating: 5 },
    { name: 'David K.', role: 'Mechanical Engineering, 200L', text: 'Finally, a modern system for engineering students. I love the interactive design and easy navigation.', rating: 4 },
  ];

  const executives = [
    {
      name: 'Olawoyin Oluwafemi John',
      title: 'President',
      img: '/assets/executives/FEMI.png',
      desc: 'Dedicated to fostering unity, driving academic excellence, and representing NUESA ACU.'
    },
    {
      name: 'Samule Adeshina',
      title: 'Vice President',
      img: '/assets/executives/Adeshina.png',
      desc: 'Supporting strategic leadership and bridging the gap between theory and practical engineering.'
    },
    {
      name: 'Kamsiyochi Wogu',
      title: 'Financial Secretary',
      img: '/assets/executives/Kamsi.png',
      desc: 'Committed to precise financial record-keeping, budgeting, and fiscal transparency.'
    },
    {
      name: 'Nathaniel Olakunmi',
      title: 'General Secretary',
      img: '/assets/executives/General.png',
      desc: 'Coordinating communication, administrative excellence, and seamless student engagement.'
    },
  ];

  return (
    <div className={clsx('min-h-screen', 'bg-gray-900', 'text-white', 'font-sans', 'overflow-x-hidden', 'pt-16')}>

      {/* Dynamic Looping Background Hero Section */}
      <section className={clsx('relative', 'w-full', 'min-h-[90vh]', 'flex', 'items-center', 'pt-20', 'pb-20', 'justify-center')}>
        <div className="hero-bg-slider">
          <img src="/assets/IMG_6912.JPG" alt="Campus 1" className="hero-bg-slide" />
          <img src="/assets/IMG_6913.JPG" alt="Students 2" className="hero-bg-slide" />
          <img src="/assets/IMG_8556.JPG" alt="Tech 3" className="hero-bg-slide" />
          <img src="/assets/IMG_6912.JPG" alt="Campus 4" className="hero-bg-slide" />
          <div className={clsx('absolute', 'inset-0', 'bg-gradient-to-t', 'from-gray-900', 'via-gray-900/60', 'to-transparent', 'z-10')} />
        </div>

        <div className={clsx('container', 'mx-auto', 'px-6', 'relative', 'z-20')}>
          <div className={clsx('max-w-4xl', 'mx-auto', 'text-center', 'reveal-on-scroll')}>
            <p className={clsx('text-emerald-400', 'font-semibold', 'tracking-widest', 'uppercase', 'mb-4', 'text-sm', 'md:text-base', 'drop-shadow-lg')}>
              NUESA · Ajayi Crowther University
            </p>
            <h1 className={clsx('text-4xl', 'md:text-6xl', 'font-bold', 'mb-6', 'leading-tight', 'font-serif', 'drop-shadow-xl')}>
              Nigerian Universities Engineering Students Association
              <br />
              <span className={clsx('text-transparent', 'bg-clip-text', 'bg-gradient-to-r', 'from-emerald-400', 'to-cyan-400')}>
                ACU Chapter
              </span>
            </h1>
            <div className={clsx('flex', 'flex-col', 'sm:flex-row', 'justify-center', 'items-center', 'gap-4')}>
              {!user ? (
                <Link to="/login" className={clsx('premium-btn', 'bg-emerald-500', 'hover:bg-emerald-400', 'text-white', 'px-8', 'py-3', 'rounded-full', 'font-bold', 'text-lg', 'shadow-[0_0_20px_rgba(16,185,129,0.4)]')}>
                  Student Login
                </Link>
              ) : (
                <Link to="/pay" className={clsx('premium-btn', 'bg-emerald-500', 'hover:bg-emerald-400', 'text-white', 'px-8', 'py-3', 'rounded-full', 'font-bold', 'text-lg', 'shadow-[0_0_20px_rgba(16,185,129,0.4)]')}>
                  Make a Payment
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* How it Works Module */}
      <section className={clsx('py-24', 'bg-gray-900')}>
        <div className={clsx('container', 'mx-auto', 'px-6', 'max-w-6xl')}>
          <div className={clsx('text-center', 'mb-16')}>
            <p className={clsx('text-emerald-500', 'font-bold', 'tracking-widest', 'uppercase', 'text-sm', 'mb-2', 'reveal-on-scroll')}>How it works</p>
            <h2 className={clsx('text-4xl', 'md:text-5xl', 'font-bold', 'font-serif', 'mb-4', 'reveal-on-scroll', 'delay-100')}>Three simple steps</h2>
            <p className={clsx('text-gray-400', 'max-w-2xl', 'mx-auto', 'reveal-on-scroll', 'delay-200')}>From your first visit to a confirmed payment — zero guesswork. The system is designed for ease and transparency.</p>
          </div>
          <div className={clsx('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-8')}>
            {steps.map((s, i) => (
              <div key={i} className={clsx('premium-card', 'bg-gray-800/40', 'border', 'border-gray-700', 'p-8', 'rounded-2xl', 'backdrop-blur-sm', 'reveal-on-scroll')} style={{ transitionDelay: `${i * 150}ms` }}>
                <div>
                  <span className={clsx('text-5xl', 'font-black', 'text-transparent', 'bg-clip-text', 'bg-gradient-to-br', 'from-emerald-500/40', 'to-emerald-800/10', 'block', 'mb-4')}>{s.n}</span>
                  <h3 className={clsx('text-xl', 'font-bold', 'mb-3', 'text-white')}>{s.title}</h3>
                  <p className={clsx('text-gray-400', 'leading-relaxed')}>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About NUESA Section */}
      <section className={clsx('py-24', 'bg-gray-900', 'border-t', 'border-gray-800')}>
        <div className={clsx('container', 'mx-auto', 'px-6', 'max-w-6xl')}>
          <div className={clsx('flex', 'flex-col', 'md:flex-row', 'items-center', 'gap-12')}>
            <div className={clsx('md:w-1/2', 'reveal-on-scroll')}>
              <div className="relative">
                <div className={clsx('absolute', 'inset-0', 'bg-emerald-500', 'rounded-3xl', 'translate-x-4', 'translate-y-4', 'opacity-20')}></div>
                <img src="/assets/IMG_8556.JPG" alt="About NUESA" className={clsx('relative', 'rounded-3xl', 'shadow-xl', 'z-10', 'w-full', 'object-cover')} />
              </div>
            </div>
            <div className={clsx('md:w-1/2', 'reveal-on-scroll', 'delay-100')}>
              <p className={clsx('text-emerald-500', 'font-bold', 'tracking-widest', 'uppercase', 'text-sm', 'mb-2')}>About NUESA</p>
              <h2 className={clsx('text-4xl', 'md:text-5xl', 'font-bold', 'font-serif', 'mb-6', 'text-white')}>Empowering Future Engineers</h2>
              <p className={clsx('text-gray-400', 'text-lg', 'leading-relaxed', 'mb-6')}>
                The Nigerian Universities Engineering Students' Association (NUESA) ACU Chapter is the central representative body for all engineering students. We are dedicated to fostering a community of innovation, academic excellence, and professional development.
              </p>
              <ul className={clsx('space-y-4', 'mb-8')}>
                <li className={clsx('flex', 'items-center', 'gap-3', 'text-gray-300')}>
                  <svg className={clsx('w-5', 'h-5', 'text-emerald-500', 'flex-shrink-0')} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Skill Acquisition & Training
                </li>
                <li className={clsx('flex', 'items-center', 'gap-3', 'text-gray-300')}>
                  <svg className={clsx('w-5', 'h-5', 'text-emerald-500', 'flex-shrink-0')} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Industrial Networking & Seminars
                </li>
              </ul>
              <Link to="/about" className={clsx('text-emerald-400', 'hover:text-white', 'font-bold', 'flex', 'items-center', 'gap-2', 'group', 'transition-colors')}>
                Read Full History
                <svg className={clsx('w-5', 'h-5', 'group-hover:translate-x-2', 'transition-transform')} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our College Section */}
      <section className={clsx('py-24', 'bg-gray-950', 'border-t', 'border-gray-800')}>
        <div className={clsx('container', 'mx-auto', 'px-6', 'max-w-6xl')}>
          <div className={clsx('text-center', 'mb-16')}>
            <p className={clsx('text-emerald-500', 'font-bold', 'tracking-widest', 'uppercase', 'text-sm', 'mb-2', 'reveal-on-scroll')}>Our College</p>
            <h2 className={clsx('text-4xl', 'md:text-5xl', 'font-bold', 'font-serif', 'mb-4', 'reveal-on-scroll', 'delay-100')}>Faculty of Engineering ACU</h2>
            <p className={clsx('text-gray-400', 'max-w-2xl', 'mx-auto', 'reveal-on-scroll', 'delay-200')}>A hub of state-of-the-art laboratories, modern classrooms, and brilliant minds.</p>
          </div>
          <div className={clsx('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-8')}>
            <div className={clsx('bg-gray-900', 'border', 'border-gray-700', 'p-8', 'rounded-2xl', 'reveal-on-scroll', 'hover:border-emerald-500/50', 'transition-colors')}>
              <svg className={clsx('w-10', 'h-10', 'text-emerald-500', 'mb-6')} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              <h3 className={clsx('text-xl', 'font-bold', 'mb-3', 'text-white')}>Modern Labs</h3>
              <p className={clsx('text-gray-400', 'leading-relaxed')}>Fully equipped laboratories that meet international standards for hands-on practical experience.</p>
            </div>
            <div className={clsx('bg-gray-900', 'border', 'border-gray-700', 'p-8', 'rounded-2xl', 'reveal-on-scroll', 'delay-100', 'hover:border-emerald-500/50', 'transition-colors')}>
              <svg className={clsx('w-10', 'h-10', 'text-emerald-500', 'mb-6')} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              <h3 className={clsx('text-xl', 'font-bold', 'mb-3', 'text-white')}>Digital Library</h3>
              <p className={clsx('text-gray-400', 'leading-relaxed')}>Access to thousands of journals, software, and tools tailored to diverse engineering branches.</p>
            </div>
            <div className={clsx('bg-gray-900', 'border', 'border-gray-700', 'p-8', 'rounded-2xl', 'reveal-on-scroll', 'delay-200', 'hover:border-emerald-500/50', 'transition-colors')}>
              <svg className={clsx('w-10', 'h-10', 'text-emerald-500', 'mb-6')} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <h3 className={clsx('text-xl', 'font-bold', 'mb-3', 'text-white')}>Expert Faculty</h3>
              <p className={clsx('text-gray-400', 'leading-relaxed')}>Learn directly from seasoned lecturers and professors deeply rooted in industry practices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Leadership */}
      <section className={clsx('py-24', 'bg-gray-950', 'border-y', 'border-gray-800')}>
        <div className={clsx('container', 'mx-auto', 'px-6', 'max-w-6xl')}>
          <div className={clsx('text-center', 'mb-16')}>
            <p className={clsx('text-emerald-500', 'font-bold', 'tracking-widest', 'uppercase', 'text-sm', 'mb-2', 'reveal-on-scroll')}>Leadership</p>
            <h2 className={clsx('text-4xl', 'md:text-5xl', 'font-bold', 'font-serif', 'mb-4', 'reveal-on-scroll', 'delay-100')}>Meet Our Leadership</h2>
            <p className={clsx('text-gray-400', 'max-w-2xl', 'mx-auto', 'reveal-on-scroll', 'delay-200')}>Meet the team guiding engineering programmes and ensuring student welfare for this current tenure.</p>
          </div>
          <div className={clsx('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4', 'gap-6')}>
            {executives.map((ex, i) => (
              <div key={i} className={clsx('premium-card', 'group', 'bg-gray-900', 'border', 'border-gray-700', 'rounded-2xl', 'overflow-hidden', 'reveal-on-scroll')} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className={clsx('h-full', 'flex', 'flex-col')}>
                  <div className={clsx('aspect-square', 'w-full', 'overflow-hidden', 'bg-gray-800')}>
                    <img src={ex.img} alt={ex.name} className={clsx('w-full', 'h-full', 'object-cover', 'group-hover:scale-110', 'transition-transform', 'duration-700')} />
                  </div>
                  <div className={clsx('p-6', 'flex-1', 'flex', 'flex-col')}>
                    <h3 className={clsx('text-lg', 'font-bold', 'text-white', 'mb-1', 'group-hover:text-emerald-400', 'transition-colors')}>{ex.name}</h3>
                    <p className={clsx('text-emerald-500', 'text-xs', 'uppercase', 'font-bold', 'tracking-wider', 'mb-3')}>{ex.title}</p>
                    <p className={clsx('text-gray-400', 'text-sm', 'leading-relaxed')}>{ex.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={clsx('mt-12', 'text-center')}>
            <Link to="/executives" className={clsx('reveal-on-scroll', 'inline-flex', 'text-emerald-400', 'hover:text-emerald-300', 'font-medium', 'text-lg', 'items-center', 'justify-center', 'gap-2', 'group')}>
              View Past Executives Timeline
              <svg className={clsx('w-5', 'h-5', 'group-hover:translate-x-2', 'transition-transform')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials / Comments Section */}
      <section className={clsx('py-24', 'bg-gray-900', 'relative', 'overflow-hidden')}>
        {/* Abstract background blobs */}
        <div className={clsx('absolute', 'top-0', 'left-0', 'w-96', 'h-96', 'bg-emerald-600/10', 'rounded-full', 'blur-3xl', '-translate-x-1/2', '-translate-y-1/2', 'pointer-events-none')}></div>
        <div className={clsx('absolute', 'bottom-0', 'right-0', 'w-96', 'h-96', 'bg-cyan-600/10', 'rounded-full', 'blur-3xl', 'translate-x-1/3', 'translate-y-1/3', 'pointer-events-none')}></div>

        <div className={clsx('container', 'mx-auto', 'px-6', 'max-w-6xl', 'relative', 'z-10')}>
          <div className={clsx('text-center', 'mb-16')}>
            <p className={clsx('text-emerald-500', 'font-bold', 'tracking-widest', 'uppercase', 'text-sm', 'mb-2', 'reveal-on-scroll')}>Student Voices</p>
            <h2 className={clsx('text-4xl', 'md:text-5xl', 'font-bold', 'font-serif', 'mb-4', 'reveal-on-scroll', 'delay-100')}>What Our Student Says</h2>
            <p className={clsx('text-gray-400', 'max-w-2xl', 'mx-auto', 'reveal-on-scroll', 'delay-200')}>Hear from your fellow engineering students about their experience with the portal and NUESA community.</p>
          </div>

          <div className={clsx('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-6')}>
            {comments.map((comment, i) => (
              <div key={i} className={clsx('premium-card', 'bg-gray-800/60', 'backdrop-blur-md', 'border', 'border-gray-700/50', 'p-8', 'rounded-2xl', 'relative', 'reveal-on-scroll')} style={{ transitionDelay: `${i * 150}ms` }}>
                <div>
                  {/* Quote icon */}
                  <svg className={clsx('w-10', 'h-10', 'text-emerald-500/20', 'absolute', 'top-6', 'right-6')} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  <div className={clsx('flex', 'text-yellow-500', 'mb-4')}>
                    {[...Array(comment.rating)].map((_, idx) => (
                      <svg key={idx} className={clsx('w-5', 'h-5')} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className={clsx('text-gray-300', 'italic', 'mb-6', 'leading-relaxed', 'relative', 'z-10')}>"{comment.text}"</p>
                  <div>
                    <p className={clsx('text-white', 'font-bold')}>{comment.name}</p>
                    <p className={clsx('text-emerald-400', 'text-xs', 'uppercase', 'tracking-wide', 'mt-1')}>{comment.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className={clsx('py-20', 'bg-emerald-900', 'border-t', 'border-emerald-800', 'text-center')}>
        <div className={clsx('container', 'mx-auto', 'px-6')}>
          <div className="reveal-on-scroll">
            <h2 className={clsx('text-3xl', 'md:text-5xl', 'font-bold', 'font-serif', 'mb-6', 'text-white', 'text-shadow-lg')}>Ready to make your payment?</h2>
            <p className={clsx('text-emerald-100', 'mb-10', 'max-w-xl', 'mx-auto', 'text-lg')}>Join hundreds of engineers who have successfully completed their registrations through the portal.</p>
            <Link to={user ? "/pay" : "/login"} className={clsx('premium-btn', 'inline-block', 'bg-white', 'text-emerald-900', 'shadow-xl', 'hover:bg-gray-100', 'px-8', 'py-4', 'rounded-full', 'font-bold', 'text-lg')}>
              {user ? "Go to Payment Dashboard" : "Sign in to your account"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
