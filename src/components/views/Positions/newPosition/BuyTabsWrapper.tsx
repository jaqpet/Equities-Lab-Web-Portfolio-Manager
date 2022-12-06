import React, { FC, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import PurchaseNewPosition from "./PurchaseNewPosition";
import { GuessTickerType } from "../../../../services/RESTService";

// Tab stuff
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index } = props;
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index ? (
        <Box sx={{ p: 3 }}>
          <span>{children}</span>
        </Box>
      ) : null}
    </div>
  );
};

type BuyTabsWrapperProps = {
  ticker: GuessTickerType;
  parentLogic: {
    clear: () => void;
    handleUpdate: () => void;
  };
  handleResponseOpen: (response: string, redirect: boolean) => void;
};

const BuyTabsWrapper: FC<BuyTabsWrapperProps> = ({
  ticker,
  parentLogic,
  handleResponseOpen,
}) => {
  const [tabVal, setTabVal] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabVal(newValue);
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabVal} onChange={handleTabChange}>
          <Tab label="By Value" />
          <Tab label="By Shares" />
        </Tabs>
      </Box>
      <TabPanel value={tabVal} index={0}>
        <PurchaseNewPosition
          ticker={ticker}
          byValue={true}
          parentLogic={parentLogic}
          handleResponseOpen={handleResponseOpen}
        />
      </TabPanel>
      <TabPanel value={tabVal} index={1}>
        <PurchaseNewPosition
          ticker={ticker}
          byValue={false}
          parentLogic={parentLogic}
          handleResponseOpen={handleResponseOpen}
        />
      </TabPanel>
    </>
  );
};

export default BuyTabsWrapper;
