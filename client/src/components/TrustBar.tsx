import React from 'react';

export default function App() {
  return <TrustBar />;
}

export function TrustBar() {
  const grantLogos = [
    {
      name: 'NIDHI',
      url: 'https://startupgrants.in/assets/img/grant/nidhi.png',
    },
    {
      name: 'BIRAC',
      url: 'https://startupgrants.in/assets/img/grant/birac.png',
    },
    {
      name: 'Startup India',
      url: 'https://startupgrants.in/assets/img/grant/startup-india.png',
    },
    {
      name: 'SIDBI',
      url: 'https://startupgrants.in/assets/img/grant/sidbi.png',
    },
    {
      name: 'AIM',
      url: 'https://startupgrants.in/assets/img/grant/aim.png',
    },
    {
        name: 'MeitY Startup Hub',
        url: 'https://startupgrants.in/assets/img/grant/meity.png',
    },
    {
        name: 'Startup Uttarakhand',
        url: 'https://startupgrants.in/assets/img/grant/uttarakhand.png',
    },
    {
        name: 'i-STAC',
        url: 'https://startupgrants.in/assets/img/grant/karnataka.png',
    },
    {
        name: 'StartInUP',
        url: 'https://startupgrants.in/assets/img/grant/up.png',
    }
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
                    className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
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
