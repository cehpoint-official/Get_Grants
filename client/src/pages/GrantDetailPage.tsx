import { useEffect, useState } from 'react';
import { Link, useRoute, Redirect, useLocation } from 'wouter';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Grant } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Mail, Building, Award, CheckCircle, Share2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Footer } from '@/components/footer';

export default function GrantDetailPage() {
  const [grant, setGrant] = useState<Grant | null>(null);
  const [loading, setLoading] = useState(true);
  const [, params] = useRoute("/grant/:id");
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  const handleViewPricing = () => {
    localStorage.setItem("scrollTo", "pricing");
    navigate("/");
  };

  useEffect(() => {
    const fetchGrant = async () => {
      if (params?.id) {
        const grantRef = doc(db, 'grants', params.id);
        const docSnap = await getDoc(grantRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setGrant({
            id: docSnap.id,
            ...data,
            deadline: (data.deadline as Timestamp).toDate(),
            createdAt: (data.createdAt as Timestamp).toDate(),
          } as Grant);
        }
        setLoading(false);
      }
    };
    if (user) {
        fetchGrant();
    } else if (!authLoading) {
        setLoading(false);
    }
  }, [params?.id, user, authLoading]);

  if (loading || authLoading) return <div className="text-center p-10">Loading grant details...</div>;
  if(!user) return <Redirect to="/" />;
  if (!grant) return <div className="text-center p-10">Grant not found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Link href="/grants">
          <Button variant="ghost" className="mb-6 text-violet hover:text-pink">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Grants
          </Button>
        </Link>
        
        {/* Grant Views Remaining Notice */}
        <div className="mb-8 flex items-center justify-between rounded-lg border border-yellow-300 bg-yellow-50 p-4">
            <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                <p className="font-semibold text-yellow-800">
                    You have 0 free grant views remaining
                </p>
            </div>
            <Button onClick={handleViewPricing} size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                Upgrade
            </Button>
        </div>
        
        {/* Main Grant Details Card */}
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
                    {grant.documents.map((doc, index) => (
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

        {/* Call to Action Buttons Card */}
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

        {/* Premium Upsell Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="bg-violet/5 border-2 border-violet/20 rounded-xl p-6 text-center">
                <h3 className="text-xl font-bold text-violet mb-3">Get More with Premium</h3>
                <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Unlimited access to all grant details
                </li>
                <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Email notifications for new grants
                </li>
                <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Application deadline reminders
                </li>
                </ul>
                <Button onClick={handleViewPricing} variant="outline" className="text-violet border-violet hover:bg-violet hover:text-white">
                    View Pricing Plans
                </Button>
            </div>
        </div>

      </div>
      <Footer/>
    </div>
  );
}