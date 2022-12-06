import React, { FC, useMemo, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { PositionType } from "../../../../services/PositionService";
import { formatValue } from "../../../../utils/formatUtils";
import RS from "../../../../services/RESTService";
import NumBox from "../../../widgets/NumBox";

type UpdatePositionProps = {
  pos: PositionType;
  short: boolean;
  increase: boolean;
  handleUnchoose: () => void;
  handleUpdate: () => void;
  handleResponseOpen: (response: string, redirect: boolean) => void;
};

const UpdatePosition: FC<UpdatePositionProps> = ({
  pos,
  short,
  increase,
  handleUnchoose,
  handleUpdate,
  handleResponseOpen,
}) => {
  const company = useMemo(
    () => formatValue(pos.ticker.company, "String"),
    [pos]
  );
  const initialShares = useMemo(
    () => formatValue(Math.abs(pos.shares), "Float"),
    [pos]
  );
  const initialValue = useMemo(() => formatValue(pos.value, "Price"), [pos]);

  const [numField, setNumField] = useState<number>(
    increase ? 1 : Math.abs(pos.shares)
  );

  let onSubmit = async () => {
    let type = "";
    if (short && increase) {
      type = "Short";
    } else if (short && !increase) {
      type = "Cover";
    } else if (!short && increase) {
      type = "Buy";
    } else {
      type = "Sell";
    }

    // Parses and handles commas
    let outcome = null;
    try {
      switch (type) {
        case "Buy": {
          outcome = await RS.requestBuy(pos.ticker.id, numField, false);
          break;
        }
        case "Short": {
          outcome = await RS.requestShort(pos.ticker.id, -1 * numField, false);
          break;
        }
        case "Sell": {
          outcome = await RS.requestSell(pos.ticker.id, -1 * numField);
          break;
        }
        case "Cover": {
          outcome = await RS.requestCover(
            pos.ticker.id,
            numField,
            pos.start_price
          );
          break;
        }
        default: {
          throw Error("Couldn't get outcome");
        }
      }
      handleResponseOpen(outcome["user-info-message"].split(":")[1], false);
      handleUpdate();
    } catch (error) {
      handleResponseOpen((error as Error).message, false);
    }
  };

  return (
    <>
      <Box>
        <Typography variant="h3" align="center">
          {`${
            increase ? (short ? "Short" : "Buy") : short ? "Cover" : "Sell"
          } ${company}`}
        </Typography>
        <>
          {short ? (
            <>
              <Typography align="center">
                You are shorting {initialShares} shares in {company} with a
                value of {initialValue}
              </Typography>
              <br />
              <Typography align="center">
                How many {increase ? "more " : ""}shares do you want to{" "}
                {increase ? "short" : "cover"}?
              </Typography>
            </>
          ) : (
            <>
              <Typography align="center">
                You have {initialShares} number of shares in {company} with a
                value of {initialValue}
              </Typography>
              <br />
              <Typography align="center">
                How many {increase ? "more " : ""}shares do you want to{" "}
                {increase ? "buy" : "sell"}?
              </Typography>
            </>
          )}
          <br />
          <Stack spacing={12} direction="row" justifyContent="center">
            <NumBox
              label="Number of Shares"
              value={numField}
              onChange={setNumField}
              integersOnly={increase}
              positiveOnly={true}
            />
          </Stack>
        </>
        <br />
        <Stack spacing={12} direction="row" justifyContent="center">
          <Button
            variant="contained"
            disabled={Number.isNaN(numField)}
            color="success"
            onClick={onSubmit}
          >
            {increase ? (short ? "Short" : "Buy") : short ? "Cover" : "Sell"}
          </Button>
          <Button variant="outlined" color="error" onClick={handleUnchoose}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default UpdatePosition;
