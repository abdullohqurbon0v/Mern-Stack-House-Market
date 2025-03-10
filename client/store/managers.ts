import { IHouse } from '@/types';
import { create } from 'zustand'


interface ManagerStore {
      houses: IHouse[];
      setAllHouses: (houses: IHouse[]) => void;
      addHouse: (newHouse: IHouse) => void;
      removeHouse: (id: string) => void;
}


export const useManagersStore = create<ManagerStore>((set) => ({
      houses: [],
      setAllHouses: (houses) => set({ houses }),
      addHouse: (newHouse) => set((state) => ({ houses: [...state.houses, newHouse] })),
      removeHouse: (id) => set((state) => ({
            houses: state.houses.filter((house) => house.id !== id),
      })),
}));