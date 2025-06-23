import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, Copy, ExternalLink, X, RotateCcw, TrendingUp, Banana } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  priceMin: number;
  priceMax: number;
  volumeMin: number;
  volumeMax: number;
  marketCapMin: number;
  marketCapMax: number;
  liquidityMin: number;
  liquidityMax: number;
  txnsMin: number;
  txnsMax: number;
}

const TrendingTokensTable = ({ timeframe, buyAmount }: { timeframe: string; buyAmount: string }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'volume', direction: 'desc' });
  const [filters, setFilters] = useState<Filters>({
    priceMin: 0,
    priceMax: 10,
    volumeMin: 0,
    volumeMax: 10000000,
    marketCapMin: 0,
    marketCapMax: 1000000000,
    liquidityMin: 0,
    liquidityMax: 10000000,
    txnsMin: 0,
    txnsMax: 1000
  });
  const [activeFilters, setActiveFilters] = useState<Partial<Filters>>({});

  const generateRandomTokenData = (): Token[] => {
    const baseTokens = [
      {
        id: "1",
        name: "Frogolicious",
        symbol: "FROG",
        contractAddress: "0x1234...5678",
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
        socials: {
          telegram: "https://t.me/cryptoking",
          discord: "https://discord.gg/cryptoking",
          website: "https://cryptoking.com"
        }
      }
    ];

    return baseTokens.map((token) => ({
      ...token,
      price: Math.random() * 0.01,
      priceChange: (Math.random() - 0.5) * 1000,
      marketCap: Math.floor(Math.random() * 5000000) + 500000,
      liquidity: Math.floor(Math.random() * 200000) + 30000,
      volume: Math.floor(Math.random() * 1000000) + 100000,
      transactions: Math.floor(Math.random() * 3000) + 500,
      buyTxns: Math.floor(Math.random() * 2000) + 200,
      sellTxns: Math.floor(Math.random() * 1500) + 200
    }));
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

  // Search functionality
  useEffect(() => {
    let filtered = tokens.filter(token => 
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.contractAddress.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        const filterKey = key.replace('Min', '').replace('Max', '') as keyof Token;
        if (key.endsWith('Min')) {
          filtered = filtered.filter(token => (token[filterKey] as number) >= value);
        } else if (key.endsWith('Max')) {
          filtered = filtered.filter(token => (token[filterKey] as number) <= value);
        }
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

  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchTerm("");
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0 || searchTerm;

  const handleTokenClick = (token: Token) => {
    window.open(`/token/${token.symbol}`, '_blank');
  };

  return (
    <TooltipProvider>
      <Card className="bg-slate-800/50 border-slate-700">
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
                    {Object.keys(activeFilters).length > 0 && (
                      <Badge variant="secondary" className="ml-2 bg-yellow-500 text-slate-900">
                        {Object.keys(activeFilters).length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-slate-800 border-slate-700 text-white w-96">
                  <SheetHeader>
                    <SheetTitle className="text-white">Filter Tokens</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    <div>
                      <Label>Price Range</Label>
                      <div className="space-y-2 mt-2">
                        <Slider
                          value={[activeFilters.priceMin || filters.priceMin, activeFilters.priceMax || filters.priceMax]}
                          onValueChange={([min, max]) => setActiveFilters(prev => ({ ...prev, priceMin: min, priceMax: max }))}
                          max={filters.priceMax}
                          step={0.0001}
                          className="w-full"
                        />
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Min" 
                            value={activeFilters.priceMin || ''} 
                            onChange={(e) => setActiveFilters(prev => ({ ...prev, priceMin: parseFloat(e.target.value) || 0 }))}
                            className="bg-slate-700 border-slate-600"
                          />
                          <Input 
                            placeholder="Max" 
                            value={activeFilters.priceMax || ''} 
                            onChange={(e) => setActiveFilters(prev => ({ ...prev, priceMax: parseFloat(e.target.value) || filters.priceMax }))}
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Volume Range</Label>
                      <div className="space-y-2 mt-2">
                        <Slider
                          value={[activeFilters.volumeMin || filters.volumeMin, activeFilters.volumeMax || filters.volumeMax]}
                          onValueChange={([min, max]) => setActiveFilters(prev => ({ ...prev, volumeMin: min, volumeMax: max }))}
                          max={filters.volumeMax}
                          step={1000}
                          className="w-full"
                        />
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Min Volume" 
                            value={activeFilters.volumeMin || ''} 
                            onChange={(e) => setActiveFilters(prev => ({ ...prev, volumeMin: parseFloat(e.target.value) || 0 }))}
                            className="bg-slate-700 border-slate-600"
                          />
                          <Input 
                            placeholder="Max Volume" 
                            value={activeFilters.volumeMax || ''} 
                            onChange={(e) => setActiveFilters(prev => ({ ...prev, volumeMax: parseFloat(e.target.value) || filters.volumeMax }))}
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Market Cap Range</Label>
                      <div className="space-y-2 mt-2">
                        <Slider
                          value={[activeFilters.marketCapMin || filters.marketCapMin, activeFilters.marketCapMax || filters.marketCapMax]}
                          onValueChange={([min, max]) => setActiveFilters(prev => ({ ...prev, marketCapMin: min, marketCapMax: max }))}
                          max={filters.marketCapMax}
                          step={10000}
                          className="w-full"
                        />
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Min Market Cap" 
                            value={activeFilters.marketCapMin || ''} 
                            onChange={(e) => setActiveFilters(prev => ({ ...prev, marketCapMin: parseFloat(e.target.value) || 0 }))}
                            className="bg-slate-700 border-slate-600"
                          />
                          <Input 
                            placeholder="Max Market Cap" 
                            value={activeFilters.marketCapMax || ''} 
                            onChange={(e) => setActiveFilters(prev => ({ ...prev, marketCapMax: parseFloat(e.target.value) || filters.marketCapMax }))}
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                      </div>
                    </div>
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

        <CardContent>
          {filteredTokens.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-4">No tokens match your filters</p>
              <Button onClick={clearAllFilters} variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="relative">
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
                    <TableHead className="text-slate-300 sticky right-0 bg-slate-800/90 backdrop-blur-sm">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTokens.map((token) => (
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
                                className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                                disabled={!token.socials.website}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <div className="text-xs text-slate-500">{timeframe}</div>
                              <div className="flex items-center gap-1 ml-2">
                                {token.socials.twitter && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => openSocialLink(token.socials.twitter!)}
                                    className="h-5 w-5 p-0 text-slate-400 hover:text-blue-400"
                                  >
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                  </Button>
                                )}
                                {token.socials.telegram && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => openSocialLink(token.socials.telegram!)}
                                    className="h-5 w-5 p-0 text-slate-400 hover:text-blue-500"
                                  >
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                    </svg>
                                  </Button>
                                )}
                                {token.socials.discord && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => openSocialLink(token.socials.discord!)}
                                    className="h-5 w-5 p-0 text-slate-400 hover:text-indigo-400"
                                  >
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
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
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default TrendingTokensTable;
