import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import MenuAdmin from '../../../components/menu-admin';
import Copyright from '../../../components/footer';
import GridList from '@material-ui/core/GridList';
import Button from '@material-ui/core/Button';
import Forme from '../../../components/form'
import Fab from "@material-ui/core/Fab";
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import io from '../../../services/socket.io';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Divider from '@material-ui/core/Divider';
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AudioPlayer from 'material-ui-audio-player';
import api from '../../../services/api'
import { getNomeUsuario, getProfileLinkUsuario } from '../../../services/auth'

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
    content: {
        flexGrow: 1,
        marginTop: "2%",
        height: 'auto',
        display: "flex",
        flexDirection: 'column-reverse',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(6),
        maxHeight: "100%"
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
        maxWidth: "500px",
        marginBottom: "5px",
        marginLeft: "70%",
        backgroundColor: "#DCF8C6"
    },
    receivedVideo: {
        width: "30%",
        height: "100%",
        width: "100%",
        maxWidth: "500px",
        marginTop: "5px",
        marginBottom: "5px",
        marginLeft: "0%",
        backgroundColor: "#ffffff"
    },
    receivedSticker: {
        width: "30%",
        maxHeight: "150px",
        marginTop: "5px",
        marginBottom: "5px",
        maxWidth: "150px",
        marginLeft: "0%",
        backgroundColor: "#ffffff"
    },
    sentSticker: {
        width: "30%",
        maxHeight: "150px",
        marginTop: "5px",
        marginBottom: "5px",
        maxWidth: "150px",
        marginLeft: "70%",
        backgroundColor: "#ffffff"
    }
}));


export default function WhatsApp() {
    const [contact, setContact] = useState({});
    const [worker, setWorker] = useState("");
    const [list, setList] = useState([]);
    const [messagesList, setMessagesList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        if (contact.chatId)
            setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    useEffect(() => {
        upgrade()
    }, []);

    useEffect(() => {

        io.on('newMessage', (e) => {
            if (e.from == contact.chatId) {
                getMessages();
            }
            return uptodate();
        });

        io.on('newFile', (e) => {
            if (e.from == contact.chatId) {
                getMessages();
                setOpen(false);
            }
            return uptodate();
        });

        io.on('newAttendace', (e) => {
            console.log(e.name);
            return uptodate();
        });
    }, [contact]);

    async function upgrade() {
        setWorker(getNomeUsuario());
        const response = await api.get('/api/clients/attendance');
        if (response) {
            setList(response.data.Client);
            if (response.data.Client[0] !== undefined) {
                console.log('ok')
            } else {
                setContact([{ profileUrl: "/unexpected.jpg", chatId: "0" }])
            }
        } else {
            setList([]);
        }
    }

    async function uptodate() {
        const response = await api.get('/api/clients/attendance');
        setList(response.data.Client);
    }

    async function getMessages() {
        if (contact.chatId !== "0") {
            const response = await api.get('/api/messages/' + contact.chatId)
            setMessagesList(response.data.Message);
        }
    }

    useEffect(getMessages, [contact])

    function isValidLast(message) {
        try {
            if ((message.lastMessage.body != null) && (message.lastMessage.body != undefined)) {
                let mess = new String(message.lastMessage.body)
                mess = mess.replace(`*${worker}:*`, '')
                return ('' + mess);
            } else {
                return ('');
            }
        } catch {
            return ('');
        }
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

        const AudioMessage = (props) => {
            return (
                <Card className={props.classe}>
                    <CardContent style={{ marginTop: "2%", marginLeft: "2%" }}>
                        <AudioPlayer
                            download={false}
                            autoplay={false}
                            volume={false}
                            width="100%"
                            variation="default"
                            spacing={3}
                            src={props.src}
                        />
                    </CardContent>
                    <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                        {props.date}
                    </Typography>
                </Card>
            );
        }

        const VideoMessage = (props) => {
            return (
                <Card className={props.classe}>
                    <CardContent style={{}}>
                        <video style={{ height: "100%", width: "100%" }} src={props.src} controls="true"></video>
                    </CardContent>
                    <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                        {props.date}
                    </Typography>
                </Card>
            );
        }

        const ImageMessage = (props) => {
            return (
                <Card className={props.classe}>
                    <img style={{ height: "100%", width: "100%", }} src={props.src}></img>
                    <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                        {props.date}
                    </Typography>
                </Card>
            );
        }

        const TextMessage = (props) => {
            return (
                <Card className={props.classe}>

                    <Typography variant="button" style={{ marginLeft: "3%", marginTop: "3%" }} color="black" display="inline" gutterBottom>
                        {props.author}
                    </Typography>

                    <CardContent>
                        <Typography color="black" variant="body" display="block">
                            {props.message}
                        </Typography>
                    </CardContent>

                    <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                        {props.date}
                    </Typography>

                </Card>
            );
        }

        const DocumentMessage = (props) => {
            let docs = [{ uri: props.src }]
            return (
                <Card className={props.classe}>
                    <DocViewer pluginRenderers={DocViewerRenderers} config={{ header: { disableHeader: true, disableFileName: true } }} style={{ height: "100%", width: "100%" }} documents={docs} />
                    <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                        {props.date}
                    </Typography>

                </Card>
            );
        }


        return (
            <CardContent>
                {messagesList.map((message) => {
                    switch (message.type) {
                        case 'chat':
                            return (function () {
                                let classMessage = message.isServer == true ? classes.sent : classes.received;
                                let mess = new String(message.body);
                                return (
                                    <TextMessage
                                        classe={classMessage}
                                        author={message.author}
                                        message={mess}
                                        date={new Date(message.createdAt).toLocaleString('pt-BR')}
                                    />
                                );
                            }());
                        case 'image':
                            return (function () {
                                let classMessage = message.isServer == true ? classes.sentVideo : classes.receivedVideo;
                                return (
                                    <ImageMessage
                                        classe={classMessage}
                                        src={message.fileLink}
                                        date={new Date(message.createdAt).toLocaleString('pt-BR')}
                                    />
                                );
                            }());

                        case 'ptt':
                            return (function () {
                                let classMessage = message.isServer == true ? classes.sent : classes.received;
                                return (
                                    <AudioMessage
                                        classe={classMessage}
                                        src={message.fileLink}
                                        date={new Date(message.createdAt).toLocaleString('pt-BR')}
                                    />
                                );
                            }());

                        case 'audio':
                            return (function () {
                                let classMessage = message.isServer == true ? classes.sent : classes.received;
                                return (
                                    <AudioMessage
                                        classe={classMessage}
                                        src={message.fileLink}
                                        date={new Date(message.createdAt).toLocaleString('pt-BR')}
                                    />
                                );
                            }());

                        case 'video':
                            return (function () {
                                let classMessage = message.isServer == true ? classes.sentVideo : classes.receivedVideo;
                                return (
                                    <VideoMessage
                                        classe={classMessage}
                                        src={message.fileLink}
                                        date={new Date(message.createdAt).toLocaleString('pt-BR')}
                                    />
                                );
                            }());

                        case 'sticker':
                            return (function () {
                                let classMessage = message.isServer == true ? classes.sentSticker : classes.receivedSticker;
                                return (
                                    <ImageMessage
                                        classe={classMessage}
                                        src={message.fileLink}
                                        date={new Date(message.createdAt).toLocaleString('pt-BR')}
                                    />
                                );
                            }());

                        case 'document':
                            return (function () {
                                let classMessage = message.isServer == true ? classes.sent : classes.received;
                                return (
                                    <DocumentMessage
                                        classe={classMessage}
                                        name={message.fileName}
                                        src={message.fileLink}
                                        date={new Date(message.createdAt).toLocaleString('pt-BR')}
                                    />
                                );
                            }());

                        default:
                            return (function () {
                                let classMessage = message.isServer == true ? classes.sent : classes.received;
                                return (
                                    <DocumentMessage
                                        classe={classMessage}
                                        name={message.fileName}
                                        src={message.fileLink}
                                        date={new Date(message.createdAt).toLocaleString('pt-BR')}
                                    />
                                );
                            }());
                            break;
                    }
                })}
            </CardContent>
        );
    }

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CssBaseline />

            <MenuAdmin name="WhatsApp" />

            <main className={classes.content}>

                <div className={classes.appBarSpacer} />

                <Container maxWidth="100%" className={classes.container}>
                    <Grid>

                        <Grid container className={classes.fila}>

                            <Grid item xs={12}>

                                <Card className={classes.card}>

                                    <Grid container>
                                        <Grid item xs={3}>

                                            <Paper elevation={3} style={{ marginBottom: "2%" }}>
                                                <CardHeader
                                                    className={classes.rightBorder}
                                                    avatar={
                                                        <Avatar aria-label="Recipe" className={classes.avatar} src={getProfileLinkUsuario()}></Avatar>
                                                    }
                                                    title={getNomeUsuario()}
                                                />
                                            </Paper>

                                            <Paper elevation={2}>
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
                                            </Paper>
                                        </Grid>


                                        <Grid className={classes.heightAdjust} item xs={9}>
                                            <Paper elevation={3}>
                                                <CardHeader
                                                    avatar={
                                                        <Avatar aria-label="Recipe" className={classes.avatar} src={contact.profileUrl}></Avatar>
                                                    }
                                                    action={
                                                        <IconButton onClick={async () => {
                                                            await api.put('/api/clients/' + contact._id);
                                                            window.location.reload();
                                                        }}>
                                                            <AssignmentTurnedInIcon />
                                                        </IconButton>
                                                    }
                                                    title={contact.fullName}
                                                />
                                            </Paper>


                                            <CardContent className={[classes.rightContainer, classes.content]} style={{ marginTop: "0%" }}>

                                                <Grid>
                                                    {getRightList()}
                                                </Grid>

                                            </CardContent>


                                            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                                                <DialogTitle id="form-dialog-title">Enviar Arquivo</DialogTitle>
                                                <DialogContent>
                                                    <form>
                                                        <input
                                                            type="file"
                                                            onChange={(e) => setSelectedFile(e.target.files[0])}
                                                        />
                                                    </form>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleClose} color="primary">
                                                        Cancelar
                                                    </Button>
                                                    <Button onClick={() => {
                                                        console.log(selectedFile)
                                                        getBase64(selectedFile).then(async (data) => {
                                                            let type = selectedFile.type.split('/', 1);
                                                            let ext = selectedFile.type.split('/', 2);
                                                            ext = ext[1];
                                                            if (type == 'aplication') {
                                                                type = 'document'
                                                            }
                                                            let dados = {
                                                                "base64": data,
                                                                "type": type,
                                                                "numbers": contact.chatId,
                                                                "ext": ext,
                                                                "name": selectedFile.name
                                                            };

                                                            await api.post('/api/whatsapp/message.doc?id=0', dados).then(() => handleClose);
                                                        })
                                                    }} color="primary">
                                                        Enviar
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>
                                            <Grid
                                                container
                                                direction="row"
                                                justify="space-evenly"
                                                alignItems="center"
                                            >

                                                <Grid style={{ paddingLeft: "5px", marginTop: '1%' }} container item xs={1}>
                                                    <Fab style={{ marginLeft: 0, paddingLeft: 0 }} color="primary" aria-label="upload picture" component="span" onClick={handleClickOpen}  >
                                                        <AttachFileIcon />
                                                    </Fab>
                                                </Grid>

                                                <Grid style={{ margin: "0 0 0 0" }} item xs={11}>
                                                    <Forme number={contact} worker={worker} />
                                                </Grid>

                                            </Grid>

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