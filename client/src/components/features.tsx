import { Database, Filter, Clock, Lightbulb } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Database,
      title: "Comprehensive Database",
      description: "80+ verified grants across all sectors and stages",
      color: "bg-white hover:bg-violet/20 shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-black/40 transform hover:-translate-y-1 hover:scale-[1.01]",
      iconColor: "text-pink",
    },
    {
      icon: Filter,
      title: "Smart Filtering",
      description: "Find relevant grants by stage, sector, and location",
      color: "bg-yellowish-white hover:bg-violet/20 shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-black/40 transform hover:-translate-y-1 hover:scale-[1.01]",
      iconColor: "text-pink",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Stay updated with latest grant announcements",
      color: "bg-yellowish-white hover:bg-violet/20 shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-black/40 transform hover:-translate-y-1 hover:scale-[1.01]",
      iconColor: "text-pink",
    },
    {
      icon: Lightbulb,
      title: "Expert Insights",
      description: "Actionable tips and guides for successful applications",
      color: "bg-yellowish-white hover:bg-violet/20 shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-black/40 transform hover:-translate-y-1 hover:scale-[1.01] ",
      iconColor: "text-pink",
    },
  ];

  return (
    <section className="py-16" style={{
      background: 'white'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-violet mb-4">
            Why Get grants
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Stay updated with latest grants and deadlines
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`text-center p-6 rounded-2xl transition-all duration-300 ${feature.color}`}
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-black/20">
                <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold text-violet mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
