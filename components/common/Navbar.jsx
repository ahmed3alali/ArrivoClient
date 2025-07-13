import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import SearchAndContact from "./NavbarHelpers/SearchAndContact";
import Menu from "./NavbarHelpers/Menu";
import Logo from "./NavbarHelpers/Logo";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ openModal, slideIn, closeModal }) => {
  const [searchDrop, setSearchDrop] = useState(false);
  const [menuDrop, setMenuDrop] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSearch = () => {
    setMenuDrop(false);
    setSearchDrop(!searchDrop);
  };

  const toggleMenu = () => {
    setSearchDrop(false);
    setMenuDrop(!menuDrop);
  };

  const handleShowDropdown = () => {
    setShowDropdown(!showDropdown);
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
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-white/20' 
          : 'bg-white border-b border-[#E9EAEC]'
      }`}
    >
      <div className="wrapper">
        <nav className="flex justify-between items-center py-3 lg:py-4 gap-4">
          <Logo />
          
          {/* Desktop Menu */}
          <Menu
            setShowDropdown={setShowDropdown}
            handleShowDropdown={handleShowDropdown}
            showDropdown={showDropdown}
          />
          
          {/* Search and Contact */}
          <SearchAndContact />
          
          {/* Desktop CTA Button */}
          <div className="hidden md:flex">
            <Link href="/contact-us">
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
        </nav>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {menuDrop && (
            <motion.div
              variants={slideDownVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="md:hidden mb-4"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-4">
                <Link href="/travels-programs?type=programs">
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
                
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={handleShowDropdown}
                  className="w-full text-right p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="text-gray-700 text-sm font-medium">الخدمات</span>
                </motion.button>
                
                <Link href="/about-us">
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-gray-700 text-sm font-medium">من نحن</span>
                  </motion.div>
                </Link>
                
                <Link href="/contact-us" className="block">
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
          {searchDrop && (
            <motion.div
              variants={slideDownVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="md:hidden mb-4"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-gray-50 border-0 outline-none rounded-xl py-4 pr-6 pl-14 text-sm placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-orange/20 transition-all duration-200"
                    placeholder="إلى أين تريد أن تذهب؟"
                  />
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange to-orange-600 p-3 rounded-xl shadow-lg cursor-pointer"
                  >
                    <Image
                      src="/icons/search-white.svg"
                      alt="Search"
                      height={16}
                      width={16}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;