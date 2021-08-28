//stopstream
import { requestAccount } from "../utils";

import { TextField, Button } from '@material-ui/core';
import { useStyles } from "../styles";
import { useState } from "react";

import { ethers } from 'ethers';
import * as constants from "../constants";
import Streaming from "../abis/Streaming.json";

function SubmitYourIdea() {
    const classes = useStyles();
    const [streamId, setStreamId] = useState();
    const [status, setStatus] = useState();

    async function stopStream() {
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
                let streamingTransaction = await streamingContract.cancelStream(
                    streamId
                );

                let receipt = await streamingTransaction.wait();
                console.log(receipt);

                setStatus(`Stream stopped successfully`);
            }
            catch (err) {
                console.log(err);
                setStatus("Failed to stop stream");
            }
        }
    }

    return (
        <div>
            <center>
                <TextField
                    className={classes.formElement}
                   // onChange={e => setStreamId(e.target.value)}
                    type="text"
                    label="Idea Title" /><br /><br />
                    <TextField
                    className={classes.formElement}
                   // onChange={e => setStreamId(e.target.value)}
                    type="text"
                    label="Idea Description" /><br /><br />
                    <TextField
                    className={classes.formElement}
                   // onChange={e => setStreamId(e.target.value)}
                    type="text"
                    label="Idea Solution" /><br /><br />
                    <TextField
                    className={classes.formElement}
                  //  onChange={e => setStreamId(e.target.value)}
                    type="number"
                    label="Ether Required" /><br /><br />

                <Button
                onClick={stopStream}
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