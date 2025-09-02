import React from "react";

const mockReferralData = {
  role: "Ambassador", // or "Associate"
  referralCode: "ARYA-AMB-1234",
  referralLink: "https://arya.com/signup?ref=ARYA-AMB-1234",
  referredUsers: [
    {
      username: "john_doe",
      name: "John Doe",
      dateSubscribed: "2025-06-01",
      plan: "Pro+",
      planType: "monthly", // or "annual"
      commissionPercent: 10,
      commissionUSD: 18.80,
    },
    {
      username: "jane_smith",
      name: "Jane Smith",
      dateSubscribed: "2025-06-10",
      plan: "Plus",
      planType: "annual",
      commissionPercent: 8,
      commissionUSD: 5.80,
    },
  ],
};

const Referrals: React.FC = () => {
  const { role, referralCode, referralLink, referredUsers } = mockReferralData;
  // Calculate commission for monthly plans based on months since subscription
  function monthsSince(dateString: string) {
    const start = new Date(dateString);
    const now = new Date();
    return Math.max(
      1,
      (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
    );
  }

  const referredUsersWithCalc = referredUsers.map(user => {
    if (user.planType === "monthly") {
      const months = monthsSince(user.dateSubscribed);
      return {
        ...user,
        commissionUSD: user.commissionUSD * months,
        months,
      };
    }
    return { ...user, months: 1 };
  });

  const totalEarnings = referredUsersWithCalc.reduce((sum, user) => sum + user.commissionUSD, 0);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Referrals</h2>
      <div className="mb-6">
        <div className="mb-2">
          <span className="font-semibold text-white/80">Marketing Representative Role: </span>
          <span className="px-3 py-1 rounded bg-purple-900/30 text-purple-300 font-semibold">{role}</span>
        </div>
        <div className="mb-2">
          <span className="font-semibold text-white/80">Referral Link: </span>
          <span className="px-2 py-1 rounded bg-white/10 text-cyan-200 font-mono">{referralLink}</span>
        </div>
        <div>
          <span className="font-semibold text-white/80">Referral Code: </span>
          <span className="px-2 py-1 rounded bg-white/10 text-cyan-200 font-mono">{referralCode}</span>
        </div>
      </div>
      <div className="mb-8 flex items-center justify-center">
        <div
          className="rounded-xl px-8 py-4 shadow-lg"
          style={{
            background: "linear-gradient(90deg, rgba(20,175,192,0.13) 0%, rgba(144,74,143,0.10) 100%)",
            border: "1.5px solid rgba(20,175,192,0.18)",
            boxShadow: "0 2px 16px 0 rgba(20,175,192,0.10)",
            display: "inline-block"
          }}
        >
          <span className="text-lg font-semibold text-white/90 mr-2">Total Earnings:</span>
          <span className="text-2xl font-bold" style={{ color: "#14AFC0", textShadow: "0 0 12px #14AFC0AA" }}>
            ${totalEarnings.toFixed(2)}
          </span>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white/90">Referred Users</h3>
        {/* Mobile: Card layout */}
        <div className="space-y-4 md:hidden">
          {referredUsers.length === 0 ? (
            <div className="px-4 py-4 text-center text-white/60 bg-white/5 rounded-lg border border-border/30">
              No referred users yet.
            </div>
          ) : (
            referredUsersWithCalc.map((user, idx) => (
              <div key={idx} className="rounded-lg border border-border/30 bg-white/5 p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white/90">{user.name}</span>
                  <span className="text-xs text-white/50">@{user.username}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-white/80 text-sm">
                  <div>
                    <span className="font-semibold">Subscribed:</span> {user.dateSubscribed}
                  </div>
                  <div>
                    <span className="font-semibold">Plan:</span> {user.plan}
                  </div>
                  <div>
                    <span className="font-semibold">Type:</span>{" "}
                    {user.planType === "monthly"
                      ? `Monthly (${user.months} mo${user.months > 1 ? "s" : ""})`
                      : "Annual"}
                  </div>
                  <div>
                    <span className="font-semibold">%:</span> {user.commissionPercent}%
                  </div>
                  <div>
                    <span className="font-semibold">Commission:</span> ${user.commissionUSD.toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Desktop: Table layout */}
        <div className="hidden md:block overflow-x-auto rounded-lg border border-border/30 bg-white/5">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-white/10">
                <th className="px-4 py-2 text-left text-white/80">User Name</th>
                <th className="px-4 py-2 text-left text-white/80">Date Subscribed</th>
                <th className="px-4 py-2 text-left text-white/80">Current Plan</th>
                <th className="px-4 py-2 text-left text-white/80">Plan Type</th>
                <th className="px-4 py-2 text-left text-white/80">% Commission</th>
                <th className="px-4 py-2 text-left text-white/80">Commission ($)</th>
              </tr>
            </thead>
            <tbody>
              {referredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-white/60">
                    No referred users yet.
                  </td>
                </tr>
              ) : (
                referredUsersWithCalc.map((user, idx) => (
                  <tr key={idx} className="border-t border-border/20">
                    <td className="px-4 py-2 text-white/90">{user.name} <span className="text-xs text-white/50">@{user.username}</span></td>
                    <td className="px-4 py-2 text-white/80">{user.dateSubscribed}</td>
                    <td className="px-4 py-2 text-white/80">{user.plan}</td>
                    <td className="px-4 py-2 text-white/80 capitalize">
                      {user.planType === "monthly"
                        ? `Monthly (${user.months} mo${user.months > 1 ? "s" : ""})`
                        : "Annual"}
                    </td>
                    <td className="px-4 py-2 text-white/80">{user.commissionPercent}%</td>
                    <td className="px-4 py-2 text-white/80">
                      ${user.commissionUSD.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Referrals;
