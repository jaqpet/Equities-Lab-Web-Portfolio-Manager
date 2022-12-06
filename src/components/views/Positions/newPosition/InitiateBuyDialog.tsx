import React, { FC, useState } from "react";
import { Box, Button, Dialog, DialogContent } from "@mui/material";
import CompanyAutoSuggest from "./CompanyAutoSuggest";
import BuyTabsWrapper from "./BuyTabsWrapper";
import { GuessTickerType } from "../../../../services/RESTService";

type InitiateBuyDialogProps = {
  reload: () => void;
  handleResponseOpen: (response: string, redirect: boolean) => void;
};

const InitiateBuyDialog: FC<InitiateBuyDialogProps> = ({
  reload,
  handleResponseOpen,
}) => {
  const clear = () => {
    setTicker(null);
  };
  // Modal state
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setTimeout(clear, 500);
  };
  const handleUpdate = () => {
    handleClose();
    reload();
  };

  const [ticker, setTicker] = useState<GuessTickerType | null>(null);

  return (
    <div>
      <Button color="success" variant="contained" onClick={handleOpen}>
        Buy/Short
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          {!ticker ? (
            <Box paddingBottom={"1rem"}>
              <h2>Find Company</h2>
              <CompanyAutoSuggest
                setTicker={setTicker}
                handleResponseOpen={handleResponseOpen}
              />
            </Box>
          ) : (
            <BuyTabsWrapper
              ticker={ticker as GuessTickerType}
              parentLogic={{ clear, handleUpdate }}
              handleResponseOpen={handleResponseOpen}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InitiateBuyDialog;
