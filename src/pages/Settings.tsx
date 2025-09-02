import React, { useState } from "react";
import PaymentMethodsSection from "@/components/settings/PaymentMethodsSection";

const Settings: React.FC = () => {
  // Minimal state for toggles/inputs
  const [emailNotif, setEmailNotif] = useState(true);
  const [inAppNotif, setInAppNotif] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowMessages, setAllowMessages] = useState(true);
  const [name, setName] = useState("Your Name");
  const [email, setEmail] = useState("you@email.com");

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold text-foreground mb-8">Settings</h1>
      <form className="space-y-8">
        {/* Profile */}
        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">Profile</h2>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Name</span>
              <input
                className="px-3 py-2 rounded border border-border bg-white/10 text-foreground"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="off"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Email</span>
              <input
                className="px-3 py-2 rounded border border-border bg-white/10 text-foreground"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="off"
              />
            </label>
          </div>
        </section>
        {/* Notifications */}
        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">Notifications</h2>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={emailNotif}
                onChange={() => setEmailNotif(v => !v)}
                className="accent-cyan-500"
              />
              <span className="text-sm text-foreground">Email notifications</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inAppNotif}
                onChange={() => setInAppNotif(v => !v)}
                className="accent-cyan-500"
              />
              <span className="text-sm text-foreground">In-app notifications</span>
            </label>
          </div>
        </section>
        {/* Privacy */}
        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">Privacy</h2>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={() => setIsPrivate(v => !v)}
                className="accent-cyan-500"
              />
              <span className="text-sm text-foreground">Private account</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allowMessages}
                onChange={() => setAllowMessages(v => !v)}
                className="accent-cyan-500"
              />
              <span className="text-sm text-foreground">Allow messages from anyone</span>
            </label>
          </div>
        </section>
        {/* Account */}
        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">Account</h2>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="text-sm text-cyan-600 hover:underline text-left px-0 bg-transparent border-0"
            >
              Change password
            </button>
            <button
              type="button"
              className="text-sm text-purple-500 hover:underline text-left px-0 bg-transparent border-0"
            >
              Delete account
            </button>
          </div>
        </section>
      </form>
      <div className="mt-10">
        <PaymentMethodsSection />
      </div>
    </div>
  );
};

export default Settings;
