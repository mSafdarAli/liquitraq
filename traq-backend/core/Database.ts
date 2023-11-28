import { Collection, Db, ObjectId } from "mongodb";
import { Role, User, Products, Type, Job, Equipment_Type } from "../models";
import Utility from "../helpers/utility";
import { roles } from "./seed/roles";
import { Types } from "./seed/types";
import { Database } from "../database/db";
import { jobs } from "./seed/jobs";
import { product } from "./seed/products";
const tables = ['users', 'products', 'types', 'jobs', 'roles', 'equipment_types'];
export default class DataBase extends Utility {
	private db: Db;
	protected collections: {
		users: Collection<User>,
		roles: Collection<Role>,
		products: Collection<Products>,
		types: Collection<Type>,
		jobs: Collection<Job>,
		equipment_types: Collection<Equipment_Type>
	};
	constructor() {
		super();
		if (Database.db && !this.db) {
			this.db = Database.db;
			let c: any = {};
			tables.forEach((collection) => {
				c[collection] = this.db.collection(collection);
			})
			this.collections = c;
			this.syncDB();
		}

	}

	private syncDB = async () => {
		if (global['config']['syncDb'] && global['syncDb'] == true){
			global['syncDb'] = false;
		this.db.dropDatabase();
		let users = [
			{ _id: new ObjectId(), name: "Admin", email: "admin@gmail.com", roleId: roles[0]._id, ...this.passwordEn("Test@123"), active: true, isDeleted: false }
		]

		await this.collections.roles.insertMany(roles);
		await this.collections.users.insertMany(users);
		await this.collections.equipment_types.insertMany(Types);
		await this.collections.jobs.insertMany(jobs);
		await this.collections.products.insertMany(product);
		console.log('Data is seeded');
		}
	}

}