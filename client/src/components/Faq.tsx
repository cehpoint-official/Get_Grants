import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "./AuthModal";
import { ChatInterface } from "./ChatInterface";
import { fetchUserPremiumInquiriesByUserIdOrEmail } from "@/services/premiumSupport";
import { PremiumInquiry } from "@shared/schema";

export default function Faq() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const [latestInquiry, setLatestInquiry] = useState<PremiumInquiry | null>(null);

  useEffect(() => {
    const fetchLatestInquiry = async () => {
      if (user && isChatModalOpen) {
        const inquiries = await fetchUserPremiumInquiriesByUserIdOrEmail({ userId: user.uid, email: user.email });
        if (inquiries.length > 0) {
          setLatestInquiry(inquiries[0]); 
        } else {
          setLatestInquiry(null);
        }
      }
    };
    fetchLatestInquiry();
  }, [user, isChatModalOpen]);

  const faqs = [
    { question: "What kind of support can I expect?", answer: "Our premium support includes end-to-end grant application assistance, professional review of your pitch deck and compliance documents, and direct 1:1 access to our grant experts for personalized advice." },
    { question: "Who are the experts I will be consulting with?", answer: "Our experts are seasoned professionals with years of experience in the venture capital and grant funding sectors. They have a proven track record of helping startups secure funding." },
    { question: "What if I don't get the grant after using the service?", answer: "While we cannot guarantee funding, our service significantly increases your chances by ensuring your application is professional, compliant, and compelling. We focus on perfecting your submission to meet the highest standards." },
    { question: "How do I schedule my 1:1 consultation?", answer: "Once you sign up for a plan, you will receive access to a private booking calendar where you can schedule your consultation calls at a time that is convenient for you." },
    { question: "Is my data secure with your service?", answer: "Absolutely. We prioritize your data's security and confidentiality using industry-standard encryption and privacy protocols. Your information is safe with us." }
  ];

  const handleFaqToggle = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleChatClick = () => {
    if (user) {
      setIsChatModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div id="faq" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-block px-3 py-1 text-sm font-semibold rounded-2xl bg-purple-100 text-[#8541EF]">
              FAQ
            </span>
            <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-[#111827]">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-[#565F6C]">
              Simplifying everything you need here
            </p>
            <div className="mt-6 h-1 w-28 mx-auto lg:mx-0 bg-[#8541EF]" />
          </div>
          <div className="mt-10 lg:mt-0">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <button onClick={() => handleFaqToggle(index)} className="w-full flex justify-between items-center text-left p-5">
                    <span className="text-base font-medium text-[#30343B]">{faq.question}</span>
                    <Plus className={`h-5 w-5 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-45' : ''}`} style={{ color: '#30343B' }} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? "max-h-screen" : "max-h-0"}`}>
                    <div className="px-5 pb-5">
                      <p className="text-[#565F6C]">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center mt-16">
          <Button onClick={handleChatClick} className="bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 text-white px-4 py-2 font-semibold text-base rounded-lg shadow-lg transition-opacity h-auto">
            {user ? "Chat With Our Experts" : "Chat Now"}
          </Button>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      <Dialog open={isChatModalOpen} onOpenChange={setIsChatModalOpen}>
        <DialogContent className="sm:max-w-lg p-0 h-[70vh] flex flex-col">
            <DialogHeader className="p-4 border-b">
              <DialogTitle className="text-xl font-bold text-center text-[#30343B]">Conversation with Admin</DialogTitle>
            </DialogHeader>
            <ChatInterface 
              initialInquiryId={latestInquiry?.id || null}
              onChatStarted={(newId) => {
                setLatestInquiry({ id: newId, ...latestInquiry } as PremiumInquiry);
              }}
            />
        </DialogContent>
      </Dialog>
    </div>
  );
}