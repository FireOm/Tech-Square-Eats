'use client';


export default function AtlantaHeader() {

  return (
    <div className="relative text-center">

      <div className="flex flex-col items-center justify-center mb-0 sm:mb-0 relative z-10 space-y-2">
        {/* Logo Image */}
        <div className="relative">
          <img 
            src="/4.png" 
            alt="EatOut Logo" 
            className="w-100 h-20 object-cover object-center"
          />
        </div>
        
        {/* Tagline */}
        <div className="text-center">
          {/* <p className="text-sm sm:text-base text-gray-600 font-medium">
            Your digital menu companion
          </p> */}
        </div>
      </div>

      
    </div>
  );
}
