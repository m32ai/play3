import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Copy, ExternalLink, Shield, CheckCircle, XCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Token {
  rank: number;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  volume: number;
  marketCap: number;
  holders: number;
  age: string;
  liquidity: number;
  safetyScore: number;
  address: string;
  twitterMentions?: number;
  safetyBreakdown: {
    mintAuthority: boolean;
    freezeAuthority: boolean;
    updateAuthority: boolean;
    lpLocked: boolean;
    ownerBalance: number;
    devMigrations: boolean;
    topHolders: number;
    tradingEnabled: boolean;
  };
}

const TrendingTokensTable = ({ timeframe, buyAmount }: { timeframe: string; buyAmount: string }) => {
  const { toast } = useToast();

  const [sortColumn, setSortColumn] = useState<keyof Token | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const tokensPerPage = 10;

  const handleSort = (column: keyof Token) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedTokens = (tokens: Token[]) => {
    if (!sortColumn) return tokens;

    return [...tokens].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return 0;
      }
    });
  };

  const paginatedTokens = (tokens: Token[]) => {
    const startIndex = (currentPage - 1) * tokensPerPage;
    const endIndex = startIndex + tokensPerPage;
    return tokens.slice(startIndex, endIndex);
  };

  const totalPages = (tokens: Token[]) => {
    return Math.ceil(tokens.length / tokensPerPage);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const mockTokens: Token[] = Array.from({ length: 20 }, (_, i) => ({
    rank: i + 1,
    name: `Token ${i + 1}`,
    symbol: `TK${i + 1}`,
    price: Math.random() * 100,
    priceChange: (Math.random() - 0.5) * 200,
    volume: Math.random() * 1000000,
    marketCap: Math.random() * 10000000,
    holders: Math.floor(Math.random() * 10000),
    age: `${Math.floor(Math.random() * 24)}h`,
    liquidity: Math.random() * 500000,
    safetyScore: Math.floor(Math.random() * 3) + 6, // 6-8 range
    address: `${Math.random().toString(36).substring(2, 15)}...${Math.random().toString(36).substring(2, 8)}`,
    twitterMentions: Math.floor(Math.random() * 100),
    safetyBreakdown: {
      mintAuthority: Math.random() > 0.3, // 70% chance disabled
      freezeAuthority: Math.random() > 0.3,
      updateAuthority: Math.random() > 0.3,
      lpLocked: Math.random() > 0.2,
      ownerBalance: Math.random() * 5, // 0-5%
      devMigrations: Math.random() > 0.8, // 20% chance of migrations
      topHolders: Math.random() * 30, // 0-30%
      tradingEnabled: Math.random() > 0.1 // 90% chance enabled
    }
  }));

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address copied to clipboard",
      duration: 2000,
    });
  };

  const handleQuickBuy = (token: Token) => {
    toast({
      title: `Quick Buy ${buyAmount} SOL`,
      description: `Buying ${buyAmount} SOL worth of ${token.symbol}`,
      duration: 3000,
    });
  };

  const SafetyScoreHover = ({ token }: { token: Token }) => {
    const safetyChecks = [
      {
        label: "Mint Authority Disabled",
        status: !token.safetyBreakdown.mintAuthority,
        value: !token.safetyBreakdown.mintAuthority ? "Disabled" : "Enabled"
      },
      {
        label: "Freeze Authority Disabled", 
        status: !token.safetyBreakdown.freezeAuthority,
        value: !token.safetyBreakdown.freezeAuthority ? "Disabled" : "Enabled"
      },
      {
        label: "Update Authority Renounced",
        status: !token.safetyBreakdown.updateAuthority,
        value: !token.safetyBreakdown.updateAuthority ? "Renounced" : "Not Renounced"
      },
      {
        label: "LP Locked or Burned",
        status: token.safetyBreakdown.lpLocked,
        value: token.safetyBreakdown.lpLocked ? "Locked/Burned" : "Not Locked"
      },
      {
        label: "Token Owner Balance < 2%",
        status: token.safetyBreakdown.ownerBalance < 2,
        value: `${token.safetyBreakdown.ownerBalance.toFixed(1)}%`
      },
      {
        label: "No Dev Migrations",
        status: !token.safetyBreakdown.devMigrations,
        value: !token.safetyBreakdown.devMigrations ? "None" : "Yes"
      },
      {
        label: "Top 10 Holders < 15%",
        status: token.safetyBreakdown.topHolders < 15,
        value: `${token.safetyBreakdown.topHolders.toFixed(1)}%`
      },
      {
        label: "Trading Enabled",
        status: token.safetyBreakdown.tradingEnabled,
        value: token.safetyBreakdown.tradingEnabled ? "Yes" : "No"
      }
    ];

    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Badge 
            variant="outline" 
            className={`
              px-2 py-1 text-xs font-medium cursor-pointer
              ${token.safetyScore >= 7 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : token.safetyScore >= 5 
                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                : 'bg-red-500/20 text-red-400 border-red-500/30'
              }
            `}
          >
            <Shield className="w-3 h-3 mr-1" />
            {token.safetyScore}/8
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent className="w-96 bg-slate-800 border-slate-700">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white">Safety Score</h4>
              <Badge 
                variant="outline"
                className={`
                  ${token.safetyScore >= 7 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                    : token.safetyScore >= 5 
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }
                `}
              >
                <Shield className="w-3 h-3 mr-1" />
                {token.safetyScore}/8
              </Badge>
            </div>
            
            <div className="space-y-3">
              {safetyChecks.map((check, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-b-0">
                  <div className="flex items-center space-x-2">
                    {check.status ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-sm text-slate-300">{check.label}</span>
                    <Info className="w-3 h-3 text-slate-500" />
                  </div>
                  <span className={`text-sm font-medium ${
                    check.status ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {check.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white mb-2">Trending Tokens</h2>
        <p className="text-slate-400 text-sm">Top performing tokens in the last {timeframe}</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-750">
            <tr className="border-b border-slate-700">
              <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">#</th>
              <th className="text-left p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Token</th>
              <th className="text-right p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Price</th>
              <th className="text-right p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">{timeframe} %</th>
              <th className="text-right p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Volume</th>
              <th className="text-right p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Mcap</th>
              <th className="text-center p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Safety</th>
              <th className="text-center p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {mockTokens.map((token) => (
              <tr key={token.rank} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="p-4">
                  <span className="text-slate-300 font-medium">{token.rank}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{token.symbol.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">{token.name}</div>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400 text-sm">{token.symbol}</span>
                        <button
                          onClick={() => copyAddress(token.address)}
                          className="text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <span className="text-white font-medium">${token.price.toFixed(6)}</span>
                </td>
                <td className="p-4 text-right">
                  <span className={`font-medium ${
                    token.priceChange >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {token.priceChange >= 0 ? '+' : ''}{token.priceChange.toFixed(1)}%
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-slate-300">${(token.volume / 1000).toFixed(1)}K</span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-slate-300">${(token.marketCap / 1000000).toFixed(2)}M</span>
                </td>
                <td className="p-4 text-center">
                  <SafetyScoreHover token={token} />
                </td>
                <td className="p-4 text-center">
                  <Button
                    size="sm"
                    onClick={() => handleQuickBuy(token)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-3 py-1 text-xs"
                  >
                    Buy {buyAmount} SOL
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrendingTokensTable;
