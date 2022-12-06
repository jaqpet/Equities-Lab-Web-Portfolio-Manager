import { RowType, TickerType } from "../components/widgets/TableWidget";

export interface PositionType extends RowType {
  value: number;
  returns: number;
  start_date: Date;
  end_date: Date | null;
  shares: number;
  start_price: number;
  end_price: number;
  sector: string;
  industry: string;
  pos_type: string;
  ticker: TickerType;
}

abstract class PositionService {
  static defaultBuy = 100000;

  static isPending = (pos: PositionType): boolean =>
    ["Pending Buy", "Pending Sell", "Pending Short", "Pending Cover"].includes(
      pos.pos_type
    );

  static isOpen = (pos: PositionType): boolean =>
    ["Holding", "Shorting"].includes(pos.pos_type);

  static isClosed = (pos: PositionType): boolean =>
    ["Sold", "Covered"].includes(pos.pos_type);

  static isShortType = (pos: PositionType): boolean =>
    ["Shorting", "Covered"].includes(pos.pos_type);

  static getStatusColor = (status: string): string => {
    switch (status) {
      case "Sold":
        return "#aaaaaa";
      case "Shorting":
        return "#66194d";
      case "Covered":
        return "#916f8a";
      case "Pending Buy":
        return "#497199";
      case "Pending Sell":
        return "#72879c";
      case "Pending Short":
        return "#502f52";
      case "Pending Cover":
        return "#705868";
      case "Bought":
      default:
        return "#000000";
    }
  };
}

export default PositionService;
