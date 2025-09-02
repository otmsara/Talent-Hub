import {
  SubscriptionStatus,
  PaymentProvider,
  ReferralCode,
  SubscriptionPlan,
} from "@/lib/types/subscription";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function getSubscriptionStatus(
  accessToken?: string
): Promise<SubscriptionStatus> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    const response = await fetch(`${API_URL}/accounts/subscription/status/`, {
      credentials: "include",
      headers,
    });

    console.log(
      "Subscription API Response:",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Subscription API Error:", errorText);
      throw new Error(
        `Failed to fetch subscription status: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Network error fetching subscription status:", error);
    throw error;
  }
}

export async function validateReferralCode(
  code: string,
  accessToken?: string
): Promise<ReferralCode> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  const response = await fetch(
    `${API_URL}/accounts/referral/validate/${code}/`,
    {
      credentials: "include",
      headers,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("Error validating referral code:", error); // Debugging log
    throw new Error(error.error || "Failed to validate referral code");
  }

  return response.json(); // Return the backend response as-is
}

export async function initiateSubscription(
  planId: string,
  provider: PaymentProvider,
  referralCode?: string,
  accessToken?: string
): Promise<{ checkoutUrl: string }> {
  console.log("Access Token:", accessToken); // Debugging log
  console.log("Plan ID:", planId); // Debugging log
  console.log("Provider:", provider); // Debugging log

  const response = await fetch(`${API_URL}/accounts/subscription/checkout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify({
      planId,
      provider,
      referralCode,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Error initiating subscription:", error); // Debugging log
    throw new Error(error.error || "Failed to initiate subscription");
  }

  return response.json();
}
