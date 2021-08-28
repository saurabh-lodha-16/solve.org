import { CreateStream } from "./views/CreateStream";
import { SubmitYourIdea } from "./views/SubmitYourIdea";
import { WithdrawFromStream } from "./views/WithdrawFromStream";
import { GetVotingTokens } from "./views/GetVotingTokens";

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import AppBar from '@material-ui/core/AppBar';
import { useState } from "react";


function App() {

  const [tabValue, setTabValue] = useState(0);

  function a11yProps(index) {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
  }

  function handleTabChange(event, newValue) {
    setTabValue(newValue);
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="Solve.Org">
        <Tab label="Home" {...a11yProps(0)} />
          <Tab label="Funded Ideas" {...a11yProps(1)} />
          <Tab label="Submit Your Idea" {...a11yProps(2)} />
          <Tab label="Get Voting Tokens" {...a11yProps(3)} />
        </Tabs>
      </AppBar>

      {tabValue === 0 && (<CreateStream />)}
      {tabValue === 1 && (<WithdrawFromStream />)}
      {tabValue === 2 && (<SubmitYourIdea/>)}
      {tabValue === 3 && (<GetVotingTokens />)}

    </div>
  );
  
}

export default App;
