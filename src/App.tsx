import React, { FC } from "react";
import { EqLabHome } from "./components/EqLabHome";
import { BrowserRouter as Router } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";

const EQLTheme = createTheme({
  typography: {
    h3: {
      fontSize: "1.75rem",
    },
  },
});

const App: FC = () => {
  return (
    <Router basename={process.env.REACT_APP_BASENAME}>
      <ThemeProvider theme={EQLTheme}>
        <EqLabHome />
      </ThemeProvider>
    </Router>
  );
};

export default App;
