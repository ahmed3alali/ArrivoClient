import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

const Menu = ({ handleShowDropdown, showDropdown, setShowDropdown }) => {
  const router = useRouter();
  const isActive = path => {
    return router.pathname === path ? "text-orange" : "text-gray-700";
  };

  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
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

  const serviceItemVariants = {
    hidden: { x: -20, opacity: 0 },
    show: { 
      x: 0, 
      opacity: 1,
      transition: { 
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const services = [
    {
      icon: "/icons/services/baloon.svg",
      title: "برامج سياحية",
      description: "نقدم مغامرات ملهمة وتجارب مصممة بعناية لكل عميل، مع تخطيط متفوق وتنظيم محكم لضمان تجربة سفر لا تُنسى.",
      href: "/our-services?service=programs"
    },
    {
      icon: "/icons/services/bus.svg",
      title: "رحلات يومية",
      description: "استمتع برحلات يومية مع سائق خاص لزيارة وجهات رائعة وأماكن غير مكتشفة. مستشارون محترفون لتنظيم مسارات متناسقة.",
      href: "/our-services?service=daily-trips"
    },
    {
      icon: "/icons/services/build.svg",
      title: "حجز الإقامة",
      description: "استمتع بإقامة مثالية من خبراء يوفرون اختيارات ملائمة ومتنوعة، بأسعار تنافسية ومعرفة عميقة بأماكن الإقامة.",
      href: "/our-services?service=stay-places"
    },
    {
      icon: "/icons/services/car.svg",
      title: "تأجير السيارات",
      description: "تأجير سيارات مرن وآمن، اختيارات متنوعة، توصيل مريح، لتجربة سفر لا مثيل لها.",
      href: "/our-services?service=cars"
    }
  ];

  return (
    <div className="hidden md:flex gap-x-8 lg:gap-x-12 items-center relative">
      {/* Services Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute z-50 top-12 right-0 min-w-[900px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-8"
            style={{ 
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div className="flex gap-12">
              {/* Left Section - Promotional Content */}
              <div className="flex-1 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <h4 className="text-xl font-bold text-gray-900">عروض خارقة لاتفوتها</h4>
                    <span className="bg-gradient-to-r from-orange to-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      جديد
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    نحن هنا لتحقيق أحلامك السياحية! اختر الخدمة المفضلة من قائمتنا
                    ولنبدأ المغامرة الرائعة سويًا!
                  </p>
                </div>
                
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    width={385}
                    height={185}
                    src="/images/img.jpg"
                    alt="Travel services"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="bg-white p-3 rounded-xl shadow-md">
                    <Image
                      alt="Help"
                      src="/icons/services/Help.svg"
                      height={24}
                      width={24}
                    />
                  </div>
                  <div>
                    <h6 className="font-semibold text-gray-900 text-sm">مركز المساعدة</h6>
                    <p className="text-gray-600 text-xs">
                      تواصل معنا{" "}
                      <span className="text-orange font-medium">
                        support@arrivo-travel.com
                      </span>
                    </p>
                  </div>
                </motion.div>
              </div>
              
              {/* Right Section - Services Grid */}
              <div className="flex-1 grid grid-cols-1 gap-6">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    variants={serviceItemVariants}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      x: 5,
                      transition: { duration: 0.2 }
                    }}
                    className="group"
                  >
                    <Link href={service.href}>
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300">
                        <div className="bg-white border-2 border-gray-200 group-hover:border-orange p-3 rounded-xl transition-all duration-300 group-hover:shadow-lg">
                          <Image
                            alt={service.title}
                            src={service.icon}
                            height={24}
                            width={24}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h5 className="font-semibold text-gray-900 group-hover:text-orange transition-colors duration-200">
                              {service.title}
                            </h5>
                            <Image
                              alt="Arrow"
                              src="/icons/services/up.svg"
                              height={16}
                              width={16}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            />
                          </div>
                          <p className="text-gray-600 text-xs leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Links */}
      <Link href="/travels-programs?type=programs">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 ${isActive("/travels-programs")}`}
        >
          <span className="text-sm font-medium">البرامج السياحية</span>
          <span className="bg-orange text-white px-2 py-1 rounded-md text-xs font-semibold">
            جديد
          </span>
        </motion.div>
      </Link>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleShowDropdown}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 ${
          showDropdown ? "text-orange bg-orange/10" : "text-gray-700"
        }`}
      >
        <span className="text-sm font-medium">الخدمات</span>
        <motion.div
          animate={{ rotate: showDropdown ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Image alt="Dropdown" src="/icons/navbar/down.svg" height={16} width={16} />
        </motion.div>
      </motion.button>

      <Link href="/about-us">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 ${isActive("/about-us")}`}
        >
          <span className="text-sm font-medium">من نحن</span>
        </motion.div>
      </Link>
    </div>
  );
};

export default Menu;