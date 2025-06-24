import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, Copy, ExternalLink, X, RotateCcw, TrendingUp, Banana, Users, Code, Eye, Zap, Target, Flame, Shield } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  marketCap: number;
  liquidity: number;
  volume: number;
  transactions: number;
  buyTxns: number;
  sellTxns: number;
  contractAddress: string;
  protocol?: string;
  dexPaid?: boolean;
  topHoldersPercent?: number;
  insiderHolding?: number;
  bundlers?: number;
  devHoldings?: number;
  holdersCount?: number;
  proTradersCount?: number;
  snipersPercent?: number;
  lpBurned?: boolean;
  socials: {
    twitter?: string;
    telegram?: string;
    discord?: string;
    website?: string;
  };
}

interface SortConfig {
  key: keyof Token | null;
  direction: 'asc' | 'desc';
}

interface Filters {
  priceMin: number | null;
  priceMax: number | null;
  volumeMin: number | null;
  volumeMax: number | null;
  marketCapMin: number | null;
  marketCapMax: number | null;
  liquidityMin: number | null;
  liquidityMax: number | null;
  txnsMin: number | null;
  txnsMax: number | null;
  selectedProtocols: string[];
  searchKeywords: string;
  excludeKeywords: string;
  dexPaid: boolean | null;
  topHoldersMin: number | null;
  topHoldersMax: number | null;
  insiderHoldingMin: number | null;
  insiderHoldingMax: number | null;
  bundlersMin: number | null;
  bundlersMax: number | null;
  devHoldingsMin: number | null;
  devHoldingsMax: number | null;
  holdersCountMin: number | null;
  holdersCountMax: number | null;
  proTradersCountMin: number | null;
  proTradersCountMax: number | null;
}

const protocols = [
  { name: "Pump", color: "bg-green-600", icon: "🚀" },
  { name: "LaunchLab", color: "bg-blue-600", icon: "🔬" },
  { name: "Bonk", color: "bg-orange-600", icon: "🔥" },
  { name: "Dynamic BC", color: "bg-red-600", icon: "⚡" },
  { name: "Launch a Coin", color: "bg-green-700", icon: "💰" },
  { name: "Boop", color: "bg-blue-700", icon: "👻" },
  { name: "Moonit", color: "bg-yellow-600", icon: "🌙" },
  { name: "Raydium", color: "bg-purple-600", icon: "⚡" },
  { name: "Pump AMM", color: "bg-gray-600", icon: "🔧" },
  { name: "Meteora AMM", color: "bg-orange-700", icon: "☄️" },
  { name: "Meteora AMM V2", color: "bg-orange-800", icon: "☄️" },
];

const TrendingTokensTable = ({ timeframe, buyAmount }: { timeframe: string; buyAmount: string }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [paginatedTokens, setPaginatedTokens] = useState<Token[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50); // Show 50 tokens per page
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'volume', direction: 'desc' });
  const [activeFilters, setActiveFilters] = useState<Filters>({
    priceMin: null,
    priceMax: null,
    volumeMin: null,
    volumeMax: null,
    marketCapMin: null,
    marketCapMax: null,
    liquidityMin: null,
    liquidityMax: null,
    txnsMin: null,
    txnsMax: null,
    selectedProtocols: [],
    searchKeywords: "",
    excludeKeywords: "",
    dexPaid: null,
    topHoldersMin: null,
    topHoldersMax: null,
    insiderHoldingMin: null,
    insiderHoldingMax: null,
    bundlersMin: null,
    bundlersMax: null,
    devHoldingsMin: null,
    devHoldingsMax: null,
    holdersCountMin: null,
    holdersCountMax: null,
    proTradersCountMin: null,
    proTradersCountMax: null,
  });

  const generateRandomTokenData = (): Token[] => {
    const baseTokens = [
      {
        id: "1",
        name: "Frogolicious",
        symbol: "FROG",
        contractAddress: "0x1234...5678",
        protocol: "Pump",
        socials: {
          twitter: "https://twitter.com/frogolicious",
          telegram: "https://t.me/frogolicious",
          discord: "https://discord.gg/frogolicious",
          website: "https://frogolicious.com"
        }
      },
      {
        id: "2",
        name: "MoonShot",
        symbol: "MOON",
        contractAddress: "0xabcd...efgh",
        protocol: "LaunchLab",
        socials: {
          twitter: "https://twitter.com/moonshot",
          telegram: "https://t.me/moonshot",
          website: "https://moonshot.com"
        }
      },
      {
        id: "3",
        name: "DiamondHands",
        symbol: "DIAMOND",
        contractAddress: "0x9876...5432",
        protocol: "Raydium",
        socials: {
          twitter: "https://twitter.com/diamondhands",
          discord: "https://discord.gg/diamondhands",
          website: "https://diamondhands.com"
        }
      },
      {
        id: "4",
        name: "RocketFuel",
        symbol: "ROCKET",
        contractAddress: "0xdef0...1234",
        protocol: "Bonk",
        socials: {
          twitter: "https://twitter.com/rocketfuel",
          telegram: "https://t.me/rocketfuel",
          discord: "https://discord.gg/rocketfuel",
          website: "https://rocketfuel.com"
        }
      },
      {
        id: "5",
        name: "CryptoKing",
        symbol: "KING",
        contractAddress: "0x5678...9abc",
        protocol: "Meteora AMM",
        socials: {
          telegram: "https://t.me/cryptoking",
          discord: "https://discord.gg/cryptoking",
          website: "https://cryptoking.com"
        }
      }
    ];

    // Generate more tokens for pagination
    const moreTokenNames = [
      "SolFlare", "MoonRocket", "CryptoGem", "DefiKing", "TokenMaster",
      "BlockChain", "SatoshiCoin", "EtherDream", "BitGold", "AltCoin",
      "MetaVerse", "NFTWorld", "GameFi", "YieldFarm", "LiquidGold",
      "SmartContract", "DecentralFi", "CoinBase", "TradeFi", "SwapCoin",
      "StakingRewards", "BurnToken", "HodlCoin", "PumpIt", "MoonLambo",
      "DiamondPaws", "RocketShip", "ToTheMoon", "BullRun", "BearTrap",
      "WhaleWallet", "FishTank", "ShrimpArmy", "CrabDance", "OctopusInk",
      "TurtlePower", "RabbitHole", "FoxFire", "WolfPack", "LionHeart",
      "EagleEye", "HawkVision", "OwlWisdom", "PenguinPool", "PolarBear",
      "PandaPower", "KoalaCoin", "KangarooJump", "ElephantMemory", "RhinoCharge"
    ];

    const allTokens = [];
    
    // Add base tokens
    baseTokens.forEach((token, index) => {
      allTokens.push({
        ...token,
        price: Math.random() * 0.01,
        priceChange: (Math.random() - 0.5) * 1000,
        marketCap: Math.floor(Math.random() * 5000000) + 500000,
        liquidity: Math.floor(Math.random() * 200000) + 30000,
        volume: Math.floor(Math.random() * 1000000) + 100000,
        transactions: Math.floor(Math.random() * 3000) + 500,
        buyTxns: Math.floor(Math.random() * 2000) + 200,
        sellTxns: Math.floor(Math.random() * 1500) + 200,
        dexPaid: Math.random() > 0.5,
        topHoldersPercent: Math.floor(Math.random() * 50) + 20,
        insiderHolding: Math.floor(Math.random() * 30) + 5,
        bundlers: Math.floor(Math.random() * 20) + 2,
        devHoldings: Math.floor(Math.random() * 15) + 1,
        holdersCount: Math.floor(Math.random() * 10000) + 1000,
        proTradersCount: Math.floor(Math.random() * 500) + 50,
        snipersPercent: Math.floor(Math.random() * 25) + 2,
        lpBurned: Math.random() > 0.3,
      });
    });

    // Generate additional tokens
    moreTokenNames.forEach((name, index) => {
      const symbol = name.toUpperCase().substring(0, Math.min(name.length, 6));
      const protocols = ["Pump", "LaunchLab", "Bonk", "Dynamic BC", "Launch a Coin", "Boop", "Moonit", "Raydium", "Pump AMM", "Meteora AMM", "Meteora AMM V2"];
      
      allTokens.push({
        id: (baseTokens.length + index + 1).toString(),
        name: name,
        symbol: symbol,
        price: Math.random() * 0.01,
        priceChange: (Math.random() - 0.5) * 1000,
        marketCap: Math.floor(Math.random() * 5000000) + 500000,
        liquidity: Math.floor(Math.random() * 200000) + 30000,
        volume: Math.floor(Math.random() * 1000000) + 100000,
        transactions: Math.floor(Math.random() * 3000) + 500,
        buyTxns: Math.floor(Math.random() * 2000) + 200,
        sellTxns: Math.floor(Math.random() * 1500) + 200,
        contractAddress: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        dexPaid: Math.random() > 0.5,
        topHoldersPercent: Math.floor(Math.random() * 50) + 20,
        insiderHolding: Math.floor(Math.random() * 30) + 5,
        bundlers: Math.floor(Math.random() * 20) + 2,
        devHoldings: Math.floor(Math.random() * 15) + 1,
        holdersCount: Math.floor(Math.random() * 10000) + 1000,
        proTradersCount: Math.floor(Math.random() * 500) + 50,
        snipersPercent: Math.floor(Math.random() * 25) + 2,
        lpBurned: Math.random() > 0.3,
        socials: {
          twitter: Math.random() > 0.3 ? `https://twitter.com/${name.toLowerCase()}` : undefined,
          telegram: Math.random() > 0.5 ? `https://t.me/${name.toLowerCase()}` : undefined,
          discord: Math.random() > 0.6 ? `https://discord.gg/${name.toLowerCase()}` : undefined,
          website: Math.random() > 0.4 ? `https://${name.toLowerCase()}.com` : undefined,
        }
      });
    });

    return allTokens;
  };

  // Mock data generation with auto-refresh
  useEffect(() => {
    // Initial data load
    const initialTokens = generateRandomTokenData();
    setTokens(initialTokens);
    setFilteredTokens(initialTokens);

    // Set up interval to refresh data every second
    const interval = setInterval(() => {
      const newTokens = generateRandomTokenData();
      setTokens(newTokens);
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [timeframe]);

  // Pagination effect
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filteredTokens.slice(startIndex, endIndex);
    setPaginatedTokens(paginated);
    setTotalPages(Math.ceil(filteredTokens.length / itemsPerPage));
  }, [filteredTokens, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters, searchTerm]);

  // Search functionality
  useEffect(() => {
    let filtered = tokens.filter(token => 
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.contractAddress.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply protocol filters
    if (activeFilters.selectedProtocols.length > 0) {
      filtered = filtered.filter(token => 
        token.protocol && activeFilters.selectedProtocols.includes(token.protocol)
      );
    }

    // Apply keyword filters
    if (activeFilters.searchKeywords) {
      const keywords = activeFilters.searchKeywords.split(',').map(k => k.trim().toLowerCase());
      filtered = filtered.filter(token =>
        keywords.some(keyword =>
          token.name.toLowerCase().includes(keyword) ||
          token.symbol.toLowerCase().includes(keyword)
        )
      );
    }

    if (activeFilters.excludeKeywords) {
      const excludeKeywords = activeFilters.excludeKeywords.split(',').map(k => k.trim().toLowerCase());
      filtered = filtered.filter(token =>
        !excludeKeywords.some(keyword =>
          token.name.toLowerCase().includes(keyword) ||
          token.symbol.toLowerCase().includes(keyword)
        )
      );
    }

    // Apply dex paid filter
    if (activeFilters.dexPaid !== null) {
      filtered = filtered.filter(token => token.dexPaid === activeFilters.dexPaid);
    }

    // Apply numeric range filters
    const numericFilters = [
      { key: 'price', min: 'priceMin', max: 'priceMax' },
      { key: 'volume', min: 'volumeMin', max: 'volumeMax' },
      { key: 'marketCap', min: 'marketCapMin', max: 'marketCapMax' },
      { key: 'liquidity', min: 'liquidityMin', max: 'liquidityMax' },
      { key: 'transactions', min: 'txnsMin', max: 'txnsMax' },
      { key: 'topHoldersPercent', min: 'topHoldersMin', max: 'topHoldersMax' },
      { key: 'insiderHolding', min: 'insiderHoldingMin', max: 'insiderHoldingMax' },
      { key: 'bundlers', min: 'bundlersMin', max: 'bundlersMax' },
      { key: 'devHoldings', min: 'devHoldingsMin', max: 'devHoldingsMax' },
      { key: 'holdersCount', min: 'holdersCountMin', max: 'holdersCountMax' },
      { key: 'proTradersCount', min: 'proTradersCountMin', max: 'proTradersCountMax' },
    ];

    numericFilters.forEach(({ key, min, max }) => {
      const minValue = activeFilters[min as keyof Filters] as number | null;
      const maxValue = activeFilters[max as keyof Filters] as number | null;
      
      if (minValue !== null) {
        filtered = filtered.filter(token => (token[key as keyof Token] as number) >= minValue);
      }
      if (maxValue !== null) {
        filtered = filtered.filter(token => (token[key as keyof Token] as number) <= maxValue);
      }
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key!] as number;
        const bVal = b[sortConfig.key!] as number;
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    setFilteredTokens(filtered);
  }, [tokens, searchTerm, activeFilters, sortConfig]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value && !searchHistory.includes(value)) {
      setSearchHistory(prev => [value, ...prev.slice(0, 4)]);
    }
  };

  const handleSort = (key: keyof Token) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(6)}`;
  };

  const getSortIcon = (column: keyof Token) => {
    if (sortConfig.key !== column) return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    console.log('Copied to clipboard:', text);
  };

  const openSocialLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleQuickBuy = (token: Token) => {
    console.log('Quick buy clicked for:', token.symbol);
    // Implement quick buy logic here
  };

  const toggleProtocol = (protocolName: string) => {
    setActiveFilters(prev => ({
      ...prev,
      selectedProtocols: prev.selectedProtocols.includes(protocolName)
        ? prev.selectedProtocols.filter(p => p !== protocolName)
        : [...prev.selectedProtocols, protocolName]
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({
      priceMin: null,
      priceMax: null,
      volumeMin: null,
      volumeMax: null,
      marketCapMin: null,
      marketCapMax: null,
      liquidityMin: null,
      liquidityMax: null,
      txnsMin: null,
      txnsMax: null,
      selectedProtocols: [],
      searchKeywords: "",
      excludeKeywords: "",
      dexPaid: null,
      topHoldersMin: null,
      topHoldersMax: null,
      insiderHoldingMin: null,
      insiderHoldingMax: null,
      bundlersMin: null,
      bundlersMax: null,
      devHoldingsMin: null,
      devHoldingsMax: null,
      holdersCountMin: null,
      holdersCountMax: null,
      proTradersCountMin: null,
      proTradersCountMax: null,
    });
    setSearchTerm("");
  };

  const hasActiveFilters = Object.values(activeFilters).some(value => 
    value !== null && value !== "" && (Array.isArray(value) ? value.length > 0 : true)
  ) || searchTerm;
  
  const activeFilterCount = Object.entries(activeFilters).filter(([key, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== "";
  }).length;

  const handleTokenClick = (token: Token) => {
    window.open(`/token/${token.symbol}`, '_blank');
  };

  // Mock function to generate fake tweets for demonstration
  const generateMockTweets = (tokenSymbol: string) => {
    const tweetTemplates = [
      `🚀 $${tokenSymbol} is absolutely mooning right now! Don't miss this gem! #crypto #altcoin`,
      `Just bought more $${tokenSymbol}. This project has incredible potential! 💎🙌`,
      `$${tokenSymbol} community is growing fast! Join us before it's too late! 🔥`,
      `Technical analysis looking bullish for $${tokenSymbol}. Target: 100x 📈`,
      `$${tokenSymbol} holders are diamond hands! 💎 Never selling! #HODL`,
    ];
    
    return tweetTemplates.slice(0, 3).map((template, index) => ({
      id: index + 1,
      content: template,
      author: `@cryptotrader${index + 1}`,
      timestamp: `${Math.floor(Math.random() * 24)}h ago`,
      likes: Math.floor(Math.random() * 1000) + 10,
      retweets: Math.floor(Math.random() * 500) + 5,
    }));
  };

  const getSecurityScore = (token: Token) => {
    let score = 8; // Start with perfect score
    
    // Deduct points based on risk factors
    if ((token.topHoldersPercent || 0) > 40) score -= 2;
    else if ((token.topHoldersPercent || 0) > 30) score -= 1;
    
    if ((token.devHoldings || 0) > 10) score -= 2;
    else if ((token.devHoldings || 0) > 5) score -= 1;
    
    if ((token.insiderHolding || 0) > 20) score -= 2;
    else if ((token.insiderHolding || 0) > 15) score -= 1;
    
    if ((token.bundlers || 0) > 15) score -= 1;
    if ((token.snipersPercent || 0) > 10) score -= 1;
    if (!token.lpBurned) score -= 1;
    
    return Math.max(0, score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-400';
    if (score >= 5) return 'text-yellow-400';
    if (score >= 3) return 'text-orange-400';
    return 'text-red-400';
  };

  const getSecurityIndicators = (token: Token) => {
    const indicators = [
      {
        icon: Users,
        value: token.topHoldersPercent || 0,
        label: "Top 10 Holders %",
        isRisk: (token.topHoldersPercent || 0) > 40,
        tooltip: "Percentage held by top 10 holders. High concentration (>40%) indicates risk."
      },
      {
        icon: Code,
        value: token.devHoldings || 0,
        label: "Dev Holdings %",
        isRisk: (token.devHoldings || 0) > 10,
        tooltip: "Percentage held by developers. High dev holdings (>10%) may indicate risk."
      },
      {
        icon: Eye,
        value: token.insiderHolding || 0,
        label: "Insider Holdings %",
        isRisk: (token.insiderHolding || 0) > 20,
        tooltip: "Percentage held by insiders. High insider concentration (>20%) indicates risk."
      },
      {
        icon: Zap,
        value: token.bundlers || 0,
        label: "Bundlers %",
        isRisk: (token.bundlers || 0) > 15,
        tooltip: "Percentage from bundled transactions. High bundling (>15%) may indicate manipulation."
      },
      {
        icon: Target,
        value: token.snipersPercent || 0,
        label: "Snipers %",
        isRisk: (token.snipersPercent || 0) > 10,
        tooltip: "Percentage held by snipers/bots. High sniper activity (>10%) indicates risk."
      },
      {
        icon: Flame,
        value: token.lpBurned ? 100 : 0,
        label: "LP Burned",
        isRisk: !token.lpBurned,
        tooltip: "Whether liquidity pool tokens are burned. Unburned LP tokens indicate risk.",
        isBoolean: true
      }
    ];

    return indicators;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className={currentPage === i ? "bg-yellow-500 text-black" : "text-white hover:bg-slate-700"}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className={currentPage === 1 ? "bg-yellow-500 text-black" : "text-white hover:bg-slate-700"}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <span className="px-3 py-2 text-slate-400">...</span>
          </PaginationItem>
        );
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className={currentPage === i ? "bg-yellow-500 text-black" : "text-white hover:bg-slate-700"}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <span className="px-3 py-2 text-slate-400">...</span>
          </PaginationItem>
        );
      }

      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
            className={currentPage === totalPages ? "bg-yellow-500 text-black" : "text-white hover:bg-slate-700"}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <TooltipProvider>
      <Card className="bg-slate-800/50 border-slate-700 h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
              Trending Tokens
            </CardTitle>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={clearAllFilters}
                  className="text-slate-400 hover:text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white">
                    <Filter className="w-4 h-4 mr-1" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-2 bg-yellow-500 text-black">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-black border-yellow-500/30 text-white w-96 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="text-yellow-500 text-xl font-bold">Filter Tokens</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    {/* Protocols */}
                    <div>
                      <Label className="text-yellow-500 mb-3 block font-semibold text-sm uppercase tracking-wide">Protocols</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {protocols.map((protocol) => (
                          <Button
                            key={protocol.name}
                            size="sm"
                            variant={activeFilters.selectedProtocols.includes(protocol.name) ? "default" : "outline"}
                            onClick={() => toggleProtocol(protocol.name)}
                            className={`text-xs h-9 transition-all duration-200 ${
                              activeFilters.selectedProtocols.includes(protocol.name)
                                ? "bg-yellow-500 text-black border-yellow-500 hover:bg-yellow-400 font-medium"
                                : "border-yellow-500/30 text-yellow-400 hover:text-black hover:bg-yellow-500 hover:border-yellow-500"
                            }`}
                          >
                            <span className="mr-1">{protocol.icon}</span>
                            {protocol.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Keywords */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-yellow-500 font-semibold text-sm uppercase tracking-wide">Search Keywords</Label>
                        <Input 
                          placeholder="keyword1, keyword2..." 
                          value={activeFilters.searchKeywords} 
                          onChange={(e) => setActiveFilters(prev => ({ 
                            ...prev, 
                            searchKeywords: e.target.value 
                          }))}
                          className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 mt-2 focus:border-yellow-500 focus:ring-yellow-500"
                        />
                      </div>
                      <div>
                        <Label className="text-yellow-500 font-semibold text-sm uppercase tracking-wide">Exclude Keywords</Label>
                        <Input 
                          placeholder="keyword1, keyword2..." 
                          value={activeFilters.excludeKeywords} 
                          onChange={(e) => setActiveFilters(prev => ({ 
                            ...prev, 
                            excludeKeywords: e.target.value 
                          }))}
                          className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 mt-2 focus:border-yellow-500 focus:ring-yellow-500"
                        />
                      </div>
                    </div>

                    {/* Audit and Metrics Tabs */}
                    <Tabs defaultValue="audit" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-yellow-500/30">
                        <TabsTrigger value="audit" className="text-yellow-400 data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-medium">Audit</TabsTrigger>
                        <TabsTrigger value="metrics" className="text-yellow-400 data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-medium">Metrics</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="audit" className="space-y-6 mt-6">
                        {/* Dex Paid */}
                        <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg border border-yellow-500/20">
                          <Checkbox 
                            id="dexPaid"
                            checked={activeFilters.dexPaid === true}
                            onCheckedChange={(checked) => setActiveFilters(prev => ({
                              ...prev,
                              dexPaid: checked ? true : null
                            }))}
                            className="border-yellow-500/50 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                          />
                          <Label htmlFor="dexPaid" className="text-white font-medium">Dex Paid</Label>
                        </div>

                        {/* Top 10 Holders % */}
                        <div>
                          <Label className="text-yellow-500 font-semibold text-sm uppercase tracking-wide">Top 10 Holders %</Label>
                          <div className="flex gap-3 mt-3">
                            <Input 
                              placeholder="Min" 
                              type="number"
                              value={activeFilters.topHoldersMin || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                topHoldersMin: e.target.value ? parseFloat(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                            <Input 
                              placeholder="Max" 
                              type="number"
                              value={activeFilters.topHoldersMax || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                topHoldersMax: e.target.value ? parseFloat(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                          </div>
                        </div>

                        {/* Insider Holding % */}
                        <div>
                          <Label className="text-yellow-500 font-semibold text-sm uppercase tracking-wide">Insider Holding %</Label>
                          <div className="flex gap-3 mt-3">
                            <Input 
                              placeholder="Min" 
                              type="number"
                              value={activeFilters.insiderHoldingMin || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                insiderHoldingMin: e.target.value ? parseFloat(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                            <Input 
                              placeholder="Max" 
                              type="number"
                              value={activeFilters.insiderHoldingMax || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                insiderHoldingMax: e.target.value ? parseFloat(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                          </div>
                        </div>

                        {/* Bundlers % */}
                        <div>
                          <Label className="text-yellow-500 font-semibold text-sm uppercase tracking-wide">Bundlers %</Label>
                          <div className="flex gap-3 mt-3">
                            <Input 
                              placeholder="Min" 
                              type="number"
                              value={activeFilters.bundlersMin || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                bundlersMin: e.target.value ? parseFloat(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                            <Input 
                              placeholder="Max" 
                              type="number"
                              value={activeFilters.bundlersMax || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                bundlersMax: e.target.value ? parseFloat(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                          </div>
                        </div>

                        {/* Dev Holdings % */}
                        <div>
                          <Label className="text-yellow-500 font-semibold text-sm uppercase tracking-wide">Dev Holdings %</Label>
                          <div className="flex gap-3 mt-3">
                            <Input 
                              placeholder="Min" 
                              type="number"
                              value={activeFilters.devHoldingsMin || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                devHoldingsMin: e.target.value ? parseFloat(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                            <Input 
                              placeholder="Max" 
                              type="number"
                              value={activeFilters.devHoldingsMax || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                devHoldingsMax: e.target.value ? parseFloat(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="metrics" className="space-y-6 mt-6">
                        {/* Price Range */}
                        <div>
                          <Label className="text-yellow-500 font-semibold text-sm uppercase tracking-wide">Price Range</Label>
                          <div className="flex gap-3 mt-3">
                            <Input 
                              placeholder="Min Price" 
                              type="number"
                              step="0.000001"
                              value={activeFilters.priceMin || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                priceMin: e.target.value ? parseFloat(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                            <Input 
                              placeholder="Max Price" 
                              type="number"
                              step="0.000001"
                              value={activeFilters.priceMax || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                priceMax: e.target.value ? parseFloat(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                          </div>
                        </div>

                        {/* Volume Range */}
                        <div>
                          <Label className="text-yellow-500 font-semibold text-sm uppercase tracking-wide">Volume Range ($)</Label>
                          <div className="flex gap-3 mt-3">
                            <Input 
                              placeholder="Min Volume" 
                              type="number"
                              value={activeFilters.volumeMin || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                volumeMin: e.target.value ? parseFloat(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                            <Input 
                              placeholder="Max Volume" 
                              type="number"
                              value={activeFilters.volumeMax || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                volumeMax: e.target.value ? parseFloat(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                          </div>
                        </div>

                        {/* Market Cap Range */}
                        <div>
                          <Label className="text-yellow-500 font-semibold text-sm uppercase tracking-wide">Market Cap Range ($)</Label>
                          <div className="flex gap-3 mt-3">
                            <Input 
                              placeholder="Min Market Cap" 
                              type="number"
                              value={activeFilters.marketCapMin || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                marketCapMin: e.target.value ? parseFloat(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                            <Input 
                              placeholder="Max Market Cap" 
                              type="number"
                              value={activeFilters.marketCapMax || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                marketCapMax: e.target.value ? parseFloat(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                          </div>
                        </div>

                        {/* Liquidity Range */}
                        <div>
                          <Label className="text-yellow-500 font-semibold text-sm uppercase tracking-wide">Liquidity Range ($)</Label>
                          <div className="flex gap-3 mt-3">
                            <Input 
                              placeholder="Min Liquidity" 
                              type="number"
                              value={activeFilters.liquidityMin || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                liquidityMin: e.target.value ? parseFloat(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                            <Input 
                              placeholder="Max Liquidity" 
                              type="number"
                              value={activeFilters.liquidityMax || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                liquidityMax: e.target.value ? parseFloat(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                          </div>
                        </div>

                        {/* Transactions Range */}
                        <div>
                          <Label className="text-yellow-500 font-semibold text-sm uppercase tracking-wide">Transactions Range</Label>
                          <div className="flex gap-3 mt-3">
                            <Input 
                              placeholder="Min TXNs" 
                              type="number"
                              value={activeFilters.txnsMin || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                txnsMin: e.target.value ? parseInt(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                            <Input 
                              placeholder="Max TXNs" 
                              type="number"
                              value={activeFilters.txnsMax || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                txnsMax: e.target.value ? parseInt(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                          </div>
                        </div>

                        {/* Holders Count */}
                        <div>
                          <Label className="text-yellow-500 font-semibold text-sm uppercase tracking-wide">Holders Count</Label>
                          <div className="flex gap-3 mt-3">
                            <Input 
                              placeholder="Min" 
                              type="number"
                              value={activeFilters.holdersCountMin || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                holdersCountMin: e.target.value ? parseInt(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                            <Input 
                              placeholder="Max" 
                              type="number"
                              value={activeFilters.holdersCountMax || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                holdersCountMax: e.target.value ? parseInt(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                          </div>
                        </div>

                        {/* Pro Traders Count */}
                        <div>
                          <Label className="text-yellow-500 font-semibold text-sm uppercase tracking-wide">Pro Traders Count</Label>
                          <div className="flex gap-3 mt-3">
                            <Input 
                              placeholder="Min" 
                              type="number"
                              value={activeFilters.proTradersCountMin || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                proTradersCountMin: e.target.value ? parseInt(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                            <Input 
                              placeholder="Max" 
                              type="number"
                              value={activeFilters.proTradersCountMax || ''} 
                              onChange={(e) => setActiveFilters(prev => ({ 
                                ...prev, 
                                proTradersCountMax: e.target.value ? parseInt(e.target.value) : null 
                              }))}
                              className="bg-black/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500"
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by token name, ticker, or contract address..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowSearchHistory(true)}
              onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
            {searchTerm && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            
            {/* Search History */}
            {showSearchHistory && searchHistory.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-slate-700 border border-slate-600 rounded-md mt-1 z-50">
                <div className="p-2 border-b border-slate-600 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Recent Searches</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSearchHistory([])}
                    className="text-xs text-slate-400 hover:text-white h-auto p-1"
                  >
                    Clear History
                  </Button>
                </div>
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(term)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-600 text-slate-300 hover:text-white text-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {filteredTokens.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-4">No tokens match your filters</p>
              <Button onClick={clearAllFilters} variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="flex flex-col flex-1">
              <div className="flex-1 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-700/50">
                      <TableHead className="text-slate-300">Pair Info</TableHead>
                      <TableHead className="text-slate-300 cursor-pointer" onClick={() => handleSort('price')}>
                        <div className="flex items-center gap-1">
                          Price
                          {getSortIcon('price')}
                        </div>
                      </TableHead>
                      <TableHead className="text-slate-300 cursor-pointer" onClick={() => handleSort('marketCap')}>
                        <div className="flex items-center gap-1">
                          Market Cap
                          {getSortIcon('marketCap')}
                        </div>
                      </TableHead>
                      <TableHead className="text-slate-300 cursor-pointer" onClick={() => handleSort('liquidity')}>
                        <div className="flex items-center gap-1">
                          Liquidity
                          {getSortIcon('liquidity')}
                        </div>
                      </TableHead>
                      <TableHead className="text-slate-300 cursor-pointer" onClick={() => handleSort('volume')}>
                        <div className="flex items-center gap-1">
                          Volume
                          {getSortIcon('volume')}
                        </div>
                      </TableHead>
                      <TableHead className="text-slate-300 cursor-pointer" onClick={() => handleSort('transactions')}>
                        <div className="flex items-center gap-1">
                          TXNS
                          {getSortIcon('transactions')}
                        </div>
                      </TableHead>
                      <TableHead className="text-slate-300">Security</TableHead>
                      <TableHead className="text-slate-300 sticky right-0 bg-slate-800/90 backdrop-blur-sm">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTokens.map((token) => (
                      <TableRow 
                        key={token.id} 
                        className="border-slate-700 hover:bg-slate-700/50 cursor-pointer animate-fade-in"
                        onClick={() => handleTokenClick(token)}
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                              {token.symbol[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-medium">${token.symbol}</span>
                                <span className="text-slate-400">{token.name}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(token.contractAddress)}
                                  className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => token.socials.website && openSocialLink(token.socials.website)}
                                  className="h-6 w-6 p-0 text-slate-400 hover:text-blue-400"
                                  disabled={!token.socials.website}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <div className="text-xs text-slate-500">{timeframe}</div>
                                <div className="flex items-center gap-1 ml-2">
                                  {token.socials.twitter && (
                                    <HoverCard>
                                      <HoverCardTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => openSocialLink(token.socials.twitter!)}
                                          className="h-5 w-5 p-0 text-slate-400 hover:text-blue-400"
                                        >
                                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 0 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                          </svg>
                                        </Button>
                                      </HoverCardTrigger>
                                      <HoverCardContent className="w-80 bg-slate-800 border-slate-700 text-white">
                                        <div className="space-y-3">
                                          <h4 className="text-sm font-semibold text-blue-400">Latest Tweets about ${token.symbol}</h4>
                                          {generateMockTweets(token.symbol).map((tweet) => (
                                            <div key={tweet.id} className="border-b border-slate-700 pb-3 last:border-b-0">
                                              <div className="flex items-start space-x-2">
                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                  {tweet.author[1].toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                  <div className="flex items-center space-x-2 mb-1">
                                                    <span className="text-blue-400 text-sm font-medium">{tweet.author}</span>
                                                    <span className="text-slate-500 text-xs">•</span>
                                                    <span className="text-slate-500 text-xs">{tweet.timestamp}</span>
                                                  </div>
                                                  <p className="text-sm text-slate-300 mb-2">{tweet.content}</p>
                                                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                                                    <span>❤️ {tweet.likes}</span>
                                                    <span>🔄 {tweet.retweets}</span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                          <div className="text-center">
                                            <Button 
                                              size="sm" 
                                              variant="outline" 
                                              className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                                              onClick={() => openSocialLink(token.socials.twitter!)}
                                            >
                                              View more on X
                                            </Button>
                                          </div>
                                        </div>
                                      </HoverCardContent>
                                    </HoverCard>
                                  )}
                                  {token.socials.telegram && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => openSocialLink(token.socials.telegram!)}
                                      className="h-5 w-5 p-0 text-slate-400 hover:text-blue-500"
                                    >
                                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 0 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                      </svg>
                                    </Button>
                                  )}
                                  {token.socials.discord && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => openSocialLink(token.socials.discord!)}
                                      className="h-5 w-5 p-0 text-slate-400 hover:text-purple-400"
                                    >
                                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.317 4.3698c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z"/>
                                      </svg>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-white font-medium transition-all duration-500">{formatPrice(token.price)}</div>
                            <div className={`text-sm flex items-center gap-1 font-medium transition-all duration-500 ${token.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {token.priceChange >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                              {token.priceChange >= 0 ? '+' : ''}{token.priceChange.toFixed(2)}%
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-white font-medium transition-all duration-500">{formatCurrency(token.marketCap)}</div>
                            <div className={`text-sm font-medium transition-all duration-500 ${token.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {token.priceChange >= 0 ? '+' : ''}{token.priceChange.toFixed(2)}%
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white font-medium transition-all duration-500">{formatCurrency(token.liquidity)}</TableCell>
                        <TableCell className="text-white font-medium transition-all duration-500">{formatCurrency(token.volume)}</TableCell>
                        <TableCell>
                          <div>
                            <div className="text-white font-medium transition-all duration-500">{token.transactions.toLocaleString()}</div>
                            <div className="flex items-center gap-1 mt-1">
                              <div className="flex-1 bg-slate-600 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                                  style={{ width: `${(token.buyTxns / token.transactions) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-400 transition-all duration-500">
                                {token.buyTxns} / {token.sellTxns}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-bold ${
                                  getSecurityScore(token) >= 7 
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                    : getSecurityScore(token) >= 5
                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                    : getSecurityScore(token) >= 3
                                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                  <Shield className="w-3 h-3" />
                                  {getSecurityScore(token)}/8
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-slate-800 border-slate-700 text-white max-w-xs">
                                <div className="space-y-2">
                                  <div className="font-medium text-center mb-2">Security Analysis</div>
                                  <div className="text-xs space-y-1">
                                    <div className="flex justify-between">
                                      <span>Dev Wallet:</span>
                                      <span className={token.devHoldings && token.devHoldings > 10 ? 'text-red-400' : 'text-green-400'}>
                                        {token.devHoldings || 0}%
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Insider:</span>
                                      <span className={token.insiderHolding && token.insiderHolding > 20 ? 'text-red-400' : 'text-green-400'}>
                                        {token.insiderHolding || 0}%
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Bundle:</span>
                                      <span className={token.bundlers && token.bundlers > 15 ? 'text-red-400' : 'text-green-400'}>
                                        {token.bundlers || 0}%
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Sniper Wallets:</span>
                                      <span className={token.snipersPercent && token.snipersPercent > 10 ? 'text-red-400' : 'text-green-400'}>
                                        {token.snipersPercent || 0}%
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Bot Wallets:</span>
                                      <span className="text-green-400">0.5%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Top 10 Holders:</span>
                                      <span className={token.topHoldersPercent && token.topHoldersPercent > 40 ? 'text-red-400' : 'text-green-400'}>
                                        {token.topHoldersPercent || 0}%
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>LP Burned:</span>
                                      <span className={token.lpBurned ? 'text-green-400' : 'text-red-400'}>
                                        {token.lpBurned ? 'Yes' : 'No'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                        <TableCell className="sticky right-0 bg-slate-800/90 backdrop-blur-sm border-l border-slate-700">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium shadow-lg"
                                onClick={() => handleQuickBuy(token)}
                              >
                                <Banana className="w-4 h-4 mr-1" />
                                {buyAmount}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Buy {buyAmount} SOL</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              <div className="border-t border-slate-700 p-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-400">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTokens.length)} of {filteredTokens.length} tokens
                  </div>
                  
                  <Pagination className="mx-0">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          className={`text-white hover:bg-slate-700 ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                        />
                      </PaginationItem>
                      
                      {renderPaginationItems()}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          className={`text-white hover:bg-slate-700 ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default TrendingTokensTable;
