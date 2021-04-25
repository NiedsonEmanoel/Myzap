import React, { useState, useEffect } from "react";
import api from '../../../services/api';
import { useParams } from 'react-router-dom';
import useStyles from './style';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
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
    Tab,
    Tabs,
    AppBar,
    Typography,
    Toolbar,
    ListItem,
    CardContent,
    IconButton,
    ListItemText,
    Divider,
    Avatar,
    CardHeader,
    Paper,
    GridList,
    List
} from '@material-ui/core';

import { getNomeUsuario } from '../../../services/auth';

function UserChat() {
    const [contact, setContact] = useState({});
    const { idChat } = useParams();
    const [messagesList, setMessagesList] = useState([]);
    const classes = useStyles();


    useEffect(() => {
        async function loadClient() {
            let response = await api.get('/api/clients/details/' + idChat);
            let client = response.data.Client[0];
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
            <Grid container>
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

                                    <IconButton onClick={async () => {
                                        let data = {
                                            "worker": getNomeUsuario()
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
                                </>
                            }
                            title={contact.fullName}
                        />

                        <GridList cols={1} style={{
                            marginTop: "0%",
                            height: "75vh",
                            backgroundImage: 'url(/wall.png)',
                            backgroundRepeat: 'repeat-y',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}>
                            <CardContent style={{
                                display: "flex",
                                flexDirection: "column-reverse",
                                height: "75vh",
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
        </>
    );
}

export default UserChat;