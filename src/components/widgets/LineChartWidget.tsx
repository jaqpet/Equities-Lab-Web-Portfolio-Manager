import React, { FC } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

type BasicTwoLineChartWidgetProps = {
  chartTitle: string;
  firstTitle: string;
  secondTitle: string;
  labels: string[];
  firstData: number[];
  secondData: number[];
};

export const BasicTwoLineChartWidget: FC<BasicTwoLineChartWidgetProps> = ({
  chartTitle,
  firstTitle,
  secondTitle,
  labels,
  firstData,
  secondData,
}) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: chartTitle,
      },
    },
    radius: 0,
  };

  const data = {
    labels,
    datasets: [
      {
        label: firstTitle,
        data: firstData,
        borderColor: "#32CD32",
        backgroundColor: "#32CD32",
      },
      {
        label: secondTitle,
        data: secondData,
        borderColor: "#964B00",
        backgroundColor: "#964B00",
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default BasicTwoLineChartWidget;
