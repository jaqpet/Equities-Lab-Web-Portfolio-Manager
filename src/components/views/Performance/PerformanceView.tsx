import { Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import RS, { PerformanceData } from "../../../services/RESTService";
import BasicTwoLineChartWidget from "../../widgets/LineChartWidget";

type PerformanceViewProps = {
  handleResponseOpen: (response: string, redirect: boolean) => void;
};

const PerformanceView: FC<PerformanceViewProps> = ({ handleResponseOpen }) => {
  const [performance, setPerformance] = useState<PerformanceData>();

  const getPerformance = async () => {
    const rawTable: PerformanceData = await RS.loadPerformance();
    setPerformance(rawTable);
  };

  useEffect(() => {
    try {
      getPerformance();
    } catch (error) {
      handleResponseOpen((error as Error).message + " table", false);
    }
  }, [handleResponseOpen]);

  if (!performance) return null;

  const rows = performance.backtestGraph.rows;
  const dates = [];
  const yourReturns: number[] = [];
  const theirReturns: number[] = [];
  for (let i = 0; i < rows.length; i++) {
    const theDate = rows[i].date;
    const newYouReturn = rows[i].Portfolio;
    const newCompareReturn = rows[i]["S&P 500"];

    const prevYouReturn = i !== 0 ? yourReturns[i - 1] : 1;
    const prevThemReturn = i !== 0 ? theirReturns[i - 1] : 1;

    dates.push(theDate);
    yourReturns.push(newYouReturn * prevYouReturn);
    theirReturns.push(newCompareReturn * prevThemReturn);
  }

  return performance.backtestGraph.rows.length > 1 ? (
    <BasicTwoLineChartWidget
      chartTitle="Your Portfolio vs. S&P500"
      firstTitle="Your Portfolio"
      secondTitle="Their Portfolio"
      labels={dates}
      firstData={yourReturns}
      secondData={theirReturns}
    />
  ) : (
    <Typography variant="h2" align="center">
      Cannot process chart from empty portfolio
    </Typography>
  );
};

export default PerformanceView;
