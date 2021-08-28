import { requestAccount } from "../utils";

import { TextField, Button } from '@material-ui/core';
import { useStyles } from "../styles";
import { useState } from "react";

import { ethers } from 'ethers';
import * as constants from "../constants";
import Streaming from "../abis/Streaming.json";


function WithdrawFromStream() {
    const classes = useStyles();
    const [streamId, setStreamId] = useState();
    const [amount, setAmount] = useState();
    const [status, setStatus] = useState();

    async function withdrawFromStream() {
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

            try {
                let streamingTransaction = await streamingContract.withdrawFromStream(
                    streamId,
                    amount
                );

                let receipt = await streamingTransaction.wait();
                console.log(receipt);

                setStatus(`Withdrawl completed successfully`);
            }
            catch (err) {
                console.log(err);
                setStatus("Failed to process withdrawl");
            }
        }
    }

    return (
        <div>
            <center>
                <TextField
                    className={classes.formElement}
                    onChange={e => setStreamId(e.target.value)}
                    type="number"
                    label="Which stream do you want to withdraw from?" /><br />

                <TextField
                    className={classes.formElement}
                    onChange={e => setAmount(e.target.value)}
                    type="number"
                    label="What amount do you want to withdraw?" /><br /><br />

                <Button
                    onClick={withdrawFromStream}
                    className={classes.formElement}
                    variant="contained"
                    color="primary"
                >Submit</Button>
                <p>{status}</p>
            </center>
        </div>
    );
}

export { WithdrawFromStream };