import { Request, Response } from "../../__types";
import { BaseController } from "../../core";
// const { OAuth2Client } = require("google-auth-library");
// const client = new OAuth2Client(global["config"].google_key.GOOGLE_CLIENT_ID);
import Utility from "../../helpers/utility";


export default class AuthController extends BaseController {
  public __component: string = "auth";
  public login = async (req: Request, res: Response): Promise<Response> => {
    const FormBody: { email: string; password: string } = req.body;
    const user = await this.collections.users.findOne({ email: FormBody.email });

    if (!user) {
      return this.jsonError(res, 400, this.__component, 'Email is incorrect');
    }

    if (user.isDeleted) {
      return this.jsonError(res, 400, this.__component, 'User does not exist');
    }

    if (!user.active) {
      return this.jsonError(res, 400, this.__component, 'Your account is deactivated');
    }

    const password = this.passwordEn(FormBody.password, user.salt);
    if (password.password === user.password) {
      const role = await this.collections.roles.findOne({ _id: user.roleId });

      if (!role) {
        return this.jsonError(res, 400, this.__component, 'Role not found for user');
      }

      const tokenPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        roleID: user.roleId,
        role: role,
        // permissions: role.permissions
      };

      const token = this.signJwt(tokenPayload);
      return this.json(res, 200, { message: 'Login Successfully', token });
    }

    return this.jsonError(res, 400, this.__component, 'Password is incorrect');
  };

  public register = async (req: Request, res: Response): Promise<Response> => {
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
        const role = await this.collections.roles.findOne({ name: "User" });

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

  public forgetPassword = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const FormBody: { email: string } = req.body;
    const user = await this.collections.users.findOne({ email: FormBody.email });
    if (user) {
      // let message_subject = 'Reset Password';
      // const html =  '<body> Password Reset Link <a href="/resetPassword">Click to Reset Your Password</body>';
      // const mailOptions = {
      //   from: 'lovelaunch.com',
      //   to: 'FormBody.email',
      //   subject: message_subject,
      //   text: html
      // };
      // const email = new EmailHelper();
      // await email.sendEmailUsingSendGrid(mailOptions);
      return this.json(
        res,
        200,
        { message: "Check your Email" }
      );
    }
    return this.jsonError(res, 400, this.__component, "Email is incorrect");
  };
  public changePassword = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const FormBody: { email: string; confirm_password: string } = req.body;
    const user = await this.collections.users.findOne({ email: FormBody.email });
    if (user) {
      const password = this.passwordEn(FormBody.confirm_password, user.salt);
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
