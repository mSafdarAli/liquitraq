import { route } from "../../__types";
import DasboardController from "./controller";
const controller: DasboardController = new DasboardController();

const routes: route[] = [
    { path: controller.__component + '/jobs', method: "get", function: controller.jobCounts, private: true },
    { path: controller.__component + '/status', method: "get", function: controller.getStatusCount, private: true },
    { path: controller.__component + '/disposition', method: "get", function: controller.dispositionCounts, private: true },
    { path: controller.__component + '/price', method: "get", function: controller.dispositionPrice, private: true },
    { path: controller.__component + '/itemchart', method: "get", function: controller.getItemChart, private: true },
]

export default routes;
