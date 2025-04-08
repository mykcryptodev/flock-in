import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FarcasterUser {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  custody_address: string;
  verified_addresses: {
    primary: {
      eth_address?: string;
    }
  };
}

interface UserState {
  selectedUser: FarcasterUser | null;
  setSelectedUser: (user: FarcasterUser | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      selectedUser: null,
      setSelectedUser: (user) => set({ selectedUser: user }),
    }),
    {
      name: 'user-storage',
    }
  )
); 