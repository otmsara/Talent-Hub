export type SubscriptionPlan = {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: 'month' | 'year';
    features: string[];
    tokenLimit: number;
    isPopular?: boolean;
  };
  
  export type SubscriptionStatus = {
    isActive: boolean;
    plan: SubscriptionPlan | null;
    tokensUsed: number;
    tokensRemaining: number;
    expiresAt: string | null;
  };
  
  export type PaymentProvider = 'stripe' | 'paystack' | 'paypal';
  
  export type ReferralCode = {
    code: string;
    discount: number;
    isValid: boolean;
  };