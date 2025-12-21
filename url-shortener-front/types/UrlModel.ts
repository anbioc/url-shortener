import { User } from "./User";

export type UrlModel ={
  id: number;

  url: string;

  short: string;

  clicks: number

  user: User

  createdAt: Date;

  updatedAt: Date;
}
