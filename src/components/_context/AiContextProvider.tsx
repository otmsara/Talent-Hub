"use client";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

// Define the interface for the AiContext
export interface AiContextInterface {
  uploadSucces: boolean;
  setUploadSucces: Dispatch<SetStateAction<boolean>>;
  tabState: boolean;
  setTabState: Dispatch<SetStateAction<boolean>>;
  chatRightBar: boolean;
  setChatRightBar: Dispatch<SetStateAction<boolean>>;
  sessionId: string | null;
  setSessionId: Dispatch<SetStateAction<string | null>>;
}

// Create  upload with a default value
const AiContext = createContext<AiContextInterface>({
  uploadSucces: false,
  setUploadSucces: () => {},
  tabState: false,
  setTabState: () => {},
  chatRightBar: false,
  setChatRightBar: () => {},
  sessionId: null,
  setSessionId: () => {},
});

export const AiContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [uploadSucces, setUploadSucces] = useState(false);
  const [tabState, setTabState] = useState(false);
  const [chatRightBar, setChatRightBar] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  return (
    <AiContext.Provider
      value={{
        setSessionId,
        sessionId,
        uploadSucces,
        setUploadSucces,
        tabState,
        setTabState,
        chatRightBar,
        setChatRightBar,
      }}
    >
      {children}
    </AiContext.Provider>
  );
};

export default AiContext;
