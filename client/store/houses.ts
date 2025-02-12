import { IHouse } from '@/types';
import { create } from 'zustand'


interface HouseStore {
  houses: IHouse[];
  setAllHouses: (houses: IHouse[]) => void;
  addHouse: (newHouse: IHouse) => void;
  removeHouse: (id: string) => void;
}


export const useHouseStore = create<HouseStore>((set) => ({
  houses: [],
  setAllHouses: (houses) => set({ houses }),
  addHouse: (newHouse) => set((state) => ({ houses: [...state.houses, newHouse] })),
  removeHouse: (id) => set((state) => ({
    houses: state.houses.filter((house) => house.id !== id),
  })),
}));