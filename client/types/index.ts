export interface ChildProps {
  children: React.ReactNode
}
export interface IUser {
  _id: string,
  fullName: string,
  email: string,
  password: string
}


export interface IHouse {
  id: string;
  repair: string;
  address: string;
  userViaOwner: string;
  owner: string;
  valute: string;
  landmark: string;
  district: string;
  description: string;
  square: number;
  date: string;
  floor: number;
  rooms: number;
  numberOfFloorOfTheBuilding: number;
  price: number;
  employee: string,
  checkConditioner: boolean;
  tv: boolean;
  washingMaching: boolean;
  prepayment: boolean;
  deposit: boolean;
  files: FileList[] | null;
}