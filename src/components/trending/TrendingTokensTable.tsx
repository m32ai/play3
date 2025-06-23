
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, Copy, ExternalLink, Plus, X, RotateCcw } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

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

const TrendingTokensTable = ({ timeframe }: { timeframe: string }) => {
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
    txnsMax: 10000
  });
  const [activeFilters, setActiveFilters] = useState<Partial<Filters>>({});

  // Mock data generation
  useEffect(() => {
    const mockTokens: Token[] = [
      {
        id: "1",
        name: "Frogolicious",
        symbol: "FROG",
        price: 0.0002389,
        priceChange: 984.2,
        marketCap: 1200000,
        liquidity: 39000,
        volume: 248000,
        transactions: 1558,
        buyTxns: 825,
        sellTxns: 733,
        contractAddress: "0x1234...5678"
      },
      {
        id: "2",
        name: "MoonShot",
        symbol: "MOON",
        price: 0.0015432,
        priceChange: -48.3,
        marketCap: 850000,
        liquidity: 65000,
        volume: 420000,
        transactions: 2341,
        buyTxns: 1200,
        sellTxns: 1141,
        contractAddress: "0xabcd...efgh"
      },
      {
        id: "3",
        name: "DiamondHands",
        symbol: "DIAMOND",
        price: 0.0008765,
        priceChange: 156.7,
        marketCap: 2100000,
        liquidity: 120000,
        volume: 680000,
        transactions: 892,
        buyTxns: 567,
        sellTxns: 325,
        contractAddress: "0x9876...5432"
      },
      {
        id: "4",
        name: "RocketFuel",
        symbol: "ROCKET",
        price: 0.0034567,
        priceChange: 78.9,
        marketCap: 5600000,
        liquidity: 234000,
        volume: 1200000,
        transactions: 3456,
        buyTxns: 2100,
        sellTxns: 1356,
        contractAddress: "0xdef0...1234"
      },
      {
        id: "5",
        name: "CryptoKing",
        symbol: "KING",
        price: 0.0012345,
        priceChange: -23.1,
        marketCap: 890000,
        liquidity: 45000,
        volume: 156000,
        transactions: 678,
        buyTxns: 234,
        sellTxns: 444,
        contractAddress: "0x5678...9abc"
      }
    ];
    setTokens(mockTokens);
    setFilteredTokens(mockTokens);
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
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchTerm("");
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0 || searchTerm;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            Trending Tokens
            <Button size="sm" variant="ghost" className="text-yellow-500 hover:text-yellow-400">
              <Plus className="w-4 h-4 mr-1" />
              Add to Dashboard
            </Button>
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
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-700/50">
                <TableHead className="text-slate-300">Token</TableHead>
                <TableHead className="text-slate-300 cursor-pointer" onClick={() => handleSort('price')}>
                  <div className="flex items-center gap-1">
                    Price + % Change
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
                    TXNs
                    {getSortIcon('transactions')}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTokens.map((token) => (
                <TableRow key={token.id} className="border-slate-700 hover:bg-slate-700/50 cursor-pointer">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {token.symbol[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{token.name}</span>
                          <span className="text-slate-400">${token.symbol}</span>
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
                            className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-white">{formatPrice(token.price)}</div>
                      <div className={`text-sm flex items-center gap-1 ${token.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {token.priceChange >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {Math.abs(token.priceChange).toFixed(1)}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300">{formatCurrency(token.marketCap)}</TableCell>
                  <TableCell className="text-slate-300">{formatCurrency(token.liquidity)}</TableCell>
                  <TableCell className="text-slate-300">{formatCurrency(token.volume)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="text-white">{token.transactions.toLocaleString()}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex-1 bg-slate-600 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(token.buyTxns / token.transactions) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">
                          {token.buyTxns}/{token.sellTxns}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingTokensTable;
