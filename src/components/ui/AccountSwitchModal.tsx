import React from "react";
import { useAccount } from "../../contexts/AccountContext";
import { users } from "../../data/dummyData";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  onClose: () => void;
};

const AGI_CORP_ID = "agi_corp";

export const AccountSwitchModal: React.FC<Props> = ({ open, onClose }) => {
  const { currentUser, switchUser } = useAccount();
  const agiCorp = users.find(u => u.id === AGI_CORP_ID);
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white/5 backdrop-blur-sm border border-border/30 rounded-2xl shadow-lg p-6 w-full max-w-sm flex flex-col items-center relative">
        <button
          className="absolute top-3 right-3 text-muted-foreground hover:text-white transition"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <img
          src={
            currentUser.id === "agi_corp"
              ? "https://static.vecteezy.com/system/resources/thumbnails/047/656/219/small_2x/abstract-logo-design-for-any-corporate-brand-business-company-vector.jpg"
              : currentUser.avatar
          }
          alt={currentUser.name}
          className="w-16 h-16 rounded-full border-2 border-cyan-400 mb-3 shadow"
        />
        <div className="text-xl font-bold text-foreground mb-1">{currentUser.name}</div>
        <div className="text-muted-foreground text-sm mb-6">@{currentUser.username}</div>
        <div className="w-full flex flex-col gap-3">
          <Button
            className="w-full"
            variant="default"
            onClick={() => {
              onClose();
              alert("Signed out (demo)");
            }}
          >
            Sign Out
          </Button>
          {agiCorp && currentUser.id !== AGI_CORP_ID && (
            <Button
              className="w-full flex items-center gap-2"
              variant="secondary"
              onClick={() => {
                switchUser(agiCorp.id);
                onClose();
                navigate("/profile");
              }}
            >
              <img src={agiCorp.avatar} alt="AGI Corp" className="w-6 h-6 rounded-full" />
              Switch to AGI Corp
            </Button>
          )}
          {agiCorp && currentUser.id === AGI_CORP_ID && (
            <Button
              className="w-full flex items-center gap-2"
              variant="secondary"
              onClick={() => {
                switchUser("u1");
                onClose();
                navigate("/profile");
              }}
            >
              <img src="https://i.pravatar.cc/150?img=12" alt="Jamie Smith" className="w-6 h-6 rounded-full" />
              Switch to Jamie Smith
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSwitchModal;
