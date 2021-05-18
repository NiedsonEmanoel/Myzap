import React, { useState, useEffect } from "react";
import api from '../../../services/api';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PanToolIcon from '@material-ui/icons/PanTool';
import { Link } from 'react-router-dom';
import MenuAdmin from '../../../components/menu-admin';
import Copyright from '../../../components/footer';
import io from '../../../services/socket.io';
import { getTipoUsuario, getNotifPreference, setNotifPreference, getIdUsuario, setTipoUsuario } from '../../../services/auth'

import {getPreferenceColor} from '../../../services/auth'

import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

import {
    Grid,
    Box,
    IconButton,
    CssBaseline,
    Container,
    makeStyles,
    ListItem,
    ListItemText,
    Divider,
    Avatar,
    Paper,
    GridList,
    List
} from '@material-ui/core';

const drawerWidth = 240;


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(4),
    },
}));

function WhatsMobile() {
    const classes = useStyles();
    const [list, setList] = useState([]);
    const [resultList, setResultList] = useState([]);
    const [queryText, setQueryText] = useState('');
    const [notif, setNotif] = React.useState(getNotifPreference() == 'true');
    let colorLink = getPreferenceColor() == 'dark' ? 'white':'black';
    const handleNotif = () => {
        if (notif == true) {
            setNotifPreference('false')
            setNotif(false)
        } else {
            setNotifPreference('true')
            setNotif(true)
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

    async function requestList() {
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

        setList(listA);

        if (queryText == '') {
            setResultList(listA);
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

    async function initList() {
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

        setList(listA);
        setResultList(listA);
    }

    useEffect(() => {
        initList();

        io.on('newAttendace', (e) => {
            return requestList();
        });

        io.on('userChanged', (e) => {
            return requestList();
        });

        io.on('newMessage', (e) => {
            return requestList();
        });

        io.on('newFile', (e) => {
            return requestList();
        });

    }, []);

    useEffect(() => {
        async function s() {
            let res = await (await api.get('/api/workers/details/' + getIdUsuario())).data.Worker[0].tipo_usuario;
            setTipoUsuario(`${res}`);
        }
        s();
    }, [])

    function isValidLast(message) {
        try {
            if ((message.lastMessage.body != null) && (message.lastMessage.body != undefined)) {
                let mess = new String(message.lastMessage.body)
                mess = mess.trim();
                mess = mess == 'Seu atendimento foi finalizado com sucesso.' ? '' : mess
                return ('' + mess);
            } else {
                return ('');
            }
        } catch {
            return ('');
        }
    }

    function getLeftList() {
        return (resultList.map(item => (
            <>
                <Link to={'/admin/whatsapp/' + item._id} style={{ textDecoration: "none", color: colorLink }}>
                    <ListItem button={false} >
                        <Avatar src={item.profileUrl}></Avatar>
                        <ListItemText style={{
                            width: '100%',
                            paddingLeft: 15
                        }} primary={item.fullName} secondary={isValidLast(item)} />
                        {item.firstAttendace ? <PanToolIcon /> : <>{lastDate(item)}</>}
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </Link>
            </>
        )));
    }

    return (
        <div className={classes.root}>
            <CssBaseline />

            <MenuAdmin name="WhatsApp" />

            <main className={classes.content}>

                <div className={classes.appBarSpacer} />

                <Container maxWidth="lg" style={{paddingTop: '10px'}}>

                    <Grid container style={{height: '100%'}}>
                        <Grid item xs={12}>

                            <Paper component="form"
                                onChange={handleOnQuery}
                                onSubmit={handleOnQuery}
                                style={{
                                    display: 'flex',
                                    width: "100%",
                                    marginTop: "2px",
                                    marginBottom: "5px"
                                }}>

                                <InputBase
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
                                <IconButton type="submit" aria-label="search">
                                    <SearchIcon />
                                </IconButton>
                                <Divider orientation="vertical" />
                            </Paper>

                            <Paper elevation={2}>
                                <GridList style={{
                                    width: '100%',
                                    display: "flex",
                                    height: "75vh",
                                    flexWrap: 'normal'
                                }} cols={1}>
                                    <List >
                                        {getLeftList()}
                                    </List>
                                </GridList>
                            </Paper>

                        </Grid>
                    </Grid>
                    <Box pt={1}>
                        <Copyright />
                    </Box>
                </Container>
            </main>
        </div>

    );
}

export default WhatsMobile;