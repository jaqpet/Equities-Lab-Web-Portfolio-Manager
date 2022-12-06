import React, { FC, useEffect, useState } from "react";
import TableWidget, { ChooseRowEvent } from "../../widgets/TableWidget";
import { ServerTable } from "../../widgets/TableWidget";
import { Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import InitiateBuyDialog from "./newPosition/InitiateBuyDialog";
import PosClickDialog from "./heldPositions/PosClickDialog";
import { EyeServerResponseType } from "../../../services/ConnectService";
import { PositionType } from "../../../services/PositionService";

export interface RawPosTableType extends EyeServerResponseType {
  name: "table-wrapper";
  Positions: ServerTable;
}

type PositionViewProps = {
  positions: ServerTable | undefined;
  reload: () => void;
  orders: ServerTable | undefined;
  handleResponseOpen: (response: string, redirect: boolean) => void;
};

export const PositionsView: FC<PositionViewProps> = ({
  positions,
  reload,
  orders,
  handleResponseOpen,
}) => {
  const [filteredTable, setFilteredTable] = useState<ServerTable | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rowTableData, setRowTableData] = useState<ChooseRowEvent>();

  const onChooseRow = (eventInfo: ChooseRowEvent) => {
    setRowTableData(eventInfo);
    setOpenDialog(true);
  };

  const [openOrAll, setOpenOrAll] = useState<string>("open");
  const handleSelectChange = (event: SelectChangeEvent) => {
    setOpenOrAll(event.target.value as string);
  };

  useEffect(() => {
    if (!positions) return;

    if (openOrAll === "open") {
      const openRows = positions.rows.filter(
        (row) => !(row as PositionType).end_date
      );
      setFilteredTable({ ...positions, rows: openRows });
    } else {
      setFilteredTable(positions);
    }
  }, [positions, openOrAll]);

  const permaColumns: string[] = ["company", "value", "returns"];
  const flexColumns: string[] = ["start_date"];
  const initialHidden: string[] = [
    "end_date",
    "shares",
    "start_price",
    "end_price",
    "sector",
    "industry",
    "pos_type",
  ];

  const initialSortState = [
    { id: "end_date", desc: true },
    { id: "start_date", desc: true },
  ];

  return (
    <Box>
      <br />
      {filteredTable ? (
        <>
          <PosClickDialog
            open={openDialog}
            setOpenDialog={setOpenDialog}
            selectedRow={rowTableData}
            reload={reload}
            orders={orders}
            handleResponseOpen={handleResponseOpen}
          />
          <InitiateBuyDialog
            reload={reload}
            handleResponseOpen={handleResponseOpen}
          />
          <br />
          <Select
            fullWidth
            variant="standard"
            value={openOrAll}
            label="Open Positions or All Positions"
            onChange={handleSelectChange}
          >
            <MenuItem value={"open"}>Open Positions</MenuItem>
            <MenuItem value={"all"}>All Positions</MenuItem>
          </Select>

          <TableWidget
            serverTable={filteredTable}
            colState={{
              permaColumns,
              flexColumns,
              initialHidden,
              initialSortState,
            }}
            onChooseRow={onChooseRow}
          />
        </>
      ) : null}
    </Box>
  );
};
