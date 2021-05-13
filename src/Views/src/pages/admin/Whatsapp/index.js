import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import MenuAdmin from '../../../components/menu-admin';
import PanToolIcon from '@material-ui/icons/PanTool';
import Icon from '@material-ui/core/Icon';

import Copyright from '../../../components/footer';
import DoneIcon from '@material-ui/icons/Done';
import getTipo from '../../../functions/getTipo';
import GridList from '@material-ui/core/GridList';
import Button from '@material-ui/core/Button';
import Forme from '../../../components/form'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import io from '../../../services/socket.io';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from '../../../services/api'
import { getNomeUsuario, getProfileLinkUsuario, getTipoUsuario, setTipoUsuario, getToken, getIdUsuario, getAttendanceCount, setAttendanceCountOnePlus, setToZeroAttendanceCount } from '../../../services/auth';
import useStyles from './style';

import InputBase from '@material-ui/core/InputBase';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';

import {
    Paper,
    Grid,
    Card,
    DialogContentText,
    Chip,
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
    const [openExclude, setOpenExclude] = useState(false);
    const [openChange, setOpenChange] = useState(false);
    const [openQR, setQR] = useState(false);
    const [count, setCount] = useState(parseInt(getAttendanceCount()));

    const [users, setUsers] = useState([])

    function countPlus() {
        setAttendanceCountOnePlus();
        setCount(count + 1)
    }

    function countZero() {
        setToZeroAttendanceCount();
        setCount(0);
    }

    const handleClickOpen = () => {
        if (contact.chatId)
            setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setOpenChange(false)
        setOpenExclude(false)
        setQR(false)
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
        (async () => {
            const response = await api.get('/api/workers');
            let arr = [];
            for (let key in response.data.Workers) {
                let object = {
                    "Name": response.data.Workers[key].nome_usuario,
                    "ProfilePic": response.data.Workers[key].foto_perfil,
                    "Id": response.data.Workers[key]._id,
                    "Type": getTipo(response.data.Workers[key].tipo_usuario)
                }
                if (object.Id != getIdUsuario()) {
                    arr.push(object)
                } else {
                    object.Type = 'Você'
                    arr.push(object)
                }

            }

            setUsers(arr)
        })()
    }, [])

    useEffect(() => {
        async function s() {
            let res = await (await api.get('/api/workers/details/' + getIdUsuario())).data.Worker[0].tipo_usuario;
            setTipoUsuario(`${res}`);
        }
        s();
    }, [])

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

        io.on('newMessageSent', (e) => {
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
        const arrResponse = response.data.Client;
        let listA = [];

        for (let key in arrResponse) {
            if ((getTipoUsuario() != '3') && (getTipoUsuario() != '2')) {
                if (arrResponse[key].WorkerAttendance == 'no-one') {
                    listA.push(arrResponse[key]);
                } else {
                    if (arrResponse[key].WorkerAttendance == getIdUsuario()) {
                        listA.push(arrResponse[key]);
                    }
                }
            } else {
                listA = arrResponse;
            }
        }

        if (response) {
            setList(listA);
            setResultList(listA)
            if (response.data.Client[0] !== undefined) {
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
        const arrResponse = response.data.Client;
        let listA = [];

        for (let key in arrResponse) {
            if (getTipoUsuario() != '3') {
                if (arrResponse[key].WorkerAttendance == 'no-one') {
                    listA.push(arrResponse[key]);
                } else {
                    if (arrResponse[key].WorkerAttendance == getIdUsuario()) {
                        listA.push(arrResponse[key]);
                    }
                }
            } else {
                listA = arrResponse;
            }
        }

        setList(listA);

        if (queryText == '') {
            setResultList(listA);
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
                mess = mess.trim();
                mess = mess=='Seu atendimento foi finalizado com sucesso.'?'':mess
                return ('' + mess);
            } else {
                return ('');
            }
        } catch {
            return ('');
        }
    }

    function lastDate(message) {
        try {
            if ((message.lastMessage.body != null) && (message.lastMessage.body != undefined)) {
                let date = new Date(message.lastMessage.createdAt)
                let hour = date.toLocaleTimeString('pt-br')
                let arrHour = hour.split(":", 2)
                return (`${arrHour[0]}:${arrHour[1]}`);
            }
            else {
                return ('');
            }
        }
        catch {
            return ('')
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

    function getUsersToAblyChange() {
        return (users.map(item => (
            <>
                <ListItem button={true} onClick={async (e) => {
                    let data = {
                        "worker": item.Id,
                        "name": item.Name
                    }
                    const response = await api.patch('/api/clients/first/?_id=' + contact._id, data);
                    setContact({});
                    handleClose();
                }}>
                    <Avatar src={item.ProfilePic}></Avatar>
                    <ListItemText className={classes.list} primary={item.Name} secondary={item.Type} />
                </ListItem>

                <Divider />
            </>
        )));
    }

    function getLeftList() {
        return (resultList.map(item => (
            <>
                <ListItem button={true} onClick={(e) => { setContact(item) }}>
                    <Avatar src={item.profileUrl}></Avatar>
                    <ListItemText className={classes.list} primary={item.fullName} secondary={isValidLast(item)} />
                    {
                        item.firstAttendace ?
                            <PanToolIcon />
                            :
                            <>{lastDate(item)}</>
                    }

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

                                            <Dialog open={openExclude} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
                                                <DialogTitle id="alert-dialog-title">{"Deseja excluir essa conversa?"}</DialogTitle>

                                                <DialogContent>

                                                    <DialogContentText id="alert-dialog-description">
                                                        Não será possível desfazer essa ação.
                                                    </DialogContentText>

                                                </DialogContent>

                                                <DialogActions>

                                                    <Button onClick={handleClose} color="primary">
                                                        Sair
                                                    </Button>

                                                    <Button onClick={async () => {
                                                        if (contact.chatId) {
                                                            await api.delete('/api/messages/' + contact.chatId);
                                                            await api.delete('/api/whatsapp/chats/' + contact.chatId + '?id=0');
                                                            handleClose();
                                                        }
                                                    }} color="primary" autoFocus>
                                                        Excluir
                                                    </Button>

                                                </DialogActions>

                                            </Dialog>


                                            <Dialog open={openChange} onClose={handleClose} >
                                                <DialogTitle id="alert-dialog-title">{"Deseja transferir essa conversa?"}</DialogTitle>

                                                <DialogContent>
                                                    <DialogContentText>
                                                        Escolha para quem a conversa será transferida.
                                                    </DialogContentText>
                                                    {getUsersToAblyChange()}
                                                </DialogContent>

                                                <DialogActions>

                                                    <Button onClick={handleClose} color="primary">
                                                        Sair
                                                    </Button>

                                                </DialogActions>

                                            </Dialog>

                                            <Paper elevation={3} style={{ marginBottom: "1%" }}>
                                                <CardHeader
                                                    className={classes.rightBorder}
                                                    avatar={
                                                        <Avatar aria-label="Recipe" className={classes.avatar} src={getProfileLinkUsuario()}></Avatar>
                                                    }
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
                                                        contact.WorkerAttendance != undefined ? <>
                                                            <IconButton onClick={() => { setOpenChange(true) }}>
                                                                <SwapHorizontalCircleIcon />
                                                            </IconButton>

                                                            {contact.firstAttendace ? <></> : <IconButton onClick={handleClickOpen}>
                                                                <AttachFileIcon />

                                                            </IconButton>}

                                                            {contact.firstAttendace ? <></> : getTipoUsuario() == '3' ? <IconButton onClick={() => { setOpenExclude(true) }}>
                                                                <DeleteIcon />
                                                            </IconButton> : <></>}

                                                            <Chip
                                                                icon={contact.firstAttendace ? <AssignmentTurnedInIcon /> : <DoneIcon />}
                                                                label={contact.firstAttendace ? "Atender" : "Finalizar"}
                                                                onClick={async () => {
                                                                    let data = {
                                                                        "worker": getIdUsuario(),
                                                                        "name": getNomeUsuario()
                                                                    }
                                                                    if (contact.firstAttendace !== undefined) {
                                                                        if (contact.firstAttendace == false) {
                                                                            let MessDATA = {
                                                                                numbers: contact.chatId.replace('@c.us', ''),
                                                                                worker:  getNomeUsuario(),
                                                                                messages: 'Seu atendimento foi finalizado com sucesso./:end:/Por favor nos avalie com uma nota de 0 a 10.'
                                                                            }
                                                                            await api.put('/api/clients/' + contact._id, data);
                                                                            await api.post('/api/whatsapp/message?id=0', MessDATA);
                                                                            setContact({})
                                                                        } else {
                                                                            await api.patch('/api/clients/first/?_id=' + contact._id, data);
                                                                            let tempCont = contact;
                                                                            tempCont.firstAttendace = !tempCont.firstAttendace;
                                                                            setContact(tempCont)
                                                                        }
                                                                    }
                                                                }}
                                                                clickable
                                                            />
                                                        </> : <></>

                                                    }
                                                    title={contact.fullName}
                                                    subheader={
                                                        contact.WorkerAttendance != undefined ?
                                                            contact.WorkerAttendance != 'no-one' ?
                                                                `Sendo atendido por: ${contact.NameAttendance}`
                                                                :
                                                                ""
                                                            :
                                                            contact.chatId == "attendance@c.us" ?
                                                                ""
                                                                :
                                                                "Selecione alguma conversa."
                                                    }
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

                                                        getBase64(selectedFile).then(async (data) => {
                                                            let type = selectedFile.type.split('/', 1);
                                                            let ext = selectedFile.type.split('/', 2);
                                                            let port = window.location.port == '' ? '' : ':' + window.location.port;
                                                            let proxy = `${window.location.protocol}//${window.location.hostname}${port}`
                                                            ext = ext[1];
                                                            if (type == 'aplication') {
                                                                type = 'document'
                                                            }
                                                            let dados = {
                                                                "base64": data,
                                                                "type": type,
                                                                "numbers": contact.chatId,
                                                                "ext": ext,
                                                                "proxy": proxy,
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

                                            <div style={{ width: "100%" }}>
                                                <Forme number={contact} worker={worker} />
                                            </div>

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