import { useEffect, useState, useMemo } from 'react';
import { fetchGrants } from '@/services/grants';
import { Grant } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { LoaderCircle, Lock, Search, CalendarDays, Wallet, Clock4 } from 'lucide-react';
import { useAuth, AppUser } from '@/hooks/use-auth';
import { AuthModal } from '@/components/AuthModal';
import { Input } from '@/components/ui/input';
import { Footer } from '@/components/footer';
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import fittLogo from '../assets/logos/FITT-Logo.avif';
import iHubLogo from '../assets/logos/iHub-logo-New-2.avif';
import iimlLogo from '../assets/logos/iiml-logo.avif';
import iitmandicatalystLogo from '../assets/logos/iitmandicatalyst_logo.avif';
import ikpknowledgeparkLogo from '../assets/logos/ikpknowledgepark_logo.avif';
import incenseLogo from '../assets/logos/incense-logo-300x70-1.avif';
import startGujaratLogo from '../assets/logos/logo1.png';
import dpiitLogo from '../assets/logos/logo2.png';
import icreateLogo from '../assets/logos/logo3.png';
import dstNidhiLogo from '../assets/logos/logo4.png';
import stpiLogo from '../assets/logos/logo5.png';
import meityLogo from '../assets/logos/logo6.png';
import wadhwaniFoundationLogo from '../assets/logos/Screenshot 2025-06-28 134905.avif';
import aicBimtechLogo from '../assets/logos/Screenshot 2025-06-28 152327.avif';
import nsrcelLogo from '../assets/logos/Screenshot 2025-08-06 152003.avif';
import indiaAcceleratorLogo from '../assets/logos/Screenshot 2025-08-19 094112.avif';
import manipalGokBioincubatorLogo from '../assets/logos/M-GoK Logo.avif';

const logoMap: { [key: string]: string } = {
    'nidhi': dstNidhiLogo,
    'icreate': icreateLogo,
    'meity startup hub': meityLogo,
    'dpiit startup india': dpiitLogo,
    'iit mandi catalyst': iitmandicatalystLogo,
    'iit mandi ihub & hci foundation': iHubLogo,
    'fitt - iit delhi': fittLogo,
    'iim lucknow eic': iimlLogo,
    'ikp knowledge park': ikpknowledgeparkLogo,
    'incense - iit ropar': incenseLogo,
    'start gujarat': startGujaratLogo,
    'stpi': stpiLogo,
    'wadhwani foundation': wadhwaniFoundationLogo,
    'atal incubation centre - bimtech': aicBimtechLogo,
    'nsrcel': nsrcelLogo,
    'india accelerator': indiaAcceleratorLogo,
    'manipal-gok bioincubator': manipalGokBioincubatorLogo
};

const getStatusClass = (status: Grant['status']) => {
    switch (status) {
        case 'Active':
            return 'bg-[#28D36F6B] text-[#099C46]';
        case 'Upcoming':
            return 'bg-[#FFB61730] text-[#E99000]';
        case 'Expired':
            return 'bg-[#FFBAB86B] text-[#EA3030]';
        case 'Closing Soon':
             return 'bg-orange-100 text-orange-600';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

export const GrantCard = ({ grant, user, onCardClick }: { grant: Grant, user: AppUser | null, onCardClick: (grant: Grant) => void }) => {
    const organizationKey = grant.organization?.trim().toLowerCase();
    const logo = organizationKey ? logoMap[organizationKey] : undefined;
    const isPremiumGrant = grant.isPremium;
    const isUserPremium = user?.subscriptionStatus === 'premium';
    const isLocked = isPremiumGrant && !isUserPremium;

    return (
        <article
            onClick={() => onCardClick(grant)}
            className="bg-white relative rounded-[12px] border border-gray-200/80 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer overflow-hidden w-[270px] min-h-[338px]"
        >
            <div className="p-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-lg ${getStatusClass(grant.status)}`}>
                        {grant.status}
                    </span>
                    {logo && (
                        <div className="flex justify-center items-center h-[54px] w-[61px] p-2 rounded-[9px] bg-white border shadow-sm">
                            <img src={logo} alt={`${grant.organization} logo`} className="max-h-full max-w-full object-contain" />
                        </div>
                    )}
                </div>
                
                <div className="flex-grow flex flex-col">
                    <h3 className="font-poppins font-medium text-[16px] text-[#212121] leading-tight line-clamp-2 h-[48px] w-full">
                        {grant.title}
                    </h3>
                    <p className="font-poppins text-xs text-[#565D66] leading-5 line-clamp-3 h-[60px] w-full mt-2 mb-3">
                        {grant.description}
                    </p>
                </div>

                <div className="mt-auto space-y-4">
                    <div className="flex items-baseline space-x-2">
                         <span className="font-inter font-bold text-sm text-black">{grant.fundingAmount}</span>
                         <span className="font-poppins font-medium text-sm text-[#565F6C]">funding</span>
                    </div>

                    <div className="flex items-center text-xs text-gray-700 bg-[#F8F8F8] rounded-[12px] p-2">
                        <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Deadline: {new Date(grant.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                    
                    <Button 
                      className="w-full h-[45px] bg-[#D4D4D430] hover:bg-[#c0b4ff61] text-[#212121] font-semibold rounded-[35px] text-sm"
                      tabIndex={-1}
                      onClick={(e) => { e.stopPropagation(); onCardClick(grant); }}
                    >
                        {isLocked ? 'Unlock with Premium' : 'View Details'}
                    </Button>
                </div>
            </div>
            
            {isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-white/50 backdrop-blur-sm rounded-xl">
                    <Lock className="h-8 w-8 text-gray-500" />
                    <p className="text-gray-600 font-semibold mt-2 text-center">Upgrade to Premium to view details</p>
                </div>
            )}
        </article>
    );
};


const FilterSidebar = ({ filters, onFilterChange, onResetFilters }: {
    filters: any;
    onFilterChange: (name: string, value: any) => void;
    onResetFilters: () => void;
}) => {
    const [minAmount, setMinAmount] = useState(0);
    const [maxAmount, setMaxAmount] = useState(50000000); 

    const handleMinAmountChange = (value: number[]) => {
        setMinAmount(value[0]);
        onFilterChange('minAmount', value[0].toString());
    };

    const handleMaxAmountChange = (value: number[]) => {
        setMaxAmount(value[0]);
        onFilterChange('maxAmount', value[0].toString());
    };

    const formatAmount = (amount: number) => {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)} K`;
        return `₹${amount}`;
    };

    return (
        <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit sticky top-24">
            <h3 className="text-xl font-semibold mb-6">All Filters</h3>
            <div className="space-y-6">
                <div>
                    <h4 className="font-semibold mb-4">Amount</h4>
                    <div className="space-y-3">
                        <Label>Min Amount ({formatAmount(minAmount)})</Label>
                        <Slider defaultValue={[0]} max={10000000} step={50000} onValueChange={handleMinAmountChange} />
                        <Label>Max Amount ({formatAmount(maxAmount)})</Label>
                        <Slider defaultValue={[50000000]} max={1000000000} step={1000000} onValueChange={handleMaxAmountChange} />
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-4">Status</h4>
                    <RadioGroup value={filters.status} onValueChange={(value) => onFilterChange('status', value)} className="space-y-2">
                        {['All', 'Active', 'Upcoming', 'Expired', 'Closing Soon'].map(status => (
                            <div className="flex items-center space-x-2" key={status}>
                                <RadioGroupItem value={status} id={`status-${status}`} />
                                <Label htmlFor={`status-${status}`}>{status}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <div>
                    <h4 className="font-semibold mb-4">Deadline</h4>
                    <div className="relative">
                        <Input type="date" name="deadline" value={filters.deadline} onChange={(e) => onFilterChange('deadline', e.target.value)} className="pr-10" />
                        <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                </div>
                <Button variant="outline" onClick={onResetFilters} className="w-full">Reset Filters</Button>
            </div>
        </aside>
    );
};

export default function GrantsPage() {
    const [grants, setGrants] = useState<Grant[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [, navigate] = useLocation();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [filters, setFilters] = useState({
        minAmount: '', maxAmount: '', status: 'All', deadline: '',
    });
    const [activeCategory, setActiveCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const grantsPerPage = 6;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q');
        if (query) {
            setSearchTerm(query);
            setSearchInput(query);
        }
    }, []);

    const handleCardClick = (grant: Grant) => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        const isGrantLockedForUser = grant.isPremium && user.subscriptionStatus !== 'premium';
        if (isGrantLockedForUser) {
            handleViewPricing();
        } else {
            navigate(`/grant/${grant.id}`);
        }
    };
    
    const handleViewPricing = () => {
        navigate("/premium-support");
    };

    const handleFilterChange = (name: string, value: any) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleResetFilters = () => {
        setFilters({ minAmount: '', maxAmount: '', status: 'All', deadline: '' });
        setSearchTerm('');
        setActiveCategory('All');
    };

    const filteredGrants = useMemo(() => {
        let filtered = grants;

        if (searchTerm) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(grant =>
                grant.title.toLowerCase().includes(lowercasedSearchTerm) ||
                grant.description.toLowerCase().includes(lowercasedSearchTerm) ||
                grant.organization.toLowerCase().includes(lowercasedSearchTerm) ||
                (grant.category && grant.category.toLowerCase().includes(lowercasedSearchTerm)) ||
                grant.fundingAmount.toLowerCase().includes(lowercasedSearchTerm)
            );
        }

        if (activeCategory !== 'All') {
            filtered = filtered.filter(grant => grant.category === activeCategory);
        }
        
        if (filters.minAmount) {
            const min = parseFloat(filters.minAmount);
            if (!isNaN(min)) {
                filtered = filtered.filter(grant => parseFloat(grant.fundingAmount.replace(/[^0-9.-]+/g, "")) >= min);
            }
        }
        if (filters.maxAmount) {
             const max = parseFloat(filters.maxAmount);
             if (!isNaN(max)) {
                filtered = filtered.filter(grant => parseFloat(grant.fundingAmount.replace(/[^0-9.-]+/g, "")) <= max);
             }
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
            setLoading(true);
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
    
    const indexOfLastGrant = currentPage * grantsPerPage;
    const indexOfFirstGrant = indexOfLastGrant - grantsPerPage;
    const currentGrants = filteredGrants.slice(indexOfFirstGrant, indexOfLastGrant);
    const totalPages = Math.ceil(filteredGrants.length / grantsPerPage);
    const categories = ['All', 'Technology', 'Healthcare', 'Education', 'Environment', 'Sustainability', 'Fintech', 'Agriculture', 'Retail', 'Diversity', 'Social'];

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
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-12 w-[429px]">
                        <h1 className="font-poppins font-semibold text-[34px] text-gray-800 leading-tight">
                            Explore All Grants
                        </h1>
                        <p className="font-poppins font-medium text-base text-[#565F6C] leading-tight mt-[5px]">
                            Find the perfect funding opportunity for your startup.
                        </p>
                    </div>

                    <div className="flex items-center gap-[20px] mb-8">
                        <div className="relative flex-grow">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9F9F9F] pointer-events-none" />
                            <Input
                                type="text"
                                aria-label="Search"
                                placeholder="Search grants by name or des..."
                                className="w-full h-[50px] text-base font-sans text-[#3A3A3A] placeholder:text-[#9F9F9F] pl-12 pr-4 rounded-[16px] border border-gray-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] focus:ring-2 focus:ring-[#8541EF33] focus:border-[#8541EF]"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { setSearchTerm(searchInput); setCurrentPage(1); } }}
                            />
                        </div>
                        <Button onClick={() => { setSearchTerm(searchInput); setCurrentPage(1); }} className="w-[140px] h-[49px] rounded-[16px] bg-[#7E4DFF] hover:bg-[#6f3eff] text-white shadow-[0_8px_18px_rgba(126,77,255,0.35)]">
                            Search
                        </Button>
                    </div>

                    <div className="mb-12 flex flex-wrap gap-[14px]">
                        {categories.map(category => (
                            <Button
                                key={category}
                                variant="outline"
                                onClick={() => setActiveCategory(category)}
                                className={`h-8 rounded-[49px] border px-4 py-3 text-sm transition-colors duration-200 ${
                                    activeCategory === category 
                                    ? 'bg-[#C0B4FF61] border-[#8541EF] text-[#8541EF] font-semibold' 
                                    : 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400'
                                }`}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                       <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onResetFilters={handleResetFilters} />

                        <main className="lg:col-span-3">
                            {currentGrants.length > 0 ? (
                                <>
                                    <div className="flex flex-wrap gap-6">
                                        {currentGrants.map((grant) => (
                                            <GrantCard key={grant.id} grant={grant} user={user} onCardClick={handleCardClick} />
                                        ))}
                                    </div>
                                    {filteredGrants.length > grantsPerPage && (
                                        <div className="flex justify-center items-center mt-12 space-x-2">
                                            <Button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                                                Prev
                                            </Button>
                                            {Array.from({ length: totalPages }, (_, i) => i).map(pageNumber => (
                                                <Button 
                                                    key={pageNumber + 1}
                                                    onClick={() => setCurrentPage(pageNumber + 1)}
                                                    variant={currentPage === pageNumber + 1 ? 'default' : 'outline'}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    {pageNumber + 1}
                                                </Button>
                                            ))}
                                            <Button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                                                Next
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                                    <h3 className="text-xl font-semibold text-gray-700">No Grants Found</h3>
                                    <p className="mt-2 text-gray-500">Try adjusting your search or filters.</p>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccessRedirectTo="/grants"
            />
            <Footer />
        </>
    );
}