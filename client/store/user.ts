import { IUser } from '@/types'
import { create } from 'zustand'

interface IUserStore {
  user: IUser | null,
  setUserStore: (user: IUser) => void;
}

export const useUser = create<IUserStore>(set => ({
  user: null,
  setUserStore: (user) => set({ user })
}))