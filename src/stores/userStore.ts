import { create } from "zustand";
import { persist } from "zustand/middleware";

// 用户信息接口
export interface UserInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  nickname: string;
  createdAt: string;
}

// 用户状态接口
interface UserStore {
  // 状态
  isLoggedIn: boolean;
  user: UserInfo | null;
  token: string | null;
  isLoading: boolean;

  // 操作方法
  login: (user: UserInfo, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserInfo>) => void;
  updateAvatar: (avatarUrl: string) => void;

  // Mock登录方法（用于开发阶段）
  mockLogin: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      token: null,
      isLoading: false,

      login: (user, token) => {
        set({
          isLoggedIn: true,
          user,
          token,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          isLoggedIn: false,
          user: null,
          token: null,
          isLoading: false,
        });
        // 清除localStorage中的token
        localStorage.removeItem("authToken");
      },

      updateUser: (updates) => {
        const state = get();
        if (state.user) {
          set({
            user: { ...state.user, ...updates },
          });
        }
      },

      updateAvatar: (avatarUrl) => {
        const state = get();
        if (state.user) {
          set({
            user: { ...state.user, avatar: avatarUrl },
          });
        }
      },

      // Mock登录方法（用于开发阶段）
      mockLogin: () => {
        const mockUser: UserInfo = {
          id: "mock-user-1",
          name: "张三",
          nickname: "小张",
          email: "zhangsan@example.com",
          phone: "13800138000",
          avatar: "",
          createdAt: new Date().toISOString(),
        };

        const mockToken = "mock-token-" + Date.now();

        // 保存token到localStorage
        localStorage.setItem("authToken", mockToken);

        get().login(mockUser, mockToken);
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        token: state.token,
      }),
    }
  )
);
