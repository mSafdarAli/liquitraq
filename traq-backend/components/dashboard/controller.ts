import { Request, Response } from "../../__types";
import { BaseController } from "../../core";

export default class DashboardController extends BaseController {
  public __component: string = "dashboard";

  public jobCounts = async (req: Request, res: Response): Promise<Response> => {

    try {
      const jobPipeline = [
        {
          $match: {
            isDeleted: false
          }
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            status: "$_id",
            count: 1
          }
        },
        {
          $sort: { status: 1 }
        }
      ];


      const jobCounts = await this.collections.jobs?.aggregate(jobPipeline).toArray();


      return this.json(res, 200, { data: jobCounts });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "Error fetching Job counts", error);
    }
  }

  public dispositionCounts = async (req: Request, res: Response): Promise<Response> => {
    try {
      const productPipeline = [
        {
          $match: {
            category: { $in: ['Furniture', 'IT', 'Infrastructure'] },
            isDeleted: false
          }
        },
        {
          $group: {
            _id: "$category",
            disposition: {
              $push: {
                type: "$disposition.data.type",
                count: 1
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            disposition: {
              $arrayToObject: {
                $map: {
                  input: ["resold", "recycled", "disposed", "returnToCustomer"],
                  as: "type",
                  in: {
                    k: "$$type",
                    v: {
                      $sum: {
                        $map: {
                          input: "$disposition",
                          as: "disp",
                          in: { $cond: [{ $eq: ["$$disp.type", "$$type"] }, "$$disp.count", 0] }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        {
          $sort: { category: 1 } // Sort by category in ascending order
        }
      ];


      const dispositionCounts = await this.collections.products?.aggregate(productPipeline).toArray();



      return this.json(res, 200, { data: dispositionCounts });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "Error fetching Disposition counts", error);
    }
  }

  public getStatusCount = async (req: Request, res: Response): Promise<Response> => {
    try {
      const pipeline = [
        {
          $match: {
            isDeleted: false
          }
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            state: "$_id",
            count: 1
          }
        },
        {
          $sort: { state: 1 }
        }
      ];

      const statusCounts = await this.collections.products?.aggregate(pipeline).toArray();

      const countList: number[] = [];
      for (const item of statusCounts) {
        countList.push(item.count);
      }
      const response = {
        statusCounts,
        countList
      }
      return this.json(res, 200, { data: response });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "Error fetching Status counts", error);
    }
  }

  public dispositionPrice = async (req: Request, res: Response): Promise<Response> => {
    try {
      const productPipeline = [
        {
          $match: {
            category: { $in: ['Furniture', 'IT', 'Infrastructure'] },
            isDeleted: false
          }
        },
        {
          $group: {
            _id: { category: "$category", type: "$disposition.data.type" },
            totalPrice: { $sum: "$price" }
          }
        },
        {
          $group: {
            _id: "$_id.category",
            disposition: {
              $push: {
                type: "$_id.type",
                totalPrice: "$totalPrice"
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            disposition: {
              $arrayToObject: {
                $map: {
                  input: ["resold", "recycled", "disposed", "returnToCustomer"],
                  as: "type",
                  in: {
                    k: "$$type",
                    v: {
                      $sum: {
                        $map: {
                          input: "$disposition",
                          as: "disp",
                          in: {
                            $cond: [{ $eq: ["$$disp.type", "$$type"] }, "$$disp.totalPrice", 0]
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        {
          $sort: { category: 1 }
        }
      ];
      const dispositionCounts = await this.collections.products?.aggregate(productPipeline).toArray();



      return this.json(res, 200, { data: dispositionCounts });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "Error fetching Disposition price", error);
    }
  }
  public getItemChart = async (req: Request, res: Response): Promise<Response> => {
    try {
      const month = {
        '01': 'Jan',
        '02': 'Feb',
        '03': 'Mar',
        '04': 'Apr',
        '05': 'May',
        '06': 'Jun',
        '07': 'Jul',
        '08': 'Aug',
        '09': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec'
      }
      const p: any[] = []
      const productPipeline = [
        {
          $match: {
            $expr: {
              $and: [
                { $gte: [{ $toDate: "$disposition.data.date" }, new Date("2023-01-01")] },
                { $lte: [{ $toDate: "$disposition.data.date" }, new Date("2023-12-31")] }
              ]
            },
            status: "completed",
            isDeleted: false
          }
        },
        {
          $group: {
            _id: { type: "$disposition.data.type", month: { $substr: ['$disposition.data.date', 5, 2] } },
            data: {
              $sum: "$price"
            }
          }
        },
        {
          $group: {
            _id: "$_id.month",
            data: {
              $push: {
                k: "$_id.type", v: {
                  $toString: "$data"
                }
              }
            }
          }
        },
        {
          $replaceWith: { $mergeObjects: [{ _id: "$_id" }, { $arrayToObject: "$data" }] }
        },
        {
          $sort: { _id: 1, }
        }
      ];
      const chartData = await this.collections.products?.aggregate(productPipeline).toArray();
      chartData.forEach((el, i) => {
        const resold = (el.resold) ? parseInt(el.resold):0;
        const recycled = (el.recycled) ? parseInt(el.recycled) : 0;
        const disposed = (el.disposed) ? parseInt(el.disposed) : 0;
        const returnToCustomer = (el.returnToCustomer) ? parseInt(el.returnToCustomer) : 0;
        p.push([month[el._id], resold, recycled, disposed, returnToCustomer])
      })

      return this.json(res, 200, { data: p });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "Error fetching Disposition price chart", error);
    }
  }

}
