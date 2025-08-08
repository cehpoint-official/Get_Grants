import { Database, Filter, Clock, Lightbulb } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Database,
      title: "Comprehensive Database",
      description: "80+ verified grants across all sectors and stages",
      color: "bg-blue-50 hover:bg-blue-100",
      iconColor: "text-primary-blue",
    },
    {
      icon: Filter,
      title: "Smart Filtering",
      description: "Find relevant grants by stage, sector, and location",
      color: "bg-green-50 hover:bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Stay updated with latest grant announcements",
      color: "bg-orange-50 hover:bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      icon: Lightbulb,
      title: "Expert Insights",
      description: "Actionable tips and guides for successful applications",
      color: "bg-purple-50 hover:bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Get Grants?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your funding search with our comprehensive database and
            expert insights
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`text-center p-6 rounded-xl transition-colors ${feature.color}`}
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
