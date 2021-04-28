import React, { useState, useEffect } from "react";
import api from '../../../services/api';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PanToolIcon from '@material-ui/icons/PanTool';
import { Link } from 'react-router-dom';
import Copyright from '../../../components/footer';
import io from '../../../services/socket.io';


import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

import {
    Grid,
    Box,
    IconButton,
    AppBar,
    Typography,
    Toolbar,
    ListItem,
    ListItemText,
    Divider,
    Avatar,
    Paper,
    GridList,
    List
} from '@material-ui/core';

import { getNomeUsuario } from '../../../services/auth';

function WhatsMobile() {
    const [list, setList] = useState([]);
    const [resultList, setResultList] = useState([]);
    const [queryText, setQueryText] = useState('');

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
        setList(response.data.Client);

        if (queryText == '') {
            setResultList(response.data.Client);
        }
    }

    async function initList() {
        const response = await api.get('/api/clients/attendance');
        setList(response.data.Client);
        setResultList(response.data.Client);
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

    function isValidLast(message) {
        try {
            if ((message.lastMessage.body != null) && (message.lastMessage.body != undefined)) {
                let mess = new String(message.lastMessage.body)
                mess = mess.replace(`*${getNomeUsuario()}:*`, '')
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
                <Link to={'/admin/whatsapp/' + item._id} style={{ textDecoration: "none" }}>
                    <ListItem button={false} >
                        <Avatar src={item.profileUrl}></Avatar>
                        <ListItemText style={{
                            width: '100%',
                            paddingLeft: 15
                        }} primary={item.fullName} secondary={isValidLast(item)} />
                        {item.firstAttendace ? <PanToolIcon /> : <></>}
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </Link>
            </>
        )));
    }

    return (
        <>
            <div style={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
                            {`WhatsApp`}
                        </Typography>

                        <Link to="/admin/" style={{ textDecoration: "none" }}>
                            <IconButton >
                                <ArrowBackIcon />
                            </IconButton>
                        </Link>

                    </Toolbar>
                </AppBar>
            </div>

            <Grid container>
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
        </>
    );
}

export default WhatsMobile;