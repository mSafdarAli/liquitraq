import { route } from "../../__types";
import TypesController from "./controller";

const controller: TypesController = new TypesController();

const routes: route[] = [
    {path: controller.__component + '/create', method: "post", function: controller.create, private: true},
    {path: controller.__component + '/:typeId', method: "put", function: controller.update, private: true},
    {path: controller.__component + '/:typeId', method: "post", function: controller.delete, private: true},
    {path: controller.__component + '/:category', method: "get", function: controller.getByCategory, private: true},
    
]
export default routes;