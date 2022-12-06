import React, { FC, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { ChooseRowEvent } from "../../widgets/TableWidget";
import OrderEntry from "./OrderEntry";

type OrderClickDialogProps = {
  open: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRow: ChooseRowEvent | undefined;
  handleResponseOpen: (response: string, redirect: boolean) => void;
};

const OrderClickDialog: FC<OrderClickDialogProps> = ({
  open,
  setOpenDialog,
  selectedRow,
}) => {
  const [choseOption, setChoseOption] = useState<boolean>(false);
  const handleUnchoose = () => setChoseOption(false);

  const handleClose = () => {
    setOpenDialog(false);
    setTimeout(handleUnchoose, 500);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          {!choseOption && selectedRow ? (
            <OrderEntry selectedRow={selectedRow} />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderClickDialog;
