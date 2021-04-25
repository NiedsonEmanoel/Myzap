import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
sent: {
    width: "48%",
    marginTop: "5px",
    marginBottom: "5px",
    marginLeft: "50%",
    backgroundColor: "#DCF8C6"
},
sentAudio: {
    width: "98%",
    marginTop: "5px",
    marginBottom: "5px",
    marginLeft: "2%",
    backgroundColor: "#DCF8C6"
},
receivedAudio: {
    width: "98%",
    marginLeft: "0%",
    marginTop: "5px",
    marginBottom: "5px",
    backgroundColor: "#ffffff"
},
sentImg: {
    width: "48%",
    marginTop: "5px",
    maxHeight: "500px",
    maxWidth: "500px",
    marginBottom: "5px",
    marginLeft: "50%",
    backgroundColor: "#DCF8C6"
},
received: {
    width: "48%",
    marginLeft: "0%",
    marginTop: "5px",
    marginBottom: "5px",
    backgroundColor: "#ffffff"
},
receivedImg: {
    width: "48%",
    maxHeight: "500px",
    marginTop: "5px",
    marginBottom: "5px",
    maxWidth: "500px",
    marginLeft: "0%",
    backgroundColor: "#ffffff"
},
sentVideo: {
    width: "48%",
    marginTop: "5px",
    maxWidth: "500px",
    marginBottom: "5px",
    marginLeft: "50%",
    backgroundColor: "#DCF8C6"
},
receivedVideo: {
    width: "48%",
    height: "100%",
    width: "100%",
    maxWidth: "500px",
    marginTop: "5px",
    marginBottom: "5px",
    marginLeft: "0%",
    backgroundColor: "#ffffff"
},
receivedSticker: {
    width: "48%",
    maxHeight: "150px",
    marginTop: "5px",
    marginBottom: "5px",
    maxWidth: "150px",
    marginLeft: "0%",
    backgroundColor: "#ffffff"
},
sentSticker: {
    width: "48%",
    maxHeight: "150px",
    marginTop: "5px",
    marginBottom: "5px",
    maxWidth: "150px",
    marginLeft: "50%",
    backgroundColor: "#ffffff"
}
}));

export default useStyles;