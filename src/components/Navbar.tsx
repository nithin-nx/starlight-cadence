import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Events', href: '/events' },
  { name: 'Team', href: '/team' },
  { name: 'Contact', href: '/contact' },
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 0.86, 0.39, 0.96] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen ? 'bg-background/95 backdrop-blur-md border-b border-border/40 py-3' : 'py-4 md:py-5 bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Mobile Layout */}
          <div className="flex md:hidden items-center justify-between">
            {/* Logo - Mobile */}
            <Link to="/" className="flex items-center gap-2 z-10">
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="font-orbitron font-bold text-primary text-base">I</span>
              </div>
              <span className="font-orbitron font-bold text-lg tracking-wider text-foreground">
                ISTE <span className="text-primary">GECB</span>
              </span>
            </Link>

            {/* Mobile Menu Button - Only for phones */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground z-10 touch-manipulation"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Desktop Layout - Horizontal Navbar with Separators */}
          <div className="hidden md:flex items-center justify-center w-full">
            <div className="flex items-center bg-background/95 backdrop-blur-md border border-border/40 rounded-lg px-1 py-1.5">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.href;
                return (
                  <React.Fragment key={link.name}>
                    <Link
                      to={link.href}
                      className={`px-3 py-1.5 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                        isActive 
                          ? 'text-foreground' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {link.name}
                    </Link>
                    {index < navLinks.length - 1 && (
                      <div className="h-5 w-px bg-border/50 mx-0.5" />
                    )}
                  </React.Fragment>
                );
              })}
              {/* Separator before Login */}
              <div className="h-5 w-px bg-border/50 mx-1" />
              <Link
                to="/auth"
                className={`px-3 py-1.5 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                  location.pathname === '/auth'
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Login
              </Link>
            </div>
          </div>

        </div>
      </motion.nav>

      {/* Mobile Menu Overlay - Only for phones */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative pt-24 px-6 pb-8 h-full overflow-y-auto"
            >
              <nav className="flex flex-col gap-2">
                {navLinks.map((link, index) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        to={link.href}
                        className={`block px-4 py-4 text-lg font-medium uppercase tracking-wider rounded-xl transition-all duration-300 ${
                          isActive 
                            ? 'text-primary bg-primary/10 border border-primary/30' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="mt-8"
              >
                <Link
                  to="/auth"
                  className="block w-full px-6 py-4 text-center text-lg font-semibold uppercase tracking-wider bg-primary text-primary-foreground rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
                >
                  Login / Sign Up
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
