import { route } from "../../__types";
import * as Controller from './controller';
const controller: Controller.default = new Controller.default;


const routes: route[] = [
	{ path: controller.__component + '/:id', method: "get", function: controller.get, private: true },
	{ path: controller.__component + '/', method: "get", function: controller.list,  private: true},
	{ path: controller.__component + '/', method: "post", function: controller.create, private: true },
	{ path: controller.__component + '/:user_id', method: "post", function: controller.update, private: true },
	{ path: controller.__component + '/:user_id', method: "put", function: controller.delete, private: true },
	{ path: controller.__component + '/:user_id/:action', method: "put", function: controller.accountAction, private: true },
	{ path: controller.__component + '/role/:roleID', method: "get", function: controller.getRole,  private: true},
	{ path: controller.__component + '/change/password', method: "post", function: controller.changePassword, private: true },
];
export default routes;