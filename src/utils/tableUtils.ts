import {
  EyeCellType,
  RowType,
  ServerTable,
  TickerType,
} from "../components/widgets/TableWidget";
import { formatValue } from "./formatUtils";

const fixDate = (theTable: ServerTable, dateItems: string[]): void => {
  theTable.rows.forEach((row) => {
    // Doing this because there's some mess with UTC and a non-time date
    // This makes the output date correct in NY time
    const manualOffset = 7 * 60 * 60 * 1000;

    dateItems.forEach((dItem) => {
      if (row.hasOwnProperty(dItem)) {
        const temp = new Date(row[dItem]);
        row[dItem] = new Date(temp.getTime() + manualOffset);
      } else {
        row[dItem] = null;
      }
    });
  });
};

const tickerize = (theTable: ServerTable): void => {
  const inTicker = ["id", "company", "symbol", "description"];
  // Cutting out from names and types
  inTicker.forEach((toRemove) => {
    const rmvIndex = theTable.columnNames.indexOf(toRemove);
    theTable.columnNames.splice(rmvIndex, 1);
    theTable.columnTypes.splice(rmvIndex, 1);
  });
  // Cutting out values and stitching in as a newTicker
  theTable.rows.forEach((row) => {
    const newTicker: TickerType = {
      id: "",
      company: "",
      symbol: "",
      description: "",
    };
    inTicker.forEach((toRemove) => {
      newTicker[toRemove] = row[toRemove];
      delete row[toRemove];
    });
    row["ticker"] = newTicker;
  });
};

export const preprocessServerTable = (
  table: ServerTable,
  dateItems: string[],
  hasDeposits: boolean
): ServerTable => {
  const castDeposits = (theTable: ServerTable): void => {
    const rows = theTable.rows;

    for (let i = 0; i < rows.length; i++) {
      if (rows[i].order_type !== "deposit") return;

      rows[i] = {
        id: null,
        symbol: "Deposit",
        company: "Deposit",
        order_type: "deposit",
        date: rows[i].date,
        value: rows[i].value,
        shares: null,
        price: null,
        sector: null,
        industry: null,
        description: null,
      };
    }
  };

  fixDate(table, dateItems);
  if (hasDeposits) castDeposits(table);
  tickerize(table);
  return table;
};

export const nullDateSort = (rowA: any, rowB: any, columnId: string) => {
  let a = rowA.renderValue(columnId) as Date;
  let b = rowB.renderValue(columnId) as Date;
  if (a === null && b === null) {
    return 0;
  } else if (a === null) {
    return 1;
  } else if (b === null) {
    return -1;
  } else if (a.getTime() < b.getTime()) {
    return -1;
  } else if (a.getTime() > b.getTime()) {
    return 1;
  } else {
    return 0;
  }
};

export const tickerSort = (rowA: any, rowB: any, columnId: string) => {
  let a = rowA.renderValue(columnId) as TickerType;
  let b = rowB.renderValue(columnId) as TickerType;
  return a.company.localeCompare(b.company);
};

export const tickerFilter = (row: RowType, id: string, filterValue: any) => {
  const company: string = row.getValue(id).company.toLowerCase();
  const symbol: string = row.getValue(id).symbol.toLowerCase();
  return (
    company.includes(filterValue.toLowerCase()) ||
    symbol.includes(filterValue.toLowerCase())
  );
};

export const typedFilterWrapper =
  (type: string) =>
  (row: RowType, id: string, filterValue: any): boolean => {
    const rawCell: EyeCellType = row.getValue(id);
    if (!rawCell) return false;

    const cell: string = formatValue(rawCell, type).toLowerCase().trim();
    const processedFilterValue = filterValue.trim().toLowerCase();
    return (
      cell.includes(processedFilterValue) ||
      rawCell.toString().includes(processedFilterValue)
    );
  };
