
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Users, ChevronDown, ExternalLink } from "lucide-react";

interface WalletActivity {
  id: string;
  tokenName: string;
  tokenSymbol: string;
  buyCount: number;
  totalAmountUSD: number;
  totalAmountSOL: number;
  walletCount: number;
  wallets: Array<{
    address: string;
    label: string;
    amount: number;
  }>;
}

const TrackedWalletActivity = ({ timeframe }: { timeframe: string }) => {
  const [walletActivities, setWalletActivities] = useState<WalletActivity[]>([]);

  useEffect(() => {
    // Mock data based on timeframe
    const mockData: WalletActivity[] = [
      {
        id: "1",
        tokenName: "Frogolicious",
        tokenSymbol: "FROG",
        buyCount: 23,
        totalAmountUSD: 145670,
        totalAmountSOL: 234.5,
        walletCount: 8,
        wallets: [
          { address: "0x1234...5678", label: "Whale", amount: 45670 },
          { address: "0xabcd...efgh", label: "Sniper", amount: 32100 },
          { address: "0x9876...5432", label: "Smart Money", amount: 28900 }
        ]
      },
      {
        id: "2",
        tokenName: "MoonShot",
        tokenSymbol: "MOON",
        buyCount: 18,
        totalAmountUSD: 89340,
        totalAmountSOL: 143.8,
        walletCount: 5,
        wallets: [
          { address: "0xdef0...1234", label: "Alpha Caller", amount: 34500 },
          { address: "0x5678...9abc", label: "Whale", amount: 28900 },
          { address: "0x2468...1357", label: "Smart Money", amount: 25940 }
        ]
      },
      {
        id: "3",
        tokenName: "DiamondHands",
        tokenSymbol: "DIAMOND",
        buyCount: 31,
        totalAmountUSD: 203450,
        totalAmountSOL: 327.2,
        walletCount: 12,
        wallets: [
          { address: "0xabc1...def2", label: "Insider", amount: 67800 },
          { address: "0x1357...2468", label: "Whale", amount: 45600 },
          { address: "0x9abc...def0", label: "Smart Money", amount: 38950 }
        ]
      }
    ];

    setWalletActivities(mockData);
  }, [timeframe]);

  const formatCurrency = (value: number) => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const getLabelColor = (label: string) => {
    const colors: Record<string, string> = {
      'Whale': 'bg-blue-500/20 text-blue-400',
      'Sniper': 'bg-red-500/20 text-red-400',
      'Smart Money': 'bg-green-500/20 text-green-400',
      'Alpha Caller': 'bg-purple-500/20 text-purple-400',
      'Insider': 'bg-yellow-500/20 text-yellow-400'
    };
    return colors[label] || 'bg-slate-500/20 text-slate-400';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Tracked Wallet Buys
          </div>
          <Button size="sm" variant="ghost" className="text-yellow-500 hover:text-yellow-400">
            <Plus className="w-4 h-4 mr-1" />
            Add to Dashboard
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {walletActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {activity.tokenSymbol[0]}
                  </div>
                  <div>
                    <div className="text-white font-medium">{activity.tokenName}</div>
                    <div className="text-slate-400 text-sm">${activity.tokenSymbol}</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-slate-400 text-sm">Buys</div>
                  <div className="text-white font-medium">{activity.buyCount}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Total Amount</div>
                  <div className="text-white font-medium">{formatCurrency(activity.totalAmountUSD)}</div>
                  <div className="text-slate-400 text-xs">{activity.totalAmountSOL.toFixed(1)} SOL</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white p-2">
                      <Users className="w-4 h-4 mr-1" />
                      {activity.walletCount} Wallets
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-700 border-slate-600 w-64">
                    {activity.wallets.map((wallet, index) => (
                      <DropdownMenuItem 
                        key={index} 
                        className="text-white hover:bg-slate-600 cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-sm">{wallet.address}</span>
                            <Badge variant="secondary" className={getLabelColor(wallet.label)}>
                              {wallet.label}
                            </Badge>
                          </div>
                          <span className="text-white text-sm">{formatCurrency(wallet.amount)}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-400 hover:text-blue-300"
                >
                  View Wallets
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-700">
          <Button variant="ghost" className="w-full text-slate-400 hover:text-white text-sm">
            View All Wallet Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackedWalletActivity;
