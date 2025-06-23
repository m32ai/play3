
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
        buyCount: 28,
        totalAmountUSD: 145670,
        totalAmountSOL: 234.5,
        walletCount: 12,
        wallets: [
          { address: "0x1234...5678", label: "Whale", amount: 45670 },
          { address: "0xabcd...efgh", label: "Sniper", amount: 32100 },
          { address: "0x9876...5432", label: "Smart Money", amount: 28900 }
        ]
      },
      {
        id: "2",
        tokenName: "Banana",
        tokenSymbol: "BANANA",
        buyCount: 24,
        totalAmountUSD: 89340,
        totalAmountSOL: 143.8,
        walletCount: 9,
        wallets: [
          { address: "0xdef0...1234", label: "Alpha Caller", amount: 34500 },
          { address: "0x5678...9abc", label: "Whale", amount: 28900 },
          { address: "0x2468...1357", label: "Smart Money", amount: 25940 }
        ]
      },
      {
        id: "3",
        tokenName: "Moon Rocket",
        tokenSymbol: "MOON",
        buyCount: 18,
        totalAmountUSD: 203450,
        totalAmountSOL: 327.2,
        walletCount: 7,
        wallets: [
          { address: "0xabc1...def2", label: "Insider", amount: 67800 },
          { address: "0x1357...2468", label: "Whale", amount: 45600 },
          { address: "0x9abc...def0", label: "Smart Money", amount: 38950 }
        ]
      },
      {
        id: "4",
        tokenName: "Solana Doge",
        tokenSymbol: "SOLDOGE",
        buyCount: 15,
        totalAmountUSD: 78450,
        totalAmountSOL: 126.2,
        walletCount: 6,
        wallets: [
          { address: "0xdef2...abc1", label: "Whale", amount: 28900 },
          { address: "0x2468...1357", label: "Smart Money", amount: 25940 },
          { address: "0x1357...2468", label: "Sniper", amount: 23610 }
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
            Tracked Wallet Activity
          </div>
          <Button size="sm" variant="ghost" className="text-yellow-500 hover:text-yellow-400">
            <Plus className="w-4 h-4 mr-1" />
            Add to Dashboard
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="grid grid-cols-4 gap-4 text-xs text-slate-400 uppercase tracking-wide pb-2 border-b border-slate-700">
            <span>TOKEN</span>
            <span className="text-right">BUYS</span>
            <span className="text-right">WALLETS</span>
            <span></span>
          </div>
          {walletActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="grid grid-cols-4 gap-4 items-center p-2 rounded hover:bg-slate-700/30 transition-colors cursor-pointer group"
            >
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {activity.tokenSymbol[0]}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">${activity.tokenSymbol}</div>
                  <div className="text-slate-400 text-xs">{activity.tokenName}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-white font-medium">{activity.buyCount}</div>
              </div>
              
              <div className="text-right">
                <div className="text-white font-medium">{activity.walletCount}</div>
              </div>
              
              <div className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-400 hover:text-blue-300 text-xs p-1 h-auto"
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackedWalletActivity;
