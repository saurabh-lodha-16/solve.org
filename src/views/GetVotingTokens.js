//stopstream
import { requestAccount } from "../utils";

import { TextField, Button } from '@material-ui/core';
import { useStyles } from "../styles";
import { useState } from "react";

import { ethers } from 'ethers';
import * as constants from "../constants";
import Token from "../abis/Token.json";

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
                constants.CONTRACT_ADDR,
                Token.abi,
                signer
            );

            try {
                let getVoitingToken = await tokenContract.mint();

                let receipt = await getVoitingToken.wait();
                console.log(receipt);

                setStatus(`token purchase stopped successfully`);
            }
            catch (err) {
                console.log(err);
                setStatus("Failed to purchase token");
            }
        }
    }

    return (
        <div>
            <center>
            <TextField
                    className={classes.formElement}
                    onChange={e => setReqEth(e.target.value)} type="number" label="Amount of Ether" /><br />
            <TextField
                    className={classes.formElement}
                    onChange={e => setSolveTokens(e.target.value)} label="Number of SOLVE Tokens" /><br />
                <Button
                onClick={getVotingTokens}
                className={classes.formElement}
                variant="contained"
                color="primary"
                >Get SOLVE tokens</Button>
                <p>{status}</p>
            </center>
        </div>
    )
}

export { GetVotingTokens };