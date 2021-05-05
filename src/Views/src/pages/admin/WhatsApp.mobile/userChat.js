import React, { useState, useEffect } from "react";
import api from '../../../services/api';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { useParams } from 'react-router-dom';
import useStyles from './style';
import Copyright from '../../../components/footer';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
import Forme from '../../../components/form';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import CancelIcon from '@material-ui/icons/Cancel';
import './fonts.css'
import {
    AudioMessage,
    ImageMessage,
    TextMessage,
    VideoMessage,
    DocumentMessage
} from '../../../components/cardsMessage';
import io from '../../../services/socket.io';

import {
    Grid,
    Dialog,
    Box,
    DialogContent,
    DialogActions,
    DialogTitle,
    Button,
    CardContent,
    IconButton,
    Avatar,
    CardHeader,
    Paper,
    GridList
} from '@material-ui/core';

import { getNomeUsuario, getToken, getIdUsuario } from '../../../services/auth';

function UserChat() {
    const [contact, setContact] = useState({});
    const { idChat } = useParams();
    const [messagesList, setMessagesList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    const handleClickOpen = () => {
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
        async function loadClient() {
            let response = await api.get('/api/clients/details/' + idChat);
            let client = response.data.Client[0];

            if (client.inAttendace == false) {
                window.location.href = '/admin/whatsapp';
            }

            setContact(client)
        }
        loadClient();
    }, []);

    async function getMessages() {
        if (contact.chatId !== "0") {
            const response = await api.get('/api/messages/' + contact.chatId)
            setMessagesList(response.data.Message);
        }
    }

    useEffect(getMessages, [contact]);

    useEffect(() => {
        io.on('newMessage', (e) => {
            if (e.from == contact.chatId) {
                getMessages();
            }
        });

        io.on('newMessageSent', (e) => {
            if (e.from == contact.chatId) {
                getMessages();
            }
        });

        io.on('newFile', (e) => {
            if (e.from == contact.chatId) {
                getMessages();
                setOpen(false);
            }
        });
    }, [contact]);

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
                                let classMessage = message.isServer == true ? classes.sentAudio : classes.receivedAudio;
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
                                        a={true}
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

    return (
        <>
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
                                "name": selectedFile.name,
                                "token": getToken()
                            };

                            await api.post('/api/whatsapp/message.doc?id=0', dados).then(() => handleClose);
                        })
                    }} color="primary">
                        Enviar
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid container style={{ overflow: 'hidden' }}>
                <Grid item xs={12}>

                    <Paper elevation={5} style={{ width: "100%" }}>
                        <CardHeader
                            avatar={
                                <Avatar aria-label="Recipe" src={contact.profileUrl}></Avatar>
                            }
                            action={
                                <>

                                    <Link to="/admin/whatsapp" style={{ textDecoration: "none" }}>
                                        <IconButton >
                                            <ArrowBackIcon />
                                        </IconButton>
                                    </Link>

                                    <IconButton onClick={handleClickOpen}>
                                        <AttachFileIcon />
                                    </IconButton>

                                    <IconButton onClick={async () => {
                                        let data = {
                                            "worker": getIdUsuario(),
                                            "name": getNomeUsuario()
                                        }
                                        if (contact.firstAttendace !== undefined) {
                                            if (contact.firstAttendace == false) {
                                                await api.put('/api/clients/' + contact._id, data);
                                                window.location.href = '/admin/whatsapp';
                                            } else {
                                                await api.patch('/api/clients/first/?_id=' + contact._id, data);
                                                window.location.reload();
                                            }
                                        }
                                    }}>
                                        {contact.firstAttendace ? <AssignmentTurnedInIcon /> : <CancelIcon />}
                                    </IconButton>
                                </>
                            }
                            title={contact.fullName}
                            subheader={
                                contact.WorkerAttendance != undefined ?
                                    contact.WorkerAttendance != 'no-one' ?
                                        `Sendo atendido por: ${contact.NameAttendance}`
                                        :
                                        ""
                                    :
                                    "Selecione alguma conversa."
                            }
                        />
                        <GridList cols={1} style={{
                            marginTop: "0%",
                            height: "68vh",
                            overflow: 'hidden',
                            backgroundImage: 'url(/wall.png)',
                            backgroundRepeat: 'repeat-y',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}>
                            <CardContent style={{
                                display: "flex",
                                flexDirection: "column-reverse",
                                height: "68vh",
                                flexGrow: 1,
                                width: "100%",
                                overflow: 'auto',
                            }}>

                                {getRightList()}

                            </CardContent>
                        </GridList>

                    </Paper>
                </Grid>
            </Grid>

            <div style={{ marginTop: "5%" }}>
                <Forme number={contact} worker={getNomeUsuario()} />
            </div>

            <Box pt={3}>
                <Copyright />
            </Box>
        </>
    );
}

export default UserChat;