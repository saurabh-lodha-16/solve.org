import { useState } from "react";
import { ethers } from "ethers";

import { requestAccount } from "../utils";

import { TextField, Button } from "@material-ui/core";

// Importing this after TextField to get precedence
import { useStyles } from "../styles";

import VotingContract from "../abis/VotingContract.json";

const constants = require("../abis/contract-address.json");
function GetIdeas() {
  const classes = useStyles();

  const [ideas, setIdeas] = useState();
  const [status, setStatus] = useState();

  async function getIdeas() {
    setStatus("Loading...");
    if (typeof window.ethereum != undefined) {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const getIdeasContract = new ethers.Contract(
        constants.VotingContract,
        VotingContract.abi,
        signer
      );

      try {

        let totalIdeas = Number(await getIdeasContract.getTotalIdeas());
         let allIdeas = [];
        for (var i = 1; i <= totalIdeas; i++) {
            let ideasMappingTransaction = await getIdeasContract.ideas(i);
            allIdeas.push(ideasMappingTransaction);
            
        } 
        console.log(allIdeas);
        setIdeas(allIdeas);
        console.log(ideas);
        
      } catch (err) {
        console.log(err);
        setStatus("idea fetching failed");
      }
    }
  }

  return (
    <div>
      <center>
        <Button
          className={classes.formElement}
          variant="contained"
          color="primary"
          onClick={getIdeas}
        >
          connect to metamask
        </Button>
        <p>{status}</p>
      </center>
    </div>
  );
}

export { GetIdeas };
