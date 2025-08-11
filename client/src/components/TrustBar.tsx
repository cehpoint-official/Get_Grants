import { Building2, Lightbulb, Rocket, Network, IndianRupee } from 'lucide-react';

export function TrustBar() {
  const partners = [
    { name: 'Govt. Schemes', icon: <Building2 className="h-10 w-10 text-primary-blue" /> },
    { name: 'Startup India', icon: <Rocket className="h-10 w-10 text-primary-blue" /> },
    { name: 'Incubators', icon: <Network className="h-10 w-10 text-primary-blue" /> },
    { name: 'Innovation Mission', icon: <Lightbulb className="h-10 w-10 text-primary-blue" /> },
    { name: 'Funding Agencies', icon: <IndianRupee className="h-10 w-10 text-primary-blue" /> },
  ];

  return (
    <section className="py-16 md:py-20 bg-light-blue">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-12">
          Trusted by India's most innovative schemes & incubators
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {partners.map((partner) => (
            <div 
              key={partner.name} 
              className="bg-white p-6 rounded-xl text-center cursor-pointer
                         hover:-translate-y-2 hover:shadow-xl transition-all duration-300 ease-in-out"
            >
              <div className="flex justify-center mb-4">
                {partner.icon}
              </div>
              <p className="font-semibold text-gray-700">{partner.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
