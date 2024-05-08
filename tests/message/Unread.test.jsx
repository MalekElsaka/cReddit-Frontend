import { describe, it, vi, afterEach, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import Unread from "@/Components/messages/Unread";
import { getRequest } from "@/services/Requests";

vi.mock("@/services/Requests", () => ({
  getRequest: vi.fn(),
}));

afterEach(() => {
  cleanup();
});

describe("Unread Component", () => {
  const mockResponse = {
    status: 200,
    data: [
      {
        _id: "1",
        from: "sender1",
        to: "receiver1",
        subject: "Test Subject 1",
        text: "Test message 1",
        isRead: false,
        isDeleted: false,
        createdAt: "2024-05-05T12:00:00Z",
      },
      {
        _id: "2",
        from: "sender2",
        to: "receiver2",
        subject: "Test Subject 2",
        text: "Test message 2",
        isRead: false,
        isDeleted: false,
        createdAt: "2024-05-06T12:00:00Z",
      },
    ],
  };

  beforeEach(() => {
    getRequest.mockResolvedValue(mockResponse);
  });

  it("renders unread component", async () => {
    render(<Unread />);
  });
});
