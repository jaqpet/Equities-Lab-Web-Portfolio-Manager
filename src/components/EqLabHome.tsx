import React, {
  FC,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Button, LinearProgress } from "@mui/material";
import CS, { GetUserInfoType } from "../services/ConnectService";
import ResponsiveAppBar from "./ResponsiveAppBar";
import UserDebug from "./views/UserDebug";
import {
  PositionsView,
  RawPosTableType,
} from "./views/Positions/PositionsView";
import { OrdersView, RawOrdersTableType } from "./views/Orders/OrdersView";
import ResponseDialog from "./widgets/ResponseDialog";
import Greeting from "./views/Greeting";
import RS from "../services/RESTService";
import { ServerTable } from "./widgets/TableWidget";
import { preprocessServerTable } from "../utils/tableUtils";

const RedirectButton: FC = () => (
  <Button
    variant="contained"
    color="secondary"
    onClick={() =>
      window.location.replace("https://www.equitieslab.com/account-summary/")
    }
  >
    Go to your Account Page
  </Button>
);

export const EqLabHome: FC = () => {
  const [responseOpen, setResponseOpen] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [redirect, setRedirect] = useState<boolean>(false);
  const handleResponseOpen = useCallback(
    (response: string, redirect: boolean) => {
      setResponse(response);
      setRedirect(redirect);
      setResponseOpen(true);
    },
    []
  );
  const handleResponseClose = () => {
    setResponseOpen(false);
    setRedirect(false);
    setTimeout(() => setResponse(""), 500);
  };

  const [params] = useSearchParams();
  const userName = useMemo(() => params.get("userName"), [params]);
  const token = useMemo(() => params.get("token"), [params]);
  const path = useMemo(() => params.get("path"), [params]);

  const [fullyLoaded, setFullyLoaded] = useState<boolean>(false);

  const [label, setLabel] = useState<GetUserInfoType | null>();

  useEffect(() => {
    const pingForLabel = async (user: string, password: string) => {
      try {
        const label: GetUserInfoType = await CS.logAndLabel(user, password);
        setLabel(label);
      } catch (error) {
        handleResponseOpen((error as Error).message, true);
      }
    };

    if (userName && token) {
      pingForLabel(userName, token);
    } else {
      setLabel(null);
    }
  }, [userName, token, handleResponseOpen]);

  // API Data
  const [positions, setPositions] = useState<ServerTable>();
  const [orders, setOrders] = useState<ServerTable>();

  const getPositions = async () => {
    setFullyLoaded(false);
    const table: RawPosTableType = await RS.loadPositions();
    const positions: ServerTable = preprocessServerTable(
      table.Positions,
      ["start_date", "end_date"],
      false
    );
    setPositions(positions);
    setFullyLoaded(true);
  };

  const getOrders = async () => {
    const table: RawOrdersTableType = await RS.loadOrders();
    const orders: ServerTable = preprocessServerTable(
      table.Orders,
      ["date"],
      true
    );
    setOrders(orders);
  };

  const reload = useCallback(() => {
    if (!label) return;

    try {
      getPositions();
      getOrders();
    } catch (error) {
      handleResponseOpen((error as Error).message + " table", false);
    }
    setFullyLoaded(true);
  }, [label, handleResponseOpen]);

  useEffect(() => {
    reload();
  }, [label, reload]);

  const getComponent = (): JSX.Element => {
    switch (label) {
      case undefined: {
        return <></>;
      }
      case null: {
        if (!fullyLoaded) {
          setFullyLoaded(true);
        }
        return (
          <Box textAlign={"center"}>
            <h1>Sorry! You need to supply your username and security token</h1>
            <h3>Get your personal URL from your Equities Lab account page</h3>
            <RedirectButton />
          </Box>
        );
      }
    }

    switch (path) {
      case "positions": {
        return (
          <PositionsView
            positions={positions}
            reload={reload}
            orders={orders}
            handleResponseOpen={handleResponseOpen}
          />
        );
      }
      case "orders": {
        return (
          <OrdersView orders={orders} handleResponseOpen={handleResponseOpen} />
        );
      }
      case "performance": {
        const PerformanceView = lazy(
          () => import("./views/Performance/PerformanceView")
        );
        return (
          <Suspense>
            <PerformanceView handleResponseOpen={handleResponseOpen} />;
          </Suspense>
        );
      }
      case "home": {
        return <Greeting label={label} />;
      }
      default: {
        return (
          <Box textAlign={"center"}>
            <h1>Invalid URL</h1>
            <RedirectButton />
          </Box>
        );
      }
    }
  };

  return (
    <>
      {label && label.isInternal ? <UserDebug /> : null}
      <ResponseDialog
        response={response}
        open={responseOpen}
        handleClose={handleResponseClose}
        redirect={redirect}
      />
      <ResponsiveAppBar label={label} />
      {fullyLoaded ? null : <LinearProgress color="secondary" />}
      {getComponent()}
    </>
  );
};
