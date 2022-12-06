import React, { FC } from "react";
import { Box, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import TickerWidget from "../../TickerWidget";
import { ChooseRowEvent, TickerType } from "../../widgets/TableWidget";
import { formatValue } from "../../../utils/formatUtils";

type RowWrapProps = {
  title: string;
  value: string;
};

const RowWrap: FC<RowWrapProps> = ({ title, value }) => (
  <>
    <Grid2 xs={6}>
      <Typography align="right">
        <b>{title}</b>
      </Typography>
    </Grid2>
    <Grid2 xs={6}>
      <Typography>{value}</Typography>
    </Grid2>
  </>
);

type OrderEntryProps = {
  selectedRow: ChooseRowEvent;
};

const OrderEntry: FC<OrderEntryProps> = ({ selectedRow }) => {
  const formatShortcut = (header: string, type: string) =>
    formatValue(selectedRow.renderValue(header), type);

  const ticker: TickerType = selectedRow.original["ticker"];
  const orderType = formatShortcut("order_type", "String");
  const date = formatShortcut("date", "Date");
  const value = formatShortcut("value", "Price");
  const shares = formatShortcut("shares", "Float");
  const price = formatShortcut("price", "Price");
  const sector = formatShortcut("sector", "String");
  const industry = formatShortcut("industry", "String");

  const pending = orderType.toLowerCase().includes("pending");

  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 xs={12}>
          <Typography variant="h6" align="center">
            {`${orderType} [${date}]`}
          </Typography>

          <Stack spacing={12} direction="row" justifyContent="center">
            {orderType === "Deposit" ? (
              <Typography variant="h3">{ticker.company}</Typography>
            ) : (
              <TickerWidget ticker={ticker} statusColor={"#000000"} />
            )}
          </Stack>
        </Grid2>

        {!pending ? <RowWrap title={"Value"} value={value} /> : <></>}
        {orderType !== "Deposit" ? (
          <>
            <RowWrap title="Num Shares" value={shares} />

            {!pending ? <RowWrap title="Price" value={price} /> : <></>}

            <RowWrap title="Sector" value={sector} />
            <RowWrap title="industry" value={industry} />
          </>
        ) : (
          <></>
        )}
      </Grid2>
    </Box>
  );
};

export default OrderEntry;
