import { ObjectId } from "mongodb";

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password?: string;
  salt?: string;
  roleId: ObjectId;
  role?: Role;
  company_name?: string,
  corporate_address?: string,
  contact?:Number,
  location_address?: string,
  start_date?: Date,
  image?: string;
  active: boolean
  isDeleted: boolean;
}

export interface Role {
  _id:  ObjectId;
  name: string;
  permissions: { [key: string]: { [key: string]: boolean } };
}

export interface Type {
  _id: ObjectId;
  name: string;
  fields: any;
}

export interface Disposition {
  type?: string;
  date: Date;
  who: string;
  shippingInfo?: string;
  ticketInfo?: string;
}

export interface Products {
  _id?: ObjectId;
  assetName: string,
  category: string;
  job: string;
  quantity: Number;
  type: string;
  make: string;
  model: string;
  serial?: string;
  pictureSerial?: string;
  description: string;
  weight_each: Number;
  price?: Number;
  pictures?: [];
  status: string;
  disposition?: {
    data?: Disposition;
  };
  active?: boolean;
  isDeleted: boolean;
}

export interface Job {
  _id?: ObjectId;
  job_name: string;
  job_no: string;
  client: string;
  address: string;
  status: 'completed' | 'in-progress';
  start_date: Date;
  end_date: Date;
  pictures?: [];
  active?: boolean;
  isDeleted: boolean;
}

export interface Equipment_Type {
  _id?: ObjectId;
  name: string;
  value: string;
  category: string;
}