import { route } from "../../__types";
import JobsController from "./controller";
const controller: JobsController = new JobsController();
const multer = require('multer');
const upload = multer({ dest: "temp/" });

const routes: route[] = [
    {path: controller.__component + '/create', method: "post", function: controller.create, private: true, uploader: upload.fields([{ name: 'file', maxCount: 5 }])},
    {path: controller.__component + '/:job_id', method: "post", function: controller.update, private: true, uploader: upload.fields([{ name: 'file', maxCount: 5 }])},
    {path: controller.__component + '/:job_id', method: "get", function: controller.get, private: true},
    {path: controller.__component + '/:job_id', method: "put", function: controller.delete, private: true},
    {path: controller.__component + '/', method: "get", function: controller.list, private: true},
    {path: controller.__component + '/read/jobs', method: "get", function: controller.jobslist, private: true},
]
export default routes;