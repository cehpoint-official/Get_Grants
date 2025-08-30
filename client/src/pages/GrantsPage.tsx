import { useEffect, useState, useMemo } from 'react';
import { fetchGrants } from '@/services/grants';
import { Grant } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { LoaderCircle, Lock, Zap, Bell, AlertTriangle, Search, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { AuthModal } from '@/components/AuthModal';
import { Input } from '@/components/ui/input';
import { Footer } from '@/components/footer';
 

// Single Grant Card component
const GrantCard = ({ grant, onDetailsClick }: { grant: Grant, onDetailsClick: (grantId: string) => void }) => (
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
      <Button className="w-full bg-violet hover:bg-pink text-white" onClick={() => onDetailsClick(grant.id)}>
        View Details
      </Button>
    </div>
  </article>
);

// Main Page Component
export default function GrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minAmount: '',
    maxAmount: '',
    status: 'All',
    deadline: '',
  });
  const [activeCategory, setActiveCategory] = useState('All Grants');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const grantsPerPage = 9;

  const handleDetailsClick = (grantId: string) => {
    if (user) {
      navigate(`/grant/${grantId}`);
    } else {
      setIsAuthModalOpen(true);
    }
  };
  
  const handleViewPricing = () => {
    localStorage.setItem("scrollTo", "pricing");
    navigate("/");
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      minAmount: '',
      maxAmount: '',
      status: 'All',
      deadline: '',
    });
    setSearchTerm('');
    setActiveCategory('All Grants');
  };

  const filteredGrants = useMemo(() => {
    let filtered = grants;

    if (searchTerm) {
      filtered = filtered.filter(grant => 
        grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grant.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeCategory !== 'All Grants') {
        filtered = filtered.filter(grant => grant.category === activeCategory);
    }
    
    // Apply filters
    if (filters.minAmount) {
        filtered = filtered.filter(grant => parseFloat(grant.fundingAmount.replace(/[^0-9.-]+/g,"")) >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
        filtered = filtered.filter(grant => parseFloat(grant.fundingAmount.replace(/[^0-9.-]+/g,"")) <= parseFloat(filters.maxAmount));
    }
    if (filters.status !== 'All') {
        filtered = filtered.filter(grant => grant.status === filters.status);
    }
    if (filters.deadline) {
        filtered = filtered.filter(grant => new Date(grant.deadline) <= new Date(filters.deadline));
    }

    return filtered;
  }, [grants, searchTerm, activeCategory, filters]);

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

  // Pagination Logic
  const indexOfLastGrant = currentPage * grantsPerPage;
  const indexOfFirstGrant = indexOfLastGrant - grantsPerPage;
  const currentGrants = filteredGrants.slice(indexOfFirstGrant, indexOfLastGrant);
  const totalPages = Math.ceil(filteredGrants.length / grantsPerPage);

  const categories = ['All Grants', 'Technology', 'Healthcare', 'Education', 'Environment', 'Sustainability', 'Fintech', 'Agriculture', 'Retail', 'Diversity', 'Social'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderCircle className="w-8 h-8 animate-spin text-violet" />
        <p className="ml-2 text-lg text-gray-600">Loading Grants...</p>
      </div>
    );
  }

  return (
    <>
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

          
          <div className="mb-12 flex items-center justify-between rounded-lg border border-yellow-300 bg-yellow-50 p-4 shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-500" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-yellow-800">
                  You've used all your free grant views
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

          
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Input 
                        type="text" 
                        placeholder="Search grants..." 
                        className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-violet focus:border-violet"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                </Button>
            </div>

            {showFilters && (
                <div className="mt-4 p-4 bg-white rounded-lg border shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input type="number" name="minAmount" placeholder="Min Amount (₹)" value={filters.minAmount} onChange={handleFilterChange} />
                        <Input type="number" name="maxAmount" placeholder="Max Amount (₹)" value={filters.maxAmount} onChange={handleFilterChange} />
                        <select name="status" value={filters.status} onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))} className="rounded-lg border-2 border-gray-300 p-2">
                            <option>All</option>
                            <option>Active</option>
                            <option>Upcoming</option>
                            <option>Expired</option>
                            <option>Closing Soon</option>
                        </select>
                        <Input type="date" name="deadline" value={filters.deadline} onChange={handleFilterChange} />
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <Button variant="ghost" onClick={handleResetFilters}>Reset</Button>
                        <Button className="bg-violet text-white hover:bg-pink">Apply Filters</Button>
                    </div>
                </div>
            )}
          </div>

          <div className="mb-12 flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
                <Button 
                    key={category} 
                    variant={activeCategory === category ? "default" : "outline"}
                    onClick={() => setActiveCategory(category)}
                    className={`${activeCategory === category ? 'bg-violet text-white' : ''}`}
                >
                    {category}
                </Button>
            ))}
          </div>

          {currentGrants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentGrants.map((grant) => (
                <GrantCard key={grant.id} grant={grant} onDetailsClick={handleDetailsClick} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700">No Grants Found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}

          {filteredGrants.length > grantsPerPage && (
            <div className="flex justify-center items-center mt-12 space-x-4">
              <Button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} variant="outline">
                « Prev
              </Button>
              <span className="text-gray-600 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} variant="outline">
                Next »
              </Button>
            </div>
          )}

          <div className="mt-20 bg-white rounded-2xl shadow-lg border p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-violet mb-3">Unlock Full Access to All Grants</h2>
              <p className="text-gray-600 max-w-3xl mx-auto mb-8">
                Get unlimited access to all grant details, email notifications for new opportunities, and personalized recommendations tailored to your startup.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-violet/10 p-3 rounded-full mb-4"><Lock className="h-6 w-6 text-violet"/></div>
                <h4 className="font-semibold text-gray-800">Unlimited Access</h4>
                <p className="text-sm text-gray-600 mt-1">View details of all available grants without restrictions</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-violet/10 p-3 rounded-full mb-4"><Bell className="h-6 w-6 text-violet"/></div>
                <h4 className="font-semibold text-gray-800">Email Alerts</h4>
                <p className="text-sm text-gray-600 mt-1">Get notified about new grants that match your criteria</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-violet/10 p-3 rounded-full mb-4"><Zap className="h-6 w-6 text-violet"/></div>
                <h4 className="font-semibold text-gray-800">Early Access</h4>
                <p className="text-sm text-gray-600 mt-1">Be the first to know about new funding opportunities</p>
              </div>
            </div>
            <div className="text-center mt-10">
              <Button onClick={handleViewPricing} className="bg-violet hover:bg-pink text-white px-8 py-3 text-base">
                View Pricing Plans
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessRedirectTo="/grants"
      />
      <Footer/>
    </>
  );
}