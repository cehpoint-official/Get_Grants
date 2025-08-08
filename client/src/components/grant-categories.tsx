import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ExternalLink } from "lucide-react";
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

interface Grant {
  name: string;
  description: string;
  website: string;
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

export function GrantCategories() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [_, navigate] = useLocation();
  const toggleDropdown = (dropdownId: string) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
    // Clear expanded stages when closing or switching categories
    if (openDropdown !== dropdownId) {
      setExpandedStages(new Set());
    }
  };

  const toggleStage = (stageId: string) => {
    const newSet = new Set(expandedStages);
    if (newSet.has(stageId)) {
      newSet.delete(stageId);
    } else {
      newSet.add(stageId);
    }
    setExpandedStages(newSet);
  };
  const filterGrants = (grants: Grant[]) => {
    if (!searchTerm.trim()) return grants;
    const term = searchTerm.toLowerCase();
    return grants.filter(
      (grant) =>
        grant.name.toLowerCase().includes(term) ||
        grant.description.toLowerCase().includes(term)
    );
  };

  const filterItems = (items: (string | Grant)[]) => {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase();
    return items.filter((item) => {
      if (typeof item === "string") {
        return item.toLowerCase().includes(term);
      }
      return (
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
    });
  };
  const shouldDisplayCategory = (
    category: Category,
    searchTerm: string
  ): boolean => {
    if (!searchTerm.trim()) return true;

    if (category.stages) {
      // For stage-based categories
      return category.stages.some((stage) => {
        const filteredGrants = filterGrants(stage.grants);
        return filteredGrants.length > 0;
      });
    } else if (category.items) {
      // For regular item categories
      const filteredItems = filterItems(category.items);
      return filteredItems.length > 0;
    }

    return true;
  };
  const categories: Category[] = [
    {
      id: "stage",
      icon: Rocket,
      title: "Stage-Wise Schemes",
      subtitle: "Ideation to Scale-Up",
      description:
        "Find grants based on your startup's current stage of development",
      color: "bg-blue-100",
      iconColor: "text-primary-blue",
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
            },
            {
              name: "SSIP Gujarat",
              description: "Student Startup and Innovation Policy support",
              website: "https://www.ssipgujarat.in/",
            },
            {
              name: "PRISM",
              description: "Promoting Innovations in Students and Researchers",
              website:
                "https://www.dsir.gov.in/promoting-innovations-individuals-start-ups-and-msmes-prism",
            },
            {
              name: "BIG (Biotech)",
              description:
                "Biotechnology Innovation Grant for early-stage biotech ideas",
              website: "https://birac.nic.in/",
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
            },
            {
              name: "NIDHI-SSP",
              description: "Startup Support Programme for technology startups",
              website: "https://nidhi.dst.gov.in/nidhissp/",
            },
            {
              name: "SAMRIDH",
              description: "Software products and services support program",
              website: "https://msh.meity.gov.in/schemes/samridh",
            },
            {
              name: "TIDE 2.0",
              description:
                "Technology Incubation and Development of Entrepreneurs",
              website: "https://msh.meity.gov.in/schemes/tide",
            },
            {
              name: "CIIE.CO Accelerators (IIM Ahmedabad)",
              description:
                "Accelerator & incubation support for early-stage startups across India",
              website: "https://iimaventures.com/current-programs/",
            },
            {
              name: "IITM Incubation Cell",
              description:
                "India's leading deep tech startup incubator (Chennai, all stages)",
              website: "http://rtbi.in/incubationiitm/",
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
            },
            {
              name: "PMMY",
              description: "Pradhan Mantri MUDRA Yojana for micro enterprises",
              website: "https://www.mudra.org.in/",
            },
            {
              name: "Stand-Up India / CGSS",
              description: "Support for SC/ST and women entrepreneurs",
              website:
                "https://www.standupmitra.in/Login/IndexNewSchemeFeatures",
            },
          ],
        },
      ],
    },
    {
      id: "sector",
      icon: Building,
      title: "Sector-Wise Schemes",
      subtitle: "Technology, Healthcare, etc.",
      description:
        "Biotechnology, AI/DeepTech, AgriTech, Gaming, EdTech and more sector-specific grants",
      color: "bg-blue-100",
      iconColor: "text-primary-blue",
      items: [
        {
          name: "Biotech – BIRAC BIG",
          description: "Biotechnology sector specific grants and support",
          website: "https://birac.nic.in/",
        },
        {
          name: "AI / DeepTech – SAMRIDH",
          description:
            "Artificial Intelligence and Deep Technology initiatives",
          website: "https://msh.meity.gov.in/schemes/samridh",
        },
        {
          name: "AgriTech – ASPIRE",
          description: "Agricultural technology and rural innovation support",
          website: "https://aspire.msme.gov.in/ASPIRE/AFHome.aspx",
        },
        {
          name: "SpaceTech – IN-SPACe",
          description: "Space technology and satellite innovation support",
          website: "https://www.inspace.gov.in/inspace",
        },
        {
          name: "Gaming – Digital India Fund",
          description: "Gaming and digital content development support",
          website: "https://seedfund.startupindia.gov.in/",
        },
        {
          name: "EdTech / Skilling – MSDE",
          description: "Education technology and skill development initiatives",
          website: "https://www.msde.gov.in/offerings?page=2",
        },
        {
          name: "Women / SC-ST – Stand-Up India",
          description: "Support for women and SC/ST entrepreneurs",
          website: "https://www.standupmitra.in/Login/IndexNewSchemeFeatures",
        },
        {
          name: "SINE IIT Bombay",
          description:
            "Sector-agnostic innovation & incubation support (Pan India)",
          website: "https://www.sineiitb.org/",
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
      color: "bg-blue-100",
      iconColor: "text-primary-blue",
      items: [
        {
          name: "Odisha",
          description: "Odisha state startup support and initiatives",
          website: "https://startupodisha.gov.in/startup-incentives/",
        },
        {
          name: "Karnataka",
          description: "Karnataka state startup ecosystem support",
          website: "https://www.missionstartupkarnataka.org/?en",
        },
        {
          name: "Startup TN",
          description: "Tamil Nadu startup mission and support",
          website: "https://startuptn.in/",
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
      ],
    },
    {
      id: "central",
      icon: University,
      title: "Central Govt Schemes",
      subtitle: "Ministry Programs",
      description:
        "SISFS, Stand-Up India, MUDRA Loans, CGSS, GENESIS and other central government initiatives",
      color: "bg-blue-100",
      iconColor: "text-primary-blue",
      items: [
        {
          name: "SISFS",
          description: "Startup India Seed Fund Scheme",
          website: "https://seedfund.startupindia.gov.in/",
        },
        {
          name: "FFS (SIDBI)",
          description: "Fund of Funds for Startups by SIDBI",
          website: "https://www.sidbivcf.in/en",
        },
        {
          name: "MUDRA Loans",
          description: "Micro Units Development and Refinance Agency loans",
          website: "https://www.mudra.org.in/",
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
      color: "bg-blue-100",
      iconColor: "text-primary-blue",
      items: [
        {
          name: "Google for Startups",
          description: "Google's global startup support program",
          website: "https://startup.google.com/",
        },
        {
          name: "AWS Activate",
          description: "Amazon Web Services startup support and credits",
          website: "https://aws.amazon.com/startups",
        },
        {
          name: "Cisco LaunchPad",
          description: "Cisco's startup accelerator program",
          website: "https://startups.cisco.com/",
        },
        {
          name: "Villgro",
          description: "Social innovation incubator and accelerator",
          website: "https://villgro.org/",
        },
        {
          name: "Social Alpha",
          description: "Impact tech innovation platform",
          website: "https://www.socialalpha.org/",
        },
        {
          name: "The/Nudge Incubator",
          description: "Social impact incubator program",
          website:
            "https://www.thenudge.org/livelihoods-ecosystem/social-entrepreneurship/incubator/",
        },
        {
          name: "CIIE.CO (IIMA)",
          description: "IIM Ahmedabad's startup incubator",
          website: "https://iimaventures.com/current-programs/",
        },
        {
          name: "Gates Foundation",
          description: "Global health and development grants",
          website: "https://www.gatesfoundation.org/",
        },
        {
          name: "Microsoft for Startups Founders Hub",
          description: "Cloud credits and global support for private startups",
          website: "https://www.microsoft.com/en-in/startups",
        },
        {
          name: "GSVlabs (now OneValley)",
          description:
            "Global startup support platform offering mentoring, workspace, capital access",
          website: "https://www.theonevalley.com/onevalley-announcement",
        },
        {
          name: "Techstars Bangalore",
          description:
            "Global accelerator network – Bangalore program for Indian startups",
          website: "https://www.techstars.com/accelerators",
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
      color: "bg-blue-100",
      iconColor: "text-primary-blue",
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
      color: "bg-blue-100",
      iconColor: "text-primary-blue",
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

  const renderStageContent = (category: Category) => {
    return (
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="p-6">
          <div className="space-y-2">
            {category.stages?.map((stage) => {
              const filteredGrants = filterGrants(stage.grants);
              if (searchTerm && filteredGrants.length === 0) return null;
              return (
                <div key={stage.id} className="space-y-2">
                  <div
                    className="flex items-center gap-3 px-4 py-3 -mx-4 -my-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => toggleStage(stage.id)}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        expandedStages.has(stage.id)
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <span className="font-medium text-gray-800 flex-1">
                      {stage.title.replace(/^[^\w]+/, "")}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-500 transition-transform ${
                        expandedStages.has(stage.id) ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {expandedStages.has(stage.id) && (
                    <div className="ml-6 pl-2 border-l-2 border-gray-200">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                        {filteredGrants.map((grant, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-3 shadow-sm hover:shadow transition-all group cursor-pointer border border-gray-200 hover:border-blue-200"
                          >
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                {grant.name}
                              </h4>
                              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                            </div>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {grant.description}
                            </p>
                            <a
                              href={grant.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Visit Website
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  const renderRegularContent = (category: Category) => {
    const filteredItems = filterItems(category.items || []);
    if (searchTerm && filteredItems.length === 0) return null;
    return (
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all group cursor-pointer border border-gray-200 hover:border-primary-blue"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 group-hover:text-primary-blue transition-colors">
                    {typeof item === "string" ? item : item.name}
                  </h4>
                  {typeof item === "object" && (
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary-blue transition-colors flex-shrink-0 ml-2" />
                  )}
                </div>
                {typeof item === "object" && (
                  <>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-blue hover:text-accent-blue transition-colors inline-flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  return (
    <section id="grants" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Explore Grant Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse through our organized categories to find the perfect funding
            opportunity for your startup
          </p>
        </div>
        <div className="max-w-6xl mx-auto mb-8 px-4">
          <div className="flex flex-col md:flex-row items-stretch gap-4 mb-8">
            {/* Search Bar */}
            <div className="flex flex-1 relative shadow-sm rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search grants by name or description..."
                className="w-full px-5 py-3 border border-gray-200 focus:ring-2 focus:ring-primary-blue text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-24 top-3 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
              <button className="bg-primary-blue hover:bg-accent-blue text-white px-6 py-3 transition-colors font-medium">
                Search
              </button>
            </div>

            {/* Apply Button */}
            <Button
              onClick={() => navigate("/apply")}
              className="bg-primary-blue hover:bg-accent-blue text-white font-semibold px-6 py-3 w-full md:w-auto"
            >
              Apply for Grant
            </Button>
          </div>

          {showForm && <GrantApplicationForm />}
        </div>

        <div className="max-w-6xl mx-auto space-y-4">
          {categories.map((category) => {
            const shouldShow = shouldDisplayCategory(category, searchTerm);
            if (!shouldShow) return null;

            return (
              <div
                key={category.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center flex-1">
                      <div
                        className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mr-4`}
                      >
                        <category.icon className="h-6 w-6 text-black" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {category.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {category.subtitle}
                        </p>
                        <p className="text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => toggleDropdown(category.id)}
                      className="bg-primary-blue hover:bg-accent-blue text-white font-medium transition-colors flex items-center gap-2 ml-4"
                    >
                      {openDropdown === category.id
                        ? "Collapse"
                        : "Explore Schemes"}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openDropdown === category.id ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </div>

                {openDropdown === category.id &&
                  (category.stages
                    ? renderStageContent(category)
                    : renderRegularContent(category))}
              </div>
            );
          })}
          {searchTerm &&
            categories.every(
              (category) => !shouldDisplayCategory(category, searchTerm)
            ) && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No grants found matching your search. Try different keywords.
                </p>
              </div>
            )}
        </div>
      </div>
    </section>
  );
}
