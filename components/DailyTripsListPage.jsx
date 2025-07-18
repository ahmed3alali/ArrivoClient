import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, MapPin, Clock, Users, Star, Heart, Share2, Calendar, Compass, Globe, Mountain, Camera, Car, Plane, X, ChevronDown, Grid, List, SlidersHorizontal } from 'lucide-react';
import MultiDayTripCard from './MultiDayTripCard';
import { HeroSquares } from './HeroSquares';
import BreadCrumb from './BreadCrumb';
import { GET_ONE_DAY_TRIPS } from '../graphql/queries';
import OneDayTripCard from './OneDayTripCard';
import LoaderExternal from './LoadingExternal';
import { ErrorMessage } from './ErrorMessage';



const GET_TRIPS = gql`
  query GetMultiDayTrips {
    trips(lengthType: MULTI_DAY) {
      edges {
        node {
          ... on MultiDayTripNode {
            id
            title
            description
            subTypes{
            id
            type
            }
            offerType
            price
            durationHours
            cardThumbnail
            groupSize
            provinces {
              id
              name
            }
            tripType
          }
        }
      }
    }
  }
`;

const DailyTripsListPage = () => {

  // Routering and fetching data ... 


  const router = useRouter();
  const { loading, error, data } = useQuery(GET_ONE_DAY_TRIPS);
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('title');

  const [likedTrips, setLikedTrips] = useState(new Set());
  
  // Filter states - all set to neutral/disabled states
  const [durationRange, setDurationRange] = useState([null, null]); // No duration filter
  const [priceRange, setPriceRange] = useState([null, null]); // No price filter
  const [tripType, setTripType] = useState(''); // No trip type filter
  const [selectedCountry, setSelectedCountry] = useState(''); // No country filter
  const [groupSizeRange, setGroupSizeRange] = useState([null, null]); // No group size filter
  const [isInitialized, setIsInitialized] = useState(false);
  



  // Input field states - these are for UI display only
  const [daysInput, setDaysInput] = useState('');
  const [priceFromInput, setPriceFromInput] = useState('');
  const [priceToInput, setPriceToInput] = useState('');
  const [groupSizeFrom, setGroupSizeFrom] = useState('');
  const [groupSizeTo, setGroupSizeTo] = useState('');



  // Helpers
  const getDaysFromHours = useCallback((hours) => Math.ceil(hours / 24), []);




  // Collect available countries from data
  const availableCountries = useMemo(() => {
    
    //checking if there is trips ... 

    // if trips foound, an empty array is made .. 
    if (!data?.trips?.edges) return [];
    const setCountries = new Set();

    // add the countries to the array 
    data.trips.edges.forEach(({ node }) => {
      node.provinces?.forEach(({ name }) => setCountries.add(name));
    });



    return Array.from(setCountries).sort();
  }, [data]);


  // Helper function to parse group size string like "2-3" or "5"
  const parseGroupSize = useCallback((groupSizeStr) => {
    if (!groupSizeStr) return null;
    
    // Handle single number like "5"
    if (!groupSizeStr.includes('-')) {
      const num = parseInt(groupSizeStr);
      return isNaN(num) ? null : { min: num, max: num };
    }
    
    // Handle range like "2-3"
    const parts = groupSizeStr.split('-');
    if (parts.length === 2) {
      const min = parseInt(parts[0].trim());
      const max = parseInt(parts[1].trim());
      
      if (!isNaN(min) && !isNaN(max)) {
        return { min, max };
      }
    }
    
    return null;
  }, []);
  

  // Calculate filter ranges dynamically
  const filterRanges = useMemo(() => {
    if (!data?.trips?.edges) {
      return { minPrice: 0, maxPrice: 10000, minDays: 1, maxDays: 20, minGroupSize: 1, maxGroupSize: 50 };
    }
  
    const trips = data.trips.edges.map(({ node }) => node);
    const prices = trips.map(t => parseInt(t.price) || 0).filter(p => p > 0);
    const days = trips.map(t => (t.durationHours)).filter(d => d > 0);
    
    // Parse group sizes from strings like "2-3"
    const groupSizeRanges = trips
      .map(t => parseGroupSize(t.groupSize))
      .filter(Boolean);
    
    const allGroupSizes = groupSizeRanges.flatMap(range => [range.min, range.max]);
  
    return {
      minPrice: Math.min(...prices) || 0,
      maxPrice: Math.max(...prices) || 10000,
      minDays: Math.min(...days) || 1,
      maxDays: Math.max(...days) || 20,
      minGroupSize: Math.min(...allGroupSizes) || 1,
      maxGroupSize: Math.max(...allGroupSizes) || 50
    };
  }, [data, getDaysFromHours, parseGroupSize]);


  // Calculate trip type counts
  const tripTypeCounts = useMemo(() => {
    if (!data?.trips?.edges) return {};
  
    const counts = {};
    data.trips.edges.forEach(({ node }) => {
      const subType = node.subTypes?.[0]?.type; // assuming one subtype
      if (subType) {
        counts[subType] = (counts[subType] || 0) + 1;
      }
    });
  
    return counts;
  }, [data]);
  






  const filteredTrips = useMemo(() => {
    if (!data?.trips?.edges) return [];
    
    let filtered = data.trips.edges.filter(({ node }) => {
      const days = getDaysFromHours(node.durationHours);
      const price = parseInt(node.price) || 0;
      
      // Search filter
      if (searchTerm && !node.title?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Duration filter - only apply if both values are set
      if (durationRange[0] !== null && durationRange[1] !== null) {
        if (days < durationRange[0] || days > durationRange[1]) return false;
      }
      
      // Price filter - only apply if both values are set
      if (priceRange[0] !== null && priceRange[1] !== null && price > 0) {
        if (price < priceRange[0] || price > priceRange[1]) return false;
      }
      
      if (tripType) {
        const sub = node.subTypes?.[0]?.type;
        if (sub?.toUpperCase() !== tripType) return false;
      }
      
      // Updated Group size filter - only apply if both values are set
      if (groupSizeRange[0] !== null && groupSizeRange[1] !== null && node.groupSize) {
        const parsedGroupSize = parseGroupSize(node.groupSize);
        if (parsedGroupSize) {
          // Check if the trip's group size range overlaps with the filter range
          const tripMin = parsedGroupSize.min;
          const tripMax = parsedGroupSize.max;
          const filterMin = groupSizeRange[0];
          const filterMax = groupSizeRange[1];
          
          // Check for overlap: trip range overlaps with filter range
          if (tripMin < filterMin || tripMax > filterMax) {
            return false;
          }
          
        }
      }
      
      // Country filter - only apply if value is set
// Country filter - case insensitive match
if (selectedCountry && node.provinces &&
  !node.provinces.some(({ name }) => 
    name.toLowerCase() === selectedCountry.toLowerCase()
  )
) return false;

      
      return true;
    });
  
    // Sort trips
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return parseInt(a.node.price) - parseInt(b.node.price);
        case 'duration':
          return getDaysFromHours(a.node.durationHours) - getDaysFromHours(b.node.durationHours);
        case 'title':
        default:
          return a.node.title.localeCompare(b.node.title);
      }
    });
  
    return filtered;
  }, [data, searchTerm, durationRange, priceRange, tripType, selectedCountry, groupSizeRange, sortBy, getDaysFromHours, parseGroupSize]);
  

  // Reset filters
  const resetFilters = useCallback(() => {
    setDurationRange([null, null]);
    setPriceRange([null, null]);
    setTripType('');
    setSelectedCountry('');
    setGroupSizeRange([null, null]);
    setSearchTerm('');
    setSortBy('title');
    setDaysInput('');
    setPriceFromInput('');
    setPriceToInput('');
    setGroupSizeFrom('');
    setGroupSizeTo('');
    router.push('/travels-programs', undefined, { shallow: true });
  }, [router]);

  const filtersRef = useRef(null);


  // Toggle liked trips
  const toggleLike = useCallback((tripId) => {
    setLikedTrips(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tripId)) {
        newSet.delete(tripId);
      } else {
        newSet.add(tripId);
      }
      return newSet;
    });
  }, []);

  const renderArabicLabel = (type) => {
    switch (type) {
      case 'FAMILY':
        return 'رحلة عائلية';
      case 'SOLO':
        return 'رحلة خاصة';

      case 'HONEYMOON':
        return 'شهر عسل';
      default:
        return type;
    }
  };


  const renderSearchResults = (city) => {
    if (!city) return '';
  
    const normalized = city.toLowerCase();
  
    if (['istanbul', 'istambul', 'İstanbul'].includes(normalized)) {
      return 'اسطنبول';
    }
    if (['trabzon', 'طرابزون'].includes(normalized)) {
      return 'طرابزون';
    }
    
    return city;
  };
  




  

  // Handle duration input change
  const handleDurationChange = useCallback((value) => {
    setDaysInput(value);
    if (value) {
      setDurationRange([1, Number(value)]);
    } else {
      setDurationRange([null, null]);
    }
  }, []);

  // Handle price input changes
  const handlePriceFromChange = useCallback((value) => {
    setPriceFromInput(value);
    updatePriceRange(value, priceToInput);
  }, [priceToInput]);

  const handlePriceToChange = useCallback((value) => {
    setPriceToInput(value);
    updatePriceRange(priceFromInput, value);
  }, [priceFromInput]);

  const updatePriceRange = useCallback((from, to) => {
    if (from && to) {
      setPriceRange([Number(from), Number(to)]);
    } else {
      setPriceRange([null, null]);
    }
  }, []);





  // Handle group size input changes
  const handleGroupSizeFromChange = useCallback((value) => {
    setGroupSizeFrom(value);
    updateGroupSizeRange(value, groupSizeTo);
  }, [groupSizeTo]);

  const handleGroupSizeToChange = useCallback((value) => {
    setGroupSizeTo(value);
    updateGroupSizeRange(groupSizeFrom, value);
  }, [groupSizeFrom]);

  const updateGroupSizeRange = useCallback((from, to) => {
    if (from && to) {
      setGroupSizeRange([Number(from), Number(to)]);
    } else {
      setGroupSizeRange([null, null]);
    }
  }, []);

  // Sync with URL params
  useEffect(() => {
    if (!router.isReady || isInitialized) return;
    
    const { country, type, title, search, minPersons, maxPersons } = router.query;
    
    if (typeof country === 'string') {
      setSelectedCountry(country);
    }
    
    if (typeof type === 'string') {
      if (type.toLowerCase() === 'solo') setTripType('SOLO');
      else if (type.toLowerCase() === 'honeymoon') setTripType('HONEYMOON');
      else if (type.toLowerCase() === 'family') setTripType('FAMILY');
      
    }
    
    if (typeof search === 'string') {
      setSearchTerm(search);
    } else if (typeof title === 'string') {
      setSearchTerm(title);
    }
    if (minPersons && !isNaN(Number(minPersons))) {
      setGroupSizeFrom(minPersons);
    }
    if (maxPersons && !isNaN(Number(maxPersons))) {
      setGroupSizeTo(maxPersons);
    }

    
    if (minPersons && maxPersons && !isNaN(Number(minPersons)) && !isNaN(Number(maxPersons))) {
      setGroupSizeRange([Number(minPersons), Number(maxPersons)]);
    }


    
    setIsInitialized(true);
  }, [router.isReady, router.query, isInitialized]);

  if (loading) {
    return (
     <LoaderExternal/>
    );
  }

  if (error) {
    return (
 <ErrorMessage/>
    );
  }

  const breadcrumbs = [
    {name: "الصفحة الرئيسية", path: "/"},
    {
      name: " الرحلات اليومية",
      path: "/travels-dailyTrips",
    },

  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50" dir="rtl">
      {/* Hero Section */}
      <div
  className="relative bg-cover bg-center text-white overflow-hidden"
  style={{
    backgroundImage: selectedCountry || searchTerm
      ? "url('/images/programs/ArrivoSearchResults.jpg')"
      : "url('/images/programs/GalleryOzngol.jpg')",
  }}
>


  <div className="absolute inset-0 bg-black/20"></div>
  <div className="relative max-w-7xl mx-auto px-4  py-16 md:py-36">
    <div className="text-center">
    <h1 className="text-4xl md:text-6xl font-bold mb-6">
  {selectedCountry
    ? renderSearchResults(selectedCountry)
    : searchTerm
    ? renderSearchResults(searchTerm)
    : 'الرحلات اليومية'}
</h1>

      <p className="text-xs md:text-sm mb-8 opacity-90">
      أفضل الأماكن السياحية في تركيا الشمالية ضمن برامج سياحية كاملة.
      </p>

      {!selectedCountry && !searchTerm }
    </div>
  </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="md:hidden lg:hidden xl:hidden bread mb-4 ml-auto text-xs">
              <BreadCrumb breadcrumbs={breadcrumbs} />
              </div>
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
 
          <div className="flex md:hidden  md:items-center  gap-4 ml-auto">
         
            <button
            onClick={() => {
              setShowFilters(prev => {
                const newVal = !prev;
                if (!prev) {
                  // Scroll after the state update (delay needed)
                  setTimeout(() => {
                    filtersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }
                return newVal;
              });
            }}
            
              className={` md:hidden lg:hidden xl:hidden flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                showFilters ? 'bg-orange text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              } shadow-md`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              الفلاتر
            </button>
            
      
          </div>
          
    
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8"   ref={filtersRef}>
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className=" p-6 sticky top-4">
              <div className=" bread mb-4">
              <BreadCrumb breadcrumbs={breadcrumbs} />
              </div>
           
              <div className="flex justify-between items-center mb-6">
             
                <h2 className="text-xl font-bold text-gray-800">بحث متقدم</h2>
                <button
                  onClick={resetFilters}
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  إعادة تعيين
                </button>
              </div>

              <div className="space-y-8">
                {/* Duration Filter */}
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-4">
                    مدة الرحلة
                  </label>
                  
                  {/* Duration Range Slider */}
                  <div className="relative mb-6">
  <div className="flex justify-between text-sm text-gray-600 mb-2">
    <span>ساعة واحدة</span>
    <span>20 ساعة</span>
  </div>
  <div className="relative" dir="rtl">
    <input
      type="range"
      min="1"
      max="20"
      value={daysInput || 20}
      onChange={(e) => handleDurationChange(e.target.value)}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
      style={{
        background: daysInput
          ? `linear-gradient(to left, #f97316 0%, #f97316 ${((daysInput - 1) / 19) * 100}%, #e5e7eb ${((daysInput - 1) / 19) * 100}%, #e5e7eb 100%)`
          : '#e5e7eb',
      }}
    />
  </div>
</div>


                  {/* Days Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      عدد الساعات
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={daysInput}
                        onChange={(e) => handleDurationChange(e.target.value)}
                        placeholder="اختر عدد الساعات"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-right text-xs"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trip Type Filter */}

<div>
  <label className="block text-base font-semibold text-gray-700 mb-4">
    نوع الرحلة
  </label>
  <div className="space-y-3">
    {/* "All Trips" option */}
    <label className="flex items-center justify-between cursor-pointer group">
      <div className="flex items-center gap-3">
        <input
          type="radio"
          name="tripType"
          value=""
          checked={tripType === ''}
          onChange={(e) => setTripType(e.target.value)}
          className="form-radio text-orange-600"
        />
        <span className="text-sm">جميع الرحلات</span>
      </div>
      <span className="text-sm text-gray-500">{data?.trips?.edges.length || 0}</span>
    </label>

    {/* Dynamically render the subTypes */}
    {Object.entries(tripTypeCounts).map(([type, count]) => (
      <label key={type} className="flex items-center justify-between cursor-pointer group">
        <div className="flex items-center gap-3">
          <input
            type="radio"
            name="tripType"
            value={type}
            checked={tripType === type}
            onChange={(e) => setTripType(e.target.value)}
            className="form-radio text-orange-600"
          />
          <span className="text-sm">{renderArabicLabel(type)}</span>
        </div>
        <span className="text-sm text-gray-500">{count}</span>
      </label>
    ))}
  </div>
</div>

                {/* Price Filter */}
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-4">
                    سعر الرحلة
                  </label>
                  
                  {/* Price Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="block  font-medium text-gray-600 mb-2 text-xs">
                        يبدأ من
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={filterRanges.minPrice}
                          max={filterRanges.maxPrice}
                          value={priceFromInput}
                          onChange={(e) => handlePriceFromChange(e.target.value)}
                          placeholder="  "
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-right text-xs pr-8"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <span className="text-gray-500">$</span>
                          <ChevronDown className="w-4 h-4 text-gray-400 inline ml-1" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        إلى
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={filterRanges.minPrice}
                          max={filterRanges.maxPrice}
                          value={priceToInput}
                          onChange={(e) => handlePriceToChange(e.target.value)}
                          placeholder="  "
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-right pr-8 text-xs"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <span className="text-gray-500">$</span>
                          <ChevronDown className="w-4 h-4 text-gray-400 inline ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trip Size */}
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-4">
                    حجم الرحلة
                  </label>
                  
                  {/* Group Size Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        يبدأ من
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={filterRanges.minGroupSize}
                          max={filterRanges.maxGroupSize}
                          value={groupSizeFrom}
                          onChange={(e) => handleGroupSizeFromChange(e.target.value)}
                          placeholder="  "
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-right text-xs  pr-8"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <span className="text-gray-500 text-xs">شخص</span>
                          <ChevronDown className="w-4 h-4 text-gray-400 inline ml-1" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        إلى
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={filterRanges.minGroupSize}
                          max={filterRanges.maxGroupSize}
                          value={groupSizeTo}
                          onChange={(e) => handleGroupSizeToChange(e.target.value)}
                          placeholder="  "
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-right text-xs pr-8"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <span className="text-gray-500 text-xs">شخص</span>
                          <ChevronDown className="w-4 h-4 text-gray-400 inline ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

            
              </div>
            </div>
          </div>

          {/* Trips Grid/List */}
          <div className="lg:col-span-3">
            {filteredTrips.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">لا توجد برامج مطابقة</h3>
                <p className="text-gray-600 mb-6">لا توجد برامج سياحية تطابق المعايير المحددة</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  إعادة تعيين الفلاتر
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
              {filteredTrips.map(({ node }) => (
                <div key={node.id} className=" w-full md:w-[320px] lg:w-[320px] ">
                  <OneDayTripCard trip={node} isSingle={false} />
                </div>
              ))}
            </div>
            
            
            
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        
        input[type="range"]::-webkit-slider-track {
          background: transparent;
          height: 8px;
          border-radius: 4px;
        }
        
        input[type="range"]::-moz-range-track {
          background: transparent;
          height: 8px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default DailyTripsListPage;