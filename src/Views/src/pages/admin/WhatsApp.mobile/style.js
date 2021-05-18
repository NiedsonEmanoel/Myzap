import { makeStyles } from '@material-ui/core/styles';
import {getPreferenceColor} from '../../../services/auth'

let colorSent = getPreferenceColor() == 'dark' ? '#006161':'#DCF8C6'
let colorReceive = getPreferenceColor() == 'dark' ? '#3c3c3e':'#FFFFFF';

const useStyles = makeStyles((theme) => ({
sent: {
    width: "48%",
    marginTop: "5px",
    marginBottom: "5px",
    marginLeft: "50%",
    backgroundColor: colorSent
},

sentAudio: {
    width: "98%",
    marginTop: "5px",
    marginBottom: "5px",
    marginLeft: "2%",
    backgroundColor: colorSent
},

receivedAudio: {
    width: "98%",
    marginLeft: "0%",
    marginTop: "5px",
    marginBottom: "5px",
    backgroundColor: colorReceive
},

sentImg: {
    width: "48%",
    marginTop: "5px",
    maxHeight: "50px",
    maxWidth: "150px",
    marginBottom: "5px",
    marginLeft: "50%",
    backgroundColor: colorSent
},

received: {
    width: "48%",
    marginLeft: "0%",
    marginTop: "5px",
    marginBottom: "5px",
    backgroundColor: colorReceive
},

receivedImg: {
    width: "48%",
    maxHeight: "50px",
    marginTop: "5px",
    marginBottom: "5px",
    maxWidth: "150px",
    marginLeft: "0%",
    backgroundColor: colorReceive
},

sentVideo: {
    width: "48%",
    marginTop: "5px",
    maxWidth: "150px",
    marginBottom: "5px",
    maxHeight: '50px',
    marginLeft: "50%",
    backgroundColor: colorSent
},

receivedVideo: {
    width: "48%",
    maxHeight: '50px',
    height: "100%",
    width: "100%",
    maxWidth: "150px",
    marginTop: "5px",
    marginBottom: "5px",
    marginLeft: "0%",
    backgroundColor: colorReceive
},

receivedSticker: {
    width: "48%",
    maxHeight: '50px',
    marginTop: "5px",
    marginBottom: "5px",
    maxWidth: "150px",
    marginLeft: "0%",
    backgroundColor: colorReceive
},

sentSticker: {
    width: "48%",
    maxHeight: '50px',
    marginTop: "5px",
    marginBottom: "5px",
    maxWidth: "150px",
    marginLeft: "50%",
    backgroundColor: colorReceive
}

}));

export default useStyles;