import { useEffect, useState } from 'react';
import { Link, useRoute, Redirect, useLocation } from 'wouter';
import { doc, getDoc, Timestamp, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Grant } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Mail, Building, Award, CheckCircle, Share2, AlertTriangle, Bookmark, BookmarkCheck, Lock, LoaderCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Footer } from '@/components/footer';

// --- Premium Lock Component ---
const PremiumLock = ({ onUpgradeClick }: { onUpgradeClick: () => void }) => (
    <div className="max-w-4xl mx-auto py-12 px-4 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center flex flex-col items-center">
            <div className="bg-violet/10 p-4 rounded-full mb-6">
                <Lock className="h-10 w-10 text-violet" />
            </div>
            <h2 className="text-3xl font-bold text-violet mb-3">
                This is a Premium Grant
            </h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
                To view the full details of this grant, including eligibility and how to apply, please upgrade to our premium plan.
            </p>
            <Button onClick={onUpgradeClick} size="lg" className="bg-violet hover:bg-pink text-white">
                View Pricing Plans
            </Button>
            <Link href="/grants">
                <Button variant="link" className="mt-4 text-violet">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to All Grants
                </Button>
            </Link>
        </div>
    </div>
);


export default function GrantDetailPage() {
    const [grant, setGrant] = useState<Grant | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(false);
    const [, params] = useRoute("/grant/:id");
    const { user, loading: authLoading } = useAuth();
    const [, navigate] = useLocation();

    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user && grant && user.savedGrants?.includes(grant.id)) {
            setIsSaved(true);
        } else {
            setIsSaved(false);
        }
    }, [user, grant]);

    const handleSaveGrant = async () => {
        if (!user || !grant) return;
        setIsSaving(true);
        const userRef = doc(db, 'users', user.uid);
        try {
            if (isSaved) {
                await updateDoc(userRef, { savedGrants: arrayRemove(grant.id) });
                setIsSaved(false);
            } else {
                await updateDoc(userRef, { savedGrants: arrayUnion(grant.id) });
                setIsSaved(true);
            }
        } catch (error) {
            console.error("Error updating saved grants:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleViewPricing = () => {
        localStorage.setItem("scrollTo", "pricing");
        navigate("/");
    };

    useEffect(() => {
        const fetchAndCheckGrant = async () => {
            if (!params?.id || !user) {
                if (!authLoading) setLoading(false);
                return;
            }

            setLoading(true);
            const grantRef = doc(db, 'grants', params.id);
            const docSnap = await getDoc(grantRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as Omit<Grant, 'id'>;
                const fetchedGrant: Grant = {
                    id: docSnap.id,
                    ...data,
                    deadline: (data.deadline as unknown as Timestamp).toDate(),
                    createdAt: (data.createdAt as unknown as Timestamp).toDate(),
                    startDate: data.startDate ? (data.startDate as unknown as Timestamp).toDate() : undefined,
                };

                setGrant(fetchedGrant);

                if (fetchedGrant.isPremium && user.subscriptionStatus !== 'premium') {
                    setIsLocked(true);
                } else {
                    setIsLocked(false);
                }
            }
            setLoading(false);
        };
        
        fetchAndCheckGrant();
    }, [params?.id, user, authLoading]);

    if (loading || authLoading) {
        return <div className="flex justify-center items-center h-screen"><LoaderCircle className="w-10 h-10 animate-spin text-violet" /></div>;
    }
    
    if (!user) {
        return <Redirect to="/" />;
    }

    if (!grant && !loading) {
        return <div className="text-center p-10">Grant not found.</div>;
    }

    if (isLocked) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <PremiumLock onUpgradeClick={handleViewPricing} />
                <Footer />
            </div>
        );
    }

    return (
        grant && (
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto py-8 px-4">
                    <Link href="/grants">
                        <Button variant="ghost" className="mb-6 text-violet hover:text-pink">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to All Grants
                        </Button>
                    </Link>
                    <div className="mb-12 flex items-center justify-between rounded-lg border border-yellow-300 bg-yellow-50 p-4 shadow-md">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <AlertTriangle className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-semibold text-yellow-800">
                                    You've used all your free grant views remaining
                                </p>
                                <p className="mt-1 text-sm text-yellow-700">
                                    Subscribe to view unlimited grant details and get email alerts for new opportunities.
                                </p>
                            </div>
                        </div>
                        <Button onClick={handleViewPricing} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 text-sm font-semibold">
                            Upgrade Now
                        </Button>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                        <div className="p-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-violet/10 text-violet">{grant.category}</span>
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${grant.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>{grant.status}</span>
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900">{grant.title}</h1>
                                    <p className="text-md font-semibold text-gray-700 mt-2 flex items-center gap-2"><Building className="h-5 w-5 text-violet" />{grant.organization}</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleSaveGrant}
                                    disabled={isSaving}
                                    className="ml-4 flex-shrink-0"
                                    aria-label={isSaved ? "Unsave this grant" : "Save this grant"}
                                >
                                    {isSaved ? <BookmarkCheck className="h-5 w-5 text-violet" /> : <Bookmark className="h-5 w-5" />}
                                </Button>
                            </div>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h2 className="text-xl font-bold text-violet mb-4">Grant Overview</h2>
                                    <p className="text-gray-700 leading-relaxed">{grant.overview}</p>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Calendar className="h-5 w-5 text-violet" />Application Deadline</h3>
                                        <p className="text-gray-600">{grant.deadline.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Award className="h-5 w-5 text-violet" />Funding Amount</h3>
                                        <p className="text-gray-600 text-lg font-bold">{grant.fundingAmount}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10">
                                <h2 className="text-xl font-bold text-violet mb-4">Eligibility Criteria</h2>
                                <p className="text-gray-700 leading-relaxed">{grant.eligibility}</p>
                            </div>

                            <div className="mt-10">
                                <h2 className="text-xl font-bold text-violet mb-4">Required Documents</h2>
                                <div className="space-y-4">
                                    {grant.documents?.map((doc, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                                            <div>
                                                <p className="font-semibold text-gray-800">{doc.title}</p>
                                                <p className="text-sm text-gray-600">{doc.description}</p>
                                                {doc.required && <p className="text-xs text-gray-500 mt-1">(Required)</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {grant.faqs && grant.faqs.length > 0 && (
                                <div className="mt-10">
                                    <h2 className="text-xl font-bold text-violet mb-4">Frequently Asked Questions</h2>
                                    <div className="space-y-4">
                                        {grant.faqs.map((faq, index) => (
                                            <div key={index} className="border-b pb-4">
                                                <p className="font-semibold text-gray-800">{faq.question}</p>
                                                <p className="text-gray-700 mt-2">{faq.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <div className="mt-10">
                                <h2 className="text-xl font-bold text-violet mb-4">Contact Information</h2>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-violet"/>
                                    <a href={`mailto:${grant.contactEmail}`} className="text-gray-700 hover:underline">{grant.contactEmail}</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 my-8">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Button asChild size="lg" className="w-full sm:w-auto bg-violet hover:bg-pink text-white flex-1">
                                <a href={grant.applyLink} target="_blank" rel="noopener noreferrer">Apply Now</a>
                            </Button>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto text-violet border-violet hover:bg-violet/10 hover:text-violet">
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                            </Button>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    );
}