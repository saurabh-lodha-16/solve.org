import { requestAccount } from "../utils";

import { TextField, Button } from "@material-ui/core";
import { useStyles } from "../styles";
import { useState } from "react";

import { ethers } from "ethers";
import VotingContract from "../abis/VotingContract.json";
import Box from "@material-ui/core/Box";

const constants = require("../abis/contract-address.json");

function SubmitYourIdea() {
  const classes = useStyles();
  const [ideaTitle, setIdeaTitle] = useState();
  const [ideaDesc, setIdeaDesc] = useState();
  const [ideaSol, setIdeaSol] = useState();
  const [reqEth, setReqEth] = useState();
  const [status, setStatus] = useState();

  function validateIdeaTitleInput() {
    return ideaTitle ? true : false;
  }

  function validateIdeaDescInput() {
    return ideaDesc ? true : false;
  }

  function validateIdeaSolInput() {
    return ideaSol ? true : false;
  }

  function validateReqEthInput() {
    return reqEth >= 0.01 ? true : false;
  }

  async function submitIdea() {
    if (!validateIdeaTitleInput()) {
      setStatus("Please enter an Idea Title");
      return;
    } else if (!validateIdeaDescInput()) {
      setStatus("Please enter an Idea description");
      return;
    } else if (!validateIdeaSolInput()) {
      setStatus("Please enter an Idea solution");
      return;
    } else if (!validateReqEthInput()) {
      setStatus("Invalid Ether Amount!");
      return;
    }
    setStatus("Loading...");

    if (typeof window.ethereum != undefined) {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const votingContract = new ethers.Contract(
        constants.VotingContract,
        VotingContract.abi,
        signer
      );

      const accountAddress = await signer.getAddress();

      console.log(accountAddress, ideaTitle, ideaDesc, ideaSol, reqEth);

      try {
        let submitIdeaTransaction = await votingContract.submitIdea(
          accountAddress,
          ideaTitle,
          ideaDesc,
          ideaSol,
          reqEth
        );

        let receipt = await submitIdeaTransaction.wait();
        console.log(receipt);

        //let ideaId = receipt.events[2].args[0].toString();

        setStatus(`Idea Submitted successfully`);
      } catch (err) {
        console.log(err);
        setStatus("Failed to submit idea");
      }
    }
  }

  return (
    <div>
     
      <center>
      
      <Box  width="65%" margin="3%">
       
    
        <TextField
          className={classes.formElement}
          onChange={(e) => setIdeaTitle(e.target.value)}
          label="Idea Title"
          color="secondary"
          p={2}
        />
       
        <br />
        <TextField
          className={classes.formElement}
          onChange={(e) => setIdeaDesc(e.target.value)}
          label="Idea Description"
          color="secondary"
        />
       
        <br />
        <TextField
          className={classes.formElement}
          onChange={(e) => setIdeaSol(e.target.value)}
          label="Idea Solution"
          color="secondary"
        />
        
        <br />
        <TextField
          className={classes.formElement}
          onChange={(e) => setReqEth(e.target.value)}
          label="Ether Required"
          color="secondary"
        />
      
        <br />
        <br/>
        <Button
          onClick={submitIdea}
          className={classes.root}
          variant="contained"
          color="secondary"
          
        >
          Submit Your Idea
        </Button>
       
        <p>{status}</p>
      
        </Box>
      </center>
     
    </div>
  );
}

export { SubmitYourIdea };
