import React from 'react';
import iitd from '../assets/logos/IIT-D.png.png';
import nit from '../assets/logos/NIT.png.png';
import nsrcel from '../assets/logos/NSRCEL.png.png';
import nuc from '../assets/logos/NUC.png.png';
import startupIndia from '../assets/logos/startup-india.png.png';
import startGujarat from '../assets/logos/start-gujarat.png.png';

export default function App() {
  return <TrustBar />;
}

export function TrustBar() {
  const grantLogos  = [
    { name: 'IIT-D', url: iitd },
    { name: 'NIT-A', url: nit },
    { name: 'NSRCEL', url: nsrcel },
    { name: 'NCU', url: nuc },
    { name: 'Startup India', url: startupIndia },
    { name: 'Start Gujarat', url: startGujarat },
  ];

  const duplicatedLogos = [...grantLogos, ...grantLogos];

  return (
    <>
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 45s linear infinite;
          }
          .marquee-container:hover .animate-marquee {
            animation-play-state: paused;
          }
        `}
      </style>

      <section className="py-12" style={{ background: 'white' }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-violet mb-4">
              Trusted by Leading Grant Organizations
            </h2>
          </div>
          
          <div className="relative w-full overflow-hidden marquee-container">
            <div className="flex items-center animate-marquee">
              {duplicatedLogos.map((logo, idx) => (
                <div key={`${logo.name}-${idx}`} className="flex-shrink-0 mx-8">
                  <img
                    src={logo.url}
                    alt={`${logo.name} logo`}
                    className="h-30 object-contain transition-all duration-400"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = `https://placehold.co/160x64/f0f0f0/333333?text=${logo.name.replace(/\s/g, '+')}`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
