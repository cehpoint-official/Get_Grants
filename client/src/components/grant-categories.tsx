import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ExternalLink, Bookmark, BookmarkCheck, Filter, X } from "lucide-react";
import {
  Rocket,
  Building,
  MapPin,
  University,
  Globe,
  Award,
} from "lucide-react";
import { GrantApplicationForm } from "./ApplyGrantForm";
import { useLocation } from "wouter";

// --- Custom Hook for Mobile Detection ---
const useMobile = (breakpoint = 1024) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

interface Grant {
  name: string;
  description: string;
  website: string;
  stage?: string;
  fundingType?: string;
  sector?: string;
  deadline?: string;
  amount?: string;
  tag?: string;
  isBookmarked?: boolean;
}

interface Stage {
  id: string;
  title: string;
  grants: Grant[];
}

interface Category {
  id: string;
  icon: any;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  iconColor: string;
  stages?: Stage[];
  items?: (string | Grant)[];
}

interface FilterOptions {
  stage: string[];
  fundingType: string[];
  sector: string[];
  deadline: string[];
}

export function GrantCategories() {
  // --- STATE MANAGEMENT ---
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [_, navigate] = useLocation();
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({
    stage: [],
    fundingType: [],
    sector: [],
    deadline: [],
  });
  const [bookmarkedGrants, setBookmarkedGrants] = useState<Set<string>>(new Set());

  // --- UI STATE & RESPONSIVENESS ---
  const isMobile = useMobile();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>("stage");

  // --- DATA & FILTER OPTIONS (Unchanged) ---
  const filterOptions = {
    stage: ["Idea", "MVP", "Revenue", "Scaling"],
    fundingType: ["Grant", "Equity", "Fellowship", "Others"],
    sector: ["Health", "Agri", "AI", "SaaS", "Deeptech", "Fintech", "Edtech", "Biotech"],
    deadline: ["This week", "This month", "Next month", "Custom"],
  };
  const categories: Category[] = [
    {
      id: "stage",
      icon: Rocket,
      title: "Stage-Wise Schemes",
      subtitle: "Ideation to Scale-Up",
      description:
        "Find grants based on your startup's current stage of development",
            color: "bg-violet/20",
            iconColor: "text-violet",
      stages: [
        {
          id: "idea",
          title: "💡 Idea Stage",
          grants: [
            {
              name: "NIDHI-PRAYAS",
              description:
                "Support for translating innovative ideas to market-ready prototypes",
              website: "https://nidhi.dst.gov.in/",
              stage: "Idea",
              fundingType: "Grant",
              sector: "Deeptech",
              deadline: "This month",
              amount: "₹10 Lakhs",
              tag: "Govt",
            },
            {
              name: "SSIP Gujarat",
              description: "Student Startup and Innovation Policy support",
              website: "https://www.ssipgujarat.in/",
              stage: "Idea",
              fundingType: "Grant",
              sector: "SaaS",
              deadline: "Next month",
            	amount: "₹5 Lakhs",
            	tag: "Govt",
          	},
          	{
          	  name: "PRISM",
          	  description: "Promoting Innovations in Students and Researchers",
          	  website:
          	    "https://www.dsir.gov.in/promoting-innovations-individuals-start-ups-and-msmes-prism",
          	  stage: "Idea",
          	  fundingType: "Grant",
          	  sector: "AI",
          	  deadline: "This week",
          	  amount: "₹2 Lakhs",
          	  tag: "Govt",
          	},
          	{
          	  name: "BIG (Biotech)",
          	  description:
          	    "Biotechnology Innovation Grant for early-stage biotech ideas",
          	  website: "https://birac.nic.in/",
          	  stage: "Idea",
          	  fundingType: "Grant",
          	  sector: "Biotech",
          	  deadline: "Next month",
          	  amount: "₹50 Lakhs",
          	  tag: "Govt",
          	},
        	],
      	},
      	{
      	  id: "mvp",
      	  title: "🚀 MVP / Early Traction",
      	  grants: [
      	    {
      	      name: "SISFS",
      	      description:
      	        "Startup India Seed Fund Scheme for proof of concept and prototype development",
      	      website: "https://seedfund.startupindia.gov.in/",
      	      stage: "MVP",
      	      fundingType: "Grant",
      	      sector: "SaaS",
      	      deadline: "This month",
      	      amount: "₹50 Lakhs",
      	      tag: "Govt",
      	    },
      	    {
      	      name: "NIDHI-SSP",
      	      description: "Startup Support Programme for technology startups",
      	      website: "https://nidhi.dst.gov.in/nidhissp/",
      	      stage: "MVP",
      	      fundingType: "Grant",
      	      sector: "Deeptech",
      	      deadline: "Next month",
      	      amount: "₹25 Lakhs",
      	      tag: "Govt",
      	    },
      	    {
      	      name: "SAMRIDH",
      	      description: "Software products and services support program",
      	      website: "https://msh.meity.gov.in/schemes/samridh",
      	      stage: "MVP",
      	      fundingType: "Grant",
      	      sector: "AI",
      	      deadline: "This week",
      	      amount: "₹40 Lakhs",
      	      tag: "Govt",
      	    },
      	    {
      	      name: "TIDE 2.0",
      	      description:
      	        "Technology Incubation and Development of Entrepreneurs",
  	    	    website: "https://msh.meity.gov.in/schemes/tide",
  	    	    stage: "MVP",
  	    	    fundingType: "Grant",
  	    	    sector: "Health",
  	    	    deadline: "Next month",
  	    	    amount: "₹30 Lakhs",
  	    	    tag: "Govt",
  	    	  },
  	    	  {
  	    	    name: "CIIE.CO Accelerators (IIM Ahmedabad)",
  	    	    description:
  	    	      "Accelerator & incubation support for early-stage startups across India",
  	    	    website: "https://iimaventures.com/current-programs/",
  	    	    stage: "MVP",
  	    	    fundingType: "Equity",
  	    	    sector: "Fintech",
  	    	    deadline: "This month",
  	    	    amount: "₹1 Crore",
  	    	    tag: "Incubator",
  	    	  },
  	    	  {
  	    	    name: "IITM Incubation Cell",
  	    	    description:
  	    	      "India's leading deep tech startup incubator (Chennai, all stages)",
  	    	    website: "http://rtbi.in/incubationiitm/",
  	    	    stage: "MVP",
  	    	    fundingType: "Equity",
  	    	    sector: "Deeptech",
  	    	    deadline: "Next month",
  	    	    amount: "₹75 Lakhs",
  	    	    tag: "Incubator",
  	    	  },
  	    	  {
  	    	    name: "HealthTech Accelerator",
  	    	    description: "Healthcare technology startup accelerator program",
  	    	    website: "https://example.com/healthtech",
  	    	    stage: "MVP",
  	    	    fundingType: "Grant",
  	    	    sector: "Health",
  	    	    deadline: "This week",
  	    	    amount: "₹40 Lakhs",
  	    	    tag: "Private",
  	    	  },
  	    	  {
  	    	    name: "AgriTech Innovation Fund",
  	    	    description: "Agricultural technology innovation and development fund",
  	    	    website: "https://example.com/agritech",
  	    	    stage: "MVP",
  	    	    fundingType: "Grant",
  	    	    sector: "Agri",
  	    	    deadline: "Next month",
  	    	    amount: "₹35 Lakhs",
  	    	    tag: "Govt",
  	    	  },
  	    	],
  	  	},
  	  	{
  	  	  id: "scaling",
  	  	  title: "📈 Scaling / Growth",
  	  	  grants: [
  	  	    {
  	  	      name: "FFS (VC Fund)",
  	  	      description:
  	  	        "Fund of Funds for Startups - venture capital funding",
  	  	      website: "https://www.sidbivcf.in/en",
  	  	      stage: "Scaling",
  	  	      fundingType: "Equity",
  	  	      sector: "SaaS",
  	  	      deadline: "Next month",
  	  	      amount: "₹10 Crores",
  	  	      tag: "Govt",
  	  	    },
  	  	    {
  	  	      name: "PMMY",
  	  	      description: "Pradhan Mantri MUDRA Yojana for micro enterprises",
  	  	      website: "https://www.mudra.org.in/",
  	  	      stage: "Scaling",
  	  	      fundingType: "Grant",
  	  	      sector: "Agri",
  	  	      deadline: "This month",
  	  	      amount: "₹10 Lakhs",
  	  	      tag: "Govt",
  	  	    },
  	  	    {
  	  	      name: "Stand-Up India / CGSS",
  	  	      description: "Support for SC/ST and women entrepreneurs",
  	  	      website:
  	  	        "https://www.standupmitra.in/Login/IndexNewSchemeFeatures",
  	  	      stage: "Scaling",
  	  	      fundingType: "Grant",
  	  	      sector: "Fintech",
  	  	      deadline: "This week",
  	  	      amount: "₹1 Crore",
  	  	      tag: "Govt",
  	  	    },
  	  	    {
  	  	      name: "EdTech Growth Fund",
  	  	      description: "Education technology scaling and growth support",
  	  	      website: "https://example.com/edtech",
  	  	      stage: "Scaling",
  	  	      fundingType: "Equity",
  	  	      sector: "Edtech",
  	  	      deadline: "Next month",
  	  	      amount: "₹2 Crores",
  	  	      tag: "Private",
  	  	    },
  	  	    {
  	  	      name: "AI Innovation Grant",
  	  	      description: "Artificial Intelligence innovation and scaling support",
  	  	      website: "https://example.com/ai",
  	  	      stage: "Scaling",
  	  	      fundingType: "Grant",
  	  	      sector: "AI",
  	  	      deadline: "This month",
  	  	      amount: "₹75 Lakhs",
  	  	      tag: "Govt",
  	  	    },
  	  	  ],
  	  	},
  	  ],
  	},
    // ... (rest of the categories data is unchanged)
    {
      id: "sector",
      icon: Building,
      title: "Sector-Wise Schemes",
      subtitle: "Technology, Healthcare, etc.",
      description:
        "Biotechnology, AI/DeepTech, AgriTech, Gaming, EdTech and more sector-specific grants",
            color: "bg-pink/20",
            iconColor: "text-pink",
      items: [
        {
          name: "Biotech – BIRAC BIG",
          description: "Biotechnology sector specific grants and support",
          website: "https://birac.nic.in/",
          fundingType: "Grant",
          sector: "Biotech",
          deadline: "Next month",
              amount: "₹50 Lakhs",
              tag: "Govt",
            },
            {
              name: "AI / DeepTech – SAMRIDH",
              description:
                "Artificial Intelligence and Deep Technology initiatives",
              website: "https://msh.meity.gov.in/schemes/samridh",
              fundingType: "Grant",
              sector: "AI",
              deadline: "This month",
            	amount: "₹40 Lakhs",
            	tag: "Govt",
          	},
          	{
          	  name: "AgriTech – ASPIRE",
          	  description: "Agricultural technology and rural innovation support",
          	  website: "https://aspire.msme.gov.in/ASPIRE/AFHome.aspx",
          	  fundingType: "Grant",
          	  sector: "Agri",
          	  deadline: "This week",
          	  amount: "₹25 Lakhs",
          	  tag: "Govt",
          	},
          	{
          	  name: "SpaceTech – IN-SPACe",
          	  description: "Space technology and satellite innovation support",
          	  website: "https://www.inspace.gov.in/inspace",
          	  fundingType: "Grant",
          	  sector: "Deeptech",
  	    	  deadline: "Next month",
  	    	  amount: "₹1 Crore",
  	    	  tag: "Govt",
  	    	},
  	    	{
  	    	  name: "Gaming – Digital India Fund",
  	    	  description: "Gaming and digital content development support",
  	    	  website: "https://seedfund.startupindia.gov.in/",
  	    	  fundingType: "Grant",
  	    	  sector: "SaaS",
  	    	  deadline: "This month",
  	    	  amount: "₹30 Lakhs",
  	    	  tag: "Govt",
  	    	},
  	    	{
  	    	  name: "EdTech / Skilling – MSDE",
  	    	  description: "Education technology and skill development initiatives",
  	    	  website: "https://www.msde.gov.in/offerings?page=2",
  	    	  fundingType: "Grant",
  	    	  sector: "Edtech",
  	    	  deadline: "Next month",
  	    	  amount: "₹20 Lakhs",
  	    	  tag: "Govt",
  	    	},
  	    	{
  	    	  name: "Women / SC-ST – Stand-Up India",
  	    	  description: "Support for women and SC/ST entrepreneurs",
  	    	  website: "https://www.standupmitra.in/Login/IndexNewSchemeFeatures",
  	    	  fundingType: "Grant",
  	    	  sector: "Fintech",
  	    	  deadline: "This week",
  	    	  amount: "₹1 Crore",
  	    	  tag: "Govt",
  	    	},
  	    	{
  	    	  name: "SINE IIT Bombay",
  	    	  description:
  	    	    "Sector-agnostic innovation & incubation support (Pan India)",
  	    	  website: "https://www.sineiitb.org/",
  	    	  fundingType: "Equity",
  	    	  sector: "Deeptech",
  	    	  deadline: "Next month",
  	    	  amount: "₹75 Lakhs",
  	    	  tag: "Incubator",
  	    	},
  	  	],
  	},
  	{
  	  id: "state",
  	  icon: MapPin,
  	  title: "State-Wise Schemes",
  	  subtitle: "All Indian States",
  	  description:
  	    "Odisha, Karnataka, Gujarat, Kerala, Telangana and other state specific startup support",
  	      	color: "bg-rose-gold/20",
  	      	iconColor: "text-rose-gold",
  	  items: [
  	    {
  	      name: "Odisha",
  	      description: "Odisha state startup support and initiatives",
  	      website: "https://startupodisha.gov.in/startup-incentives/",
  	      fundingType: "Grant",
  	      sector: "SaaS",
  	      deadline: "This month",
  	      amount: "₹25 Lakhs",
  	      tag: "Govt",
  	    },
  	    {
  	      name: "Karnataka",
  	      description: "Karnataka state startup ecosystem support",
  	      website: "https://www.missionstartupkarnataka.org/?en",
  	      fundingType: "Grant",
  	      sector: "AI",
  	      deadline: "Next month",
  	      amount: "₹50 Lakhs",
  	      tag: "Govt",
  	    },
  	    {
  	      name: "Startup TN",
  	      description: "Tamil Nadu startup mission and support",
  	      website: "https://startuptn.in/",
  	      fundingType: "Grant",
  	      sector: "Health",
  	      deadline: "This week",
  	      amount: "₹30 Lakhs",
  	      tag: "Govt",
  	    },
  	    {
  	      name: "Gujarat SSIP",
  	      description: "Gujarat Student Startup and Innovation Policy",
  	      website: "https://www.ssipgujarat.in/",
  	    },
  	    {
  	      name: "Kerala Startup Mission (KSUM) Incubator",
  	      description: "Flagship state incubator for Kerala-based startups",
  	      website: "https://startupmission.kerala.gov.in/",
  	    },
  	    {
  	      name: "Rajasthan iStart",
  	      description: "Rajasthan startup promotion scheme",
  	      website: "https://istart.rajasthan.gov.in/",
  	    },
  	    {
  	      name: "T-Hub Telangana",
  	      description: "Telangana state startup ecosystem support",
  	      website: "https://t-hub.co/startups/",
  	    },
  	    {
  	      name: "UP Startup",
  	      description: "Uttar Pradesh startup policy and support",
  	      website: "https://startinup.up.gov.in/funding/",
  	    },
  	    {
  	      name: "HP Startup Yojana",
  	      description: "Himachal Pradesh startup support scheme",
  	      website: "https://emerginghimachal.hp.gov.in/startup/",
  	    },
  	    {
  	      name: "Kerala Startup Cell & NASSCOM 10,000 Startups",
  	      description:
  	        "Incubation & accelerator programs in Karnataka and Bangalore (by Govt & NASSCOM)",
  	      website: "https://www.missionstartupkarnataka.org/",
  	    },
  	    {
  	      name: "Startup Odisha Incubator",
  	      description:
  	        "Government-supported incubator for entrepreneurs in Odisha",
  	      website: "https://startupodisha.gov.in/incubator-notification/",
  	    },
  	    // --- NEWLY ADDED STATE LINKS START HERE ---
  	    { name: "Andhra Pardesh", description: "State wise grants link", website: "https://apstartups.in/" },
  	    { name: "Assam", description: "State wise grants link", website: "https://startup.assam.gov.in/" },
  	    { name: "Chhattisgarh", description: "State wise grants link", website: "https://industries.cg.gov.in/startupcg/" },
  	    { name: "Madhya Pardesh", description: "State wise grants link", website: "https://startup.mp.gov.in/" },
  	    { name: "Manipur", description: "State wise grants link", website: "https://startupmanipur.in/" },
  	    { name: "Mizoram", description: "State wise grants link", website: "https://startupmizoram.com/" },
  	    { name: "Tripura", description: "State wise grants link", website: "https://startup.tripura.gov.in/" },
  	    { name: "Uttarakhand", description: "State wise grants link", website: "https://startuputtarakhand.uk.gov.in/" },
  	    { name: "Arunachal Pradesh", description: "State wise grants link", website: "https://www.startup.arunachal.gov.in/" },
  	    { name: "Bihar", description: "State wise grants link", website: "https://startup.bihar.gov.in/" },
  	    { name: "Goa", description: "State wise grants link", website: "https://www.startup.goa.gov.in/" },
  	    { name: "Haryana", description: "State wise grants link", website: "https://startupharyana.gov.in/" },
  	    { name: "Jharkhand", description: "State wise grants link", website: "https://abvil.jharkhand.gov.in/" },
  	    { name: "Maharashtra", description: "State wise grants link", website: "https://maitri.maharashtra.gov.in/startup-resources/" },
  	    { name: "Meghalaya", description: "State wise grants link", website: "https://www.primemeghalaya.com/" },
  	    { name: "Nagaland", description: "State wise grants link", website: "https://www.startupnagaland.in/" },
  	    { name: "Punjab", description: "State wise grants link", website: "https://pbindustries.gov.in/startup/startup_punjab;Key=policy" },
  	    { name: "Sikkim", description: "State wise grants link", website: "https://industries.sikkim.gov.in/visitors" },
  	    { name: "West Bengal", description: "State wise grants link", website: "https://www.startupbengal.in/" },
  	    { name: "Andaman and Nicobar Islands", description: "State wise grants link", website: "https://as.and.nic.in/startupindia/" },
  	    { name: "Daman and diu", description: "State wise grants link", website: "https://startup.dddgov.in/" },
  	    { name: "Jammu and Kashmir", description: "State wise grants link", website: "https://www.startupjk.com/" },
  	    { name: "Ladakh", description: "State wise grants link", website: "https://industries.ladakh.gov.in/index.html" },
  	    { name: "Lakshadweep", description: "State wise grants link", website: "https://lakshadweep.gov.in/" },
  	    { name: "Puducherry", description: "State wise grants link", website: "https://industry.py.gov.in/" },
  	    // --- NEWLY ADDED STATE LINKS END HERE ---
  	  ],
  	},
  	{
  	  id: "central",
  	  icon: University,
  	  title: "Central Govt Schemes",
  	  subtitle: "Ministry Programs",
  	  description:
  	    "SISFS, Stand-Up India, MUDRA Loans, CGSS, GENESIS and other central government initiatives",
  	      	color: "bg-violet/20",
  	      	iconColor: "text-violet",
  	  items: [
  	    {
  	      name: "SISFS",
  	      description: "Startup India Seed Fund Scheme",
  	      website: "https://seedfund.startupindia.gov.in/",
  	      fundingType: "Grant",
  	      sector: "SaaS",
  	      deadline: "This month",
  	      amount: "₹50 Lakhs",
  	      tag: "Govt",
  	    },
  	    {
  	      name: "FFS (SIDBI)",
  	      description: "Fund of Funds for Startups by SIDBI",
  	      website: "https://www.sidbivcf.in/en",
  	      fundingType: "Equity",
  	      sector: "Fintech",
  	      deadline: "Next month",
  	      amount: "₹10 Crores",
  	      tag: "Govt",
  	    },
  	    {
  	      name: "MUDRA Loans",
  	      description: "Micro Units Development and Refinance Agency loans",
  	      website: "https://www.mudra.org.in/",
  	      fundingType: "Grant",
  	      sector: "Agri",
  	      deadline: "This week",
  	      amount: "₹10 Lakhs",
  	      tag: "Govt",
  	    },
  	    {
  	      name: "Stand-Up India",
  	      description: "Support for SC/ST and women entrepreneurs",
  	      website: "https://www.standupmitra.in/Login/IndexNewSchemeFeatures",
  	    },
  	    {
  	      name: "CGSS",
  	      description: "Credit Guarantee Scheme for Startups",
  	      website:
  	        "https://www.ncgtc.in/en/product-details/CGSS/Credit-Guarantee-Scheme-for-Start-ups-(CGSS)",
  	    },
  	    {
  	      name: "BIRAC BIG",
  	      description: "Biotechnology Innovation Grant",
  	      website: "https://birac.nic.in/",
  	    },
  	    {
  	      name: "TIDE / SAMRIDH",
  	      description: "Technology incubation and software product support",
  	      website: "https://msh.meity.gov.in/schemes/samridh",
  	    },
  	    {
  	      name: "GENESIS",
          	description: "Gen-next support for innovative startups",
          	website: "https://msh.meity.gov.in/schemes/genesis",
        	},
        	{
        	  name: "ASPIRE",
        	  description: "Rural and agri-business incubation support",
        	  website: "https://aspire.msme.gov.in/ASPIRE/AFHome.aspx",
        	},
        	{
        	  name: "Atal Incubation Centres (AICs) – NITI Aayog",
        	  description:
        	    "National network of incubators supporting innovation & entrepreneurship pan-India",
        	  website: "https://aim.gov.in/aic.php",
        	},
      	],
  	},
  	{
  	  id: "private",
  	  icon: Globe,
  	  title: "Private & Global Grants",
  	  subtitle: "International Funding",
  	  description:
  	    "Google for Startups, AWS Activate, Microsoft Founders Hub, Gates Foundation and more",
  	      	color: "bg-pink/20",
  	      	iconColor: "text-red",
  	  items: [
  	    {
  	      name: "Google for Startups",
  	      description: "Google's global startup support program",
  	      website: "https://startup.google.com/",
  	      fundingType: "Grant",
  	      sector: "SaaS",
  	      deadline: "This month",
  	      amount: "$100K",
  	      tag: "Private",
  	    },
  	    {
  	      name: "AWS Activate",
  	      description: "Amazon Web Services startup support and credits",
  	      website: "https://aws.amazon.com/startups",
  	      fundingType: "Grant",
  	      sector: "SaaS",
  	      deadline: "Next month",
  	      amount: "$100K",
  	      tag: "Private",
  	    },
  	    {
  	      name: "Cisco LaunchPad",
  	      description: "Cisco's startup accelerator program",
  	      website: "https://startups.cisco.com/",
  	      fundingType: "Equity",
  	      sector: "Deeptech",
  	      deadline: "This week",
  	      amount: "$500K",
  	      tag: "Private",
  	    },
  	    {
  	      name: "Villgro",
  	      description: "Social innovation incubator and accelerator",
  	      website: "https://villgro.org/",
  	      fundingType: "Grant",
  	      sector: "Health",
  	      deadline: "Next month",
  	      amount: "₹50 Lakhs",
  	      tag: "Incubator",
  	    },
  	    {
  	      name: "Social Alpha",
  	      description: "Impact tech innovation platform",
  	      website: "https://www.socialalpha.org/",
  	    	fundingType: "Grant",
  	    	sector: "Health",
  	    	deadline: "This month",
  	    	amount: "₹25 Lakhs",
  	    	tag: "Incubator",
  	    	},
  	    	{
  	    	  name: "The/Nudge Incubator",
  	    	  description: "Social impact incubator program",
  	    	  website:
  	    	    "https://www.thenudge.org/livelihoods-ecosystem/social-entrepreneurship/incubator/",
  	    	  fundingType: "Grant",
  	    	  sector: "Fintech",
  	    	  deadline: "This week",
  	    	  amount: "₹30 Lakhs",
  	    	  tag: "Incubator",
  	    	},
  	    	{
  	    	  name: "CIIE.CO (IIMA)",
  	    	  description: "IIM Ahmedabad's startup incubator",
  	    	  website: "https://iimaventures.com/current-programs/",
  	    	  fundingType: "Equity",
  	    	  sector: "Fintech",
  	    	  deadline: "Next month",
  	    	  amount: "₹1 Crore",
  	    	  tag: "Incubator",
  	    	},
  	    	{
  	    	  name: "Gates Foundation",
  	    	  description: "Global health and development grants",
  	    	  website: "https://www.gatesfoundation.org/",
  	    	  fundingType: "Grant",
  	    	  sector: "Health",
  	    	  deadline: "Next month",
  	    	  amount: "$1M",
  	    	  tag: "Private",
  	    	},
  	    	{
  	    	  name: "Microsoft for Startups Founders Hub",
  	    	  description: "Cloud credits and global support for private startups",
  	    	  website: "https://www.microsoft.com/en-in/startups",
  	    	  fundingType: "Grant",
  	    	  sector: "SaaS",
  	    	  deadline: "This month",
  	    	  amount: "$120K",
  	    	  tag: "Private",
  	    	},
  	    	{
  	    	  name: "GSVlabs (now OneValley)",
  	    	  description:
  	    	    "Global startup support platform offering mentoring, workspace, capital access",
  	    	  website: "https://www.theonevalley.com/onevalley-announcement",
  	    	  fundingType: "Equity",
  	    	  sector: "Edtech",
  	    	  deadline: "Next month",
  	    	  amount: "$500K",
  	    	  tag: "Private",
  	    	},
  	    	{
  	    	  name: "Techstars Bangalore",
  	    	  description:
  	    	    "Global accelerator network – Bangalore program for Indian startups",
  	    	  website: "https://www.techstars.com/accelerators",
  	    	  fundingType: "Equity",
  	    	  sector: "SaaS",
  	    	  deadline: "This month",
  	    	  amount: "$120K",
  	    	  tag: "Private",
  	    	},
  	  	],
  	},
  	{
  	  id: "acadmin",
  	  icon: Award,
  	  title: "Research & Academic Infra",
  	  subtitle: "Academic Programs",
  	  description:
  	    "University-based research and academic infrastructure support programs",
  	      	color: "bg-rose-gold/20",
  	      	iconColor: "text-rose-gold",
  	  stages: [
  	    {
  	      id: "repositories",
  	      title: "📚 Research Repositories & Knowledge Platforms",
  	      grants: [
  	        {
  	          name: "Shodhganga",
  	          description:
  	            "PhD Research, Scholarly Publications, Academic Citations repository",
  	          website: "https://shodhganga.inflibnet.ac.in/",
  	        },
  	        {
  	         name: "NDLI (National Digital Library)",
  	         description:
  	         "Digital Libraries, Educational Resources, Research Papers access",
  	         website: "https://ndl.iitkgp.ac.in/",
  	          },
  	          {
  	           name: "IndiaRxiv",
  	           description:
  	           "Research Publishing, Peer Review, Academic Networking preprint server",
  	        	website: "https://ops.iihr.res.in/index.php/IndiaRxiv",
  	        	},
  	        	{
  	        	  name: "OpenAlex",
  	        	  description:
  	        	    "Research Analytics, Citation Networks, Academic Trends analysis",
  	        	  website: "https://openalex.org/",
  	        	},
  	        	{
  	        	  name: "arXiv / bioRxiv",
  	        	  description:
  	        	    "Machine Learning, Quantum Computing, Biotechnology, Drug Discovery archives",
  	        	  website: "https://arxiv.org/",
  	        	},
  	        	{
  	        	  name: "IRINS (Indian Research Information Network System)",
  	        	  description:
  	        	    "Research Collaboration, Expert Networks, R&D Partnerships platform",
  	        	  website: "https://library.nith.ac.in/library/irins.php",
  	        	},
  	      	],
  	    	  },
  	    	  {
  	    	   id: "government",
  	    	   title: "🏛️ Government Research Organizations",
  	    	   grants: [
  	    	  	{
  	    	  	  name: "CSIR Labs",
  	    	  	  description:
  	    	  	    "Materials Science, Chemical Engineering, Biotechnology, Electronics R&D",
  	    	  	  website: "https://www.csir.res.in/hi",
  	    	  	},
  	    	  	{
  	    	  	  name: "DRDO",
  	    	  	  description:
  	    	  	    "Defence Technology, Radar Systems, Missile Technology, Electronic Warfare, Cybersecurity",
  	    	  	  website: "https://www.drdo.gov.in/drdo/",
  	    	  	},
  	    	  	{
  	    	  	  name: "ISRO",
  	    	  	  description:
  	    	  	    "Space Technology, Earth Observation, Navigation Systems, Launch Vehicles, Space Applications",
  	    	  	  website: "https://www.isro.gov.in/",
  	    	  	},
  	    	  	{
  	    	  	  name: "ICMR",
  	    	  	  description:
  	    	"Healthcare, Clinical Research, Medical Diagnostics, Public Health Solutions, Pharmaceuticals",
  	    	website: "https://www.icmr.gov.in/",
  	    	  },
  	    	  {
  	    	    name: "ICAR",
  	    	    description:
  	    	      "AgriTech, Precision Agriculture, Food Processing, Plant Breeding, Agricultural Robotics",
  	    	    website: "https://icar.org.in/",
  	    	  },
  	    	  {
  	    	    name: "DAE (Department of Atomic Energy)",
  	    	    description:
  	    	      "Nuclear Technology, Nuclear Medicine, Radiation Technology, Advanced Materials, Energy Solutions",
  	    	    website: "https://dae.gov.in/",
  	    	  },
  	  	],
  	},
  	{
  	id: "academic",
  	title: "🏫 Academic Incubators & Innovation Centers",
  	grants: [
  	  {
  	    name: "RCB (Regional Centre for Biotechnology)",
  	    description:
  	      "Drug Discovery, Molecular Biology, Medical Diagnostics, Bioinformatics research hub",
  	    website: "https://rcb.res.in/",
  	  },
  	  {
  	    name: "SINE @ IIT Bombay",
  	    description:
  	      "Semiconductors, Quantum Computing, Electric Mobility, Space Technology incubator",
  	    website: "https://www.sineiitb.org/",
  	  },
  	  {
  	    name: "CIIE.CO @ IIM Ahmedabad",
  	    description:
  	      "FinTech, Digital Healthcare, IoT Healthcare, Dental Technology accelerator",
  	    website: "https://iimaventures.com/",
  	  },
  	  {
  	    name: "NSRCEL @ IIM Bangalore",
  	    description:
  	      "Women Entrepreneurship, Social Impact, Early-stage Ventures incubator",
  	    website: "https://nsrcel.org/",
  	  },
  	  {
  	    name: "Venture Center (NCL Pune)",
  	    description:
  	      "Biotech, Chemical Sciences, Drug Discovery, Materials Science, Chemical Process Innovation",
  	    website: "https://www.venturecenter.co.in/",
  	  },
  	  {
  	    name: "FITT @ IIT Delhi",
  	    description:
  	      "Clean Energy, IoT Solutions, Industrial Automation, Software Development incubator",
  	    website: "https://fitt-iitd.in/web/home",
  	  },
  	  {
  	    name: "AIC @ IIIT Hyderabad",
  	    description:
  	      "Artificial Intelligence, Machine Learning, Data Analytics, Information Security",
  	    website: "https://aic.iiit.ac.in/",
  	  },
  	  {
  	    name: "KIIT-TBI",
  	    description:
  	      "Software Development, Biomedical Devices, Industrial Solutions incubator",
  	    website: "https://kiit.ac.in/",
  	  },
  	],
    },
    {
  	id: "corporate",
  	title: "🏢 Corporate & Private Research Incubators",
  	grants: [
  	  {
  	    name: "T-Hub @ Hyderabad",
  	    description:
  	      "FinTech, HealthTech, AgriTech, SmartCity, Transportation & Logistics innovation hub",
  	    website: "https://t-hub.co/",
  	  },
  	  {
  	    name: "Nasscom 10,000 Startups",
  	    description:
  	      "Enterprise Software, Mobile Applications, Cloud Solutions, Digital Transformation",
  	    website: "https://10000startups.com/",
  	  },
  	  {
  	    name: "Zone Startups India",
  	    description:
  	      "International Expansion, Cross-border Solutions, Global Markets accelerator",
  	    website: "https://www.zonestartups.com/",
  	  },
  	  {
  	    name: "Microsoft Accelerator",
  	    description:
  	      "Artificial Intelligence, Machine Learning, Cloud Applications, Enterprise Solutions",
  	    website:
  	      "https://www.microsoft.com/en-in/msidc/academia-accelerator",
  	  },
  	  {
  	    name: "Swissnex",
  	    description:
  	      "Deep Tech, Clean Tech, International Collaborations, Technology Transfer, Global Market",
  	    website: "https://swissnex.org/",
  	  },
  	],
    },
    {
  	id: "specialized",
  	title: "🔬 Specialized Research Centers",
  	grants: [
  	  {
  	    name: "IISc Bangalore",
  	    description:
  	      "Advanced Materials, Aerospace, Computational Sciences, Energy research university",
  	    website: "https://iisc.ac.in/",
  	  },
  	  {
  	    name: "TIFR (Tata Institute of Fundamental Research)",
  	    description:
  	      "Theoretical Physics, Mathematics, Computer Science, Biological Sciences research",
  	    website: "https://www.tifr.res.in/",
  	  },
  	  {
  	    name: "NCCS (National Centre for Cell Science)",
  	    description:
  	      "Cell Biology, Stem Cell Research, Cancer Research, Molecular Medicine",
  	    website: "https://www.nccs.res.in/",
  	  },
  	  {
  	    name: "CCMB (Centre for Cellular and Molecular Biology)",
  	    description:
  	      "Genomics, Proteomics, Bioinformatics, Agricultural Biotechnology research",
  	    website: "https://www.ccmb.res.in/",
  	  },
  	],
    },
    {
  	id: "sectoral",
  	title: "🎯 Sector-Specific Research Resources",
  	grants: [
  	  {
  	    name: "BIRAC",
  	    description:
  	      "Drug Discovery, Medical Diagnostics, Bioengineering, Digital Health funding agency",
  	    website: "https://birac.nic.in/",
  	  },
  	  {
  	    name: "C-CAMP",
  	    description:
  	      "Drug Development, Medical Devices, Digital Therapeutics, Precision Medicine incubator",
  	    website: "https://ccamp.res.in/",
  	  },
  	  {
  	    name: "NSTEDB",
  	    description:
  	      "Technology Commercialization, IP Development, R&D Innovation support",
  	    website:
  	      "https://www.indiascienceandtechnology.gov.in/startups/nstedb-dst",
  	  },
  	  {
  	    name: "SIDBI Innovation Centre",
  	    description:
  	      "Digital Lending, Payment Solutions, Supply Chain Finance, Rural Banking",
  	    website:
  	      "https://www.indiascienceandtechnology.gov.in/technologyincubators/sidbi-innovation-and-incubation-centre-siic",
  	  },
  	  {
  	    name: "TIDES (NIOT)",
  	    description:
  	      "Marine Sensors, Underwater Robotics, Coastal Engineering, Aquaculture Tech",
  	    website: "https://www.niot.res.in/",
  	  },
  	  {
  	    name: "ARAI (Automotive Research Association)",
  	    description:
  	      "Electric Vehicles, Autonomous Systems, Automotive Testing, Emission Control",
  	    website: "https://www.araiindia.com/",
  	  },
  	],
    },
    {
  	id: "international",
  	title: "🌍 International Collaboration Platforms",
  	grants: [
  	  {
  	    name: "Indo-German Science Centre",
  	    description:
  	      "Precision Engineering, Automation, Clean Technology, Digital Manufacturing",
  	    website: "https://www.igstc.org/",
  	  },
  	  {
  	    name: "UK-India Education Initiative",
  	    description:
  	      "Educational Technology, Research Translation, Innovation Management",
  	    website: "https://www.ukieri.org/",
  	  },
  	  {
  	    name: "Australia-India Research Fund",
  	    description:
  	      "Renewable Energy, Climate Solutions, Smart Agriculture, Water Technology",
  	    website:
  	      "https://www.industry.gov.au/science-technology-and-innovation/international-collaboration/collaborating-india",
  	  },
  	  {
  	    name: "Japan-India Partnership",
  	    description:
  	      "Industrial Robotics, AI Applications, Smart Manufacturing, Mobility Solutions",
  	    website: "https://www.jst.go.jp/",
  	  },
  	  {
  	    name: "Israel-India Industrial R&D",
  	    description:
  	      "Cyber Defense, Military Technology, Aerospace Systems, Security Solutions",
  	    website: "https://i4f.org/",
  	  },
  	],
    },
  ],
},
{
  id: "international",
  icon: Rocket,
  title: "International Accelerators & Incubators",
  subtitle: "Global Programs",
  description:
    "Top-tier international accelerators and incubators from around the world",
        color: "bg-violet/20",
        iconColor: "text-violet",
  stages: [
    {
      id: "top-tier",
      title: "🌟 Top-Tier Global Accelerators",
      grants: [
        {
          name: "Y Combinator",
          description:
            "Pre-seed–Seed | General Tech | Global - Premier startup accelerator",
          website: "https://www.ycombinator.com/",
        },
        {
          name: "Techstars",
          description:
            "Pre-seed–Seed | General Tech | Global - Worldwide startup accelerator network",
          website: "https://www.techstars.com/",
        },
        {
          name: "500 Startups (500 Global)",
          description:
            "Pre-seed–Seed | General Tech | Global - Early-stage venture fund and accelerator",
          website: "https://500.co/",
        },
        {
          name: "Sequoia Arc",
          description:
            "Seed | General Tech | Silicon Valley, USA - Sequoia Capital's accelerator program",
          website: "https://www.sequoiacap.com/arc",
        },
      ],
    },
    {
      id: "hardware-deeptech",
      title: "🔧 Hardware & Deep-Tech Accelerators",
      grants: [
        {
          name: "HAX",
          description:
            "Pre-seed | Hardware & Deep-Tech | Global - Hardware accelerator program",
          website: "https://hax.co/",
        },
  	  {
  	    name: "SOSV",
  	    description:
  	      "Pre-seed | Hardware & Deep-Tech | Global - Multi-stage venture capital firm",
  	    website: "https://sosv.com/",
  	  },
  	  {
  	    name: "HighTechXL",
  	    description:
  	      "Pre-seed | Hardware & Deep-Tech | Europe - Deep-tech venture builder",
  	    website: "https://www.hightechxl.com/",
  	  },
  	  {
  	    name: "NVIDIA Inception",
  	    description:
  	      "Growth | AI/ML | Global - AI startup accelerator program",
  	    website: "https://www.nvidia.com/en-us/startups/",
  	  },
  	],
  	},
  	{
  	id: "corporate",
  	title: "🏢 Corporate Accelerators",
  	grants: [
  	  {
  	    name: "Microsoft Accelerator",
  	    description:
  	      "Growth | Cloud Tech | Global - Microsoft's startup accelerator program",
  	    website: "https://www.microsoft.com/accelerator",
  	  },
  	  {
  	    name: "Plug & Play",
  	    description:
  	      "Seed–Series C | Sector Specific | Global - Innovation platform and accelerator",
  	    website: "https://www.plugandplaytechcenter.com/",
  	  },
  	  {
  	    name: "Disney Accelerator",
  	    description:
  	      "Growth | Media & Entertainment | Los Angeles, USA - Disney's accelerator program",
  	    website: "https://sites.disney.com/accelerator/",
  	  },
  	  {
  	    name: "Samsung NEXT",
  	    description:
  	      "Growth | Deep Tech | Global - Samsung's innovation arm",
  	    website: "https://www.samsungnext.com/",
  	  },
  	  {
  	    name: "Mastercard Start Path",
  	    description:
  	      "Growth | FinTech | Global - Mastercard's startup engagement program",
  	    website: "https://startpath.mastercard.com/",
  	  },
  	  {
  	    name: "Coca-Cola Founders",
  	    description:
  	      "Growth | Consumer Goods | Atlanta, USA - Coca-Cola's accelerator program",
  	    website: "https://www.coca-colacompany.com/",
  	  },
  	],
    },
    {
  	id: "university",
  	title: "🎓 University-Affiliated Programs",
  	grants: [
  	  {
  	    name: "Stanford StartX",
  	    description:
  	      "Seed & Pre-seed | University Spin-offs | Stanford, USA - Equity-free accelerator",
  	    website: "https://web.startx.com/",
  	  },
  	  {
  	    name: "Berkeley SkyDeck",
  	    description:
  	      "Seed | University Spin-offs | Berkeley, USA - UC Berkeley's accelerator",
  	    website: "https://skydeck.berkeley.edu/",
  	  },
  	  {
  	    name: "MIT Sandbox",
  	    description:
  	      "Pre-seed | Student Startups | Boston, USA - MIT's innovation program",
  	    website: "https://sandbox.mit.edu/",
  	  },
  	  {
  	    name: "Oxford Foundry",
  	    description:
  	      "Seed | University Spin-offs | Oxford, UK - Oxford University's startup incubator",
  	    website:
  	      "https://www.sbs.ox.ac.uk/research/centres-and-initiatives/oxford-said-entrepreneurship-centre/oxford-foundry-elevate-accelerator",
  	  },
  	  {
  	    name: "Creative Destruction Lab",
  	    description:
  	      "Seed | Science-based | Canada - Objectives-based program for seed-stage ventures",
  	    website: "https://creativedestructionlab.com/",
  	  },
  	],
    },
    {
  	id: "regional",
  	title: "🌍 Regional Leaders",
  	grants: [
  	  {
  	    name: "Antler",
  	    description:
  	      "Pre-seed | Co-founder Matching | Global (25+ cities) - Early-stage VC and startup generator",
  	    website: "https://www.antler.co/",
  	  },
  	  {
  	    name: "Station F",
  	    description:
  	      "Seed | General Tech | Paris, France - World's biggest startup campus",
  	    website: "https://stationf.co/",
  	  },
  	  {
  	    name: "APX by Porsche",
  	    description:
  	      "Seed | Mobility & Industrial | Berlin, Germany - Early-stage accelerator",
  	    website: "https://apx.vc/",
  	  },
  	  {
  	    name: "Startupbootcamp",
  	    description:
  	      "Seed–Series C | Sector Specific | Global - Multi-corporate accelerator",
  	    website: "https://www.startupbootcamp.org/",
  	  },
  	],
    },
    {
  	id: "fintech",
  	title: "🏦 FinTech Accelerators",
  	grants: [
  	  {
  	    name: "Barclays Accelerator",
  	    description:
  	      "Growth | FinTech | London, NYC - Barclays' fintech accelerator program",
  	    website:
  	      "https://home.barclays/who-we-are/innovation/barclays-accelerator/",
  	  },
  	  {
  	    name: "JPMorgan Chase In-Residence",
  	    description:
  	      "Growth | FinTech | Global - JPMorgan's startup partnership program",
  	    website: "https://www.jpmorgan.com/global",
  	  },
  	  {
  	    name: "Fintech Fusion",
  	    description:
  	      "Seed | FinTech | Switzerland - Swiss fintech accelerator",
  	    website: "https://fintechfusion.org/",
  	  },
  	],
    },
    {
  	id: "asia-pacific",
  	title: "🌏 Asia-Pacific Accelerators",
  	grants: [
  	  {
  	    name: "K-Startup GC",
  	    description:
  	      "Seed | General Tech | South Korea - Korean government startup accelerator",
  	    website: "https://www.k-startupgc.org/",
  	  },
  	  {
  	    name: "SparkLabs",
  	    description:
  	      "Seed | General Tech | South Korea - Leading accelerator in Korea",
  	    website: "https://sparklabs.co.kr/kr/",
  	  },
  	  {
  	    name: "AcceleratorHK",
  	    description:
  	      "Seed | General Tech | Hong Kong - Hong Kong's startup accelerator",
  	    website:
  	      "https://www.hugedomains.com/domain_profile.cfm?d=acceleratorhk.com&utm_source=hdrhttpstest",
  	  },
  	  {
  	    name: "Founders Factory",
  	    description:
  	      "Seed | General Tech | Singapore - Corporate-backed accelerator",
  	    website: "https://foundersfactory.com/",
  	  },
  	  {
  	    name: "Golden Gate Ventures",
  	    description:
  	      "Seed | General Tech | Southeast Asia - Early-stage VC focused on SEA",
  	    website: "https://www.goldengate.vc/",
  	  },
  	  {
  	    name: "Chinaccelerator",
  	    description:
  	      "Seed | Cross-border Tech | Shanghai, China - Cross-border accelerator",
  	    website: "https://orbitstartups.com/",
  	  },
  	],
    },
    {
  	id: "latin-america",
  	title: "🌎 Latin America Accelerators",
  	grants: [
  	  {
  	    name: "Start-Up Chile",
  	    description:
  	      "Seed & Pre-seed | Equity-Free Tech | Chile - Government-backed equity-free program",
  	    website: "https://startupchile.org/",
  	  },
  	  {
  	    name: "Parallel 18",
  	    description:
  	      "Seed | General Tech | Puerto Rico - International accelerator program",
  	    website: "https://parallel18.com/",
  	  },
  	  {
  	    name: "NXTP Labs",
  	    description:
  	      "Seed | General Tech | Latin America - Early-stage accelerator and VC",
  	    website: "https://nxtplabs.com/",
  	  },
  	  {
  	    name: "Wayra",
  	    description:
  	      "Seed | General Tech | Latin America - Telefónica's innovation hub",
  	    website: "https://wayra.com/",
  	  },
  	],
    },
  	{
  	id: "emerging-markets",
  	title: "🌍 Emerging Markets & Africa",
  	grants: [
  	  {
  	    name: "MEST",
  	    description:
  	      "Seed & Pre-seed | Equity-Free Tech | Africa - Pan-African technology entrepreneurship program",
  	    website: "https://meltwater.org/",
  	  },
  	  {
  	    name: "Flat6Labs",
  	    description:
  	      "Seed | General Tech | MENA Region - Leading accelerator in MENA",
  	    website: "https://flat6labs.com/",
  	  },
  	  {
  	    name: "iHub",
  	    description:
  	      "Pre-seed | General Tech | Kenya, Africa - Kenya's innovation hub",
  	    website: "https://ihub.co.ke/",
  	  },
  	  {
  	    name: "Endeavor",
  	    description:
  	      "Growth | Scale-ups | Emerging Markets - Global high-impact entrepreneurship",
  	    website: "https://endeavor.org/",
  	  },
  	],
  	},
  	{
  	id: "specialized",
  	title: "🎯 Specialized Focus Accelerators",
  	grants: [
  	  {
  	    name: "ERA",
  	    description:
  	      "Seed (early revenue) | General Tech | New York, USA - Revenue-stage accelerator",
  	    website: "https://www.eranyc.com/",
  	  },
  	  {
  	    name: "AngelPad",
  	    description:
  	      "Seed | Product-Market Fit | SF & NYC, USA - Highly selective accelerator",
  	    website: "https://angelpad.com/",
  	  },
  	  {
  	    name: "Alchemist Accelerator",
  	    description:
  	      "Seed | Enterprise B2B | Silicon Valley, USA - B2B-focused accelerator",
  	    website: "https://www.alchemistaccelerator.com/",
  	  },
  	  {
  	    name: "Village Capital",
  	    description:
  	      "Seed | Impact/Social | Global - Impact-focused investment firm",
  	    website: "https://vilcap.com/",
  	  },
  	  {
  	    name: "RGA Accelerator",
  	    description:
  	      "Growth | InsurTech | Global - Insurance technology accelerator",
  	    website: "https://ventures.rga.com/",
  	  },
  	  {
  	    name: "MassChallenge",
  	    description:
  	      "Seed | Equity-Free | USA, Mexico, Israel, UK - Zero-equity accelerator",
  	    website: "https://masschallenge.org/",
  	  },
  	],
  	},
  ],
},
];

  // --- HELPER & LOGIC FUNCTIONS ---

  const handleCategoryClick = (categoryId: string) => {
    if (isMobile) {
      setActiveCategoryId(prevId => (prevId === categoryId ? null : categoryId));
    } else {
      setActiveCategoryId(categoryId);
    }
  };

  const toggleStage = (stageId: string) => {
    const newSet = new Set(expandedStages);
    if (newSet.has(stageId)) newSet.delete(stageId);
    else newSet.add(stageId);
    setExpandedStages(newSet);
  };

  const toggleFilter = (filterType: keyof FilterOptions, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[filterType];
      const newFilter = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [filterType]: newFilter };
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({ stage: [], fundingType: [], sector: [], deadline: [] });
  };

  const toggleBookmark = (grantName: string) => {
    setBookmarkedGrants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(grantName)) newSet.delete(grantName);
      else newSet.add(grantName);
      return newSet;
    });
  };

  const hasActiveFilters = useMemo(() => {
    return Object.values(selectedFilters).some(filters => filters.length > 0);
  }, [selectedFilters]);

  const combinedFilter = (items: (Grant | string)[]) => {
    const term = searchTerm.toLowerCase();
    return items.filter(item => {
      const grant = typeof item === 'object' ? item : null;

      const searchTermMatch = !term || (
        grant 
        ? grant.name.toLowerCase().includes(term) || grant.description.toLowerCase().includes(term)
        : item.toString().toLowerCase().includes(term)
      );
      if (!searchTermMatch) return false;

      if (!grant) return true; // Strings don't have other filter properties

      const stageMatch = selectedFilters.stage.length === 0 || (grant.stage && selectedFilters.stage.includes(grant.stage));
      const fundingTypeMatch = selectedFilters.fundingType.length === 0 || (grant.fundingType && selectedFilters.fundingType.includes(grant.fundingType));
      const sectorMatch = selectedFilters.sector.length === 0 || (grant.sector && selectedFilters.sector.includes(grant.sector));
      const deadlineMatch = selectedFilters.deadline.length === 0 || (grant.deadline && selectedFilters.deadline.includes(grant.deadline));
      
      return stageMatch && fundingTypeMatch && sectorMatch && deadlineMatch;
    });
  };

  const visibleCategories = useMemo(() => {
    return categories.map(category => {
        let itemsToFilter: (Grant | string)[] = [];
        if (category.stages) {
            itemsToFilter = category.stages.flatMap(stage => stage.grants);
        } else if (category.items) {
            itemsToFilter = category.items;
        }
        const count = combinedFilter(itemsToFilter).length;
        return { ...category, count };
    });
  }, [searchTerm, selectedFilters]);

  // --- NEW LOGIC: Automatically select the first category with search results ---
  useEffect(() => {
    // Only run this logic if a search term is active
    if (searchTerm) {
      const firstCategoryWithResults = visibleCategories.find(cat => cat.count > 0);
      if (firstCategoryWithResults) {
        setActiveCategoryId(firstCategoryWithResults.id);
      } else {
        setActiveCategoryId(null); // If no results, no category is active
      }
    } else {
        // When search is cleared, reset to the default category
        setActiveCategoryId('stage');
    }
  }, [searchTerm, visibleCategories]); // Rerun when search term or filtered results change
  
  const activeCategory = useMemo(() => {
    return visibleCategories.find(c => c.id === activeCategoryId) || null;
  }, [activeCategoryId, visibleCategories]);

  const totalGrantsCount = useMemo(() => {
    return visibleCategories.reduce((total, cat) => total + cat.count, 0);
  }, [visibleCategories]);

  const activeFilterCount = useMemo(() => {
    return Object.values(selectedFilters).reduce((sum, filters) => sum + filters.length, 0);
  }, [selectedFilters]);


  // --- RENDER FUNCTIONS ---

  const GrantCard = ({ grant }: { grant: Grant }) => (
    <div className="bg-yellowish-white rounded-2xl p-5 transition-all shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.28)] flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-bold text-lg text-violet pr-2">{grant.name}</h4>
        <button
          onClick={(e) => { e.stopPropagation(); toggleBookmark(grant.name); }}
          className="text-gray-400 hover:text-violet transition-colors flex-shrink-0"
        >
          {bookmarkedGrants.has(grant.name)
            ? <BookmarkCheck className="h-5 w-5 text-violet" />
            : <Bookmark className="h-5 w-5" />
          }
        </button>
      </div>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{grant.description}</p>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
        {grant.amount && <div className="flex items-center"><span className="font-semibold text-green-600 mr-2">💰</span> {grant.amount}</div>}
        {grant.deadline && <div className="flex items-center"><span className="font-semibold text-red-500 mr-2">🗓️</span> {grant.deadline}</div>}
        {grant.fundingType && <div className="flex items-center"><span className="font-semibold text-purple-500 mr-2"> G </span> {grant.fundingType}</div>}
        {grant.sector && <div className="flex items-center"><span className="font-semibold text-yellow-500 mr-2">🏢</span> {grant.sector}</div>}
      </div>

      <div className="border-t border-gray-100 pt-4 mt-auto">
        <div className="flex items-center justify-between">
          <a href={grant.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-violet hover:text-pink inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <ExternalLink className="h-4 w-4" /> Website
          </a>
          <Button size="sm" className="bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold" onClick={(e) => {e.stopPropagation(); navigate("/apply"); }}>Apply</Button>
        </div>
      </div>
    </div>
  );

  const renderStageContent = (category: Category) => (
    <div className="space-y-6">
      {category.stages?.map(stage => {
        const filteredStageGrants = combinedFilter(stage.grants);
        if (filteredStageGrants.length === 0) return null;
        return (
          <div key={stage.id}>
            <div onClick={() => toggleStage(stage.id)} className="flex items-center justify-between cursor-pointer mb-4 p-3 bg-yellowish-white rounded-2xl transition-all duration-300 shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.2)]">
              <h3 className="text-lg font-bold text-gray-800">{stage.title}</h3>
              <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedStages.has(stage.id) ? "rotate-180" : ""}`} />
            </div>
            {expandedStages.has(stage.id) && (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredStageGrants.map((grant, index) => <GrantCard key={`${stage.id}-${index}`} grant={grant as Grant} />)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderRegularContent = (category: Category) => {
    const filteredCategoryItems = combinedFilter(category.items || []);
    if (filteredCategoryItems.length === 0) return null;
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {filteredCategoryItems.map((item, index) =>
          typeof item === 'object'
            ? <GrantCard key={`${category.id}-${index}`} grant={item as Grant} />
            : (
              <div key={`${category.id}-${index}`} className="bg-yellowish-white rounded-2xl p-4 transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.28)]">
                <h4 className="font-semibold text-violet">{item}</h4>
              </div>
            )
          )}
        </div>
      );
  };
  
  return (
    <section id="grants" className="py-10 sm:py-20 min-h-screen" style={{
        background: 'white'
      }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      	{/* Header */}
      	<div className="text-center mb-12">
      	  <h2 className="text-4xl lg:text-5xl font-extrabold text-violet mb-4 tracking-tight">
      	    Your Grant Library
      	  </h2>
      	  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
      	    Discover grants, schemes, and programs perfectly matched to your startup's needs.
      	  </p>
      	</div>

      
      	<div className="py-4 mb-8  lg:top-24 z-10 lg:bg-white/80 lg:backdrop-blur-sm">
      	
      	  <div className="flex flex-col md:flex-row items-stretch gap-4">
      	  
      	    <div className="flex-grow flex relative shadow-lg shadow-black/20 rounded-xl overflow-hidden border-0 bg-yellowish-white">
       	      <input
       	        type="text"
       	        placeholder="Search grants by name or description..."
       	        className="w-full px-4 h-[48px] focus:outline-none focus:ring-0 focus-visible:ring-0 text-violet placeholder-gray-500 bg-transparent rounded-l-xl rounded-r-none"
       	        value={searchTerm}
       	        onChange={(e) => setSearchTerm(e.target.value)}
       	      />
       	      {searchTerm && (
       	        <button
       	          onClick={() => setSearchTerm("")}
       	          className="absolute right-[110px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
       	          aria-label="Clear search"
       	        >
       	          <X className="h-4 w-4" />
       	        </button>
       	      )}
       	      <button className="h-[48px] bg-violet hover:bg-pink text-white px-6 transition-colors font-medium rounded-r-xl rounded-l-none shadow-lg shadow-black/20 hover:shadow-black/40 font-semibold transform hover:-translate-y-[1px]">
       	        Search
       	      </button>
       	    </div>
       	    <Button
       	      onClick={() => setShowFilters(!showFilters)}
       	      variant="outline"
       	      className="w-full md:w-auto hover:text-pink bg-yellowish-white hover:bg-pink/20 text-violet font-medium px-4 py-3 flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-black/20 hover:shadow-black/40 transition-all duration-300"
       	    >
       	      <Filter className="h-4 w-4" />
   	      <span>Filters</span>
   	      {hasActiveFilters && (
   	        <span className="bg-violet text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
   	          {activeFilterCount}
   	        </span>
   	      )}
   	    </Button>
   	    <Button
   	      onClick={() => navigate("/apply")}
   	      className="bg-violet hover:bg-pink text-white px-6 transition-colors font-medium rounded-xl shadow-lg font-semibold"
   	    >
   	      Apply for Grant
   	    </Button>
   	  </div>

   	  {/* Filter Panel */}
   	  {showFilters && (
   	    <div className="mt-4 bg-yellowish-white rounded-2xl shadow-xl shadow-black/20 p-6 animate-in fade-in-0 duration-300">
   	      <div className="flex items-center justify-between mb-4">
   	        <h3 className="text-lg font-semibold text-violet">Filters</h3>
   	        <Button onClick={() => setShowFilters(false)} variant="ghost" size="sm" className="text-violet hover:text-pink rounded-xl"><X className="h-4 w-4" /></Button>
   	      </div>

   	      
   	      	{hasActiveFilters && (
   	      	<div className="pb-4 mb-4 border-b space-y-4">
   	      	  	<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm">
   	      	  	<div className="flex items-center gap-4 text-gray-600 font-medium">
   	      	  	  	<span>Total Grants Found: <strong className="text-gray-800">{totalGrantsCount}</strong></span>
   	      	  	  	<span className="text-violet">Active Filters: <strong className="text-violet">{activeFilterCount}</strong></span>
   	      	  	</div>
   	      	  	<Button onClick={clearAllFilters} variant="link" size="sm" className="text-violet hover:text-pink px-0 font-medium">
   	      	  	  	Clear All Filters
   	      	  	</Button>
   	      	  	</div>
   	      	  	<div className="flex flex-wrap gap-2">
   	      	  	  	{Object.entries(selectedFilters).map(([filterType, values]) =>
   	      	  	  	values.map((value: string) => (
   	      	  	  	  	<div
   	      	  	  	  	key={`${filterType}-${value}`}
   	      	  	  	  	className="flex items-center gap-2 bg-violet/20 text-violet px-3 py-1 rounded-full text-sm font-medium shadow-sm shadow-black/10"
   	      	  	  	  	>
   	      	  	  	  	<span className="capitalize">{filterType.replace(/([A-Z])/g, ' $1')}: {value}</span>
   	      	  	  	  	<button
   	      	  	  	  	  	onClick={() => toggleFilter(filterType as keyof FilterOptions, value)}
   	      	  	  	  	  	className="text-violet hover:bg-pink/20 rounded-full p-0.5 transition-colors"
   	      	  	  	  	  	>
   	      	  	  	  	  	<X className="h-3 w-3" />
   	      	  	  	  	</button>
   	      	  	  	  	</div>
   	      	  	  	))
   	      	  	  	)}
   	      	  	</div>
   	      	</div>
   	      	)}

   	      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
   	        {Object.entries(filterOptions).map(([key, options]) => (
   	          <div key={key}>
   	            <h4 className="font-medium text-violet mb-3 capitalize">{key === 'fundingType' ? 'Funding Type' : key}</h4>
   	            <div className="space-y-2">
   	              {options.map(option => (
   	                <label key={option} className="flex items-center gap-2 cursor-pointer">
   	                  <input type="checkbox" checked={selectedFilters[key as keyof FilterOptions].includes(option)} onChange={() => toggleFilter(key as keyof FilterOptions, option)} className="rounded-xl border-pink text-violet focus:ring-pink focus:border-violet" />
   	                  <span className="text-sm text-gray-700 font-medium">{option}</span>
   	                </label>
   	              ))}
   	            </div>
   	          </div>
   	        ))}
   	      </div>
   	    </div>
   	  )}
   	</div>

   	<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
 
   	  <div className="lg:col-span-4 lg:sticky lg:top-56">
   	    <div className="bg-yellowish-white rounded-2xl shadow-lg shadow-black/20 p-4">
   	      <h3 className="font-bold text-lg mb-4 px-2">Categories</h3>
   	      <div className="space-y-1">
   	        {visibleCategories.map(category => {
            
              const isActive = activeCategoryId === category.id;
              const hasSearchResults = searchTerm && category.count > 0;
              let buttonClass = 'hover:bg-pink/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.2)]';
              if (isActive) {
                buttonClass = 'bg-violet/10 text-violet shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)]'; 
              } else if (hasSearchResults) {
                buttonClass = 'hover:bg-pink/10'; 
              }

              return (
              <div key={category.id}>
   	          <button
                  onClick={() => handleCategoryClick(category.id)}
   	            className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-4 ${buttonClass}`}
   	          >
   	            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${category.color}`}>
   	              <category.icon className={`h-5 w-5 ${category.iconColor}`} />
   	            </div>
   	            <div>
   	              <p className="font-semibold">{category.title}</p>
   	              <p className="text-xs text-violet font-medium">{category.count} schemes</p>
   	            </div>
   	          </button>

                {/* Mobile Accordion Content */}
                {isMobile && activeCategoryId === category.id && (
                  <div className="mt-4 p-4 space-y-6 animate-in fade-in-0 duration-300">
                    <div className="p-6 bg-yellowish-white rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                      <h2 className="text-2xl font-bold text-violet mb-1">{category.title}</h2>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                    {category.stages
                      ? renderStageContent(category)
                      : renderRegularContent(category)
                    }
                  </div>
                )}
              </div>
              );
            })}
   	        {visibleCategories.length === 0 && (
   	          	<div className="p-4 text-center text-sm text-violet font-medium">No matching categories found.</div>
   	        )}
   	      </div>
   	    </div>
   	  </div>

   	
   	  <div className="hidden lg:block lg:col-span-8">
   	    {activeCategory && totalGrantsCount > 0 ? (
   	      <div className="space-y-6">
   	        <div className="p-6 bg-yellowish-white rounded-2xl shadow-lg shadow-black/20 hover:shadow-black/30">
   	          <h2 className="text-2xl font-bold text-violet mb-1">{activeCategory.title}</h2>
   	          <p className="text-gray-600">{activeCategory.description}</p>
   	        </div>
   	        {activeCategory.stages
   	          ? renderStageContent(activeCategory)
   	          : renderRegularContent(activeCategory)
   	        }
   	      </div>
   	    ) : (
   	      <div className="text-center py-20">
   	        <div className="bg-yellowish-white p-8 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.15)] ">
   	          <h3 className="text-xl font-bold mb-2">No Results Found</h3>
   	          <p className="text-gray-600">
   	            Try adjusting your search or filter criteria to find what you're looking for.
   	          </p>
   	          {(searchTerm || hasActiveFilters) && (
   	            <Button 
              onClick={() => { setSearchTerm(''); clearAllFilters(); }} 
              className="mt-4 bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold"
            >
   	              Clear Search & Filters
   	            </Button>
   	          )}
   	          	</div>
   	      	</div>
   	    )}
   	  </div>
  	</div>
   </div>
 </section>
 );
}
