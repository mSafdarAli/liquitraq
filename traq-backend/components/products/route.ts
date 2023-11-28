import { route } from "../../__types";
import ProductController from "./controller";
const controller: ProductController = new ProductController();
const multer = require('multer');
const upload = multer({ dest: "temp/" });

const routes: route[] = [
    { path: controller.__component + '/types/:name', method: "get", function: controller.types, private: true },
    { path: controller.__component + '/create', method: "post", function: controller.create, private: true, uploader: upload.fields([{ name: 'file', maxCount: 5 }])},
    {path: controller.__component + '/:category', method: "get", function: controller.list, private: true},
    { path: controller.__component + '/:productID', method: "put", function: controller.update, private: true, uploader: upload.fields([{ name: 'file', maxCount: 5 }])},
    {path: controller.__component + '/:productID', method: "post", function: controller.delete, private: true},
    {path: controller.__component + '/get/:productID', method: "get", function: controller.get, private: true},
    {path: controller.__component + '/product/:category', method: "get", function: controller.getAggrigate, private: true},
]

export default routes;