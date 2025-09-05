import {
    ShieldCheck,
    CalendarClock,
    ClipboardList,
    BarChartHorizontalBig,
    CheckCircle,
  } from "lucide-react";
  
  export function SmartTools() {
    const tools = [
      {
        icon: ShieldCheck,
        iconBg: "bg-[#EAFBF1]",
        iconColor: "text-[#28D36F]",
        title: "Trusted Opportunities",
        description: "Only accurate, relevant, and up-to-date grants in one place.",
        benefits: [
          "Every grant is manually reviewed by experts.",
          "Continuously refreshed listings with the latest opportunities.",
        ],
      },
      {
        icon: CalendarClock,
        iconBg: "bg-[#FFE1E0]",
        iconColor: "text-[#EB5E77]",
        title: "Never Miss a Deadline",
        description: "Stay ahead with reminders and alerts for every application window.",
        benefits: [
          "Real-time notifications keep you updated instantly.",
          "Custom calendar sync makes deadline management effortless.",
        ],
      },
      {
        icon: ClipboardList,
        iconBg: "bg-[#E0EFFF]",
        iconColor: "text-[#3B82F6]",
        title: "Simplified Application Process",
        description: "Step-by-step guidance to craft winning applications.",
        benefits: [
          "Clear eligibility checklists save time before applying.",
          "Direct submission links for a faster application process.",
        ],
      },
      {
        icon: BarChartHorizontalBig,
        iconBg: "bg-[#FFF8E1]",
        iconColor: "text-[#F59E0B]",
        title: "Smarter Funding Insights",
        description: "Leverage data to make confident funding decisions.",
        benefits: [
          "Industry-specific reports for targeted opportunities.",
          "Success benchmarks from startups who secured funds.",
        ],
      },
    ];
  
    return (
      
      <section className="py-20" style={{ background: 'linear-gradient(to top, #E7D3FF 0%, #F5F0FF 60%, #FFFFFF 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="grid lg:grid-cols-12 gap-x-8 gap-y-6 items-center mb-16">
            <div className="lg:col-span-6">
              <div className="inline-block bg-[#E7D3FF] text-[#8B3AEC] font-semibold px-4 py-1.5 rounded-full text-sm mb-4">
                Solution
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#111827] leading-tight">
                Smart Tools to Unlock Startup Funding
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-[#565F6C] text-lg leading-relaxed">
                Our platform equips you with everything you need to discover, track, and win startup grants — all in one place.
              </p>
            </div>
          </div>
          
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tools.map((tool) => (
              <div
                key={tool.title}
                className="bg-white p-6  shadow-[0_10px_35px_-15px_rgba(139,58,236,0.12)]"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${tool.iconBg}`}>
                  <tool.icon className={`h-6 w-6 ${tool.iconColor}`} strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-bold text-[#30343B] mb-2">
                  {tool.title}
                </h3>
                <p className="text-sm text-[#565F6C] mb-4">
                  {tool.description}
                </p>
                <hr className="my-4 border-gray-200" />
                <ul className="space-y-3 text-sm">
                  {tool.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2.5 mt-0.5 flex-shrink-0 fill-[#28D36F] text-white" strokeWidth={1}/>
                      <span className="text-[#565F6C]">{benefit}</span>
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