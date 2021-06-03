import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { getPreferenceColor } from '../../../services/auth'

let colorSent = getPreferenceColor() == 'dark' ? '#006161' : '#DCF8C6'
let colorReceive = getPreferenceColor() == 'dark' ? '#3c3c3e' : '#FFFFFF';
let wall = getPreferenceColor() == 'dark' ? 'wall-dark' : 'wall-light';
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        overflow: 'none',
        width: '100%',
        maxHeight: "100vh"
    },
    fila: {
        zIndex: 999,
        position: "relative" //relative
    },
    drawerPaper: {
        width: 300
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        alignItems: 'left',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 0,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    card: {
        display: "flex",
        marginTop: '3px',
        height: "calc(91.05vh - 100px)",
        width: `98%`,
    },
    rightBorder: {
        borderRight: "solid #d0D0D0 1px"
    },
    content: {
        marginTop: 0
    },
    background: {
        position: "absolute",
        height: 200,
        width: "100%",
        top: 0,
        background: "#7159C1"
    },
    rightContainer: {
        backgroundImage: `url(/${wall}.png)`,
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        flex: 1
    },
    heightAdjust: {
        display: "flex",
        maxHeight: '98%',
        flexDirection: "column"
    },
    paper: {
        background: "#9de1fe",
    },
    information: {
        color: "#444"
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    list: {
        width: '100%',
        paddingLeft: 15
    },
    content: {
        flexGrow: 1,
        marginTop: "2%",
        width: "100%",
        height: 'auto',
        display: "flex",
        flexDirection: 'column-reverse',
        overflow: 'auto',
    },
    container: {
        paddingTop: '5vh',
        paddingBottom: '6vh',
        maxHeight: "100%",
        maxWidth: '100%'
    },
    paper: {
        padding: '0',
    },
    warnings: {
        background: "#9de1fe",
        padding: 20
    },
    fixedHeight: {
        height: 240,
    },
    sent: {
        width: "30%",
        marginTop: "5px",
        marginBottom: "5px",
        marginLeft: "70%",
        backgroundColor: colorSent
    },
    sentImg: {
        width: "30%",
        marginTop: "5px",
        maxHeight: "500px",
        maxWidth: "500px",
        marginBottom: "5px",
        marginLeft: "70%",
        backgroundColor: colorSent
    },
    received: {
        width: "30%",
        marginLeft: "0%",
        marginTop: "5px",
        marginBottom: "5px",
        backgroundColor: colorReceive
    },
    receivedImg: {
        width: "30%",
        maxHeight: "500px",
        marginTop: "5px",
        marginBottom: "5px",
        maxWidth: "500px",
        marginLeft: "0%",
        backgroundColor: colorReceive
    },
    sentVideo: {
        width: "30%",
        marginTop: "5px",
        maxWidth: "500px",
        marginBottom: "5px",
        marginLeft: "70%",
        backgroundColor: colorSent
    },
    receivedVideo: {
        width: "30%",
        height: "100%",
        width: "100%",
        maxWidth: "500px",
        marginTop: "5px",
        marginBottom: "5px",
        marginLeft: "0%",
        backgroundColor: colorReceive
    },
    receivedSticker: {
        width: "30%",
        maxHeight: "150px",
        marginTop: "5px",
        marginBottom: "5px",
        maxWidth: "150px",
        marginLeft: "0%",
        backgroundColor: colorReceive
    },
    sentSticker: {
        width: "30%",
        maxHeight: "150px",
        marginTop: "5px",
        marginBottom: "5px",
        maxWidth: "150px",
        marginLeft: "70%",
        backgroundColor: colorReceive
    }
}));

export default useStyles;