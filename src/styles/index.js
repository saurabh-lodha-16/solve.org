import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  formElement: {
    width: "700px",
    margin: "15px",
  },
  root: {
    flexGrow: 1,
    marginTop: 20,
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
});

export { useStyles };
