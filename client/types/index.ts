export interface ChildProps {
  children: React.ReactNode
}
export interface IUser {
  _id: string,
  fullName: string,
  email: string,
  password: string
}
export interface OwnersTypes {
  name: string,
  phone: string,
  _id: string
}

export interface IHouse {
  _id: string,
  id: string;
  repair: string;
  address: string;
  userViaOwner: string;
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
  owner: OwnersTypes;
  employee: IUser;
  checkConditioner: boolean;
  tv: boolean;
  washingMaching: boolean;
  prepayment: boolean;
  deposit: boolean;
  files: string[] | null;
  updatedAt: string;
  createdAt: string
}


