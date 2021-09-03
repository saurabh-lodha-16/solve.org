import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  formElement: {
    width: "70%",
    margin: "15px",
  },
  root: {
    flexGrow: 1,
    marginTop: 20,
    
  },
  statusMessage:{
    color: "rgb(190,52,41)",
    font: " 16px Georgia, serif",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginTop: 10,
    marginBottom: 14,
    outline: true,
    fontSize: 20,
  },
  infoBar: {
    marginLeft: 10,
    marginBottom: 10,
  },
  loader: {
    margin: 50,
    display: "flex",
  },
 
});

export { useStyles };
