import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';
import { Grant } from '@shared/schema';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { LoaderCircle, BookmarkX } from 'lucide-react';

// यह GrantCard का एक simplified version है
const SavedGrantCard = ({ grant }: { grant: Grant }) => (
    <article className="bg-white rounded-xl border shadow-md hover:shadow-xl transition-shadow flex flex-col">
        <div className="p-5 flex-grow">
            <h3 className="text-lg font-bold text-violet line-clamp-2">{grant.title}</h3>
            <p className="text-sm font-semibold text-gray-800 my-2">{grant.organization}</p>
            <p className="text-sm text-gray-600 line-clamp-3 flex-grow">{grant.description}</p>
        </div>
        <div className="p-5 border-t bg-gray-50/70 rounded-b-xl mt-auto">
            <Link href={`/grant/${grant.id}`}>
                <Button className="w-full bg-violet hover:bg-pink text-white">
                    View Details
                </Button>
            </Link>
        </div>
    </article>
);


export default function SavedGrantsPage() {
    const { user } = useAuth();
    const [savedGrants, setSavedGrants] = useState<Grant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedGrants = async () => {
            if (!user || !user.savedGrants || user.savedGrants.length === 0) {
                setLoading(false);
                return;
            }

            try {
                // Firestore से उन सभी grants को लाएँ जिनकी ID यूज़र के savedGrants array में है
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

        fetchSavedGrants();
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
            <Navbar />
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
                                <SavedGrantCard key={grant.id} grant={grant} />
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
            <Footer />
        </>
    );
}