import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';
import { Grant } from '@shared/schema';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/footer';
import { LoaderCircle, BookmarkX } from 'lucide-react';
import { GrantCard } from '@/pages/GrantsPage'; // GrantCard को GrantsPage से इम्पोर्ट करें
import { AuthModal } from '@/components/AuthModal';

export default function SavedGrantsPage() {
    const { user } = useAuth();
    const [, navigate] = useLocation();
    const [savedGrants, setSavedGrants] = useState<Grant[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // यह handleCardClick फ़ंक्शन GrantCard को प्रॉप के रूप में चाहिए
    const handleCardClick = (grant: Grant) => {
        // Saved grants page पर, user हमेशा logged in होगा, तो सीधा navigate करें
        navigate(`/grant/${grant.id}`);
    };

    useEffect(() => {
        const fetchSavedGrants = async () => {
            if (!user || !user.savedGrants || user.savedGrants.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const grantsRef = collection(db, 'grants');
                const q = query(grantsRef, where(documentId(), 'in', user.savedGrants));
                const querySnapshot = await getDocs(q);
                
                const grantsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Grant[];
                
                setSavedGrants(grantsList);
            } catch (error) {
                console.error("Error fetching saved grants: ", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchSavedGrants();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoaderCircle className="w-10 h-10 animate-spin text-violet" />
            </div>
        );
    }

    return (
        <>
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-violet tracking-tight">
                            My Saved Grants
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                            Here are all the funding opportunities you've bookmarked.
                        </p>
                    </div>

                    {savedGrants.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {savedGrants.map((grant) => (
                                // अब GrantCard का इस्तेमाल करें
                                <GrantCard 
                                    key={grant.id} 
                                    grant={grant} 
                                    user={user} 
                                    onCardClick={handleCardClick} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
                            <BookmarkX className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">No Saved Grants Yet</h3>
                            <p className="mt-2 text-gray-500">
                                Start exploring and save grants to see them here.
                            </p>
                            <Link href="/grants">
                                <Button className="mt-6 bg-violet hover:bg-pink text-white">
                                    Explore Grants
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
             <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
            <Footer />
        </>
    );
}