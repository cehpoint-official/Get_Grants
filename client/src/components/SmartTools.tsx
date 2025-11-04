import {
  ShieldCheck,
  CalendarClock,
  ClipboardList,
  BarChartHorizontalBig,
  Check,
} from "lucide-react";

export function SmartTools() {
  const tools = [
    {
      icon: ShieldCheck,
      iconColor: "text-green-500",
      title: "Trusted Opportunities",
      description: "Only accurate, relevant, and up-to-date grants in one place.",
      benefits: [
        "Every grant is manually reviewed by experts.",
        "Continuously refreshed listings with the latest opportunities.",
      ],
    },
    {
      icon: CalendarClock,
      iconColor: "text-red-500",
      title: "Never Miss a Deadline",
      description: "Stay ahead with reminders and alerts for every application window.",
      benefits: [
        "Real-time notifications keep you updated instantly.",
        "Custom calendar sync makes deadline management effortless.",
      ],
    },
    {
      icon: ClipboardList,
      iconColor: "text-blue-500",
      title: "Simplified Application Process",
      description: "Step-by-step guidance to craft winning applications.",
      benefits: [
        "Clear eligibility checklists save time before applying.",
        "Direct submission links for a faster application process.",
      ],
    },
    {
      icon: BarChartHorizontalBig,
      iconColor: "text-amber-500",
      title: "Smarter Funding Insights",
      description: "Leverage data to make confident funding decisions.",
      benefits: [
        "Industry-specific reports for targeted opportunities.",
        "Success benchmarks from startups who secured funds.",
      ],
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
          <div className="text-center lg:text-left">
            <div className="inline-block bg-[#F3E8FF] text-[#6D28D9] font-semibold px-4 py-1.5 rounded-full text-sm mb-4">
              Solution
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
              Smart Tools to Unlock Startup Funding
            </h2>
          </div>
          <div className="text-center lg:text-left">
            <p className="text-gray-600 text-lg leading-relaxed">
              Our platform equips you with everything you need to discover, track, and win startup grants — all in one place.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col" 
            >
              <div className="mb-5">
                <tool.icon className={`h-8 w-8 ${tool.iconColor}`} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {tool.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 flex-grow">
                {tool.description}
              </p>
              <ul className="space-y-3 text-sm">
                {tool.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-green-100 mr-3 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-green-600" strokeWidth={3} />
                    </div>
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}