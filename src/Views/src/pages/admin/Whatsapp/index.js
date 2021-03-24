import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import MenuAdmin from '../../../components/menu-admin';
import Copyright from '../../../components/footer';
import GridList from '@material-ui/core/GridList';
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import io from '../../../services/socket.io';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from "@material-ui/icons/Send";
import Divider from '@material-ui/core/Divider';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AudioPlayer from 'material-ui-audio-player';
import api from '../../../services/api'
import {getNomeUsuario, getProfileLinkUsuario} from '../../../services/auth'

import {
    Paper,
    Typography,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Avatar,
    List,
    ListItem,
    ListItemText,
    IconButton,
    CardMedia
} from "@material-ui/core";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    fila: {
        zIndex: 999,
        position: "relative"
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
        marginRight: 36,
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
        height: "calc(91.05vh - 100px)",
        width: `calc(110% - ${drawerWidth}px)`,
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
        background:
            "url(/wall.png) bottom",
        flex: 1
    },
    heightAdjust: {
        display: "flex",
        maxHeight: '79vh',
        flexDirection: "column"
    },
    paper: {
        background: "#9de1fe",
        padding: 20
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
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
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
        backgroundColor: "#DCF8C6"
    },
    sentImg: {
        width: "30%",
        marginTop: "5px",
        maxHeight: "500px",
        maxWidth: "500px",
        marginBottom: "5px",
        marginLeft: "70%",
        backgroundColor: "#DCF8C6"
    },
    received: {
        width: "30%",
        marginLeft: "0%",
        marginTop: "5px",
        marginBottom: "5px",
        backgroundColor: "#ffffff"
    },
    receivedImg: {
        width: "30%",
        maxHeight: "500px",
        marginTop: "5px",
        marginBottom: "5px",
        maxWidth: "500px",
        marginLeft: "0%",
        backgroundColor: "#ffffff"
    },
    sentVideo: {
        width: "30%",
        marginTop: "5px",
        maxHeight: "500px",
        maxWidth: "500px",
        marginBottom: "5px",
        marginLeft: "70%",
        backgroundColor: "#DCF8C6"
    }
}));

export default function WhatsApp() {
    const [text, setText] = useState('');
    const [contact, setContact] = useState({});
    const [worker, setWorker] = useState("");
    const [list, setList] = useState([]);

    useEffect(upgrade, [])

    async function upgrade() {
        const response = await api.get('/api/clients/attendance');
        if (response) {
            setList(response.data.Client);
            if (response.data.Client[0] !== undefined) {
                setContact(response.data.Client[0]);
            } else {
                setContact([{ profileUrl: "/unexpected.jpg" }])
            }
        } else {
            setList([]);
        }

    }

    io.on('newMessage', (e) => {
        console.log(e.data);
        upgrade();
    });

    function isValidLast(message) {
        try {
            if ((message.lastMessage.body != null) && (message.lastMessage.body != undefined)) {
                return ('' + message.lastMessage.body);
            } else {
                return ('');
            }
        } catch {
            return ('');
        }
    }

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function getLeftList() {
        return (list.map(item => (
            <>
                <ListItem button={true} onClick={(e) => { setContact(item) }}>
                    <Avatar src={item.profileUrl}></Avatar>
                    <ListItemText className={classes.list} primary={item.fullName} secondary={isValidLast(item)} />
                </ListItem>
                <Divider variant="inset" component="li" />
            </>
        )));
    }

    function getRightList() {
        return (
            <GridList cols={1} style={{ width: "100%", height: "100%" }} cellHeight={'auto'}>

                <CardContent>

                    <Card className={classes.received}>
                        <CardContent style={{ marginTop: "2%", marginLeft: "2%" }}>
                            <AudioPlayer
                                download={false}
                                autoplay={false}
                                volume={false}
                                width="100%"
                                variation="default"
                                spacing={3}
                                src={'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3'}
                            />
                        </CardContent>
                        <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                            {new Date().toLocaleString('pt-BR')}
                        </Typography>
                    </Card>

                    <Card className={classes.sentVideo}>
                        <CardContent style={{}}>
                            <video style={{ height: "100%", width: "100%" }} src="/p.mp4" controls="true"></video>
                        </CardContent>
                        <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                            {new Date().toLocaleString('pt-BR')}
                        </Typography>
                    </Card>

                    <Card className={classes.sentImg}>
                        <img style={{ height: "100%", width: "100%", }} src="/wall.png"></img>
                        <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                            {new Date().toLocaleString('pt-BR')}
                        </Typography>
                    </Card>

                    <Card className={classes.sent}>
                        <CardContent>
                            <Typography color="black" variant="body" display="inline">
                                Em linguística, a noção de texto é ampla e ainda aberta a uma definição mais precisa. Grosso modo, pode ser entendido como manifestação linguística das ideias de um autor, que serão interpretadas pelo leitor de acordo com seus conhecimentos linguísticos e culturais. Seu tamanho é variável.
                            </Typography>
                        </CardContent>
                        <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                            {new Date().toLocaleString('pt-BR')}
                        </Typography>
                    </Card>

                    <Card className={classes.received}>
                        <CardContent>
                            <Typography color="black" variant="body" display="inline">
                                Em linguística, a noção de texto é ampla e ainda aberta a uma definição mais precisa. Grosso modo, pode ser entendido como manifestação linguística das ideias de um autor, que serão interpretadas pelo leitor de acordo com seus conhecimentos linguísticos e culturais. Seu tamanho é variável.
                            </Typography>
                        </CardContent>
                        <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                            {new Date().toLocaleString('pt-BR')}
                        </Typography>
                    </Card>

                </CardContent>


            </GridList>
        );
    }

    function sendMessage(event) {

        event.preventDefault();
    }

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CssBaseline />

            <MenuAdmin name="WhatsApp" />

            <main className={classes.content}>

                <div className={classes.appBarSpacer} />

                <Container maxWidth="80vh" className={classes.container}>

                    <Grid>

                        <Grid container className={classes.fila}>

                            <Grid item xs={12}>

                                <Card className={classes.card}>

                                    <Grid container>
                                        <Grid item xs={3}>
                                            <CardHeader
                                                className={classes.rightBorder}
                                                avatar={
                                                    <Avatar aria-label="Recipe" className={classes.avatar} src={getProfileLinkUsuario()}></Avatar>
                                                }
                                                title={getNomeUsuario()}
                                            />

                                            <Paper className={classes.warnings} elevation={0}>
                                                <Typography className={classes.information} variant="subheader">
                                                    Aqui estão listados todos os clientes que solicitaram atendimento.
                                                </Typography>
                                            </Paper>
                                            <GridList style={{
                                                width: '100%',
                                                display: "flex",
                                                height: window.innerHeight,
                                                flexWrap: 'nowrap'
                                            }} cols={1} cellHeight={((window.innerHeight / 4.50) * list.length)}>
                                                <List className={classes.list}>
                                                    {getLeftList()}
                                                </List>
                                            </GridList>
                                        </Grid>


                                        <Grid className={classes.heightAdjust} item xs={9}>
                                            <CardHeader
                                                avatar={
                                                    <Avatar aria-label="Recipe" className={classes.avatar} src={contact.profileUrl}></Avatar>
                                                }
                                                action={
                                                    <IconButton onClick={async () => {
                                                        await api.put('/api/clients/' + contact._id);
                                                         upgrade();
                                                         upgrade();
                                                         upgrade();
                                                    }}>
                                                        <AssignmentTurnedInIcon />
                                                    </IconButton>
                                                }
                                                title={contact.fullName}
                                            />

                                            <CardContent className={[classes.rightContainer, classes.content]}>
                                                <Grid>
                                                    {getRightList()}
                                                </Grid>
                                            </CardContent>

                                            <form id='form' onSubmit={sendMessage}>
                                                <Grid container style={{ paddingLeft: "5px", marginTop: '1%' }}>

                                                    <Grid xs={1} align="center">

                                                        <input style={{ display: "none" }} id="icon-button-file" name='file' onInputCapture={e => { alert('Arquivo upado!') }} type="file" />

                                                        <label htmlFor="icon-button-file">
                                                            <Fab color="primary" aria-label="upload picture" component="span">
                                                                <AttachFileIcon />
                                                            </Fab>
                                                        </label>

                                                    </Grid>

                                                    <Grid item xs={10}>
                                                        <input style={{ display: "none" }} id="escriba" name='text' value={text} type="text" />
                                                        <label htmlFor="escriba">
                                                            <TextField
                                                                id="outlined-basic-email"
                                                                variant="outlined"
                                                                onChange={e => setText(e.target.value)}
                                                                label="Digite aqui..."
                                                                fullWidth
                                                            />
                                                        </label>

                                                    </Grid>

                                                    <Grid xs={1} align="center">
                                                        <input style={{ display: "none" }} id="envi" type="submit" />
                                                        <label htmlFor="envi">
                                                            <Fab color="primary" aria-label="upload picture" component="span">
                                                                <SendIcon />
                                                            </Fab>
                                                        </label>
                                                    </Grid>

                                                </Grid>
                                            </form>
                                        </Grid>

                                    </Grid>

                                </Card>

                            </Grid>

                        </Grid>

                    </Grid>

                    <Box pt={4}>
                        <Copyright />
                    </Box>

                </Container>

            </main>
        </div >
    );
}