import {Request, Response} from "../../__types";
import { BaseController } from "../../core";
import {ObjectId} from "mongodb";


export default class TypesController extends BaseController {
    public __component: string = "types";

    public create = async ( req:Request, res:Response ): Promise<Response> => {
        try {
            const Validationrules = {
                name: global["config"].commonRules.name,
                value: global['config'].commonRules.name,
                category: global['config'].commonRules.name,
                
              };
    
              const formErrors = await this.validateForm(req.body, Validationrules);
              const FormBody = this.getFormFields(req.body, Validationrules);
              if (!formErrors) {
                await this.collections.equipment_types.insertOne({ ...FormBody });
                return this.json(res, 200, {message: "Equipment Type Added Successfully"});
              } else {
                return this.jsonError(res, 400, this.__component, formErrors);
              }
            } catch (error) {
              return this.jsonError(res, 500, this.__component, "wrong", error);
            }
    }

    public update = async (req: Request, res: Response): Promise<Response> => {
      try {
        const { typeId } = req.params;
        const Validationrules = {
          name: global["config"].commonRules.name,
          value: global['config'].commonRules.name,
          category: global['config'].commonRules.name,
        };
    
        const formErrors = await this.validateForm(req.body, Validationrules);
        const FormBody = this.getFormFields(req.body, Validationrules);
    
        if (!formErrors) {
          if (typeId) {
            await this.collections.equipment_types?.updateOne({ _id: new ObjectId(typeId) }, { $set: { ...FormBody } });
            return this.json(res, 200, { message: "Equipment Type Updated Successfully" });
          }
    
          return this.jsonError(res, 400, this.__component, "Equipment Type Not Found");
        } else {
          return this.jsonError(res, 400, this.__component, formErrors);
        }
      } catch (error) {
        return this.jsonError(res, 500, this.__component, "Error updating equipment type", error);
      }
    };

    public delete = async (req: Request, res: Response): Promise<Response> => {
      try {
        const { typeId } = req.params;
    
        if (!typeId) {
          return this.jsonError(res, 400, this.__component, "Equipment Type ID not provided");
        }
    
        const deletedCount = await this.collections.equipment_types?.deleteOne({ _id: new ObjectId(typeId) });
    
        return deletedCount && deletedCount.deletedCount > 0
          ? this.json(res, 200, { message: "Equipment Type deleted successfully" })
          : this.jsonError(res, 400, this.__component, "Equipment Type not found");
      } catch (error) {
        return this.jsonError(res, 500, this.__component, "Error deleting equipment type", error);
      }
    };

    public getByCategory = async (req: Request, res: Response): Promise<Response> => {
      try {
        const { category } = req.params;
    
        if (!category) {
          return this.jsonError(res, 400, this.__component, "Category not provided");
        }
    
        const equipmentTypes = await this.collections.equipment_types?.find({ category }).toArray();
    
        if (!equipmentTypes || equipmentTypes.length === 0) {
          return this.jsonError(res, 400, this.__component, "No equipment types found for the specified category");
        }
    
        return this.json(res, 200, { data: equipmentTypes });
        
      } catch (error) {
        return this.jsonError(res, 500, this.__component, "Error fetching equipment types", error);
      }
    };
    

}