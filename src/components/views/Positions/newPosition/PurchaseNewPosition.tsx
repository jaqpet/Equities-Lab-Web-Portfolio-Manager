import React, { FC, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import RS, { GuessTickerType } from "../../../../services/RESTService";
import { formatValue } from "../../../../utils/formatUtils";
import TickerWidget from "../../../TickerWidget";
import NumBox from "../../../widgets/NumBox";
import PositionService from "../../../../services/PositionService";

type PurchaseNewPositionProps = {
  ticker: GuessTickerType;
  byValue: boolean;
  parentLogic: {
    clear: () => void;
    handleUpdate: () => void;
  };
  handleResponseOpen: (response: string, redirect: boolean) => void;
};

const PurchaseNewPosition: FC<PurchaseNewPositionProps> = ({
  ticker,
  byValue,
  parentLogic,
  handleResponseOpen,
}) => {
  const defaultBuy = PositionService.defaultBuy;
  const [numField, setNumField] = useState<number>(byValue ? defaultBuy : 5);
  const [absoluteValueOrShares, setAbsoluteValueOrShares] = useState<number>(
    byValue ? defaultBuy : 5
  );
  const [shorting, setShorting] = useState<boolean>(false);

  const handleBuy = async () => {
    let outcome = null;
    try {
      if (shorting) {
        outcome = await RS.requestShort(
          ticker.id,
          -1 * absoluteValueOrShares,
          byValue
        );
      } else {
        outcome = await RS.requestBuy(
          ticker.id,
          absoluteValueOrShares,
          byValue
        );
      }
      PositionService.defaultBuy = absoluteValueOrShares;

      const rawMsg = outcome["user-info-message"];
      const msg = rawMsg.includes(":") ? rawMsg.split(":")[1] : rawMsg;
      handleResponseOpen(msg, false);
      parentLogic.handleUpdate();
    } catch (error) {
      handleResponseOpen((error as Error).message, false);
    }
  };

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    if (!Number.isNaN(numField)) {
      setNumField((prev) => (isChecked ? -1 : 1) * Math.abs(prev));
    }
    setShorting(isChecked);
  };

  const childOnChange = (val: number) => {
    setNumField(val);
    setAbsoluteValueOrShares(Math.abs(val));
    setShorting(val < 0);
  };

  // Used below
  // Question of "calculate twice or use more space"
  const affordableNumShares = useMemo(
    () => Math.floor(absoluteValueOrShares / ticker.estimate),
    [absoluteValueOrShares, ticker]
  );

  // "Number of Shares" presented to user
  const numShares = useMemo(
    () =>
      formatValue(
        byValue ? affordableNumShares : absoluteValueOrShares,
        "Float"
      ),
    [absoluteValueOrShares, affordableNumShares, byValue]
  );

  // "(Approximate) Total Cost" presented to user
  const approxTotalCost = useMemo(
    () =>
      formatValue(
        byValue
          ? affordableNumShares * ticker.estimate
          : absoluteValueOrShares * ticker.estimate,
        "Price"
      ),
    [absoluteValueOrShares, affordableNumShares, ticker, byValue]
  );

  return (
    <>
      <Box sx={{ textAlign: "center", paddingBottom: 1 }}>
        <NumBox
          label={byValue ? "Approximate Value" : "Number of Shares"}
          value={numField}
          onChange={childOnChange}
          integersOnly={!byValue}
          positiveOnly={false}
        />
        <br />
        <FormControlLabel
          control={<Checkbox checked={shorting} onChange={handleCheckbox} />}
          label="Shorting"
        />
        <br />
        <br />
        <Box sx={{ borderTop: 2, borderColor: "divider", paddingTop: 1 }}>
          <TickerWidget
            ticker={{
              id: ticker.id,
              company: ticker.company,
              symbol: ticker.symbol,
              description: ticker.description,
            }}
            statusColor="#000000"
          />

          <Typography>{`Number of Shares: ${numShares}`}</Typography>
          <Typography>
            {`(Approximate) Total Cost: ${approxTotalCost}`}
          </Typography>

          <br />
        </Box>
      </Box>
      <Stack direction={"row"} spacing={12} justifyContent="center">
        <Button
          color="secondary"
          variant="contained"
          disabled={Number.isNaN(numField)}
          onClick={handleBuy}
        >
          {shorting ? "Short" : "Buy"}
        </Button>

        <Button variant="outlined" color="error" onClick={parentLogic.clear}>
          Cancel
        </Button>
      </Stack>
    </>
  );
};

export default PurchaseNewPosition;
