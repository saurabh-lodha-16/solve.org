//stopstream
import { requestAccount } from "../utils";

import { TextField, Button } from "@material-ui/core";
import { useStyles } from "../styles";
import { useState } from "react";

import { BigNumber, ethers } from "ethers";
import Box from "@material-ui/core/Box";
import SolveToken from "../abis/SolveToken.json";
const constants = require("../abis/contract-address.json");

function validateToken(tokenValue) {
  return tokenValue >= 0 ? true : false;
}

function GetVotingTokens() {
  const classes = useStyles();
  const [reqEth, setReqEth] = useState();
  const [solveTokens, setSolveTokens] = useState();
  const [status, setStatus] = useState();

  function validateReqEthInput() {
    return reqEth >= 0.01 ? true : false;
  }

  async function getVotingTokens() {
    if (!validateReqEthInput()) {
      setStatus("Amount of ETH should be greater than 0.01ETH");
      return;
    }

    setStatus("Loading...");

    if (typeof window.ethereum != undefined) {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(
        constants.SolveToken,
        SolveToken.abi,
        signer
      );

      try {
        let getVoitingToken = await tokenContract.mint({
          value: BigNumber.from(String(1e18 * reqEth)),
        });

        let receipt = await getVoitingToken.wait();
        console.log(receipt);
        
        setStatus(`Token purchased successfully`);
        
        
      } catch (err) {
        console.log(err);
        setStatus("Failed to purchase tokens");
      }
    }
  }

  return (
    <div>
      <center>
        <Box marginTop="10%" width="65%"> 
        <br/><br/><br/>
          <TextField
            className={classes.formElement}
            onChange={(e) => {
              if (validateToken(e.target.value)) {
                setReqEth(e.target.value);
                setSolveTokens(e.target.value * 100);
              } else {
                setSolveTokens(0);
                e.target.value = null;
              }
            }}
            //add validation to avoid negative numbers
            type="number"
            label="Ether"
            color="secondary"
          />
          <br />
          <br />

          <br />
          <Button
            onClick={getVotingTokens}
            className={classes.root}
            variant="contained"
            color="secondary"
          >
            Get {solveTokens} SOLVE Tokens
          </Button>
          <p className={classes.statusMessage}>{status}</p>
        </Box>
      </center>
    </div>
  );
}

export { GetVotingTokens };
