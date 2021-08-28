import { useState } from 'react';
import { ethers } from 'ethers';

import * as constants from "../constants";
import { requestAccount } from '../utils';

import { TextField, Button } from '@material-ui/core';

// Importing this after TextField to get precedence
import { useStyles } from "../styles";

import Streaming from "../abis/Streaming.json";
import Token from "../abis/Token.json";

function CreateStream() {
    const classes = useStyles();

    const [recipient, setRecipient] = useState();
    const [deposit, setDeposit] = useState(0);
    const [tokenAddress, setTokenAddress] = useState();
    const [days, setDays] = useState(1);
    const [status, setStatus] = useState();

    function validateDepositInput() {
        let current = new Date();
        let startTime = new Date(current.getTime() + 86400000);
        let stopTime = new Date(startTime.getTime() + 86400000 * days);

        let startTimestamp = Math.floor(startTime.getTime() / 1000);
        let stopTimestamp = Math.floor(stopTime.getTime() / 1000);
        let duration = stopTimestamp - startTimestamp;

        let changedDeposit = deposit > 0 ? deposit : 1;
        let roundedDeposit = Math.ceil(changedDeposit / duration) * duration;

        if (Math.floor(roundedDeposit) !== Math.floor(deposit)) {
            if (window.confirm(`Can we change your deposit to ${roundedDeposit}? (Nearest multiple of duration)`)) {
                setDeposit(roundedDeposit);
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }

    }

    function validateTokenAddrInput() {
        return tokenAddress ? true : false;
    }

    function validateRecipientAddrInput() {
        return recipient ? true : false;
    }

    function validateDepositDaysInput() {
        return days >= 1 ? true : false;
    }

    async function createStream() {
        if (!validateDepositDaysInput()) {
            setStatus("Invalid number of days, must be greater that 0!");
            return;
        }
        else if (!validateDepositInput()) {
            setStatus("Invalid deposit input!");
            return;
        }
        else if (!validateRecipientAddrInput()) {
            setStatus("Invalid Recipient Address!");
            return;
        }
        else if (!validateTokenAddrInput()) {
            setStatus("Invalid Token Address!");
            return;
        }

        setStatus("Loading...");
        if (typeof window.ethereum != undefined) {
            await requestAccount();

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const streamingContract = new ethers.Contract(
                constants.CONTRACT_ADDR,
                Streaming.abi,
                signer
            );

            const tokenContract = new ethers.Contract(
                tokenAddress,
                Token.abi,
                signer
            );

            try {
                let current = new Date();
                let startTime = new Date(current.getTime() + 86400000);
                let stopTime = new Date(startTime.getTime() + 86400000 * days);

                let startTimestamp = Math.floor(startTime.getTime() / 1000);
                let stopTimestamp = Math.floor(stopTime.getTime() / 1000);

                let depositAmount = deposit * (stopTimestamp - startTimestamp);

                let allowanceTransaction = await tokenContract.approve(
                    constants.CONTRACT_ADDR,
                    depositAmount
                );

                await allowanceTransaction.wait();

                let streamingTransaction = await streamingContract.createStream(
                    recipient,
                    depositAmount,
                    tokenAddress,
                    startTimestamp,
                    stopTimestamp
                );

                let receipt = await streamingTransaction.wait();

                let streamId = receipt.events[2].args[0].toString();
                setStatus(`Stream ID: ${streamId}`);
            }
            catch (err) {
                console.log(err);
                setStatus("Stream creation failed");
            }
        }


    }

    return (
        <div>
            <center>
                <TextField
                    className={classes.formElement}
                    onChange={e => setRecipient(e.target.value)} label="Who is the recipient? (Ethereum address)" /><br />
                <TextField
                    className={classes.formElement}
                    onChange={e => setTokenAddress(e.target.value)} label="What token do you want to use? (Token address)" /><br />
                <TextField
                    className={classes.formElement}
                    onChange={e => setDays(e.target.value)} type="number" label="For how long should the money be streamed? (Days)" /><br />
                <TextField
                    className={classes.formElement}
                    onChange={e => setDeposit(e.target.value)} value={deposit} type="number" label="How much do you want to stream in total?" /><br /><br />

                <Button
                    className={classes.formElement}
                    variant="contained"
                    color="primary"
                    onClick={createStream}>
                    Submit
                </Button>
                <p>{status}</p>
            </center>
        </div>
    );

}

export { CreateStream };