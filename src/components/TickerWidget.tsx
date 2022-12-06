import React, { FC, useState } from "react";
import { Box, Button, Popover, Stack, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { TickerType } from "./widgets/TableWidget";

type TickerWidgetProps = {
  ticker: TickerType;
  statusColor: string;
};

const TickerWidget: FC<TickerWidgetProps> = ({ ticker, statusColor }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Button sx={{ pl: "2em", pr: "2em" }} onClick={handleClick}>
        <Typography variant="h3" color={statusColor}>
          {ticker.company} ({ticker.symbol})
        </Typography>
        <InfoIcon
          sx={{
            position: "absolute",
            right: 0,
          }}
        />
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Box sx={{ border: "2px solid #000", boxShadow: 24, maxWidth: 1000 }}>
          <Typography variant="h4" align="center">
            {ticker.company} ({ticker.symbol})
          </Typography>
          <Typography sx={{ p: 2 }}>{ticker.description}</Typography>
          <Stack justifyContent={"center"}>
            <Button
              variant="outlined"
              onClick={() =>
                window.open(`https://finance.yahoo.com/quote/${ticker.symbol}`)
              }
            >
              Yahoo Analytics
            </Button>
          </Stack>
        </Box>
      </Popover>
    </div>
  );
};

export default TickerWidget;
