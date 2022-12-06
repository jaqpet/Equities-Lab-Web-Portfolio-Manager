import React, { FC, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import PositionEntry from "./PositionEntry";
import { Stack } from "@mui/material";
import UpdatePosition from "./UpdatePosition";
import PS, { PositionType } from "../../../../services/PositionService";
import { ChooseRowEvent, ServerTable } from "../../../widgets/TableWidget";

type PosClickDialogProps = {
  open: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRow: ChooseRowEvent | undefined;
  reload: () => void;
  orders: ServerTable | undefined;
  handleResponseOpen: (response: string, redirect: boolean) => void;
};

const PosClickDialog: FC<PosClickDialogProps> = ({
  open,
  setOpenDialog,
  selectedRow,
  reload,
  orders,
  handleResponseOpen,
}) => {
  const [choseOption, setChoseOption] = useState<boolean>(false);
  const handleChoose = () => setChoseOption(true);
  const handleUnchoose = () => setChoseOption(false);

  const [increase, setIncrease] = useState<boolean>(true);

  const handleClose = () => {
    setOpenDialog(false);
    setTimeout(handleUnchoose, 500);
  };

  const handleUpdate = () => {
    handleClose();
    reload();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          {!choseOption && selectedRow ? (
            <Stack direction="row" justifyContent="center">
              <PositionEntry
                selectedRow={selectedRow}
                handleChoose={handleChoose}
                setIncrease={setIncrease}
                orders={orders}
              />
            </Stack>
          ) : null}
          {choseOption && selectedRow ? (
            <Stack spacing={12} direction="row" justifyContent="center">
              <UpdatePosition
                pos={selectedRow.original as PositionType}
                short={PS.isShortType(selectedRow.original as PositionType)}
                increase={increase}
                handleUnchoose={handleUnchoose}
                handleUpdate={handleUpdate}
                handleResponseOpen={handleResponseOpen}
              />
            </Stack>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PosClickDialog;
