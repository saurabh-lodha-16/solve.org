import { GetIdeas } from "./views/GetIdeas";
import { SubmitYourIdea } from "./views/SubmitYourIdea";
import { GetVotingTokens } from "./views/GetVotingTokens";

import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import AppBar from "@material-ui/core/AppBar";
import { useState } from "react";

import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));
function App() {
  const classes = useStyles();

  const [tabValue, setTabValue] = useState(0);

  function a11yProps(index) {
    return {
      id: `tab-${index}`,
      "aria-controls": `tabpanel-${index}`,
    };
  }

  function handleTabChange(event, newValue) {
    setTabValue(newValue);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Typography variant="h4" className={classes.title} color="error">
            solve.org
          </Typography>
          <Button color="secondary" size="large" variant="outlined">
            White-Paper
          </Button>
        </Toolbar>
        <Tabs
          centered
          value={tabValue}
          onChange={handleTabChange}
          aria-label="Solve.Org"
        >
          <Tab label="Home" {...a11yProps(0)} />
          <Tab label="Submit Idea" {...a11yProps(1)} />
          <Tab label="Get Tokens" {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      {tabValue === 0 && <GetIdeas />}
      {tabValue === 1 && <SubmitYourIdea />}
      {tabValue === 2 && <GetVotingTokens />}
    </div>
  );
}

export default App;
