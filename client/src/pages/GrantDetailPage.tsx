import { useEffect, useState } from 'react';
import { Link, useRoute } from 'wouter';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Grant } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Mail, FileText, Building, Award } from 'lucide-react';

export default function GrantDetailPage() {
  const [grant, setGrant] = useState<Grant | null>(null);
  const [loading, setLoading] = useState(true);
  const [, params] = useRoute("/grant/:id");

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
    fetchGrant();
  }, [params?.id]);

  if (loading) return <div className="text-center p-10">Loading grant details...</div>;
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900">{grant.title}</h1>
            <p className="text-sm font-semibold text-violet mt-2">{grant.organization}</p>
            {/* ... baaki saari details display ... */}
          </div>
        </div>
      </div>
    </div>
  );
}