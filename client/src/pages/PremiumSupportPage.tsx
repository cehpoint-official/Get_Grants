import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, LoaderCircle } from "lucide-react"; 
import { useLocation } from "wouter";
import { AuthModal } from "../components/AuthModal";
import { useAuth } from "@/hooks/use-auth";
import { Footer } from "@/components/footer";
import Faq from "@/components/Faq";
import accessIcon from "@/assets/logos/access.png";
import alertIcon from "@/assets/logos/alert.png";
import priorityIcon from "@/assets/logos/priority.png";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"; 

interface Plan {
    name: string;
    price: number;
    duration: string;
}

const PremiumInquiryModal = ({
    isOpen,
    onClose,
    plan,
    onSubmit,
    isProcessing,
}: {
    isOpen: boolean;
    onClose: () => void;
    plan: Plan | null;
    onSubmit: (details: { name: string; email: string; phone: string }) => void;
    isProcessing: boolean; 
}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            setName(user.fullName || "");
            setEmail(user.email || "");
            setPhone(user.phone || "");
        }
    }, [user, isOpen]);

    if (!plan) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !phone) {
            setError("Please fill all fields.");
            return;
        }
        onSubmit({ name, email, phone });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] bg-white rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">Confirm Your Plan: {plan.name}</DialogTitle>
                    <DialogDescription>
                        Please confirm your details below to proceed.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">Phone</Label>
                            <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">Amount</Label>
                            <Input id="amount" value={`₹${plan.price}`} readOnly className="col-span-3 bg-gray-100 font-bold" />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
                    <DialogFooter>
                        <Button type="submit" className="w-full bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 text-white font-semibold py-3" disabled={isProcessing}>
                            {isProcessing ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait...
                                </>
                            ) : (
                                "Proceed to Pay"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default function PremiumSupportPage() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [hasMeetingPlan, setHasMeetingPlan] = useState(false);

    const { user } = useAuth();
    const { toast } = useToast();
    const [, navigate] = useLocation();

    const pricingSectionRef = useRef<HTMLElement>(null);

    const handlePlanClick = (plan: Plan) => {
        if (user) {
            if (plan.price === 3999 && hasMeetingPlan) {
                toast({ title: "Opening Scheduler", description: "Redirecting you to schedule your meeting." });
                const zcalLink = "https://calendly.com/your-calendly-link"; // Default calendly link
                window.open(zcalLink, '_blank');
                return;
            }
            setSelectedPlan(plan);
            setIsEnquiryModalOpen(true);
        } else {
            setAuthInitialMode('signup');
            setIsAuthModalOpen(true);
        }
    };

    const handleInquirySubmit = async (details: { name: string; email: string; phone: string}) => {
        if (!selectedPlan || !user) return;

        setIsProcessingPayment(true);

        try {
            // Create order using HTTP request instead of Firebase callable
            const createOrderResponse = await fetch('https://us-central1-grant-e982c.cloudfunctions.net/createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: selectedPlan.price })
            });

            if (!createOrderResponse.ok) {
                throw new Error('Failed to create order');
            }

            const { orderId } = await createOrderResponse.json();

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
                amount: selectedPlan.price * 100,
                currency: "INR",
                name: "Get Grants",
                description: `Subscription: ${selectedPlan.name}`,
                order_id: orderId,
                handler: async (response: any) => {
                    setIsProcessingPayment(true);
                    try {
                        // Verify payment using HTTP request
                        const verifyResponse = await fetch('https://us-central1-grant-e982c.cloudfunctions.net/verifyPayment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                plan: selectedPlan,
                                userId: user.uid
                            })
                        });

                        if (!verifyResponse.ok) {
                            throw new Error('Payment verification failed');
                        }

                        const verifyResult = await verifyResponse.json();

                        toast({
                            title: "✅ Payment Successful!",
                            description: "Your premium subscription is now active.",
                            className: "bg-green-500 text-white",
                        });

                        setIsEnquiryModalOpen(false);
                        if (selectedPlan.price === 3999) {
                            setHasMeetingPlan(true);
                            const zcalLink = "https://calendly.com/your-calendly-link"; // Default calendly link
                            window.open(zcalLink, '_blank');
                        } else {
                            try { localStorage.setItem('askNotify', '1'); } catch {}
                            navigate("/dashboard");
                        }

                    } catch (error: any) {
                        toast({
                            title: "❌ Verification Failed",
                            description: "Payment was successful but verification failed. Please contact support.",
                            variant: "destructive",
                        });
                    } finally {
                        setIsProcessingPayment(false);
                    }
                },
                prefill: {
                    name: details.name,
                    email: details.email,
                    contact: details.phone,
                },
                theme: {
                    color: "#8A51CE",
                },
                modal: {
                    ondismiss: function() {
                        setIsProcessingPayment(false);
                    }
                }
            };

            // Check if Razorpay is loaded
            if (typeof (window as any).Razorpay === 'undefined') {
                throw new Error('Razorpay is not loaded. Please refresh the page and try again.');
            }

            const rzp = new (window as any).Razorpay(options);
            
           
            rzp.on('payment.failed', function (response: any) {
                console.error('Payment failed:', response.error);
                toast({
                    title: "❌ Payment Failed",
                    description: response.error.description || "Payment could not be completed.",
                    variant: "destructive",
                });
                setIsProcessingPayment(false);
            });

            rzp.open();

        } catch (error: any) {
             console.error("Payment process failed:", error);
             toast({
                 title: "Payment Failed",
                 description: error.message || "An error occurred during payment.",
                 variant: "destructive",
             });
             setIsProcessingPayment(false);
        }
    };

    const handleConnectClick = () => {
        navigate("/contact");
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 0);
    };
    
    const handleJoinUsClick = () => {
        pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const plans: Plan[] = [
        { name: "1-Month Access", price: 399, duration: "1-Month" },
        { name: "3-Month Access", price: 999, duration: "3-Month" },
        { name: "Custom Plan & Meeting", price: 3999, duration: "Custom Plan" }
    ];

    return (
        <div id="premium-support" className="bg-white" >
            
            <section className="bg-[#FAF5FF] pt-10 pb-20 relative z-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#30343B] mb-4">
                            Unlock All Features
                        </h2>
                        <p className="text-lg text-[#565F6C] max-w-3xl mx-auto">
                            Experience the complete power of our platform with nothing held back.
                        </p>
                    </div>
                </div>
            </section>

            <section id="pricing" ref={pricingSectionRef}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-stretch">
                        
                        <div className="group bg-white rounded-2xl p-4 text-center shadow-lg border w-full transition-all duration-300 ease-in-out hover:scale-105">
                            <div className="mb-4">
                                <div className="inline-flex items-center justify-center bg-[#F3F4F6] text-[#4B5563] px-3 py-1 rounded-full text-xs font-medium mb-3">1-Month</div>
                                <div className="mb-2 flex items-baseline justify-center">
                                    <span className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Inter', fontWeight: 700 }}>₹390</span>
                                </div>
                                <p className="text-[#565F6C] h-12 text-xs leading-4">Explore all our features for one month and find the right funding for your startup</p>
                            </div>
                            <ul className="text-left space-y-2 mb-4">
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Unlimited grant access</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Basic search functionality</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Email notifications for new grants</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Access to grant details</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Application deadline reminders</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Priority support</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Grant eligibility checker</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Early access to new features</span> </li>
                            </ul>
                            <Button onClick={() => handlePlanClick(plans[0])} className="w-full text-[#8541EF] group-hover:bg-[#8541EF] group-hover:text-dark-violet rounded-xl font-semibold h-8 text-sm border border-[#8541EF]" style={{backgroundColor: '#8541EF17'}}>Get started</Button>
                        </div>

                        <div className="bg-white rounded-2xl p-4 text-center shadow-lg w-full relative transition-all duration-300 ease-in-out hover:scale-110">
                            <div className="absolute top-3 right-3">
                                <span className="text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg" style={{ background: 'linear-gradient(91.15deg, #FA9025 30.26%, #FFEBE3 81.29%, #FF9B10 94.61%)' }}>Popular</span>
                            </div>
                            <div className="mb-4">
                                <div className="inline-flex items-center justify-center bg-[#E0E7FF] text-[#3730A3] px-3 py-1 rounded-full text-xs font-medium mb-3">3-Month</div>
                                <div className="mb-2 flex items-baseline justify-center">
                                    <span className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Inter', fontWeight: 700 }}>₹999</span>
                                </div>
                                <p className="text-[#565F6C] h-12 text-xs leading-4">Our most popular plan. Track grants over a three-month period and increase your chances</p>
                            </div>
                            <ul className="text-left space-y-2 mb-4">
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Unlimited grant access</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Basic search functionality</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Email notifications for new grants</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Access to grant details</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Application deadline reminders</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Priority support</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Grant eligibility checker</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Early access to new features</span> </li>
                            </ul>
                            <Button onClick={() => handlePlanClick(plans[1])} className="w-full bg-[#8541EF] hover:bg-[#7a38d9] text-white rounded-xl font-semibold h-8 text-sm">Get started</Button>
                        </div>

                        <div className="group bg-white rounded-2xl p-4 text-center shadow-lg border w-full transition-all duration-300 ease-in-out hover:scale-105">
                            <div className="mb-4">
                                <div className="inline-flex items-center justify-center bg-[#FEF3C7] text-[#92400E] px-3 py-1 rounded-full text-xs font-medium mb-3">Custom Plan</div>
                                <div className="mb-2 flex items-baseline justify-center">
                                    <span className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Inter', fontWeight: 700 }}>₹3999</span>
                                </div>
                                <p className="text-[#565F6C] h-12 text-xs leading-4">A premium, personalized service where you can schedule a meeting with our experts.</p>
                            </div>
                            <ul className="text-left space-y-2 mb-4">
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Grant applications by our experts</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Selection of the best incubators</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">WhatsApp support for quick help</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Video meeting support for guidance</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Pitch deck review and feedback</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Financial modeling assistance</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Compliance document preparation</span> </li>
                                 <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> <span className="text-gray-700 text-xs">Direct 1:1 access to grant experts</span> </li>
                            </ul>
                            <Button 
                                onClick={() => handlePlanClick(plans[2])} 
                                className="w-full text-[#8541EF] group-hover:bg-[#8541EF] group-hover:text-dark-violet rounded-xl font-semibold h-8 text-sm border border-[#8541EF]" 
                                style={{backgroundColor: '#8541EF17'}}
                            >
                                {hasMeetingPlan ? "Schedule Another Meeting" : "Schedule a Meeting"}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 ">
                <div className="max-w-7xl mx-auto px-4 bg-[#F9FAFB] sm:px-6 lg:px-8">
                    <div className="text-center py-10 mb-12">
                        <h2 className="text-4xl mb-4" style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#30343B' }}>Unlock All Features</h2>
                        <p className="text-base" style={{ fontFamily: 'Poppins', fontWeight: 400, color: '#00000094' }}>Enjoy full access to every tool and benefit without any limits.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-16 max-w-6xl mx-auto mt-20 relative">
                        <div className="bg-white p-8 rounded-[21px] text-center border relative w-[354px] h-[190px]" style={{ boxShadow: '0px 4px 22.1px 0px #8A51CE3D' }}>
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-full h-[70px] w-[70px] flex items-center justify-center" style={{ border: '1px solid #8541EF4F', boxShadow: '0px 4px 22.1px 0px #8A51CE3D' }}>
                                <img src={accessIcon} alt="Full Access" className="h-9 w-9" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Full Access</h3>
                            <p className="text-sm text-[#30343B]" style={{height: '48px', lineHeight: '20px'}}>Browse and review every grant opportunity with no restrictions.</p>
                        </div>
                        <div className="bg-white p-8 rounded-[21px] text-center border relative w-[354px] h-[190px]" style={{ boxShadow: '0px 4px 22.1px 0px #8A51CE3D' }}>
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-full h-[70px] w-[70px] flex items-center justify-center" style={{ border: '1px solid #8541EF4F', boxShadow: '0px 4px 22.1px 0px #8A51CE3D' }}>
                                <img src={alertIcon} alt="Instant Alerts" className="h-9 w-9" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Instant Alerts</h3>
                            <p className="text-sm text-[#30343B]" style={{height: '48px', lineHeight: '20px'}}>Stay updated with timely notifications for new grants that match your profile.</p>
                        </div>
                        <div className="bg-white p-8 rounded-[21px] text-center border relative w-[354px] h-[190px]" style={{ boxShadow: '0px 4px 22.1px 0px #8A51CE3D' }}>
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-full h-[70px] w-[70px] flex items-center justify-center" style={{ border: '1px solid #8541EF4F', boxShadow: '0px 4px 22.1px 0px #8A51CE3D' }}>
                                <img src={priorityIcon} alt="Priority Updates" className="h-9 w-9" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Priority Updates</h3>
                            <p className="text-sm text-[#30343B]" style={{height: '48px', lineHeight: '20px'}}>Gain early insights into fresh funding programs before others.</p>
                        </div>
                    </div>
                    <div className="text-center mt-12 translate-y-1/2">
                        <Button 
                            onClick={handleJoinUsClick}
                            className="bg-[#8A51CE] hover:bg-[#7c48b8] text-white px-8 py-3 rounded-[20px] font-semibold text-lg"
                        >
                            Join Us
                        </Button>
                    </div>
                </div>
            </section>

            <Faq />

            <section className="py-16 bg-[#F5F5F5]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Need Assistance?</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">Reach out to our team for tailored solutions and <br /> personalized support.</p>
                    <Button onClick={handleConnectClick} className="bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 text-white px-8 py-4 font-semibold text-base rounded-lg shadow-lg transition-opacity" style={{ backgroundColor: '#EB5E77' }}>Connect Us</Button>
                </div>
            </section>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode={authInitialMode} />
            <PremiumInquiryModal 
                isOpen={isEnquiryModalOpen} 
                onClose={() => setIsEnquiryModalOpen(false)} 
                plan={selectedPlan} 
                onSubmit={handleInquirySubmit}
                isProcessing={isProcessingPayment} 
            />
            
            <Footer />
        </div>
    );
}