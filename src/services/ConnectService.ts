abstract class ConnectService {
  static userName: string | null = null;
  static token: string | null = null;
  static urlBase: string = process.env.REACT_APP_DATA_URL as string;

  // Option URL Argument: ?...&{asOf=YYYMMDD}...

  static logAndLabel = async (
    user: string,
    password: string
  ): Promise<GetUserInfoType> => {
    ConnectService.userName = user;
    ConnectService.token = password;

    const response = await this.query("getUserInfo");
    return response as GetUserInfoType;
  };

  static query = async (
    operation: string,
    opParams: string = ""
  ): Promise<object> => {
    if (!this.userName || !this.token) throw Error("Missing userName or token");

    // urlBase has trailing slash
    const dataURL = `${this.urlBase}${operation}?token=${ConnectService.token}&userName=${ConnectService.userName}${opParams}`;
    const response = await fetch(dataURL);
    if (!response.ok) {
      throw Error(await response.text());
    }
    return response.json();
  };
}

export type EyeServerResponseType = { action: string; "play-version": number };

export interface GetUserInfoType extends EyeServerResponseType {
  label: string;
  isStudent: boolean;
  portfolio: string;
  isInternal: boolean;
}

export interface TransactionResponseType extends EyeServerResponseType {
  "user-info-message": string;
  tickerId: string;
  name: string;
  orderType: string;
  shares: number;
  avgCost: number;
  pending: boolean;
}

export default ConnectService;
