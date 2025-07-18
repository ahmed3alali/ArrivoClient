import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import SearchAndContact from "./NavbarHelpers/SearchAndContact";
import Menu from "./NavbarHelpers/Menu";
import Logo from "./NavbarHelpers/Logo";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

const Navbar = ({ openModal, slideIn, closeModal }) => {
  const [searchDrop, setSearchDrop] = useState(false);
  const [menuDrop, setMenuDrop] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Refs for click outside detection
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Security: Input validation and sanitization
  const validateAndSanitizeInput = (input) => {
    if (!input || typeof input !== 'string') return '';
    
    // Remove potentially dangerous characters and limit length
    const sanitized = input
      .replace(/[<>'"&]/g, '') // Remove HTML/script injection characters
      .replace(/javascript:/gi, '') // Remove javascript protocol
      .replace(/data:/gi, '') // Remove data protocol
      .replace(/vbscript:/gi, '') // Remove vbscript protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
      .slice(0, 100); // Limit to 100 characters
    
    return sanitized;
  };

  // Security: Rate limiting for search
  const searchAttempts = useRef(0);
  const lastSearchTime = useRef(0);
  const MAX_SEARCH_ATTEMPTS = 5;
  const SEARCH_COOLDOWN = 60000; // 1 minute

  const isRateLimited = () => {
    const now = Date.now();
    if (now - lastSearchTime.current > SEARCH_COOLDOWN) {
      searchAttempts.current = 0;
      lastSearchTime.current = now;
    }
    return searchAttempts.current >= MAX_SEARCH_ATTEMPTS;
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close menu if clicked outside
      if (menuRef.current && !menuRef.current.contains(event.target) && menuDrop) {
        setMenuDrop(false);
      }
      
      // Close search if clicked outside
      if (searchRef.current && !searchRef.current.contains(event.target) && searchDrop) {
        setSearchDrop(false);
      }

      // Close dropdown if clicked outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && showDropdown) {
        setShowDropdown(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuDrop, searchDrop, showDropdown]);

  // Close dropdowns when route changes
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = () => {
      setSearchDrop(false);
      setMenuDrop(false);
      setShowDropdown(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  const toggleSearch = () => {
    setMenuDrop(false);
    setSearchDrop(!searchDrop);
  };

  const isTripDetailPage = router.asPath.startsWith("/travels-programs/") &&
  !router.asPath.includes("timings-prices");

  const hideSearchBar =
  router.pathname === "/travels-programs" || router.pathname === "/travels-dailyTrips";

  const toggleMenu = () => {
    setSearchDrop(false);
    setMenuDrop(!menuDrop);
  };

  const handleShowDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Security: Rate limiting check
    if (isRateLimited()) {
      alert('تم تجاوز حد البحث. يرجى المحاولة مرة أخرى بعد دقيقة واحدة.');
      return;
    }

    // Security: Validate and sanitize input
    const sanitizedQuery = validateAndSanitizeInput(searchQuery);
    
    if (!sanitizedQuery) {
      alert('يرجى إدخال نص بحث صحيح');
      return;
    }

    if (sanitizedQuery.length < 2) {
      alert('يرجى إدخال نص بحث أطول من حرفين');
      return;
    }

    // Increment search attempts
    searchAttempts.current++;
    
    try {
      // Security: Use encodeURIComponent for URL safety
      const searchUrl = `/travels-programs?type=programs&title=${encodeURIComponent(sanitizedQuery)}`;
      router.push(searchUrl);
      setSearchDrop(false);
      setSearchQuery("");
    } catch (error) {
      console.error('Search navigation error:', error);
      alert('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleSearchInputChange = (e) => {
    // Security: Validate input in real-time
    const value = e.target.value;
    const sanitizedValue = validateAndSanitizeInput(value);
    setSearchQuery(sanitizedValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
    // Security: Prevent potentially dangerous key combinations
    if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
      e.preventDefault();
      // Allow paste but sanitize it
      navigator.clipboard.readText().then(text => {
        const sanitizedText = validateAndSanitizeInput(text);
        setSearchQuery(prev => (prev + sanitizedText).slice(0, 100));
      }).catch(() => {
        // Clipboard access failed, ignore
      });
    }
  };

  const slideDownVariants = {
    hidden: { 
      opacity: 0, 
      y: -20,
      scale: 0.95 
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      scale: 0.98,
      transition: { 
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <div 
    className={`z-50 transition-all duration-500 ${
      isTripDetailPage ? '' : 'sticky top-0'
    } ${
      scrolled
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-white/20'
        : 'bg-white border-b border-[#E9EAEC]'
    }`}
    >
      <div className="wrapper">
        <nav className="flex justify-between items-center py-3 lg:py-4 gap-4">
          <Logo />
          
          {/* Desktop Menu */}
          <div ref={dropdownRef}>
            <Menu
              setShowDropdown={setShowDropdown}
              handleShowDropdown={handleShowDropdown}
              showDropdown={showDropdown}
            />
          </div>
          
          {/* Search and Contact */}
          {!hideSearchBar && <SearchAndContact />}
          
          {/* Desktop CTA Button */}
          <div className="hidden md:flex">
            <Link href="/">
              <motion.button 
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(240, 134, 49, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden group outline-none text-sm font-semibold text-orange py-3 px-6 border-2 border-orange rounded-xl hover:text-white transition-all duration-300 ease-out"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-orange to-orange-600 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out"></span>
                <span className="relative z-10">تواصل معنا</span>
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="md:hidden flex gap-3">
            {!hideSearchBar && (
              <div ref={searchRef}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleSearch}
                  className="outline-none flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <AnimatePresence mode="wait">
                    {searchDrop ? (
                      <motion.div
                        key="close-search"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 180 }}
                        exit={{ rotate: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Image
                          src="/icons/navbar/Small/Icon.jpg"
                          alt="Close search"
                          height={24}
                          width={24}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="open-search"
                        initial={{ rotate: 180 }}
                        animate={{ rotate: 0 }}
                        exit={{ rotate: 180 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Image 
                          src="/icons/search.svg" 
                          alt="Search" 
                          height={24} 
                          width={24} 
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            )}
            
            <div ref={menuRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMenu}
                className="outline-none flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <AnimatePresence mode="wait">
                  {menuDrop ? (
                    <motion.div
                      key="close-menu"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 180 }}
                      exit={{ rotate: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Image
                        src="/icons/navbar/Small/Icon.jpg"
                        alt="Close menu"
                        height={24}
                        width={24}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="open-menu"
                      initial={{ rotate: 180 }}
                      animate={{ rotate: 0 }}
                      exit={{ rotate: 180 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Image 
                        src="/icons/menu.svg" 
                        alt="Menu" 
                        height={24} 
                        width={24} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {menuDrop && (
            <motion.div
              ref={menuRef}
              variants={slideDownVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="md:hidden mb-4"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-4">
                <Link href="/">
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-gray-700 text-sm font-medium">الرئيسية</span>
                  </motion.div>
                </Link>

                <Link href="/travels-programs">
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-gray-700 text-sm font-medium">البرامج السياحية</span>
                    <span className="text-orange border border-orange py-1 px-2 rounded-md text-xs font-semibold bg-orange/10">
                      جديد
                    </span>
                  </motion.div>
                </Link>

                <Link href="/travels-dailyTrips">
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-gray-700 text-sm font-medium">الرحلات اليومية</span>
                  </motion.div>
                </Link>
                
                <Link href="/about-us">
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-gray-700 text-sm font-medium">من نحن</span>
                  </motion.div>
                </Link>
                
                <Link href="/" className="block">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-orange to-orange-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    تواصل معنا
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Search Dropdown */}
        <AnimatePresence>
          {searchDrop && !hideSearchBar && (
            <motion.div
              ref={searchRef}
              variants={slideDownVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="md:hidden mb-4"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleKeyPress}
                    maxLength={100}
                    autoComplete="off"
                    spellCheck="false"
                    className="w-full bg-gray-50 border-0 outline-none rounded-xl py-4 pr-6 pl-14 text-sm placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-orange/20 transition-all duration-200"
                    placeholder="إلى أين تريد أن تذهب؟"
                  />
                  <button
                    type="submit"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Image
                      src="/icons/search-white.svg"
                      alt="Search"
                      height={16}
                      width={16}
                    />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;