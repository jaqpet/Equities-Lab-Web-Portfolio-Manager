import { RawOrdersTableType } from "../components/views/Orders/OrdersView";
import { RawPosTableType } from "../components/views/Positions/PositionsView";
import CS, {
  EyeServerResponseType,
  TransactionResponseType,
} from "./ConnectService";

// Option URL Argument: ?...&{asOf=YYYMMDD}...

export interface CompanyAutoSuggestType extends EyeServerResponseType {
  prefix: string;
  suggestions: string[];
}

export interface GuessTickerType extends EyeServerResponseType {
  id: string;
  company: string;
  symbol: string;
  description: string;
  estimate: number;
}

export interface PerformanceData extends EyeServerResponseType {
  name: string;
  backtestGraph: {
    benchmarkColumnNames: string[];
    columnColors: string[];
    columnDecisions: object[];
    columnDescriptions: string[];
    columnZooms: boolean[];
    dataType: string;
    indicators: any[];
    initialValues: number[];
    keyColumn: Date;
    name: string;
    startDate: string;
    columnNames: string[];
    columnTypes: string[];
    rows: {
      date: string;
      Portfolio: number;
      "S\u0026P 500": number;
    }[];
  };
}

const cleanse = (raw: string): string => encodeURIComponent(raw);

abstract class RESTService {
  static autoSuggestCache: Record<string, CompanyAutoSuggestType> = {};
  static guessTickerCache: Record<string, GuessTickerType> = {};

  // Fetch errors handled in main code
  static loadPositions = async (): Promise<RawPosTableType> => {
    return (await CS.query("loadPositions")) as RawPosTableType;
  };

  static loadOrders = async (): Promise<RawOrdersTableType> => {
    const table = (await CS.query("loadOrders")) as RawOrdersTableType;
    table.Orders = { ...table.Orders, hidden: [] };
    return table;
  };

  static loadPerformance = async (): Promise<PerformanceData> => {
    return (await CS.query("loadPerformance")) as PerformanceData;
  };

  static requestBuy = async (
    tickerId: string,
    amount: number,
    byValue: boolean
  ): Promise<TransactionResponseType> => {
    const response = await CS.query(
      "requestBuy",
      `&tickerId=${cleanse(tickerId)}&${byValue ? "value" : "shares"}=${amount}`
    );
    return response as TransactionResponseType;
  };

  static requestShort = async (
    tickerId: string,
    shares: number,
    byValue: boolean
  ): Promise<TransactionResponseType> => {
    const response = await CS.query(
      "requestShort",
      `&tickerId=${cleanse(tickerId)}&${byValue ? "value" : "shares"}=${shares}`
    );
    return response as TransactionResponseType;
  };

  static requestSell = async (
    tickerId: string,
    shares: number
  ): Promise<TransactionResponseType> => {
    const response = await CS.query(
      "requestSell",
      `&tickerId=${cleanse(tickerId)}&shares=${shares}`
    );
    return response as TransactionResponseType;
  };

  static requestCover = async (
    tickerId: string,
    shares: number,
    avg: number
  ): Promise<TransactionResponseType> => {
    const response = await CS.query(
      "requestCover",
      `&tickerId=${cleanse(tickerId)}&shares=${shares}&avgCostOfShort=${avg}`
    );
    return response as TransactionResponseType;
  };

  static autoSuggest = async (
    prefix: string
  ): Promise<CompanyAutoSuggestType> => {
    const cleansed = cleanse(prefix);
    const cache = this.autoSuggestCache;
    if (cache[cleansed]) return cache[cleansed];

    const suggestions = (await CS.query(
      "autoSuggest",
      `&prefix=${cleansed}&limit=10`
    )) as CompanyAutoSuggestType;
    cache[cleansed] = suggestions;
    return suggestions;
  };

  static guessTicker = async (
    company: string
  ): Promise<GuessTickerType | null> => {
    const cleansed = cleanse(company);
    const cache = this.guessTickerCache;
    if (cache[cleansed]) return cache[cleansed];

    const guessed = (await CS.query(
      "guessTicker",
      `&company=${cleansed}`
    )) as EyeServerResponseType;
    if (!guessed.hasOwnProperty("id")) return null;

    const ticker = guessed as GuessTickerType;
    cache[cleansed] = ticker;
    return ticker;
  };
}

export default RESTService;
