export class LoginModel {
  public userName!: string;
  public password!: string;
}

export class LoginModelAPI {
  public userName!: string;
  public password!: string;

  public static getDataForAPI(data: LoginModel): LoginModelAPI {
    return {
      userName: data.userName,
      password: data.password,
    };
  }
}
