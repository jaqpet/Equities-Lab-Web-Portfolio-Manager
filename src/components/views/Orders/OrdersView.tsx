import React, { FC, useState } from "react";
import TableWidget, { ChooseRowEvent } from "../../widgets/TableWidget";
import { ServerTable } from "../../widgets/TableWidget";
import { Box } from "@mui/material";
import { EyeServerResponseType } from "../../../services/ConnectService";
import OrderClickDialog from "./OrderClickDialog";

export interface RawOrdersTableType extends EyeServerResponseType {
  name: "table-wrapper";
  Orders: ServerTable;
}

type OrdersViewProps = {
  orders: ServerTable | undefined;
  handleResponseOpen: (response: string, redirect: boolean) => void;
};

export const OrdersView: FC<OrdersViewProps> = ({
  orders,
  handleResponseOpen,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [rowTableData, setRowTableData] = useState<ChooseRowEvent>();

  const onChooseRow = (eventInfo: ChooseRowEvent) => {
    setRowTableData(eventInfo);
    setOpenDialog(true);
  };

  const permaColumns: string[] = ["company", "order_type", "date", "value"];
  const flexColumns: string[] = ["shares", "price"];
  const initialHidden: string[] = ["sector", "industry"];

  const initialSortState = [{ id: "date", desc: true }];

  return (
    <Box>
      {orders ? (
        <>
          <OrderClickDialog
            open={openDialog}
            setOpenDialog={setOpenDialog}
            selectedRow={rowTableData}
            handleResponseOpen={handleResponseOpen}
          />
          <TableWidget
            serverTable={orders}
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
