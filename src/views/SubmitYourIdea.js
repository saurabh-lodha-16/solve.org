import { requestAccount } from "../utils";

import { TextField, Button } from '@material-ui/core';
import { useStyles } from "../styles";
import { useState } from "react";

import { ethers } from 'ethers';
import * as constants from "../constants";
import VotingContract from "../abis/VotingContract.json";

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
        }
        else if (!validateIdeaDescInput()) {
            setStatus("Please enter an Idea description");
            return;
        }
        else if (!validateIdeaSolInput()) {
            setStatus("Please enter an Idea solution");
            return;
        }
        else if (!validateReqEthInput()) {
            setStatus("Invalid Ether Amount!");
            return;
        }
        setStatus("Loading...");

        if (typeof window.ethereum != undefined) {
            await requestAccount();

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const votingContract = new ethers.Contract(
                constants.CONTRACT_ADDR,
                VotingContract.abi,
                signer
            );

            try {

                let userAddress = "dummy";

                let submitIdeaTransaction = await votingContract.submitIdea(
                    userAddress,
                    ideaTitle,
                    ideaDesc,
                    ideaSol,
                    reqEth,
                );

                let receipt = await submitIdeaTransaction.wait();
                console.log(receipt);

                let ideaId = receipt.events[2].args[0].toString();

                setStatus(`Idea Submitted successfully`);
            }
            catch (err) {
                console.log(err);
                setStatus("Failed to submit idea");
            }
        }
    }

    return (
        <div>
            <center>
            <TextField
                    className={classes.formElement}
                    onChange={e => setIdeaTitle(e.target.value)} label="Idea Title" /><br />
            <TextField
                    className={classes.formElement}
                    onChange={e => setIdeaDesc(e.target.value)} label="Idea Description" /><br />
            <TextField
                    className={classes.formElement}
                    onChange={e => setIdeaSol(e.target.value)} label="Idea Solution" /><br />
            <TextField
                    className={classes.formElement}
                    onChange={e => setReqEth(e.target.value)} label="Ether Required" /><br />
                <Button
                onClick={submitIdea}
                className={classes.formElement}
                variant="contained"
                color="primary"
                >Submit Your Idea</Button>
                <p>{status}</p>
            </center>
        </div>
    )
}

export { SubmitYourIdea };