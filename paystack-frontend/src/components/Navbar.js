import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import studentLogo from '../assets/student-logo.jpeg';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Executives', path: '/executives' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ];

  const protectedLinks = [
    // { name: 'Voting', path: '/voting' },
  ];

  const visibleLinks = user ? [...publicLinks, ...protectedLinks] : publicLinks;

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/home') return true;
    return location.pathname === path;
  };

  return (
    <nav className={`fixed z-50 transition-all duration-500 shadow-2xl left-1/2 -translate-x-1/2 w-[95%] lg:w-[90%] max-w-7xl rounded-full ${scrolled ? 'top-4 bg-gray-950/90 backdrop-blur-xl border border-gray-800/80 py-3' : 'top-6 bg-gray-900/60 backdrop-blur-lg border border-gray-700/50 py-4'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-full blur group-hover:blur-md opacity-40 group-hover:opacity-70 transition-all duration-300"></div>
              <img src={studentLogo} alt="NUESA Logo" className="relative w-11 h-11 md:w-12 md:h-12 rounded-full border border-gray-700 object-cover z-10" />
            </div>
            <span className="font-sans font-black text-xl md:text-2xl text-white tracking-widest uppercase flex flex-col justify-center">
              NUESA
              <span className="text-[0.6rem] md:text-xs text-emerald-400 font-bold tracking-[0.2em] -mt-1 opacity-80 group-hover:opacity-100 group-hover:text-cyan-400 transition-colors">ACU Portal</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <div className="flex bg-gray-900/50 backdrop-blur-sm border border-gray-800/80 p-1.5 rounded-full shadow-inner mr-6">
              {visibleLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`relative px-5 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-full overflow-hidden ${
                    isActive(link.path) 
                      ? 'text-gray-900' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {isActive(link.path) && (
                    <span className="absolute inset-0 bg-emerald-500 rounded-full -z-10 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                  )}
                  {link.name}
                </Link>
              ))}
            </div>
            
            {/* Desktop Auth / CTA Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link 
                    to="/pay" 
                    className="relative group overflow-hidden bg-gray-800 border border-emerald-500/30 hover:border-emerald-500/80 text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                       Make Payment
                       <svg className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </span>
                  </Link>
                  <div className="h-8 w-px bg-gray-700/50 mx-2"></div>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-400 text-[0.65rem] uppercase tracking-widest font-bold">Logged In</span>
                    <button onClick={handleLogout} className="text-emerald-400 font-bold text-sm tracking-wide hover:text-white hover:scale-105 transition-all">
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link to="/login" className="text-sm font-bold text-gray-900 bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all px-8 py-2.5 rounded-full uppercase tracking-widest flex items-center gap-2 group">
                  Login Access
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative z-50 text-emerald-400 p-2 rounded-full bg-gray-900/80 border border-gray-800"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 bg-gray-950/95 backdrop-blur-xl z-40 transition-all duration-500 lg:hidden flex flex-col pt-24 px-6 ${isMobileMenuOpen ? 'block opacity-100 translate-x-0' : 'pointer-events-none opacity-0 translate-x-full'}`}>
         
         <div className="flex flex-col gap-4 overflow-y-auto pb-20">
            {visibleLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className={`text-2xl font-black uppercase tracking-widest py-4 border-b border-gray-800/50 transition-colors ${
                  isActive(link.path) ? 'text-emerald-400' : 'text-gray-500 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-8">
              {user ? (
                <div className="flex flex-col gap-4">
                   <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 flex justify-between items-center">
                     <div>
                       <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">User Matrix</p>
                       <p className="text-emerald-400 font-bold text-lg">{user.name}</p>
                     </div>
                     <button onClick={handleLogout} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-bold text-sm tracking-widest uppercase transition-colors">
                       Logout
                     </button>
                   </div>
                   
                   <Link to="/pay" className="w-full text-center bg-emerald-500 text-gray-900 font-black tracking-widest uppercase py-4 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                     💳 Make Payment
                   </Link>
                </div>
              ) : (
                <Link to="/login" className="flex justify-center items-center w-full bg-emerald-500 text-gray-900 font-black text-xl tracking-widest uppercase py-5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  Student Login
                </Link>
              )}
            </div>
         </div>
      </div>
    </nav>
  );
};

export default Navbar;
