import React from 'react';

const StartupGrowth = () => {
  return (
   
    <div className="bg-gray-100 flex items-center justify-center font-sans py-0 md:py-0">
      {/* Main component container */}
      <div className="flex w-full max-w-10xl shadow-lg  overflow-hidden mx-4 md:mx-1 lg:mx-2 flex-col md:flex-row">
        {/* Left Dark Section */}
        <div className="bg-[#1F2937] text-white p-8 md:p-10 flex flex-col justify-center w-full md:w-1/3">
          <span className="bg-[#8B5CF6] text-white text-xs md:text-sm font-semibold px-3 md:px-4 py-1 rounded-full self-start mb-4 md:mb-6">
            Impact
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            Startup Growth at Your Fingertips
          </h1>
        </div>
        {/* Right White Section with Stats */}
        <div className="bg-white p-6 sm:p-8 lg:flex-grow grid grid-cols-4 md:p-12 flex-grow grid grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-start md:items-center">
          {/* Stat Item 1 */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">150+</h2>
            <p className="text-gray-700 font-semibold mt-1 sm:mt-2">Active Opportunities</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Fresh grants updated every day</p>
          </div>
          {/* Stat Item 2 */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">₹15Cr+</h2>
            <p className="text-gray-700 font-semibold mt-1 sm:mt-2">Funding Pool</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Available for startups right now</p>
          </div>
          {/* Stat Item 3 */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">24/7</h2>
            <p className="text-gray-700 font-semibold mt-1 sm:mt-2">Smart Alerts</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Instant notifications on new deadlines</p>
          </div>
          {/* Stat Item 4 */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">2,500+</h2>
            <p className="text-gray-700 font-semibold mt-1 sm:mt-2">Trusted Founders</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Entrepreneurs already using our platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupGrowth;