import React, { FC, useMemo, useState, useEffect } from "react";
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import { useMediaQuery } from "@mui/material";
import {
  nullDateSort,
  tickerSort,
  tickerFilter,
  typedFilterWrapper,
} from "../../utils/tableUtils";
import { MRT_Row } from "material-react-table";
import { formatString, formatValue } from "../../utils/formatUtils";

// This is passed in from the API as-is
export interface ServerTable {
  dataType: string;
  name: string;
  hidden: string[];
  columnNames: string[];
  columnTypes: string[];
  rows: RowType[];
}

export interface TickerType extends Record<string, any> {
  id: string;
  company: string;
  symbol: string;
  description: string;
}

export type RowType = Record<string, any>;

export type EyeCellType = (string | number | undefined) | (Date | null);

export type ChooseRowEvent = MRT_Row<RowType>;

const createColumns = (table: ServerTable): MRT_ColumnDef<RowType>[] => {
  const columns: MRT_ColumnDef<RowType>[] = [];

  // Special ticker column
  columns.push({
    accessorKey: "ticker",
    header: formatString("company"),
    Cell: ({ cell }) => {
      const rawCell = cell.getValue<TickerType>();
      const notDeposit = rawCell.company !== "Deposit";
      return rawCell.company + (notDeposit ? ` (${rawCell.symbol})` : "");
    },
    sortDescFirst: false,
    // Not sure why this reduces min size, but here we are
    maxSize: 50,
    sortingFn: tickerSort,
    filterFn: tickerFilter,
  });

  // Non-ticker columns
  for (let colIndex = 0; colIndex < table.columnNames.length; colIndex++) {
    const colName: string = table.columnNames[colIndex];
    const colType: string = table.columnTypes[colIndex];

    let colDef: MRT_ColumnDef<RowType> = {
      accessorKey: colName,
      header: formatString(colName),
      Cell: ({ cell }) => {
        return formatValue(cell.getValue<EyeCellType>(), colType);
      },
      maxSize: 50, // Not sure why this reduces min size
      filterFn: typedFilterWrapper(colType),
    };

    if (colType === "Date") {
      colDef = { ...colDef, sortingFn: "nullDateSort" };
    } else if (["Price", "Float", "Percent"].includes(colType)) {
      colDef = {
        ...colDef,
        sortingFn: "basic",
      };
    } else {
      colDef = { ...colDef, sortingFn: "alphanumeric" };
    }

    columns.push(colDef);
  }
  return columns;
};

type TableWidgetProps = {
  serverTable: ServerTable;
  colState: {
    permaColumns: string[];
    flexColumns: string[];
    initialHidden: string[];
    initialSortState: { id: string; desc: boolean }[];
  };
  onChooseRow: (chooseRowEvent: ChooseRowEvent) => void;
};

export const TableWidget: FC<TableWidgetProps> = ({
  serverTable,
  colState,
  onChooseRow,
}) => {
  const isMobile = useMediaQuery("(max-width: 900px)");

  const columns = useMemo<MRT_ColumnDef<RowType>[]>(() => {
    return createColumns(serverTable);
  }, [serverTable]);
  const rows: RowType[] = serverTable.rows;
  const colNames: string[] = serverTable.columnNames;

  const initialVisState: Record<string, boolean> = {};
  colNames.forEach((colName) => {
    initialVisState[colName] = !colState.initialHidden.includes(colName);
  });

  // Record of column visibility
  const [columnVisibility, setColumnVisibility] =
    useState<Record<string, boolean>>(initialVisState);

  // Determines if we're on mobile or not
  useEffect(() => {
    setColumnVisibility((prevState) => {
      const updatedVis: Record<string, boolean> = {};
      colState.flexColumns.forEach(
        (flexCol) => (updatedVis[flexCol] = !isMobile)
      );
      return { ...prevState, ...updatedVis };
    });
  }, [colState, isMobile]);

  return (
    <MaterialReactTable
      columns={columns}
      data={rows}
      sortingFns={{
        nullDateSort,
        tickerSort,
      }}
      initialState={{
        sorting: colState.initialSortState,
        showColumnFilters: true,
      }}
      onColumnVisibilityChange={setColumnVisibility}
      state={{ columnVisibility }}
      muiTableBodyRowProps={({ row }) => ({
        onClick: () => {
          onChooseRow(row);
        },
        sx: { cursor: "pointer" },
      })}
      renderToolbarInternalActions={({ table }) => (
        <>
          {/* eslint-disable-next-line react/jsx-pascal-case */}
          <MRT_ToggleFiltersButton table={table} />
          {/* eslint-disable-next-line react/jsx-pascal-case */}
          <MRT_ShowHideColumnsButton table={table} />
        </>
      )}
      enablePagination={false}
    />
  );
};

export default TableWidget;
