const BackgroundSVG = () => (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="5" className="text-gray-200" fill="currentColor">
            <animate attributeName="r" values="5;10;5" dur="4s" repeatCount="indefinite" />
          </circle>
          <line x1="0" y1="0" x2="40" y2="40" stroke="currentColor" strokeWidth="2" className="text-gray-300">
            <animate attributeName="stroke-width" values="2;4;2" dur="4s" repeatCount="indefinite" />
          </line>
          <line x1="40" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="2" className="text-gray-300">
            <animate attributeName="stroke-width" values="2;4;2" dur="4s" repeatCount="indefinite" />
          </line>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pattern)" />
    </svg>
  );
  
  export default BackgroundSVG;
  