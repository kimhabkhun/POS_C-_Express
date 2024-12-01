import {
  AdminAddUserToGroupCommand,
  AdminAddUserToGroupCommandInput,
  AdminGetUserCommand,
  AdminGetUserCommandInput,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  SignUpCommand,
  SignUpCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";

import { createHmac } from "crypto";

import config from "@/config";
import {
  SignUpRequest,
  VerifyUserRequest,
} from "@/controllers/types/auth.types";

const client = new CognitoIdentityProviderClient({
  region: "us-west-2",
});

class AuthService {
  private createHmacSecret(username: string): string {
    return createHmac("sha256", config.awsCognitoClientSecret)
      .update(username + config.awsCognitoClientId)
      .digest("base64");
  }
  async signup(body: SignUpRequest) {
    try {
      const input: SignUpCommandInput = {
        ClientId: config.awsCognitoClientId,
        SecretHash: this.createHmacSecret(body.username),
        Username: body.username,
        Password: body.password,
        UserAttributes: [
          {
            Name: "email",
            Value: body.email,
          },
          {
            Name: "name",
            Value: body.username,
          },
        ],
      };

      const command = new SignUpCommand(input);

      const res = await client.send(command);
      return res;
    } catch (error) {
      throw error;
    }
  }
  async confirmSignup(req: VerifyUserRequest) {
    const input: ConfirmSignUpCommandInput = {
      ClientId: config.awsCognitoClientId,
      SecretHash: this.createHmacSecret(req.username),
      Username: req.username,
      ConfirmationCode: req.confirmCode,
    };
    try {
      const userInfo = await this.getUserByUsername(req.username);

      // //add to DB
      const attributes = ["email", "name", "sub"];
      const total = userInfo.UserAttributes?.filter(
        (attr) => attr.Name && attributes.includes(attr.Name)
      );

      console.log(total);
      const command = new ConfirmSignUpCommand(input);

      const res = await client.send(command);

      // await axios.post("http://localhost:4003/v1/users", {
      //   sub: userInfo.Username,
      //   email: email,
      // });

      return res;
    } catch (error) {
      throw error;
    }
  }
  async login(req: { username: string; password: string }) {
    const input: InitiateAuthCommandInput = {
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: req.username,
        PASSWORD: req.password,
        SECRET_HASH: this.createHmacSecret(req.username),
      },
      ClientId: config.awsCognitoClientId,
    };
    const command = new InitiateAuthCommand(input);
    const res = await client.send(command);
    return res.AuthenticationResult;
  }
  async addToGroup(username: string, groupName: string = "user") {
    try {
      const params: AdminAddUserToGroupCommandInput = {
        GroupName: groupName,
        Username: username,
        UserPoolId: config.awsCognitoUserPoolId,
      };
      const command = new AdminAddUserToGroupCommand(params);
      await client.send(command);
      console.log(
        `AuthService confirmSignup() method: User added to ${groupName}`
      );
    } catch (error) {
      throw error;
    }
  }
  async getUserByUsername(username: string) {
    const params: AdminGetUserCommandInput = {
      Username: username,
      UserPoolId: config.awsCognitoUserPoolId,
    };
    try {
      const command = new AdminGetUserCommand(params);
      const userInfo = await client.send(command);
      return userInfo;
    } catch (error) {
      console.error("AuthService getUserByUsername() error", error);

      throw error;
    }
  }
}
export default new AuthService();
