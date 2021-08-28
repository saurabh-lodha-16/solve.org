import { useState } from "react";
import { ethers } from "ethers";

import { requestAccount } from "../utils";
import { Button } from "@material-ui/core";
import { useStyles } from "../styles";
import VotingContract from "../abis/VotingContract.json";
const constants = require("../abis/contract-address.json");

function GetIdeas() {
  const classes = useStyles();

  const [ideas, setIdeas] = useState(() => new Map());
  const [status, setStatus] = useState();
  const [ideaId, setIdeaId] = useState();

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
        
        for (var i = 1; i <= totalIdeas; i++) {
            let ideaFromContract = await getIdeasContract.ideas(i);
            setIdeas(ideas.set(i, ideaFromContract));
        } 
               
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

  async function toVote() {
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
  
      try {
        let submitVoteTransaction = await votingContract.voteForIdea(
          ideaId
        );
  
        let receipt = await submitVoteTransaction.wait();
        console.log(receipt);
  
        //let ideaId = receipt.events[2].args[0].toString();
  
        setStatus(`Idea Voted successfully`);
      } catch (err) {
        console.log(err);
        setStatus("Failed to vote for idea");
      }
    }
  }
  
  
  
  async function claimingFunds() {
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
  
      try {
        let submitClaimTransaction = await votingContract.claimFunds(
          ideaId
        );
  
        let receipt = await submitClaimTransaction.wait();
        console.log(receipt);
  
        //let ideaId = receipt.events[2].args[0].toString();
  
        setStatus(`Idea funds claimed successfully`);
      } catch (err) {
        console.log(err);
        setStatus("Failed to claim funds for idea");
      }
    }
  }
}



export { GetIdeas };



