import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  TrendingUp, 
  TrendingDown, 
  ExternalLink, 
  Clock,
  MessageCircle,
  Send,
  Globe,
  User,
  Heart,
  Repeat2,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TrendingToken {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  sentiment: {
    positive: number;
    negative: number;
  };
  logoURL: string;
}

const mockTrendingTokens: TrendingToken[] = [
  {
    id: "1",
    name: "Ethereum",
    symbol: "ETH",
    price: 3500.50,
    change24h: 5.2,
    volume: 15000000000,
    marketCap: 420000000000,
    sentiment: { positive: 75, negative: 25 },
    logoURL: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  },
  {
    id: "2",
    name: "Bitcoin",
    symbol: "BTC",
    price: 65000,
    change24h: -2.5,
    volume: 20000000000,
    marketCap: 1200000000000,
    sentiment: { positive: 60, negative: 40 },
    logoURL: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579",
  },
  {
    id: "3",
    name: "Ripple",
    symbol: "XRP",
    price: 0.50,
    change24h: 1.0,
    volume: 2000000000,
    marketCap: 25000000000,
    sentiment: { positive: 55, negative: 45 },
    logoURL: "https://assets.coingecko.com/coins/images/44/small/xrp-logo.png?1547034056",
  },
];

const TrendingTokensTable = () => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState<TrendingToken[]>(mockTrendingTokens);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTokens((prevTokens) =>
        prevTokens.map((token) => ({
          ...token,
          price: token.price + (Math.random() - 0.5) * 10,
          change24h: token.change24h + (Math.random() - 0.5) * 2,
          volume: token.volume + (Math.random() - 0.5) * 100000000,
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Trending Tokens</CardTitle>
        <CardDescription>
          Real-time trending tokens with social sentiment analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className="rounded-md border"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Token</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">24h %</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-right">Market Cap</TableHead>
                <TableHead className="text-center">Social</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isHovering ? tokens : tokens.slice()).map((token, index) => (
                <TableRow 
                  key={token.id} 
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => navigate(`/token/${token.id}`)}
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={token.logoURL} alt={token.name} />
                        <AvatarFallback>{token.symbol}</AvatarFallback>
                      </Avatar>
                      <span>{token.name} ({token.symbol})</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">${token.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={token.change24h > 0 ? "success" : "destructive"}>
                      {token.change24h > 0 ? <TrendingUp className="h-4 w-4 mr-2" /> : <TrendingDown className="h-4 w-4 mr-2" />}
                      {token.change24h.toFixed(2)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">${(token.volume / 1000000).toFixed(0)}M</TableCell>
                  <TableCell className="text-right">${(token.marketCap / 1000000000).toFixed(0)}B</TableCell>
                  <TableCell className="text-center">
                    <HoverCard>
                      <HoverCardTrigger>
                        <MessageSquare className="h-5 w-5 text-blue-500 hover:text-blue-700 cursor-pointer mx-auto" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <CardTitle>Social Sentiment</CardTitle>
                        <CardDescription>
                          Positive: {token.sentiment.positive}% | Negative: {token.sentiment.negative}%
                        </CardDescription>
                      </HoverCardContent>
                    </HoverCard>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingTokensTable;
