import { useState } from "react";
import { ethers } from "ethers";

import { requestAccount } from "../utils";

import { TextField, Button } from "@material-ui/core";

// Importing this after TextField to get precedence
import { useStyles } from "../styles";

import Streaming from "../abis/Streaming.json";
import Token from "../abis/Token.json";

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
        let ideasMappingTransaction = await getIdeasContract.ideas(1);
        console.log(ideasMappingTransaction);
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
