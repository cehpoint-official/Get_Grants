import React from 'react';

export function TrustBar() {
  const grantLogos = [
    {
      name: 'NIDHI',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/DST_India_Logo.svg/320px-DST_India_Logo.svg.png',
      description: 'National Initiative for Developing and Harnessing Innovations',
      category: 'Innovation'
    },
    {
      name: 'BIRAC',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/BIRAC_Logo.png/320px-BIRAC_Logo.png',
      description: 'Biotechnology Industry Research Assistance Council',
      category: 'Biotech'
    },
    {
      name: 'Startup India',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Startup_India_logo.png/320px-Startup_India_logo.png',
      description: 'Government of India\'s flagship initiative',
      category: 'Government'
    },
    {
      name: 'SIDBI',
      url: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/SIDBI_logo.svg/320px-SIDBI_logo.svg.png',
      description: 'Small Industries Development Bank of India',
      category: 'Finance'
    },
    {
      name: 'AIM ',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/NITI_Aayog_logo.png/320px-NITI_Aayog_logo.png',
      description: 'Atal Innovation Mission',
      category: 'Innovation'
    }
  ];

  return (
    <section className="py-12" style={{
      background: 'linear-gradient(135deg, hsl(60, 30%, 95%) 0%, hsl(30, 60%, 90%) 100%)'
    }}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-violet mb-4">
            Trusted by Leading Grant Organizations
          </h2>
        </div>
        
        <div className="overflow-hidden">
          <div className="marquee__track flex items-center gap-x-16 py-4">
            {grantLogos.map((logo, idx) => (
              <div key={`${logo.name}-${idx}`} className="flex-shrink-0">
                <div className="text-center">
                  <img
                    src={logo.url}
                    alt={logo.name}
                    className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = `https://placehold.co/160x64/f0f0f0/333333?text=${logo.name.replace(/\s/g, '+')}`;
                    }}
                  />
                  <p className="mt-2 text-sm text-violet font-medium">
                    {logo.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
