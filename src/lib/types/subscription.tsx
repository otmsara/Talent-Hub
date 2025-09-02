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
  tokens_remaining: number;
  tokens_used: number;
  expires_at: string | null;
  is_active: boolean;
  isActive: boolean;
  plan: SubscriptionPlan | null;
};

export type PaymentProvider = 'stripe' | 'paystack' | 'paypal';

export type ReferralCode = {
  code: string;
  discount: number;
  isValid: boolean;
};