import { Info, CalendarClock, UserX } from "lucide-react";

export function Features() {
  const painPoints = [
    {
      icon: Info,
      title: "Information Overload",
      description: "So many portals, yet no single place to view everything.",
    },
    {
      icon: CalendarClock,
      title: "Silent Deadlines",
      description: "Application windows pass by unnoticed, reducing your chances.",
    },
    {
      icon: UserX,
      title: "Unfit Options",
      description: "Effort spent evaluating programs ends in rejection due to strict criteria.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="inline-block bg-[#EB5E77]/10 text-[#EB5E77] font-semibold px-4 py-1.5 rounded-full text-sm mb-4">
            Pain Points
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#30343B] mb-3">
            Why is finding grants so hard?
          </h2>
          <p className="text-lg text-[#565F6C] max-w-2xl mx-auto">
            Why most startups miss out on funding opportunities
          </p>
        </div>
        
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 md:gap-x-8 max-w-sm md:max-w-5xl mx-auto">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="relative bg-white pt-16 pb-10 px-8 rounded-xl shadow-lg text-center"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#EB5E77]/10 border-2 border-[#EB5E77] rounded-full flex items-center justify-center">
                <point.icon className="h-8 w-8 text-[#EB5E77]" />
              </div>
              <h3 className="text-xl font-bold text-[#30343B] mb-3">
                {point.title}
              </h3>
              <p className="text-[#565F6C]">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}