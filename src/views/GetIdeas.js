import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { requestAccount } from "../utils";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import { useStyles } from "../styles";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import CircularProgressWithLabel from "../styles/circularWithLabel";
import VotingContract from "../abis/VotingContract.json";
import SolveToken from "../abis/SolveToken.json";
import { toast } from "react-toastify";

const constants = require("../abis/contract-address.json");

function GetIdeas() {
  const classes = useStyles();

  const [ideas, setIdeas] = useState(() => new Map());
  const [balance, setBalance] = useState();
  const [totalIdeas, setTotalIdeas] = useState(0);
  const [loading, setIsLoading] = useState(true);
  const [approval, setApproval] = useState(false);

  const showIdeaCards = () => {
    if (ideas.size > 0 && totalIdeas > 0) {
      return Array.from(Array(totalIdeas).keys()).map((index) => {
        let idea = ideas.get(index + 1);
        
        return (
          
          <Card key={idea} className={classes.root} variant="outlined">
           
            <CardContent>
             
              <Typography color="secondary" variant="h5" component="h2" >
               
                {idea.title}
              </Typography>
              <Typography className={classes.pos}>
                {idea.description}
              </Typography>
              <Typography color="secondary" variant="h5" component="h2">
                Solution
              </Typography>
              <Typography className={classes.pos}>{idea.solution}</Typography>
             
            </CardContent>
            <div className={classes.infoBar}>
              {idea.isFunded ? (
                idea.hasClaimed ? (
                  <IconButton color="secondary" aria-label="claim">
                    Donations Claimed &nbsp; <MonetizationOnIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => claimFunds(index + 1)}
                    color="secondary"
                    aria-label="claim"
                  >
                    Claim &nbsp; <MonetizationOnIcon />
                  </IconButton>
                )
              ) : (
                <IconButton
                  color="secondary"
                  disabled={Boolean(!approval)}
                  aria-label="vote"
                  onClick={() => voteForIdea(index + 1)}
                >
                  &nbsp; <ArrowUpwardIcon /> &nbsp; {Number(idea.totalVotes)}
                </IconButton>
              )}
              <IconButton aria-label="voteStatus">
                <CircularProgressWithLabel
                  thickness={5}
                  variant="determinate"
                  color="secondary"
                  value={
                    Number(idea.totalVotes) /
                    Number(idea.requiredDonationInEthers)
                  }
                />
              </IconButton>
              <IconButton color="secondary" aria-label="vote">
                
                Target: {Number(idea.requiredDonationInEthers) * 100} SOLVE&nbsp; <MonetizationOnIcon /> &nbsp;{" "}
              </IconButton>
              {!approval ? (
                <IconButton
                  onClick={() => approve()}
                  color="secondary"
                  aria-label="approval"
                >
                  &nbsp; <ThumbUpIcon /> &nbsp; Approve
                </IconButton>
              ) : (
                <IconButton />
              )}
            </div>
           
          </Card>
         
        );
      });
    }
  };

  async function getIdeas() {
    const provider = new ethers.providers.JsonRpcProvider(
      `https://eth-rinkeby.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`
    );
    const getIdeasContract = new ethers.Contract(
      constants.VotingContract,
      VotingContract.abi,
      provider
    );

    try {
      let totalIdeas = Number(await getIdeasContract.getTotalIdeas());
      setTotalIdeas(totalIdeas);
      for (let i = 1; i <= totalIdeas; i++) {
        const ideaFromContract = await getIdeasContract.ideas(i);
        setIdeas(ideas.set(i, ideaFromContract));
      }
      if (ideas.size > 0 && totalIdeas > 0) {
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const getIdeasAsyncFunction = async () => {
      await getIdeas();
      await checkAllowance();
    };
    getIdeasAsyncFunction();
  }, [ideas]);

  return (
    <Container fixed>
      {!loading ? (
        
        <Grid container style={{marginTop:'10%'}}>{showIdeaCards()} </Grid>
      ) : (
        <Grid container style={{position: 'relative'}}  >
          <CircularProgress
            size={100}
            className={classes.loader}
            color="secondary"
            style={{marginLeft: '48%', marginTop:'25%'}}
            
          />
        </Grid>
      )}
    </Container>
  );

  async function getBalance(address) {
    const provider = new ethers.providers.JsonRpcProvider(
      `https://eth-rinkeby.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`
    );
    const solveTokenContract = new ethers.Contract(
      constants.SolveToken,
      SolveToken.abi,
      provider
    );
    try {
      const balance = Number(await solveTokenContract.balanceOf(address));
      setBalance(balance);
    } catch (err) {
      console.log(err);
    }
  }

  async function approve() {
    if (typeof window.ethereum != undefined) {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const solveTokenContract = new ethers.Contract(
        constants.SolveToken,
        SolveToken.abi,
        signer
      );

      try {
        let approveTransaction = await solveTokenContract.approve(
          constants.VotingContract,
          BigNumber.from(String(1e18))
        );
        await approveTransaction.wait();
        await checkAllowance();
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function checkAllowance() {
    if (typeof window.ethereum != undefined) {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const solveTokenContract = new ethers.Contract(
        constants.SolveToken,
        SolveToken.abi,
        signer
      );

      try {
        const allowance = Number(
          await solveTokenContract.allowance(
            signer.getAddress(),
            constants.VotingContract
          )
        );
        if (Number(allowance) >= 1e18) {
          setApproval(true);
        } else {
          setApproval(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function voteForIdea(ideaId) {
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
        const submitVoteTransaction = await votingContract.voteForIdea(ideaId);
        await submitVoteTransaction.wait();
        const ideaFromContract = await votingContract.ideas(ideaId);
        ideas.set(ideaId, ideaFromContract);
        await checkAllowance();
        setIdeas(ideas);
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function claimFunds(ideaId) {
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
        const submitClaimTransaction = await votingContract.claimFunds(ideaId);
        await submitClaimTransaction.wait();
        const ideaFromContract = await votingContract.ideas(ideaId);
        setIdeas(ideas.set(ideaId, ideaFromContract));
      } catch (err) {
        console.log(err);
      }
    }
  }
}

export { GetIdeas };
