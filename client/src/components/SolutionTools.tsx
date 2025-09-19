import { Button } from "@/components/ui/button";
import { User, Puzzle, ClipboardCheck, Clock } from "lucide-react";
import { navigate } from "wouter/use-browser-location";


type ProcessCardProps = {
  step: string;
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
};

function ProcessCard({ step, title, description, Icon }: ProcessCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-center ">
      <div className="mb-4">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#FFE1E0]">
          <Icon className="h-6 w-6 text-[#EB5E77] " />
        </div>
      </div>
      <p className="text-xs font-semibold text-[#EB5E77] mb-1 uppercase">{step}</p>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

export default function GrantJourneySection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#FFE1E0] text-[#EB5E77] px-3 py-1 rounded-full text-sm font-semibold mb-4">
            Easy Process
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] leading-tight">
            Your Grant Journey, Simplified
          </h2>
        </div>

        {/* Process Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <ProcessCard
            step="Step - 1"
            title="Create Your Profile"
            description="Fill in your startup details once and unlock a world of tailored grants."
            Icon={User}
          />
          <ProcessCard
            step="Step - 2"
            title="Get Matched with Grants"
            description="Discover opportunities that align with your industry, stage, and funding needs."
            Icon={Puzzle}
          />
          <ProcessCard
            step="Step - 3"
            title="Track & Apply Easily"
            description="Save grants, track progress, and apply with confidence."
            Icon={ClipboardCheck}
          />
          <ProcessCard
            step="Step - 4"
            title="Never Miss a Deadline"
            description="Receive instant reminders and updates so you're always on time."
            Icon={Clock}
          />
        </div>

        {/* Call to Action Button */}
        <div className="text-center">
          <Button 
          onClick={() => { navigate('/grants'); setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 0); }}
          className="bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 text-white px-4 py-4 font-semibold text-base rounded-lg shadow-lg transition-opacity">
            Find Grants Now
          </Button>
        </div>
        
      </div>
    </section>
  );
}