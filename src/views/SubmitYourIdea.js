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
    return reqEth >= 1 ? true : false;
  }

  async function submitIdea() {
    if (!validateIdeaTitleInput()) {
      setStatus("Please enter a Title");
      return;
    } else if (!validateIdeaDescInput()) {
      setStatus("Please enter a description");
      return;
    } else if (!validateIdeaSolInput()) {
      setStatus("Please enter a solution");
      return;
    } else if (!validateReqEthInput()) {
      setStatus("Minimum Ether Required is 1");
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

       

        setStatus(`Idea Submitted Successfully`);
      } catch (err) {
        console.log(err);
        setStatus("Failed to Submit Idea");
      }
    }
  }

  return (
    <div>
     
      <center>
      
      <Box  width="65%" margin="10%">
       
    
        <TextField
          className={classes.formElement}
          onChange={(e) => setIdeaTitle(e.target.value)}
          label="Title"
          color="secondary"
          p={2}
        />
       
        <br />
        <TextField
          className={classes.formElement}
          onChange={(e) => setIdeaDesc(e.target.value)}
          label="Description"
          color="secondary"
        />
       
        <br />
        <TextField
          className={classes.formElement}
          onChange={(e) => setIdeaSol(e.target.value)}
          label="Solution"
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
          Submit
        </Button>
       
        <p>{status}</p>
      
        </Box>
      </center>
     
    </div>
  );
}

export { SubmitYourIdea };
