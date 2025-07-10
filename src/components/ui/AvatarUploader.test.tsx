import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AvatarUploader from "./AvatarUploader";

// Mock COS Uploader
vi.mock("../../utils/cosUploader", () => ({
  createCOSUploader: vi.fn(() => ({
    uploadFile: vi.fn(),
    cancelUpload: vi.fn(),
    clearAllTasks: vi.fn(),
  })),
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => "mocked-url");
global.URL.revokeObjectURL = vi.fn();

describe("AvatarUploader", () => {
  const mockOnAvatarChange = vi.fn();
  let mockUploader: any;

  beforeEach(() => {
    mockOnAvatarChange.mockClear();
    const { createCOSUploader } = require("../../utils/cosUploader");
    mockUploader = createCOSUploader();
    mockUploader.uploadFile.mockClear();
    mockUploader.cancelUpload.mockClear();
    mockUploader.clearAllTasks.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render default avatar placeholder", () => {
    render(<AvatarUploader onAvatarChange={mockOnAvatarChange} />);

    const placeholder = screen.getByRole("img", { hidden: true });
    expect(placeholder).toBeInTheDocument();
  });

  it("should display current avatar when provided", () => {
    const avatarUrl = "https://example.com/avatar.jpg";
    render(
      <AvatarUploader
        currentAvatar={avatarUrl}
        onAvatarChange={mockOnAvatarChange}
      />
    );

    const avatar = screen.getByRole("img", { name: "头像" });
    expect(avatar).toHaveAttribute("src", avatarUrl);
  });

  it("should handle different sizes correctly", () => {
    const { rerender } = render(
      <AvatarUploader onAvatarChange={mockOnAvatarChange} size="sm" />
    );
    expect(screen.getByTestId("avatar-container")).toHaveClass("w-12 h-12");

    rerender(<AvatarUploader onAvatarChange={mockOnAvatarChange} size="lg" />);
    expect(screen.getByTestId("avatar-container")).toHaveClass("w-24 h-24");
  });

  it("should be disabled when disabled prop is true", () => {
    render(<AvatarUploader onAvatarChange={mockOnAvatarChange} disabled />);

    const container = screen.getByTestId("avatar-container");
    expect(container).toHaveClass("cursor-not-allowed opacity-50");
  });

  it("should open file dialog when clicked", async () => {
    const user = userEvent.setup();
    render(<AvatarUploader onAvatarChange={mockOnAvatarChange} />);

    const input = screen.getByLabelText("选择头像图片");
    const clickSpy = vi.spyOn(input, "click");

    const container = screen.getByTestId("avatar-container");
    await user.click(container);

    expect(clickSpy).toHaveBeenCalled();
  });

  it("should not open file dialog when disabled", async () => {
    const user = userEvent.setup();
    render(<AvatarUploader onAvatarChange={mockOnAvatarChange} disabled />);

    const input = screen.getByLabelText("选择头像图片");
    const clickSpy = vi.spyOn(input, "click");

    const container = screen.getByTestId("avatar-container");
    await user.click(container);

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it("should handle file selection and upload", async () => {
    mockUploader.uploadFile.mockResolvedValue({
      url: "https://cos.example.com/avatar.jpg",
      key: "avatar/123_test.jpg",
      etag: "mock-etag",
      location: "cos.example.com/avatar.jpg",
    });

    render(<AvatarUploader onAvatarChange={mockOnAvatarChange} />);

    const file = new File(["test content"], "test.jpg", { type: "image/jpeg" });
    const input = screen.getByLabelText("选择头像图片");

    await userEvent.upload(input, file);

    expect(mockUploader.uploadFile).toHaveBeenCalledWith(
      expect.objectContaining({
        file,
        key: expect.stringContaining("avatar/"),
        onProgress: expect.any(Function),
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );

    await waitFor(() => {
      expect(mockOnAvatarChange).toHaveBeenCalledWith(
        "https://cos.example.com/avatar.jpg"
      );
    });
  });

  it("should reject non-image files", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<AvatarUploader onAvatarChange={mockOnAvatarChange} />);

    const file = new File(["test content"], "test.txt", { type: "text/plain" });
    const input = screen.getByLabelText("选择头像图片");

    await userEvent.upload(input, file);

    expect(alertSpy).toHaveBeenCalledWith("请选择图片文件");
    expect(mockUploader.uploadFile).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it("should reject files larger than 5MB", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<AvatarUploader onAvatarChange={mockOnAvatarChange} />);

    // Create a file larger than 5MB
    const largeFile = new File(["x".repeat(6 * 1024 * 1024)], "large.jpg", {
      type: "image/jpeg",
    });
    const input = screen.getByLabelText("选择头像图片");

    await userEvent.upload(input, largeFile);

    expect(alertSpy).toHaveBeenCalledWith("图片大小不能超过5MB");
    expect(mockUploader.uploadFile).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it("should show upload progress", async () => {
    let progressCallback: (progress: any) => void;

    mockUploader.uploadFile.mockImplementation(({ onProgress }: any) => {
      progressCallback = onProgress;
      return new Promise(() => {}); // Never resolve to keep upload in progress
    });

    render(<AvatarUploader onAvatarChange={mockOnAvatarChange} />);

    const file = new File(["test content"], "test.jpg", { type: "image/jpeg" });
    const input = screen.getByLabelText("选择头像图片");

    await userEvent.upload(input, file);

    // Simulate progress update
    progressCallback!({ loaded: 50, total: 100, percent: 50 });

    await waitFor(() => {
      expect(screen.getByText("50%")).toBeInTheDocument();
    });
  });

  it("should handle upload cancellation", async () => {
    let progressCallback: (progress: any) => void;

    mockUploader.uploadFile.mockImplementation(({ onProgress }: any) => {
      progressCallback = onProgress;
      return new Promise(() => {}); // Never resolve to keep upload in progress
    });

    render(<AvatarUploader onAvatarChange={mockOnAvatarChange} />);

    const file = new File(["test content"], "test.jpg", { type: "image/jpeg" });
    const input = screen.getByLabelText("选择头像图片");

    await userEvent.upload(input, file);

    // Update progress to show cancel button
    progressCallback!({ loaded: 25, total: 100, percent: 25 });

    await waitFor(() => {
      const cancelButton = screen.getByText("取消");
      expect(cancelButton).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("取消");
    await userEvent.click(cancelButton);

    expect(mockUploader.cancelUpload).toHaveBeenCalled();
  });

  it("should handle upload error", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockUploader.uploadFile.mockRejectedValue(new Error("Upload failed"));

    render(<AvatarUploader onAvatarChange={mockOnAvatarChange} />);

    const file = new File(["test content"], "test.jpg", { type: "image/jpeg" });
    const input = screen.getByLabelText("选择头像图片");

    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("上传失败: Upload failed");
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(mockOnAvatarChange).not.toHaveBeenCalled();

    alertSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("should handle drag and drop", async () => {
    mockUploader.uploadFile.mockResolvedValue({
      url: "https://cos.example.com/avatar.jpg",
      key: "avatar/123_test.jpg",
      etag: "mock-etag",
      location: "cos.example.com/avatar.jpg",
    });

    render(<AvatarUploader onAvatarChange={mockOnAvatarChange} />);

    const container = screen.getByTestId("avatar-container");
    const file = new File(["test content"], "test.jpg", { type: "image/jpeg" });

    // Simulate drag over
    fireEvent.dragOver(container, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(container).toHaveClass("border-blue-400");

    // Simulate drop
    fireEvent.drop(container, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(mockUploader.uploadFile).toHaveBeenCalled();
  });

  it("should clear tasks on unmount", () => {
    const { unmount } = render(
      <AvatarUploader onAvatarChange={mockOnAvatarChange} />
    );

    unmount();

    expect(mockUploader.clearAllTasks).toHaveBeenCalled();
  });

  it("should show development debug info", async () => {
    // Mock development environment
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    let progressCallback: (progress: any) => void;

    mockUploader.uploadFile.mockImplementation(({ onProgress }: any) => {
      progressCallback = onProgress;
      return new Promise(() => {}); // Never resolve to keep upload in progress
    });

    render(<AvatarUploader onAvatarChange={mockOnAvatarChange} />);

    const file = new File(["test content"], "test.jpg", { type: "image/jpeg" });
    const input = screen.getByLabelText("选择头像图片");

    await userEvent.upload(input, file);

    // Simulate progress update
    progressCallback!({ loaded: 1024, total: 2048, percent: 50 });

    await waitFor(() => {
      expect(screen.getByText(/进度: 50%/)).toBeInTheDocument();
      expect(screen.getByText(/1KB \/ 2KB/)).toBeInTheDocument();
    });

    // Restore environment
    process.env.NODE_ENV = originalEnv;
  });
});

// Install @testing-library/user-event if not already installed
// pnpm add -D @testing-library/user-event
