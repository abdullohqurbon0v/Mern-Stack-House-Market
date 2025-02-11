export interface ChildProps {
  children: React.ReactNode
}
export interface House {
  id: number,
  imageUrl: string,
  availabilityDate: string,
  repair: string,
  price: number,
  district: string,
  rooms: number,
  floor: number,
  employee: string,
  owner: string
}

export interface IUser {
  _id: string,
  fullName: string,
  email: string,
  password: string
}