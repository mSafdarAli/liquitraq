import { ObjectId } from "mongodb";
import { Role } from "../../models";


export const roles: Role[] = [
  {
    _id: new ObjectId(),
    name: "Admin",
    permissions: {
			"dashboard": {
				view: true,
				update: true,
				create: true,
				delete: true,
				priceGraph:true,
				userGraph:true
			},
			"roles": {
				view: true,
				update: true,
				create: true,
				delete: true
			},
			"user management": {
				view: true,
				update: true,
				create: true,
				delete: true,
				viewButton: false,
			},
			"products": {
				view: true,
				update: true,
				create: true,
				delete: true,
				viewButton: false,
			},
			"types": {
				view: true,
				update: true,
				create: true,
				delete: true,
			},
			"jobs": {
				view: true,
				update: true,
				create: true,
				delete: true,
				viewButton: false,
			}
		}
  },
  {
    _id: new ObjectId(),
    name: "User",
    permissions: {
			"dashboard": {
				view: true,
				update: false,
				create: false,
				delete: false,
				priceGraph: false,
				userGraph: false
			},
			"roles": {
				view: true,
				update: false,
				create: false,
				delete: false
			},
			"user management": {
				view: false,
				update: false,
				create: false,
				delete: false,
				viewButton: true,
			},
			"products": {
				view: true,
				update: false,
				create: false,
				delete: false,
				viewButton: true,
			},
			"types": {
				view: true,
				update: false,
				create: false,
				delete: false
			},
			"jobs": {
				view: true,
				update: false,
				create: false,
				delete: false,
				viewButton: true,
			}
		}
  }
];
