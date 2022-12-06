import { RowType, TickerType } from "../components/widgets/TableWidget";

export interface OrderType extends RowType {
  order_type: string;
  date: Date;
  value: number;
  shares: number;
  price: number;
  sector: string;
  industry: string;
  ticker: TickerType;
}

// Export when it has something
// eslint-disable-next-line @typescript-eslint/no-unused-vars
abstract class OrderService {}
