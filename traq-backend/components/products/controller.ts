import { Filter_Options, Request, Response } from "../../__types";
import { BaseController } from "../../core";
import { ObjectId } from "mongodb";
import { uploadImages } from "../../helpers/imagehelper";

export default class ProductController extends BaseController {
  public __component: string = "products";

  private filter_options: Filter_Options = {
    search: ['assetName', 'type', 'status', 'pictureSerial'],
    defaultSort: "_id",
    filters: {
      type: { type: "string", filter: "$eq" },
      status: { type: "string", filter: "$eq" },
      "disposition.data.type": { type: "string", filter: "$eq" }
    },
  };

  public types = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name } = req.params;
      let type = await this.collections.types.findOne({ name: name });

      if (type) {
        return this.json(res, 200, { data: type });
      }
      return this.jsonError(
        res,
        400,
        this.__component,
        "No Data Found"
      );
    }
    catch (error) {
      return this.jsonError(res, 500, this.__component, "Error fetching types data", error);
    }
  }

  public create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const Validationrules = {
        assetName: global["config"].commonRules.name,
        category: global["config"].commonRules.name,
        quantity: 'required',
        job: 'required',
        serial: global["config"].commonRules.name,
        pictureSerial: global["config"].commonRules.name,
        type: global["config"].commonRules.name,
        make: global["config"].commonRules.name,
        model: global["config"].commonRules.name,
        description: 'required',
        weight_each: 'required',
        price: 'required',
        status: global["config"].commonRules.name,
      };

      const formErrors = await this.validateForm(req.body, Validationrules);
      const FormBody = this.getFormFields(req.body, Validationrules);
      if (req.body.notes) {
        FormBody.notes = req.body.notes;
      }
      if (req.body.disposition === 'resold') {
        const disposition = {
          data: {
            type: req.body.disposition,
            date: req.body.date,
            who: req.body.who,
            shippingInfo: req.body.shippingInfo,
          },
        }
        FormBody['disposition'] = disposition;
      }
      else {
        const disposition = {
          data: {
            type: req.body.disposition,
            date: req.body.date,
            who: req.body.who,
            ticketInfo: req.body.ticketInfo,
          },
        }
        FormBody['disposition'] = disposition;
      }
      FormBody['isDeleted'] = false;
      if (req.body.pictures) {
        FormBody['pictures'] = req.body.pictures;
      }

      if (!formErrors) {
        if (req.files != null && req.files != undefined && Object.keys(req.files).length > 0) {
          const filesArray = req.files;
          if(filesArray["file"]){
            const images = await uploadImages(filesArray["file"], req.body.category)
            FormBody['pictures'] = images;
          }
          // if(filesArray['serial']){
          //   console.log(filesArray["serial"])
          //   const images = await uploadImages(filesArray["serial"], "Serial")
          //   FormBody['serial'] = images;
          // }
        }
        FormBody['price'] = parseInt(FormBody['price']);
        await this.collections.products.insertOne(FormBody);
        return this.json(res, 200, { message: "Product Added Successfully" });
      } else {
        return this.jsonError(res, 400, this.__component, formErrors);
      }
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "Error creating product", error);
    }
  }


  public list = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { category } = req.params;

      // const match = { isDeleted: false, category: category  };

      this.getAggrigation(req, this.filter_options, { isDeleted: false, category: category })
      let [result, pagination] = await Promise.all([
        this.collections.products?.aggregate([
          ...req.aggregations,
          {
            $project: {
              assetName: 1,
              category: 1,
              // quantity: 1,
              type: 1,
              // make: 1,
              // model: 1,
              serial: 1,
              pictureSerial: 1,
              job: 1,
              // pictures: 1,
              description: 1,
              // weight_each:1,
              // price: 1,
              status: 1,
              disposition:1,
            }

          }

        ]).toArray(),
        this.collections.products?.aggregate(req.dbPagination).toArray(),
      ]);
      return this.json(res, 200, { data: { data: result, pagination: pagination } });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "Error fetching user data", error);
    }
  };

  public get = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { productID } = req.params;
      const product = await this.collections.products?.findOne({ _id: new ObjectId(productID) });

      if (!product) {
        return this.jsonError(res, 400, this.__component, "Assect not found");
      }

      return this.json(res, 200, { data: product });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "Error fetching Assect data", error);
    }
  };

  public update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { productID } = req.params;
      const Validationrules = {
        assetName: global["config"].commonRules.name,
        category: global["config"].commonRules.name,
        quantity: 'required',
        job: 'required',
        serial: global["config"].commonRules.name,
        pictureSerial: global["config"].commonRules.name,
        type: global["config"].commonRules.name,
        make: global["config"].commonRules.name,
        model: global["config"].commonRules.name,
        description: 'required',
        price: 'required',
        weight_each: 'required',
        status: global["config"].commonRules.name

      };

      const formErrors = await this.validateForm(req.body, Validationrules);
      const FormBody = this.getFormFields(req.body, Validationrules);
      if(req.body.notes){
        FormBody.notes = req.body.notes;
      }
      if (req.body.disposition === 'resold') {
        const disposition = {
          data: {
            type: req.body.disposition,
            date: req.body.date,
            who: req.body.who,
            shippingInfo: req.body.shippingInfo,
          },
        }
        FormBody['disposition'] = disposition;
      }
      else {
        const disposition = {
          data: {
            type: req.body.disposition,
            date: req.body.date,
            who: req.body.who,
            ticketInfo: req.body.ticketInfo,
          },
        }
        FormBody['disposition'] = disposition;
      }

      if (!formErrors) {
        if (req.files != null && req.files != undefined && Object.keys(req.files).length > 0) {
          const filesArray = req.files;
          const existingProduct = await this.collections.products?.findOne(
            { _id: new ObjectId(productID) }
          );
          if (filesArray["file"]) {
            const images = await uploadImages(filesArray["file"], req.body.category, existingProduct?.pictures)
            FormBody['pictures'] = images;
          } 
          // if (filesArray['serial']) {
          //   const images = await uploadImages(filesArray["serial"], "Serial", existingProduct?.serial)
          //   FormBody['serial'] = images;
          // }
        }
        FormBody['price'] = parseInt(FormBody['price']);
        const updatedProduct = await this.collections.products?.findOneAndUpdate(
          { _id: new ObjectId(productID) },
          { $set: { ...FormBody } }
        );

        if (updatedProduct) {
          return this.json(res, 200, { message: "Assect Updated Successfully" });
        } else {
          return this.jsonError(res, 400, this.__component, "Assect not found");
        }
      } else {
        return this.jsonError(res, 400, this.__component, formErrors);
      }
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "Error updating Assect", error);
    }
  };

  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { productID } = req.params;
      const product = await this.collections.products?.findOneAndUpdate(
        { _id: new ObjectId(productID) },
        { $set: { isDeleted: true } }
      );

      if (!product.value) {
        return this.jsonError(res, 400, this.__component, "Assect not found");
      }

      return this.json(res, 200, { message: "Assect Deleted Successfully" });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "Error deleting Assect", error);
    }
  };

  public getAggrigate = async (req: Request, res: Response): Promise<Response> => {
    try {
      const category = req.params.category;
      const dispositionTypes = ["resold", "recycled", "disposed", "returnToCustomer"];
      const statusTypes = ["in-progress", "completed", "originalState"];

      const pipeline = [
        {
          $match: { category, isDeleted: false }
        },
        {
          $facet: {
            dispositionCounts: [
              {
                $group: {
                  _id: "$disposition.data.type",
                  count: { $sum: 1 },
                  totalPrice: { $sum: "$price" }
                }
              },
              {
                $project: {
                  type: "$_id",
                  count: 1,
                  totalPrice: 1,
                  _id: 0
                }
              }
            ],
            statusCounts: [
              {
                $group: {
                  _id: "$status",
                  count: { $sum: 1 }
                }
              },
              {
                $project: {
                  status: "$_id",
                  count: 1,
                  _id: 0
                }
              }
            ]
          }
        },
        {
          $project: {
            dispositionCounts: dispositionTypes.map(type => ({
              $ifNull: [{ $arrayElemAt: [{ $filter: { input: "$dispositionCounts", as: "count", cond: { $eq: ["$$count.type", type] } } }, 0] }, { count: 0, totalPrice: 0, type }]
            })),
            statusCounts: statusTypes.map(status => ({
              $ifNull: [{ $arrayElemAt: [{ $filter: { input: "$statusCounts", as: "count", cond: { $eq: ["$$count.status", status] } } }, 0] }, { count: 0, status }]
            })),

          }
        }
      ];
      let result = await this.collections.products?.aggregate(pipeline).toArray();
      const statusGraph = {};
      const priceGraph = {};
      const overviewGraph = {};
      for (const item of result[0].dispositionCounts) {
        statusGraph[item.type] = item.count;
        priceGraph[item.type]=item.totalPrice;
      }
      for (const item of result[0].statusCounts) {
        overviewGraph[item.status]=item.count
      }
      const respo = {
        result,
        statusGraph,
        priceGraph,
        overviewGraph
      }
      return this.json(res, 200, { data: respo });
    }
    catch (error) {
      return this.jsonError(res, 500, this.__component, "Error fetching products counts ", error);
    }
  }

}