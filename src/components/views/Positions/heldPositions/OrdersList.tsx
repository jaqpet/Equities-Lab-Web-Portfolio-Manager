import React, { FC, useMemo, useState } from "react";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Popover,
} from "@mui/material";
import { RowType, ServerTable } from "../../../widgets/TableWidget";
import { PositionType } from "../../../../services/PositionService";
import { OrderType } from "../../../../services/OrderService";
import { formatValue } from "../../../../utils/formatUtils";

type OrdersListProps = {
  row: PositionType;
  orders: ServerTable | undefined;
};

const OrdersList: FC<OrdersListProps> = ({ row, orders }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const allOrders = useMemo(() => orders?.rows, [orders]) as OrderType[];

  const filtered = useMemo(
    () =>
      allOrders.filter((each: RowType) => {
        const eachId = (each as PositionType).ticker.id;
        const toMatch = row.ticker.id;
        return eachId === toMatch;
      }),
    [allOrders, row]
  );

  let divCount = filtered.length;

  const mapOrders = (item: OrderType, index: number) => {
    const date = formatValue(item.date, "Date");
    const orderType = formatValue(item.order_type, "String");
    const value = formatValue(item.value, "Price");

    const estimatedValue = formatValue(item.shares * row.end_price, "Price");
    divCount -= 1;
    return (
      <React.Fragment key={index}>
        <ListItem>
          <ListItemText
            primary={`${orderType} ${
              value !== "?" ? value : `approximately ${estimatedValue}`
            } on [${date}]`}
          />
        </ListItem>
        {divCount ? <Divider /> : null}
      </React.Fragment>
    );
  };

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        color="success"
        onClick={handleClick}
      >
        View Trades for {row.ticker.company}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Box sx={{ border: "2px solid #000", boxShadow: 24, maxWidth: 1000 }}>
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              maxHeight: 350,
            }}
          >
            {orders ? filtered.map(mapOrders) : null}
          </List>
        </Box>
      </Popover>
    </>
  );
};

export default OrdersList;
