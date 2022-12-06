import React, { FC, useEffect, useRef, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import RS, {
  CompanyAutoSuggestType,
  GuessTickerType,
} from "../../../../services/RESTService";

type CompanyAutoSuggestProps = {
  setTicker: React.Dispatch<React.SetStateAction<GuessTickerType | null>>;
  handleResponseOpen: (response: string, redirect: boolean) => void;
};

const CompanyAutoSuggest: FC<CompanyAutoSuggestProps> = ({
  setTicker,
  handleResponseOpen,
}) => {
  const [field, setField] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [invalidQuery, setInvalidQuery] = useState<boolean>(false);

  // When field changes
  // Options-getting doesn't work when this is merged into handler
  useEffect(() => {
    const getOptions = async (field: string) => {
      if (field.length < 3) {
        return setOptions([]);
      }

      try {
        const suggested: CompanyAutoSuggestType = await RS.autoSuggest(field);
        setOptions(suggested.suggestions);
      } catch (error) {
        handleResponseOpen((error as Error).message, false);
      }
    };

    if (!field) return;
    getOptions(field);
  }, [field, handleResponseOpen]);

  const handleFieldChange = (
    event: React.SyntheticEvent,
    newInputValue: string
  ) => {
    setInvalidQuery(false);
    setField(newInputValue.replace("\\", ""));
  };

  const handleSelectChange = async (
    event: React.SyntheticEvent,
    newValue: string | null
  ) => {
    if (!newValue) return;

    setSelected(newValue);
    try {
      const guessed: GuessTickerType | null = await RS.guessTicker(newValue);
      // "Error handling" for lack of suggestions
      if (!guessed) return setInvalidQuery(true);

      const ticker = guessed as GuessTickerType;
      setTicker(ticker);
    } catch (error) {
      handleResponseOpen((error as Error).message + " suggestions", false);
    }
  };

  // Auto-focus
  let inputRef = useRef<any>(null);
  useEffect(() => {
    const ref = inputRef?.current;
    if (ref) {
      ref.focus();
    }
  }, []);

  return (
    <Autocomplete
      openOnFocus
      autoHighlight
      freeSolo
      options={options}
      value={selected}
      onChange={handleSelectChange}
      inputValue={field}
      onInputChange={handleFieldChange}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{ maxWidth: 350 }}
          error={invalidQuery}
          helperText={
            invalidQuery
              ? `No matching companies for: ${field}`
              : "For suggestions, please have three or more letters"
          }
          label="Company"
          placeholder="Company Name or Symbol"
          inputRef={inputRef}
        />
      )}
    />
  );
};

export default CompanyAutoSuggest;
