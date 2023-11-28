
import { Filter_Options, Request, Response } from '../__types';
import Validator from 'validatorjs';
import DataBase from './Database';
/**
* @class BaseController
*/
export class BaseController extends DataBase {
	
	private errors: { [key: string]: string } = {
		permission: "You Don't have permission",
		notfound: "Data Not Found",
		invalid: "Invalid Request",
		exist: "% already Exist",
		required: "Please provide required Info",
		create: 'Unable to create %',
		update: 'Unable to update %',
		list: 'Unable to load %',
		get: 'Unable to load %',
		cantdelete: 'Can\'t delete this %, because this % profile has been used.',
		delete: 'Can\'t delete this %, Error occurred',
		dontexist: '% doesn\'t exist',
		login: 'Please Login to continue',
		token: 'Failed to authenticate token.',
		wrong: 'Something went wrong please try again latter.',
	};
	constructor() {
		super();
		this.registerAsyncValidator();
	}
	protected json = (res: Response, statusCode: number, ret: {data?: object | null, message?: string, token?: string}): Response => {
		const {data, message, token} = ret;
		let resp = { success: true, pagination: { total: 1, page: 1, page_size: global['config'].pagination.page_size } };
		if(data) {
			if (data["pagination"] && data["pagination"].length > 0) {
				resp.pagination = data["pagination"][0].pagination[0];
			} else {
				resp.pagination.total = 0;
			}
			if (data["data"]) {
				resp["data"] = data["data"];
			} else {
				resp["data"] = data;
			}
			// resp = Object.assign(resp, data)
		} else {
			resp["data"] = null;
		}
		if(message) {
			resp["message"] = message;
		}
		if(token) {
			resp["token"] = token;
		}
		return res.status(statusCode).json(resp);
	}
	protected jsonError = async (res: Response, statusCode: number, component?: string, error?, exception?) => {
		if (exception) {
			console.log(exception);
		}
		if (!error) {
			return res.sendStatus(statusCode);
		}
		return res.status(statusCode).json(this.error((component ? component : ""), error));
	}
	protected error = (component: string, error) => {
		if (this.errors[error]) {
			return { success: false, error: this.errors[error].replace(/%/g, component.charAt(0).toUpperCase() + component.slice(1)) };
		} else {
			return { success: false, error: error };
		}
	}
	protected getAggrigation = (req: Request, filter_options: Filter_Options, defaultFilter: object = {}) => {
		let {search, defaultSort, filters} = filter_options;
		const data = defaultFilter;
		req.aggregations = [];
		req.dbPagination = [];
		Object.keys(req.query).forEach(field => {
			if(filters[field]) {
				const {type, filter} = filters[field];
				let value: any = req.query[field];
				if(type == "boolean") {
					value = JSON.parse(value.toLowerCase());;
				}
				if(filter === "$in") {
					value = value.split(",");
					if(type === "int") {
						value = value.map((str) => {return parseInt(str); });
					}
				} else if (type === "int") {
					value = parseInt(value);
				}
				
				if (filter === "eq") {
					data[field] = value;
				} else {
					if (!data[field]) {
						data[field] = {};
					}
					data[field][filter] = value;
				}
			}
		});
		if (req.query["q"]) {
			const q = req.query["q"].toString();
			if (search.length > 0) {
				const se = search.map(e => {
					const se = {};
					se[e] = new RegExp(q);
					return se;
				});
				data["$or"] = se;
			}
		}
		if(Object.keys(data).length > 0) {
			req.dbPagination.push({
				$match: data,
			});
			req.aggregations.push({
				$match: data,
			});
		}
		
		
		let rawParm;
		if (req.query['orderby']) {
			rawParm = req.query['orderby'];
		} else {
			rawParm = defaultSort;
		}
		
		let order = 1;
		if (req.query['orderdir']) {
			order = parseInt(req.query['orderdir'].toString());
		}
		let sort = {};
		sort[rawParm] = order;
		req.aggregations.push({
			$sort: sort,
		});
		
		
		// Pagination
		let page = 1;
		let page_size = global['config'].pagination.page_size;
		if (req.query['page']) {
			page = parseInt(req.query['page'].toString());
		}
		if (req.query['limit']) {
			page_size = parseInt(req.query['limit'].toString());
		}
		if (page) {
			page = page - 1;
		}
		
		if (page_size > global['config'].pagination.maxLimit) {
			page_size = global['config'].pagination.maxLimit;
		}
		const skip = page * page_size;
		
		// Pagination
		req.aggregations.push({ $skip: skip }, { $limit: page_size });
		req.dbPagination.push({
			$facet: {
				pagination: [{ $count: "total" }, { $addFields: { page: page + 1, page_size: page_size }}],
			}
		});
	}
	registerAsyncValidator = () => {
		Validator.registerAsync(
			"exist",
			function (value: string, attribute, req, passes) {
				if (!attribute)
				throw new Error(
					"Specify Requirements i.e fieldName: exist:collection,column"
					);
					let attArr = attribute.split(",");
					
					if (attArr.length !== 2)
					throw new Error(`Invalid format for validation rule on ${attribute}`);
					const { 0: collection, 1: column } = attArr;
					
					let msg =
					column == "username"
					? `${column} has already been taken `
					: `${column} already in use`;
					let query = {};
					query[column] = value;
					let projection = {};
					projection[column] = 1;
					this.collections[collection]
					?.findOne(query, { projection })
					.then((result) => {
						if (result) {
							passes(false, msg); // if username is not available
						} else {
							passes(true);
						}
					});
				},
				"Username has already been taken."
				);
			}
		}
		