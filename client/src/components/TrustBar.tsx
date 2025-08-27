import React from 'react';
import l1 from '../assets/logos/logo1.png';
import l2 from '../assets/logos/logo2.png';
import l3 from '../assets/logos/logo3.png';
import l4 from '../assets/logos/logo4.png';
import l5 from '../assets/logos/logo5.png';
import l6 from '../assets/logos/logo6.png';

export default function App() {
  return <TrustBar />;
}

export function TrustBar() {
  const grantLogos = [
    { name: 'IIT-D', url: l1 },
    { name: 'NIT-A', url: l2 },
    { name: 'NSRCEL', url: l3 },
    { name: 'NCU', url: l4 },
    { name: 'Startup India', url: l5 },
    { name: 'Start Gujarat', url: l6 },
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
            animation: marquee 15s linear infinite;
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
            <div className="flex items-center animate-marquee gap-16">
              {duplicatedLogos.map((logo, idx) => (
                <div key={`${logo.name}-${idx}`} className="flex-shrink-0 w-44">
                  <img
                    src={logo.url}
                    alt={`${logo.name} logo`}
                    className="h-16 w-full object-contain transition-all duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = `https://placehold.co/176x64/f0f0f0/333333?text=${logo.name.replace(/\s/g, '+')}`;
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
