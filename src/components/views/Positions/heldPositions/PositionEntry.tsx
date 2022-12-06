import React, { FC } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import PS, { PositionType } from "../../../../services/PositionService";
import TickerWidget from "../../../TickerWidget";
import {
  ChooseRowEvent,
  ServerTable,
  TickerType,
} from "../../../widgets/TableWidget";
import { formatValue } from "../../../../utils/formatUtils";
import OrdersList from "./OrdersList";

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

type PositionEntryProps = {
  selectedRow: ChooseRowEvent;
  handleChoose: () => void;
  setIncrease: React.Dispatch<React.SetStateAction<boolean>>;
  orders: ServerTable | undefined;
};

const PositionEntry: FC<PositionEntryProps> = ({
  selectedRow,
  handleChoose,
  setIncrease,
  orders,
}) => {
  const formatShortcut = (header: string, type: string) =>
    formatValue(selectedRow.renderValue(header), type);

  const originalPos = selectedRow.original as PositionType;

  const ticker: TickerType = selectedRow.original["ticker"];
  const value = formatShortcut("value", "Price");
  const returns = formatShortcut("returns", "Percent");
  const startDate = formatShortcut("start_date", "Date");
  const endDate = formatShortcut("end_date", "Date");
  const sector = formatShortcut("sector", "String");
  const industry = formatShortcut("industry", "String");

  const status = formatShortcut("pos_type", "String");
  const color = PS.getStatusColor(status);

  const isPosPending = PS.isPending(originalPos);
  const isPosOpen = PS.isOpen(originalPos);
  const isPosClosed = PS.isClosed(originalPos);
  const isShortType = PS.isShortType(originalPos);

  const shares: number = selectedRow.renderValue("shares");
  const endPrice: number = selectedRow.renderValue("end_price");
  const estimatedValue = formatValue(shares * endPrice, "Price");

  const handleIncrease = () => {
    setIncrease(true);
    handleChoose();
  };

  const handleDecrease = () => {
    setIncrease(false);
    handleChoose();
  };

  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 xs={12}>
          <OrdersList
            row={selectedRow.original as PositionType}
            orders={orders}
          />
        </Grid2>
        <Grid2 xs={12}>
          <Typography variant="h6" align="center" style={{ color }}>
            {isPosPending ? `${status}` : null}
            {isPosOpen ? `${status} since ${startDate}` : null}
            {isPosClosed ? `${status} [${startDate} \u2013 ${endDate}]` : null}
          </Typography>

          <Stack spacing={12} direction="row" justifyContent="center">
            <TickerWidget ticker={ticker} statusColor={color} />
          </Stack>
        </Grid2>

        {!isPosPending ? (
          <RowWrap title="Value" value={value} />
        ) : (
          <RowWrap title="Estimated Value" value={estimatedValue} />
        )}

        {returns ? <RowWrap title="Returns" value={returns} /> : null}

        <RowWrap title="Sector" value={sector} />
        <RowWrap title="industry" value={industry} />
      </Grid2>

      {!["Closed", "Covered"].includes(status) ? (
        <>
          <br />
          <Stack spacing={12} direction="row" justifyContent="center">
            <Button variant="contained" onClick={handleIncrease}>
              {isShortType ? "Short More" : "Buy More"}
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleDecrease}
            >
              {isShortType ? "Cover" : "Sell"}
            </Button>
          </Stack>
        </>
      ) : null}
    </Box>
  );
};

export default PositionEntry;
