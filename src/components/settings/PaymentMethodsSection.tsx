import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card as UICard } from "@/components/ui/card";
import { X } from "lucide-react";

type CardMethod = {
  id: string;
  type: "card";
  name: string;
  number: string;
  expiry: string;
  cvc: string;
};

type PaypalMethod = {
  id: string;
  type: "paypal";
  email: string;
};

type PaymentMethod = CardMethod | PaypalMethod;

const initialMethods: PaymentMethod[] = [];

const PaymentMethodsSection: React.FC = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);
  const [showAdd, setShowAdd] = useState<null | "card" | "paypal">(null);
  const [editMethod, setEditMethod] = useState<PaymentMethod | null>(null);

  // Card form state
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Paypal form state
  const [paypalEmail, setPaypalEmail] = useState("");

  // Reset all form fields
  const resetForms = () => {
    setCardName("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setPaypalEmail("");
    setEditMethod(null);
    setShowAdd(null);
  };

  // Add or update card
  const handleSaveCard = () => {
    if (!cardName || !cardNumber || !cardExpiry || !cardCvc) return;
    if (editMethod && editMethod.type === "card") {
      setMethods((prev) =>
        prev.map((m) =>
          m.id === editMethod.id
            ? { ...editMethod, name: cardName, number: cardNumber, expiry: cardExpiry, cvc: cardCvc }
            : m
        )
      );
    } else {
      setMethods((prev) => [
        ...prev,
        {
          id: "card_" + Date.now(),
          type: "card",
          name: cardName,
          number: cardNumber,
          expiry: cardExpiry,
          cvc: cardCvc,
        },
      ]);
    }
    resetForms();
  };

  // Add or update PayPal
  const handleSavePaypal = () => {
    if (!paypalEmail) return;
    if (editMethod && editMethod.type === "paypal") {
      setMethods((prev) =>
        prev.map((m) =>
          m.id === editMethod.id ? { ...editMethod, email: paypalEmail } : m
        )
      );
    } else {
      setMethods((prev) => [
        ...prev,
        {
          id: "paypal_" + Date.now(),
          type: "paypal",
          email: paypalEmail,
        },
      ]);
    }
    resetForms();
  };

  // Edit
  const handleEdit = (method: PaymentMethod) => {
    setEditMethod(method);
    if (method.type === "card") {
      setCardName(method.name);
      setCardNumber(method.number);
      setCardExpiry(method.expiry);
      setCardCvc(method.cvc);
      setShowAdd("card");
    } else {
      setPaypalEmail(method.email);
      setShowAdd("paypal");
    }
  };

  // Remove
  const handleRemove = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <section>
      <h2 className="text-lg font-medium text-foreground mb-3">Payment Methods</h2>
      <div className="flex flex-col gap-4">
        {methods.length === 0 && (
          <div className="text-sm text-muted-foreground">No payment methods saved.</div>
        )}
        {methods.map((method) =>
          method.type === "card" ? (
            <UICard key={method.id} className="flex items-center justify-between px-4 py-3 bg-white/5">
              <div>
                <div className="font-medium text-foreground">
                  **** **** **** {method.number.slice(-4)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {method.name} &middot; Expires {method.expiry}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(method)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleRemove(method.id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </UICard>
          ) : (
            <UICard key={method.id} className="flex items-center justify-between px-4 py-3 bg-white/5">
              <div>
                <div className="font-medium text-foreground">PayPal</div>
                <div className="text-xs text-muted-foreground">{method.email}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(method)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleRemove(method.id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </UICard>
          )
        )}
        <div className="flex gap-2 mt-2">
          <Button variant="outline" size="sm" onClick={() => setShowAdd("card")}>
            Add Card
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowAdd("paypal")}>
            Add PayPal
          </Button>
        </div>
      </div>
      {/* Card Dialog */}
      <Dialog open={showAdd === "card"} onOpenChange={resetForms}>
        <DialogContent>
          <DialogTitle>{editMethod ? "Edit Card" : "Add Card"}</DialogTitle>
          <div className="flex flex-col gap-3 mt-2">
            <Input
              placeholder="Name on card"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
            <Input
              placeholder="Card number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
              maxLength={16}
            />
            <div className="flex gap-2">
              <Input
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                maxLength={5}
              />
              <Input
                placeholder="CVC"
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                maxLength={4}
              />
            </div>
            <div className="flex gap-2 mt-2">
              <Button onClick={handleSaveCard} className="w-full">
                {editMethod ? "Save Changes" : "Add Card"}
              </Button>
              <Button variant="ghost" onClick={resetForms} className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* PayPal Dialog */}
      <Dialog open={showAdd === "paypal"} onOpenChange={resetForms}>
        <DialogContent>
          <DialogTitle>{editMethod ? "Edit PayPal" : "Add PayPal"}</DialogTitle>
          <div className="flex flex-col gap-3 mt-2">
            {editMethod ? (
              <>
                <Input
                  placeholder="PayPal email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  type="email"
                  disabled
                />
                <div className="flex gap-2 mt-2">
                  <Button onClick={handleSavePaypal} className="w-full">
                    Save Changes
                  </Button>
                  <Button variant="ghost" onClick={resetForms} className="w-full">
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button
                  className="w-full bg-yellow-400 text-black hover:bg-yellow-300"
                  onClick={async () => {
                    // Replace with your real PayPal client ID
                    const PAYPAL_CLIENT_ID = "sb";
                    const REDIRECT_URI = window.location.origin + "/paypal-auth-complete";
                    const PAYPAL_AUTH_URL = `https://www.paypal.com/signin/authorize?client_id=${PAYPAL_CLIENT_ID}&response_type=code&scope=openid email&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

                    // Open popup
                    const width = 500, height = 600;
                    const left = window.screenX + (window.outerWidth - width) / 2;
                    const top = window.screenY + (window.outerHeight - height) / 2;
                    const popup = window.open(
                      PAYPAL_AUTH_URL,
                      "PayPalAuth",
                      `width=${width},height=${height},left=${left},top=${top}`
                    );
                    if (!popup) return;

                    // Listen for redirect with code
                    const interval = setInterval(async () => {
                      try {
                        if (!popup || popup.closed) {
                          clearInterval(interval);
                          return;
                        }
                        // If redirected to our domain, parse code
                        if (popup.location.origin === window.location.origin) {
                          const params = new URLSearchParams(popup.location.search);
                          const code = params.get("code");
                          if (code) {
                            // In a real app, exchange code for user info on backend
                            // For demo, just use a placeholder email
                            setMethods((prev) => [
                              ...prev,
                              {
                                id: "paypal_" + Date.now(),
                                type: "paypal",
                                email: "paypal-user@example.com",
                              },
                            ]);
                            popup.close();
                            resetForms();
                            clearInterval(interval);
                          }
                        }
                      } catch (e) {
                        // Ignore cross-origin errors until redirected
                      }
                    }, 500);
                  }}
                >
                  Connect with PayPal
                </Button>
                <div className="flex gap-2 mt-2">
                  <Button variant="ghost" onClick={resetForms} className="w-full">
                    Cancel
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  You will be redirected to PayPal to securely connect your account.
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PaymentMethodsSection;
