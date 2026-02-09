export class LoginResponse {
  public email: string;
  public userName: string;
  public token: string;
  public companyID: number;
  public companyName: string;
  public isBrokerView: boolean;
  public isPriceProtection: boolean;
  public priceChangeOver: number;
  public permissions: string;

  public static getDataFromAPI(data: LoginResponseAPI): LoginResponse {
    return {
      email: data.Email,
      userName: data.UserName,
      token: data.Token,
      companyID: data.CompanyID,
      companyName: data.CompanyName,
      isBrokerView: data.IsBrokerView,
      isPriceProtection: data.IsPriceProtection,
      priceChangeOver: data.PriceChangeOver,
      permissions: data.Permissions,
    };
  }
}

export class LoginResponseAPI {
  public Email: string;
  public UserName: string;
  public Token: string;
  public CompanyID: number;
  public CompanyName: string;
  public IsBrokerView: boolean;
  public IsPriceProtection: boolean;
  public PriceChangeOver: number;
  public Permissions: string;
}
