import React, { useMemo } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EL_logo from "./../assets/equities_lab_white.png";
import { GetUserInfoType } from "../services/ConnectService";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
// https://mui.com/#app-bar-with-responsive-menu

type ResponsiveAppBarProps = {
  label: GetUserInfoType | null | undefined;
};

const ResponsiveAppBar: React.FC<ResponsiveAppBarProps> = ({ label }) => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [params] = useSearchParams();

  const personalParams = useMemo(
    () => `token=${params.get("token")}&userName=${params.get("userName")}`,
    [params]
  );

  const nav = useNavigate();

  const pages = ["positions", "orders", "performance"];
  const settings = ["Account"];

  const iteratePages = (mainTabColor: boolean) =>
    pages.map((page) => {
      const tabColor =
        mainTabColor && params.get("path") === page ? "#0f477e" : "";
      return (
        <Button
          key={page}
          color="inherit"
          onClick={() => {
            nav(`?path=${page}&${personalParams}`);
            handleCloseNavMenu();
          }}
          sx={{
            my: 2,
            display: "block",
            backgroundColor: tabColor,
            "&:hover": {
              backgroundColor: tabColor,
            },
            textDecoration: "none",
          }}
        >
          {page}
        </Button>
      );
    });

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Avatar alt="Equities Lab" src={EL_logo} />

          {/* XS Dropdown Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            {label ? (
              <>
                <IconButton
                  size="large"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {label ? iteratePages(false) : "&nbsp;"}
                </Menu>
              </>
            ) : (
              <></>
            )}
          </Box>

          {/* XS Logo */}
          <Typography
            variant="h5"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
            }}
          >
            <Link
              to={"?path=home" + (label ? `&${personalParams}` : "")}
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Equities Lab
            </Link>
          </Typography>

          {/* MD Logo */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: {
                xs: "none",
                md: "flex",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
              },
            }}
          >
            <Link
              to={"?path=home" + (label ? `&${personalParams}` : "")}
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Equities Lab
            </Link>
          </Typography>

          {label ? (
            <>
              {/* MD Tab Bar */}
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {iteratePages(true)}
              </Box>

              {/* Profile and User Settings */}
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Profile Picture" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => {
                        handleCloseUserMenu();
                        window.location.replace(
                          "https://www.equitieslab.com/account-summary/"
                        );
                      }}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <Typography>&nbsp;{label.label}</Typography>
            </>
          ) : (
            <></>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
