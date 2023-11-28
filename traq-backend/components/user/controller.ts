import { Filter_Options, Request, Response } from "../../__types";
import { BaseController } from "../../core";
import { ObjectId } from "mongodb";
import Utility from "../../helpers/utility";

export default class UserController extends BaseController {
  public __component: string = "user";

  private filter_options: Filter_Options = {
    search: ['name', 'email'],
    defaultSort: "_id",
    filters: {},
  };

  public get = async (req: Request, res: Response): Promise<Response> => {
    const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      const { id } = req.params;
      const user = await this.collections.users?.aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "roles",
            localField: "roleId",
            foreignField: "_id",
            as: "roledata",
          },
        },
        {
          $addFields: {
            adjustedStartDate: {
              $toDate: "$start_date",
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
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            company_name: 1,
            corporate_address: 1,
            contact: 1,
            location_address: 1,
            start_date: "$formattedStartDate",
            roleId: 1,
            active: 1,
            image: 1,
            role: { $arrayElemAt: ["$roledata.name", 0] },
          },
        },
      ]).toArray();
      if (!user.length) {
        return this.jsonError(res, 400, this.__component, "User not found");
      }

      return this.json(res, 200, { data: user[0] });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "Error fetching user data", error);
    }
  };

  public list = async (req: Request, res: Response): Promise<Response> => {
    try {
      const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;


      // const match = { isDeleted: false };
      this.getAggrigation(req, this.filter_options, { isDeleted: false });

      let [result, pagination] = await Promise.all([
        this.collections.users?.aggregate([
          ...req.aggregations,
          {
            $lookup: {
              from: "roles",
              localField: "roleId",
              foreignField: "_id",
              as: "roledata",
            },
          },
          {
            $addFields: {
              adjustedStartDate: {
                $toDate: "$start_date",
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
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              corporate_address: 1,
              start_date: "$formattedStartDate",
              role: { $arrayElemAt: ["$roledata.name", 0] },
            }

          }

        ]).toArray(),
        this.collections.users?.aggregate(req.dbPagination).toArray(),
      ])
      return this.json(res, 200, { data: { data: result, pagination: pagination } });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "Error fetching user data", error);
    }
  };

  public create = async (req: Request, res: Response): Promise<Response> => {
    const utility = new Utility();

    try {
      const Validationrules = {
        name: global["config"].commonRules.name,
        password: global["config"].commonRules.password.push("confirmed"),
        email: global["config"].commonRules.email,
        company_name: global["config"].commonRules.name,
        corporate_address: global["config"].commonRules.address,
        contact: global["config"].commonRules.phone,
        location_address: global["config"].commonRules.address,
        start_date: global["config"].commonRules.date,
        active: 'required',
      };

      const formErrors = await this.validateForm(req.body, Validationrules);
      const FormBody = this.getFormFields(req.body, Validationrules);
      FormBody['isDeleted'] = false;
      if (!formErrors) {
        if (req.body.image) {
          const uploadedImage = await utility.uploadBase64File(req.body.image, "profilePictures/")

          if (uploadedImage) {

            FormBody.image = uploadedImage;
          }
        }

        const existingUser = await this.collections.users.findOne({
          email: FormBody.email,
        });
        if (existingUser) {
          return this.jsonError(
            res,
            400,
            this.__component,
            "Email Already Exists Use A Different One"
          );
        }
        const password = this.passwordEn(FormBody.password);
        const role = await this.collections.roles.findOne({ name: req.body.role });

        if (role) {
          FormBody["roleId"] = role._id;
        }

        await this.collections.users.insertOne({ ...FormBody, ...password });
        return this.json(res, 200, { message: "Registered Successfully" });
      } else {
        return this.jsonError(res, 400, this.__component, formErrors);
      }
    } catch (error) {
      return this.jsonError(res, 400, this.__component, "wrong", error);
    }
  };

  public update = async (req: Request, res: Response): Promise<Response> => {
    const utility = new Utility();
    try {
      const { user_id } = req.params;
      const Validationrules = {
        name: global["config"].commonRules.name,
        email: global["config"].commonRules.email,
        company_name: global["config"].commonRules.name,
        corporate_address: global["config"].commonRules.address,
        contact: 'required',
        location_address: global["config"].commonRules.address,
        start_date: global["config"].commonRules.date,
      }
      const formErrors = await this.validateForm(req.body, Validationrules);
      const FormBody = req.body;
      if (!formErrors) {
        if (user_id) {
          if (req.body.image) {
            const image = await utility.uploadBase64File(req.body.image, "profilePictures/")
            if (image) {

              FormBody.image = image;
            }
          }
          await this.collections.users?.updateOne({ _id: new ObjectId(user_id) }, { $set: { ...FormBody } });
          return this.json(res, 200, { message: "User Updated Successfully" });
        }
        return this.jsonError(
          res,
          400,
          this.__component,
          "User Not Found"
        );
      } else {
        return this.jsonError(res, 400, this.__component, formErrors);
      }
    } catch (error) {
      return this.jsonError(res, 400, this.__component, "wrong", error);
    }
  }

  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { user_id } = req.params;
      await this.collections.users?.updateOne(
        { _id: new ObjectId(user_id) },
        { $set: { isDeleted: true } }
      );
      return this.json(res, 200, { message: "User Deleted Successfully" });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "wrong", error);
    }
  }

  public accountAction = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { user_id, action } = req.params;

      const isActive = action === 'activate';

      await this.collections.users?.updateOne(
        { _id: new ObjectId(user_id) },
        { $set: { active: isActive } }
      );

      if (isActive) {
        return this.json(res, 200, { message: 'User activated successfully' });
      } else {
        return this.json(res, 200, { message: 'User deactivated successfully' });
      }
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "wrong", error);
    }
  }

  public getRole = async (req: Request, res: Response): Promise<Response> => {
    try {

      const { roleID } = req.params;
      const role = await this.collections.roles?.findOne({ _id: new ObjectId(roleID) });
      if (!role) {
        return this.jsonError(res, 400, this.__component, "Role not found");
      }

      return this.json(res, 200, { data: role });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "wrong", error);
    }
  }

  public changePassword = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const FormBody: { email: string; confirm_password: string } = req.body;
    const user = await this.collections.users.findOne({ email: FormBody.email });
    if (user) {
      const password = this.passwordEn(FormBody.confirm_password);
      await this.collections.users.updateOne({ _id: user._id }, { $set: password });
      return this.json(res, 200, { message: "Password updates successfully" });
    }
    return this.jsonError(
      res,
      400,
      this.__component,
      "Password is not updated"
    );
  };
}
