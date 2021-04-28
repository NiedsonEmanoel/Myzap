import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import MenuAdmin from '../../../components/menu-admin';
import PanToolIcon from '@material-ui/icons/PanTool';
import CancelIcon from '@material-ui/icons/Cancel';
import Copyright from '../../../components/footer';
import GridList from '@material-ui/core/GridList';
import Button from '@material-ui/core/Button';
import Forme from '../../../components/form'
import Fab from "@material-ui/core/Fab";
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import io from '../../../services/socket.io';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from '../../../services/api'
import { getNomeUsuario, getProfileLinkUsuario } from '../../../services/auth';
import useStyles from './style';

import InputBase from '@material-ui/core/InputBase';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';

import {
    Paper,
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

import {
    AudioMessage,
    ImageMessage,
    TextMessage,
    VideoMessage,
    DocumentMessage
} from '../../../components/cardsMessage';


export default function WhatsApp() {
    const [contact, setContact] = useState({});
    const [worker, setWorker] = useState("");
    const [list, setList] = useState([]);
    const [resultList, setResultList] = useState([]);
    const [queryText, setQueryText] = useState('');
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
        upgrade();

        io.on('newAttendace', (e) => {
            return uptodate();
        });

        io.on('userChanged', (e) => {
            return uptodate();
        })
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
    }, [contact]);

    async function upgrade() {
        setWorker(getNomeUsuario());
        const response = await api.get('/api/clients/attendance');

        if (response) {
            setList(response.data.Client);
            setResultList(response.data.Client)
            if (response.data.Client[0] !== undefined) {
                console.log('ok')
            } else {
                setContact([{}])
            }
        } else {
            setList([]);
            setResultList([])
        }
    }

    async function uptodate() {
        const response = await api.get('/api/clients/attendance');
        setList(response.data.Client);

        if (queryText == '') {
            setResultList(response.data.Client);
        }
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

    function handleOnQuery(event) {
        event.preventDefault();
        let results;
        if (!queryText) {
            results = list
        } else {
            results = list.filter(item => item.fullName.toLowerCase().indexOf(queryText.toLowerCase()) !== -1)
        }
        setResultList(results);
    }

    function getLeftList() {
        return (resultList.map(item => (
            <>
                <ListItem button={true} onClick={(e) => { setContact(item) }}>
                    <Avatar src={item.profileUrl}></Avatar>
                    <ListItemText className={classes.list} primary={item.fullName} secondary={isValidLast(item)} />
                    {item.firstAttendace ? <PanToolIcon /> : <></>}
                </ListItem>
                <Divider variant="inset" component="li" />
            </>
        )));
    }



    function getRightList() {
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

                <Container maxWidth="100%" maxHeight="100%" className={classes.container}>
                    <Grid>

                        <Grid container className={classes.fila}>

                            <Grid item xs={12}>

                                <Card className={classes.card}>

                                    <Grid container>
                                        <Grid item xs={3}>

                                            <Paper elevation={3} style={{ marginBottom: "1%" }}>
                                                <CardHeader
                                                    className={classes.rightBorder}
                                                    avatar={
                                                        <Avatar aria-label="Recipe" className={classes.avatar} src={getProfileLinkUsuario()}></Avatar>
                                                    }
                                                    title={getNomeUsuario()}
                                                />
                                            </Paper>

                                            <Paper component="form"
                                                onChange={handleOnQuery}
                                                onSubmit={handleOnQuery}
                                                style={{
                                                    display: 'flex',
                                                    width: "100%",
                                                    marginBottom: "5px"
                                                }}>

                                                <InputBase
                                                    className={classes.input}
                                                    placeholder="Pesquisar por contato"
                                                    value={queryText}
                                                    onChangeCapture={(e) => {
                                                        if (!e.target.value) {
                                                            setQueryText('');
                                                            setResultList(list)
                                                        } else {
                                                            setQueryText(e.target.value)
                                                        }

                                                    }}
                                                    inputProps={{ 'aria-label': 'Pesquisar por contato' }}
                                                    style={{
                                                        width: "100%",
                                                        marginLeft: "20px"
                                                    }}
                                                />
                                                <IconButton type="submit" className={classes.iconButton} aria-label="search">
                                                    <SearchIcon />
                                                </IconButton>
                                                <Divider className={classes.divider} orientation="vertical" />
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
                                            <Paper elevation={5}>
                                                <CardHeader
                                                    avatar={
                                                        <Avatar aria-label="Recipe" className={classes.avatar} src={contact.profileUrl}></Avatar>
                                                    }
                                                    action={
                                                        <IconButton onClick={async () => {
                                                            let data = {
                                                                "worker": worker
                                                            }
                                                            if (contact.firstAttendace !== undefined) {
                                                                if (contact.firstAttendace == false) {
                                                                    await api.put('/api/clients/' + contact._id, data);
                                                                    setContact({})
                                                                } else {
                                                                    await api.patch('/api/clients/first/?_id=' + contact._id, data);
                                                                    let tempCont = contact;
                                                                    tempCont.firstAttendace = !tempCont.firstAttendace;
                                                                    setContact(tempCont)
                                                                }
                                                            }
                                                        }}>
                                                            {contact.firstAttendace ? <AssignmentTurnedInIcon /> : <CancelIcon />}
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

                                                {contact.firstAttendace ? <></> : <Grid style={{ paddingLeft: "5px", marginTop: '1%' }} container item xs={1}>
                                                    <Fab style={{ marginLeft: 0, paddingLeft: 0 }} color="primary" aria-label="upload picture" component="span" onClick={handleClickOpen}  >
                                                        <AttachFileIcon />
                                                    </Fab>
                                                </Grid>}

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