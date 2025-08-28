import { useEffect, useState } from 'react';
import { fetchGrants } from '@/services/grants'; 
import { Grant } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { LoaderCircle } from 'lucide-react';

// Single Grant Card component
const GrantCard = ({ grant }: { grant: Grant }) => (
  <article className="bg-white rounded-xl border shadow-md hover:shadow-xl transition-shadow flex flex-col">
    <div className="p-5 flex-grow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-violet line-clamp-2">{grant.title}</h3>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${grant.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
          {grant.status}
        </span>
      </div>
      <p className="text-sm font-semibold text-gray-800 mb-3">{grant.organization}</p>
      <p className="text-sm text-gray-600 mb-4 line-clamp-4 flex-grow">{grant.description}</p>
    </div>
    <div className="p-5 border-t bg-gray-50/70 rounded-b-xl">
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
      <span className="truncate">
          <span className="font-semibold text-gray-700">Deadline:</span> {grant.deadline.toLocaleDateString()}
        </span>
        <span className="truncate">
          <span className="font-semibold text-gray-700">Funding:</span> {grant.fundingAmount}
        </span>
       
      </div>
      <Link href={`/grant/${grant.id}`}>
        <Button className="w-full bg-violet hover:bg-pink text-white">
          View Details
        </Button>
      </Link>
    </div>
  </article>
);

// Main Page Component
export default function GrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGrants = async () => {
      try {
        const fetchedGrants = await fetchGrants();
        setGrants(fetchedGrants as Grant[]);
      } catch (error) {
        console.error("Failed to fetch grants:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGrants();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderCircle className="w-8 h-8 animate-spin text-violet" />
        <p className="ml-2 text-lg text-gray-600">Loading Grants...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-violet tracking-tight">
            Explore All Grants
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect funding opportunity for your startup.
          </p>
        </div>

        {grants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {grants.map((grant) => (
              <GrantCard key={grant.id} grant={grant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700">No Grants Found</h3>
            <p className="mt-2 text-gray-500">The admin hasn't posted any grants yet. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}