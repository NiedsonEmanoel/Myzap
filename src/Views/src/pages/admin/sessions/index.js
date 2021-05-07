import React, { useState, useEffect } from 'react';
import useStyles from './theme';
import MenuAdmin from '../../../components/menu-admin';
import Copyright from '../../../components/footer';
import io from '../../../services/socket.io';
import {getIdUsuario, getTipoUsuario, setTipoUsuario} from '../../../services/auth';
import { useSnackbar } from 'notistack';
import api from '../../../services/api'

import {
    Grid,
    Container,
    Box,
    CssBaseline,
    Paper,
    Chip,
    Table,
    Dialog,
    DialogContent,
    TableBody,
    TableCell,
    TableContainer,
    Button,
    ButtonGroup,
    TableHead,
    TableRow
} from '@material-ui/core';

import DoneIcon from '@material-ui/icons/Done';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import ClearIcon from '@material-ui/icons/Clear';

export default function Sessions() {
    const classes = useStyles();

    const [id, setId] = useState(0);
    const [sessions, setSessions] = useState([]);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function switchSessions(s) {
        setSessions(s);
    }

    function switchID(id) {
        setId(id);
    }

    useEffect(() => {
        io.on('sessionChanged', (e) => {
            (async () => {
                const handler = await api.get('/api/whatsapp/sessions');
                const numberOfSessions = handler.data.numberOfSessions;
                let sessionsTemp = [];

                for (let i = 0; i < numberOfSessions; i++) {
                    let active = await (await api.get('/api/whatsapp/sessions.details/' + i)).data.started;
                    let phone
                    try {
                        phone = active == true ? await (await api.get('/api/whatsapp/device?id=' + i)).data.device.phone.device_model : "-";
                    }
                    catch (e) {
                        phone = 'Aguardando...'
                    }
                    let tempAux = {
                        "Session": i,
                        "active": active,
                        "device": phone
                    }
                    sessionsTemp.push(tempAux);
                }
                switchSessions(sessionsTemp);
            })();
            handleClose();
        });
    }, []);

    useEffect(()=>{
        async function s(){
          let res = await (await api.get('/api/workers/details/'+getIdUsuario())).data.Worker[0].tipo_usuario;
          setTipoUsuario(`${res}`);
          if((getTipoUsuario() != '3')){
            window.location.href='/admin'
          }
        }
        s();
      }, [])

    useEffect(() => {
        (async () => {
            const handler = await api.get('/api/whatsapp/sessions');
            const numberOfSessions = handler.data.numberOfSessions;
            let sessionsTemp = [];

            for (let i = 0; i < numberOfSessions; i++) {
                let active = await (await api.get('/api/whatsapp/sessions.details/' + i)).data.started;
                let phone
                let alias
                try {
                    phone = active == true ? await (await api.get('/api/whatsapp/device?id=' + i)).data.device.phone.device_model : "-";
                    //  alias = active == true ? await (await api.get('/api/whatsapp/alias?id=' + i)).data.alias : '-'
                }
                catch (e) {
                    phone = 'Aguardando...';
                    //alias = '-';
                }
                let tempAux = {
                    "Session": i,
                    "active": active,
                    "device": phone,
                    "alias": "Credencial Interna" // alias
                }
                sessionsTemp.push(tempAux);
            }
            switchSessions(sessionsTemp);
        })();
    }, []);

    function getData() {
        return (
            sessions.map((value) => {
                return (
                    <TableRow>
                        <TableCell>
                            {value.Session}
                        </TableCell>

                        <TableCell align="center">
                            {value.active ? <Chip label="Ativa" color="primary" /> : <Chip label="Inativa" disabled />}
                        </TableCell>

                        <TableCell align="center">
                            {
                                value.device != '-' ?
                                    value.device != 'Aguardando...' ?
                                        <Chip label={value.device} variant="outlined" color="primary" />
                                        :
                                        <Chip label={value.device} variant="outlined" color="secondary" />
                                    :
                                    value.device
                            }
                        </TableCell>

                        <TableCell align="center">
                            {value.alias == "" ? "Credencial Interna" : value.alias}
                        </TableCell>

                        <TableCell align="right">
                            <ButtonGroup size="small" aria-label="small button group">
                                {value.active ?
                                    <Button onClick={async () => {

                                        const r = await api.delete('/api/whatsapp/sessions?id=' + value.Session);
                                        return ('');

                                    }}>
                                        Desabilitar
                                        <ClearIcon />
                                    </Button>

                                    :

                                    <Button onClick={async () => {
                                        const r = await api.post('/api/whatsapp/sessions?id=' + value.Session);
                                        return ('');
                                    }}>
                                        Habilitar
                                        <DoneIcon />
                                    </Button>
                                }

                                {value.active ?
                                    <Button onClick={() => {
                                        switchID(value.Session);
                                        handleClickOpen();
                                    }}>
                                        QRCode
                                        <img style={{ height: "100%", paddingLeft: '3px' }} src={'/qrcode.svg'}></img>
                                    </Button>

                                    :

                                    <></>
                                }
                            </ButtonGroup>
                        </TableCell>

                    </TableRow>
                );
            })
        );
    }

    return (
        <div className={classes.root}>
            <CssBaseline />

            <MenuAdmin name="Sessões" />

            <main className={classes.content}>

                <div className={classes.appBarSpacer} />

                <Container maxWidth="lg" className={classes.container}>

                    <Dialog
                        open={open}
                        onClose={handleClose}
                    >
                        <DialogContent>
                            <iframe style={{ height: '269px', width: '269px' }} src={`/api/whatsapp/qrcode?id=${id}`}></iframe>
                        </DialogContent>
                    </Dialog>

                    <Grid>
                        <Paper className={classes.paper}>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="flex-start"
                            >
                                <h2>Controle da Sessão</h2>
                            </Grid>


                            <Grid container spacing={3}>

                                <Grid item xs={12} sm={12}>

                                    <TableContainer component={Paper}>

                                        <Table className={classes.table} aria-label="simple table">

                                            <TableHead>

                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell align="center">Status</TableCell>
                                                    <TableCell align="center">Aparelho</TableCell>
                                                    <TableCell align="center">Sessão DialogFlow</TableCell>
                                                    <TableCell align="right">Opções</TableCell>
                                                </TableRow>

                                            </TableHead>

                                            <TableBody>

                                                {

                                                    getData()

                                                }

                                            </TableBody>

                                        </Table>

                                    </TableContainer>

                                </Grid>

                            </Grid>

                        </Paper>
                    </Grid>

                    <Box pt={4}>
                        <Copyright />
                    </Box>

                </Container>

            </main>
        </div>
    );
}