import { EyeCellType } from "../components/widgets/TableWidget";

const formatDate = (date: Date): string => {
  return date.toLocaleDateString(undefined, { timeZone: "America/New_York" });
};

export const formatValue = (cellData: EyeCellType, type: string): string => {
  // Only some end_dates should be null
  if (cellData === null) {
    return "";
  } else if (cellData === undefined || Number.isNaN(cellData)) {
    // If undefined, return a placeholder
    // Placeholder varies depending if it's a number type
    return ["Price", "Float", "Percent"].includes(type) ? "?" : "";
  }

  switch (type) {
    case "Date":
      return formatDate(cellData as Date);
    case "Price":
      return (cellData as number).toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
      });
    case "Float":
      return (cellData as number).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      });
    case "Percent":
      return (
        (cellData as number).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        }) + "%"
      );
    case "String":
      return formatString(cellData as string);
    default:
      return cellData.toLocaleString();
  }
};

export const formatString = (header: string): string => {
  const formatWord = (subHeader: string) => {
    if (subHeader.length === 0) {
      return subHeader;
    }
    const first = subHeader.charAt(0).toUpperCase();
    let rest = "";
    if (subHeader.length > 1) {
      rest = subHeader.slice(1);
    }
    return first + rest;
  };

  const fragments = header.split(header.includes("_") ? "_" : " ");
  for (let i in fragments) {
    fragments[i] = formatWord(fragments[i].trim());
  }
  return fragments.join(" ");
};

// String => Number
export const strictParseFloat = (rawVal: string): number => {
  const floatRegex = RegExp("^-?([0-9]+([.][0-9]*)?|[.][0-9]+)$");
  const val = rawVal.replaceAll(",", "");
  const isNum = floatRegex.test(val);
  return isNum ? parseFloat(val) : NaN;
};

// String => String
export const localizeKeepDecimals = (rawVal: string): string => {
  const isNum = strictParseFloat(rawVal);
  if (Number.isNaN(isNum)) throw Error("Not a number");

  const split = rawVal.replaceAll(",", "").split(".");
  const numBody = formatValue(parseFloat(split[0]), "Float");
  if (split.length === 1) {
    // No decimal
    return numBody;
  } else {
    // Yes decimal
    const decimals = split[1];
    return numBody + "." + decimals;
  }
};
