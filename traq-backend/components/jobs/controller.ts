import { Filter_Options, Request, Response } from "../../__types";
import { BaseController } from "../../core";
import { ObjectId } from "mongodb";
import { uploadImages } from "../../helpers/imagehelper";

export default class JobsController extends BaseController {
  public __component: string = "jobs";

  private filter_options: Filter_Options = {
    search: ['job_name', 'status'],
    defaultSort: "_id",
    filters: {
      status: { type: "string", filter: "$eq" }
    },
  };

  public create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const Validationrules = {
        job_name: global["config"].commonRules.name,
        job_no: 'required',
        client: global['config'].commonRules.name,
        address: global['config'].commonRules.address,
        status: 'required',
        start_date: global['config'].commonRules.date,
        end_date: global['config'].commonRules.date,
      };

      const formErrors = await this.validateForm(req.body, Validationrules);
      const FormBody = this.getFormFields(req.body, Validationrules);
      FormBody['isDeleted'] = false;
      if (req.body.pictures) {
        FormBody['pictures'] = req.body.pictures;
      }
      if (!formErrors) {

        if (req.files != null && req.files != undefined && Object.keys(req.files).length > 0) {
          const filesArray = req.files;
          const images = await uploadImages(filesArray, req.body.category)
          FormBody['pictures'] = images;
        }
        await this.collections.jobs.insertOne({ ...FormBody });
        return this.json(res, 200, { message: "Job Added Successfully" });
      } else {
        return this.jsonError(res, 400, this.__component, formErrors);
      }
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "wrong", error);
    }
  };

  public update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { job_id } = req.params;

      const Validationrules = {
        job_name: global["config"].commonRules.name,
        job_no: 'required',
        client: global['config'].commonRules.name,
        address: global['config'].commonRules.address,
        status: 'required',
        start_date: global['config'].commonRules.date,
        end_date: global['config'].commonRules.date,
      };

      const formErrors = await this.validateForm(req.body, Validationrules);
      const FormBody = this.getFormFields(req.body, Validationrules);
      if (req.body.pictures) {
        FormBody['pictures'] = req.body.pictures;
      }
      if (!formErrors) {
        if (req.files != null && req.files != undefined && Object.keys(req.files).length > 0) {
          const filesArray = req.files;
          const existingjob = await this.collections.jobs?.findOne(
            { _id: new ObjectId(job_id) }
          );
          const images = await uploadImages(filesArray, req.body.category, existingjob?.pictures)
          FormBody['pictures'] = images;
        }
        const updatedJob = await this.collections.jobs?.findOneAndUpdate(
          { _id: new ObjectId(job_id) },
          { $set: { ...FormBody } }
        );

        if (updatedJob) {
          return this.json(res, 200, { message: "Job Updated Successfully" });
        } else {
          return this.jsonError(res, 400, this.__component, "Job not found");
        }

      } else {
        return this.jsonError(res, 400, this.__component, formErrors);
      }
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "Error updating job", error);
    }
  };

  public get = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { job_id } = req.params;
      const job = await this.collections.jobs?.findOne({ _id: new ObjectId(job_id) });

      if (!job) {
        return this.jsonError(res, 400, this.__component, "Job not found");
      }

      return this.json(res, 200, { data: job });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "Error fetching job data", error);
    }
  };

  public list = async (req: Request, res: Response): Promise<Response> => {
    const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {

      this.getAggrigation(req, this.filter_options, { isDeleted: false })
      let [result, pagination] = await Promise.all([
        this.collections.jobs?.aggregate([
          ...req.aggregations,
          {
            $addFields: {
              adjustedStartDate: {
                $toDate: "$start_date",
              },
            },
          },
          {
            $addFields: {
              adjustedEndDate: {
                $toDate: "$end_date",
              },
            },
          },
          {
            $addFields: {
              formattedStartDate: {
                $dateToString: {
                  format: "%d-%m-%Y",
                  date: "$adjustedStartDate",
                  timezone: systemTimeZone,
                },
              },
              formattedEndDate: {
                $dateToString: {
                  format: "%d-%m-%Y",
                  date: "$adjustedEndDate",
                  timezone: systemTimeZone,
                },
              },
            },
          },
          {
            $project: {
              job_name: 1,
              job_no: 1,
              client: 1,
              address: 1,
              status: 1,
              start_date: "$formattedStartDate",
              end_date: "$formattedEndDate",
            }
          }

        ]).toArray(),
        this.collections.jobs?.aggregate(req.dbPagination).toArray(),
      ])
      return this.json(res, 200, { data: { data: result, pagination: pagination } });

    } catch (error) {
      return this.jsonError(res, 500, this.__component, "Error fetching user data", error);
    }
  };

  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { job_id } = req.params;
      const job = await this.collections.jobs?.findOneAndUpdate(
        { _id: new ObjectId(job_id) },
        { $set: { isDeleted: true } }
      );

      if (!job.value) {
        return this.jsonError(res, 400, this.__component, "Job not found");
      }

      return this.json(res, 200, { message: "Job Deleted Successfully" });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "Error deleting job", error);
    }
  };

  public jobslist = async (req: Request, res: Response): Promise<Response> => {
    try {

      const match = { isDeleted: false };
      const jobsList = await this.collections.jobs?.aggregate([
        {
          $match: match,
        },
        {
          $project: {
            job_name: 1,
            job_no: 1,
          }

        }

      ]).toArray();
      const keyValuePairs = jobsList.map(job => ({ _id: job._id, name: job.job_no, value: job.job_no }));
      return this.json(res, 200, { data: keyValuePairs });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "Error fetching user data", error);
    }
  };

}