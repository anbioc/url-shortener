import { UrlModel } from "./UrlModel";

export enum userRole {
  USER = 'user',
  ADMIN = 'admin',
}

export type User = {
  id: number;

  email: string;

  fullname: string;

  password: string;

  role: userRole;

  urls?: UrlModel[]

  createdAt: Date;

  updatedAt: Date;
}
