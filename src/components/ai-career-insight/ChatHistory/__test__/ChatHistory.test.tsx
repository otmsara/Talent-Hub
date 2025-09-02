/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, act } from "@testing-library/react";
import ChatHistory from "../ChatHistory"; // Replace with your component path
import AiContext from "../../../_context/AiContextProvider";

// Mock the aiRequestChats API call
jest.mock("../../../actions", () => ({
  aiRequestChats: jest.fn(),
}));

describe("ChatHistory", () => {
  const mockAiRequestChats = require("../../../actions").aiRequestChats;

  const renderComponent = (contextValue = {}) => {
    return render(
      <AiContext.Provider
        value={{
          chatRightBar: true,
          setChatRightBar: jest.fn(),
          tabState: true,
          setTabState: jest.fn(),
          uploadSucces: false,
          setUploadSucces: jest.fn(),
          sessionId: "this-is-a-test-id",
          setSessionId: jest.fn(),
          ...contextValue,
        }}
      >
        <ChatHistory />
      </AiContext.Provider>
    );
  };

  it("displays chat data when available", async () => {
    const mockChats = { results: ["Chat 1", "Chat 2"] };
    mockAiRequestChats.mockResolvedValueOnce({
      success: true,
      data: mockChats,
    });

    await act(async () => {
      renderComponent();
    });

    expect(mockChats.results.length).toBeGreaterThan(1);
  });

  it("displays fallback message when no chats are available", async () => {
    mockAiRequestChats.mockResolvedValueOnce({
      success: true,
      data: { results: [] },
    });

    await act(async () => {
      renderComponent();
    });
    expect(screen.getByText(/No chats available./i)).toBeInTheDocument();
  });
});
