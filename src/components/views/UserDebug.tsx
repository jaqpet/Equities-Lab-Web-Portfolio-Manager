import React, { FC, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const students: string[] = ["Frank", "David", "Bill", "Amy"];
const smokeStudents: string[] = ["Emma", "Fred"];
const fakeToken = "1234567890";

const UserDebug: FC = () => {
  const nav = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const studentNav = (student: string) => () =>
    nav(
      `?path=home&token=${fakeToken}&userName=${student.toLowerCase()}_student`
    );

  const others: [string, () => void][] = [
    ["Support", () => nav(`?path=home&token=${fakeToken}&userName=support`)],
    ["No One", () => nav(`?path=home`)],
  ];

  const toggleDrawer =
    (isOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setOpen(isOpen);
    };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={toggleDrawer(true)}>
        User Debug
      </Button>
      <Drawer anchor={"left"} open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {/* Students */}
            <ListSubheader>Students</ListSubheader>
            {students.map((student) => (
              <ListItem key={student} disablePadding>
                <ListItemButton onClick={studentNav(student)}>
                  <ListItemText primary={student} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider />
            {/* Smoketest Students */}
            <ListSubheader>Smoketest Students</ListSubheader>
            {smokeStudents.map((student) => (
              <ListItem key={student} disablePadding>
                <ListItemButton onClick={studentNav(student)}>
                  <ListItemText primary={student} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider />
            {/* Not Students */}
            <ListSubheader>Other</ListSubheader>
            {others.map((item) => (
              <ListItem key={item[0]} disablePadding>
                <ListItemButton onClick={item[1]}>
                  <ListItemText primary={item[0]} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </React.Fragment>
  );
};

export default UserDebug;
