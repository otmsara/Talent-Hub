
import React from 'react';
import { useWalletStore } from '../../data/walletStore';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Wallet, Star } from 'lucide-react';

const UserWallet = () => {
  const { balance, reviews } = useWalletStore();
  
  return (
    <Card className="bg-secondary/10 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">My Wallet</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-2">
          <span className="text-sm text-muted-foreground">Available Balance</span>
          <p className="text-3xl font-bold text-primary">
            ${balance.toFixed(2)}
          </p>
          {reviews.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border/20">
              <span className="text-sm text-muted-foreground">
                You've left {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserWallet;
