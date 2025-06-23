
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

interface WalletData {
  id: string;
  name: string;
  labels: string[];
  lastActive: string;
  value: number;
  pnl: number;
  winRate: number;
}

interface WalletTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightLabel?: string;
}

const WalletTrackerModal = ({ isOpen, onClose, highlightLabel }: WalletTrackerModalProps) => {
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWallets, setFilteredWallets] = useState<WalletData[]>([]);

  useEffect(() => {
    // Mock wallet data
    const mockWallets: WalletData[] = [
      {
        id: "1",
        name: "HIGH PROFIT",
        labels: ["Sniper", "High Profit"],
        lastActive: "1m",
        value: 897,
        pnl: 245.8,
        winRate: 85
      },
      {
        id: "2",
        name: "STABLE EARN",
        labels: ["Whale", "Stable"],
        lastActive: "3m",
        value: 12,
        pnl: -15.2,
        winRate: 72
      },
      {
        id: "3",
        name: "RISK 1",
        labels: ["Sniper"],
        lastActive: "38m",
        value: 234,
        pnl: 156.4,
        winRate: 90
      },
      {
        id: "4",
        name: "WHALE MOVES",
        labels: ["Whale", "High Volume"],
        lastActive: "1h",
        value: 5243,
        pnl: -892.1,
        winRate: 45
      },
      {
        id: "5",
        name: "SMART TRADES",
        labels: ["Smart Money", "Sniper"],
        lastActive: "2h",
        value: 5623,
        pnl: 1245.7,
        winRate: 88
      }
    ];
    setWallets(mockWallets);
  }, []);

  useEffect(() => {
    let filtered = wallets.filter(wallet => 
      wallet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.labels.some(label => label.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Highlight wallets with specific label
    if (highlightLabel) {
      filtered = filtered.sort((a, b) => {
        const aHasLabel = a.labels.some(label => 
          label.toLowerCase().includes(highlightLabel.toLowerCase())
        );
        const bHasLabel = b.labels.some(label => 
          label.toLowerCase().includes(highlightLabel.toLowerCase())
        );
        if (aHasLabel && !bHasLabel) return -1;
        if (!aHasLabel && bHasLabel) return 1;
        return 0;
      });
    }

    setFilteredWallets(filtered);
  }, [wallets, searchTerm, highlightLabel]);

  const getLabelColor = (label: string) => {
    if (highlightLabel && label.toLowerCase().includes(highlightLabel.toLowerCase())) {
      return "bg-yellow-500 text-black";
    }
    
    switch (label.toLowerCase()) {
      case 'sniper':
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case 'whale':
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case 'smart money':
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Users className="w-6 h-6 text-purple-400" />
            Wallet Tracker
            {highlightLabel && (
              <Badge className="bg-yellow-500 text-black">
                Highlighting: {highlightLabel}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by address/name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white"
            />
          </div>

          {/* Wallet List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredWallets.map((wallet) => (
              <div 
                key={wallet.id}
                className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer hover:bg-slate-700/50 ${
                  highlightLabel && wallet.labels.some(label => 
                    label.toLowerCase().includes(highlightLabel.toLowerCase())
                  ) 
                    ? 'border-yellow-500/50 bg-yellow-500/10' 
                    : 'border-slate-600 bg-slate-700/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {wallet.name[0]}
                    </div>
                    <div>
                      <div className="text-white font-medium">{wallet.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {wallet.labels.map((label) => (
                          <Badge 
                            key={label} 
                            variant="outline" 
                            className={`text-xs border ${getLabelColor(label)}`}
                          >
                            {label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-slate-400 text-sm">Last Active</div>
                    <div className="text-white font-medium">{wallet.lastActive}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400">Value</div>
                    <div className="text-white font-medium">{formatCurrency(wallet.value)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">30D PnL</div>
                    <div className={`font-medium flex items-center gap-1 ${
                      wallet.pnl >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {wallet.pnl >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {wallet.pnl >= 0 ? '+' : ''}${wallet.pnl.toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Win Rate</div>
                    <div className="text-white font-medium">{wallet.winRate}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-700">
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
                Import/Export
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
                Labels
              </Button>
            </div>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium">
              Add Wallet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletTrackerModal;
