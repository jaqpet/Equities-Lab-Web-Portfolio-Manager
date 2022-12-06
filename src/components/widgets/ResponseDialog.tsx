import React, { FC } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export interface ResponseDialogProps {
  response: string;
  open: boolean;
  handleClose: () => void;
  redirect: boolean;
}

const ResponseDialog: FC<ResponseDialogProps> = ({
  response,
  open,
  handleClose,
  redirect,
}) => {
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Server Response</DialogTitle>
      <DialogContent>
        <Typography>{response}</Typography>
        {redirect ? (
          <>
            <br />
            <Button
              fullWidth
              color="success"
              variant="contained"
              onClick={() =>
                window.location.replace(
                  "https://www.equitieslab.com/account-summary/"
                )
              }
            >
              Go to Equities Lab account page
            </Button>
          </>
        ) : (
          <></>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResponseDialog;
