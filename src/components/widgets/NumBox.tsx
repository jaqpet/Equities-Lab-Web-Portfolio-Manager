import { TextField } from "@mui/material";
import React, { FC, useEffect, useMemo, useState } from "react";
import {
  localizeKeepDecimals,
  formatValue,
  strictParseFloat,
} from "../../utils/formatUtils";

type NumBoxProps = {
  label: string;
  value: number;
  onChange: (val: number) => void;
  integersOnly: boolean;
  positiveOnly: boolean;
};

const NumBox: FC<NumBoxProps> = ({
  label,
  value,
  onChange,
  integersOnly,
  positiveOnly,
}) => {
  const [textField, setTextField] = useState<string>(
    formatValue(value, "Float")
  );

  const helperText = useMemo(() => {
    return `Non-zero ${positiveOnly ? "Positive " : ""}${
      integersOnly ? "Integers" : "Numbers"
    } Only`;
  }, [positiveOnly, integersOnly]);

  const handleTextChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const rawVal = event.target.value;
    setTextField(rawVal);

    const isMatch = strictParseFloat(rawVal);

    // Not strictly necessary since setting same-value won't rerender,
    // but this, at least, skips all the boolean stuff below
    if (isMatch === value) return;

    /*
      isMatch is invalid if:
      - rawVal is Not a Number or 0
      - rawVal isn't positive when it needs to be
      - rawVal isn't an integer when it needs to be
    */
    const invalid =
      !isMatch ||
      (positiveOnly && isMatch <= 0) ||
      (integersOnly && !Number.isInteger(isMatch));

    onChange(!invalid ? isMatch : NaN);
  };

  // Reformats when the value changes
  useEffect(() => {
    if (Number.isNaN(value)) return;

    setTextField(
      integersOnly
        ? formatValue(value, "Float")
        : localizeKeepDecimals(value.toString())
    );
  }, [value, integersOnly]);

  const isNaN = useMemo(() => Number.isNaN(value), [value]);

  return (
    <>
      <TextField
        autoFocus
        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        error={isNaN}
        helperText={isNaN ? helperText : ""}
        label={label}
        value={textField}
        onChange={handleTextChange}
        variant="filled"
      />
    </>
  );
};

export default NumBox;
