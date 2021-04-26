import React, { useState, useEffect } from "react";
import api from '../../../services/api';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PanToolIcon from '@material-ui/icons/PanTool';
import { Link } from 'react-router-dom';
import io from '../../../services/socket.io';

import {
    Grid,
    IconButton,
    AppBar,
    Typography,
    Toolbar,
    ListItem,
    ListItemText,
    Divider,
    Avatar,
    CardHeader,
    Paper,
    GridList,
    List
} from '@material-ui/core';

import { getNomeUsuario, getProfileLinkUsuario } from '../../../services/auth';

function WhatsMobile() {
    const [list, setList] = useState([])

    async function requestList() {
        const response = await api.get('/api/clients/attendance');
        console.log(response.data.Client)
        setList(response.data.Client);
    }

    useEffect(() => {
        requestList();

        io.on('newAttendace', (e) => {
            return requestList();
        });

        io.on('userChanged', (e) => {
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
        return (list.map(item => (
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

                    <Paper elevation={3} style={{ marginBottom: "2%" }}>
                        <CardHeader

                            avatar={
                                <Avatar aria-label="Recipe" src={getProfileLinkUsuario()}></Avatar>
                            }
                            title={getNomeUsuario()}
                        />
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
        </>
    );
}

export default WhatsMobile;