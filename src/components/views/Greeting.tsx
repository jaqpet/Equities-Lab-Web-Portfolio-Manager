import React, { FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Button, Grid, Stack } from "@mui/material";
import { GetUserInfoType } from "../../services/ConnectService";

type GreetingProps = { label: GetUserInfoType };

const Greeting: FC<GreetingProps> = ({ label }) => {
  const [params] = useSearchParams();
  const nav = useNavigate();

  return (
    <Box textAlign={"center"}>
      <h1>Welcome, {label.label}</h1>

      <Grid container spacing={2}>
        <Grid item xs={0} md={4} />
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={() =>
                nav(
                  `?path=positions&token=${params.get(
                    "token"
                  )}&userName=${params.get("userName")}`
                )
              }
            >
              View Positions
            </Button>

            <Button
              fullWidth
              variant="contained"
              onClick={() =>
                nav(
                  `?path=orders&token=${params.get(
                    "token"
                  )}&userName=${params.get("userName")}`
                )
              }
            >
              View Orders
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={0} md={4} />
      </Grid>
    </Box>
  );
};

export default Greeting;
