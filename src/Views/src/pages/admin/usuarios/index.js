import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import MenuAdmin from '../../../components/menu-admin';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Copyright from '../../../components/footer';
import { useSnackbar } from 'notistack';
import { Grid } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import io from '../../../services/socket.io';
import { getIdUsuario, setTipoUsuario, getTipoUsuario } from '../../../services/auth';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import api from '../../../services/api';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
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
  table: {
    minWidth: 650,
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  btnSuccess: { backgroundColor: "green", color: "#fff", "&:hover": { backgroundColor: "#12b912" } }
}));

export default function UsuariosListagem() {
  const [usuarios, setUsuarios] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function Attendace(inAttendace) {
    switch (inAttendace) {
      case true:
        return ('Finalizar atendimento');
        break;

      default:
        return ('Atender');
        break;
    }
  }

  useEffect(() => {
    async function s() {
      let res = await (await api.get('/api/workers/details/' + getIdUsuario())).data.Worker[0].tipo_usuario;
      setTipoUsuario(`${res}`);
      if ((getTipoUsuario() != '3') && (getTipoUsuario() != '2')) {
        window.location.href = '/admin'
      }
    }
    s();
  }, [])

  useEffect(() => {
    loadUsuarios();
    io.on('userChanged', (e) => {
      console.log('a')
      loadUsuarios();
      handleClose();
    });
  }, [])

  async function loadUsuarios() {
    const response = await api.get('/api/clients');
    setUsuarios(response.data.Clients);
  }

  function getUsers() {
    return (
      usuarios.map((row) => (
        <>
          <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
            <DialogTitle id="alert-dialog-title">{"Deseja excluir esse Contato?"}</DialogTitle>

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
                try {
                  const response = await api.delete('/api/clients/' + row._id);
                  await api.delete('/api/messages/' + row.chatId);
                  await api.delete('/api/whatsapp/chats/' + row.chatId + '?id=0');
                  handleClose();
                } catch (e) {
                  console.log(e);
                  alert('Erro, tente mais tarde.');
                }
              }} color="primary" autoFocus>
                Excluir
              </Button>

            </DialogActions>

          </Dialog>

          <TableRow key={row.nome}>
            <TableCell component="th" scope="row">
              <Chip color="primary" avatar={<Avatar src={row.profileUrl} />} label={row.fullName} />
            </TableCell>
            <TableCell align="center">{new String(row.chatId).replace('@c.us', '')}</TableCell>
            <TableCell align="center">{new String(`${row.WithDrawCash.toFixed(2)}R$`).replace('.', ',')}</TableCell>
            <TableCell align="center">{`${new Date(row.createdAt).toLocaleDateString('pt-BR')} - ${new Date(row.createdAt).toLocaleTimeString('pt-BR')}`}</TableCell>
            <TableCell align="right">

              <ButtonGroup size="small" aria-label="small button group">
                <Button variant="contained" color="primary" onClick={async () => {
                  let data = {
                    _id: row._id,
                    worker: "no-one",
                  }
                  await api.patch('/api/clients/', data);
                }}>{Attendace(row.inAttendace)}</Button>

                {row.WithDrawCash != 0 ? <Button disabled variant="contained" color="secondary" onClick={handleClickOpen} ><DeleteIcon />
                </Button> : <Button variant="contained" color="secondary" onClick={handleClickOpen} ><DeleteIcon />
                </Button>}

              </ButtonGroup>

            </TableCell>
          </TableRow>
        </>
      )));
  }

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />

      <MenuAdmin name="Contatos" />

      <main className={classes.content}>

        <div className={classes.appBarSpacer} />

        <Container maxWidth="lg" className={classes.container}>

          <Grid>
            <Paper className={classes.paper}>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="flex-start"
              >
                <h2>Listagem de Contatos</h2>

                <Button variant="contained" className={classes.btnSuccess} href={'/admin/contatos/cadastrar'}><AddIcon />Cadastrar</Button>
              </Grid>


              <Grid container spacing={3}>

                <Grid item xs={12} sm={12}>

                  <TableContainer component={Paper}>

                    <Table className={classes.table} aria-label="simple table">

                      <TableHead>

                        <TableRow>
                          <TableCell>Nome</TableCell>
                          <TableCell align="center">Telefone</TableCell>
                          <TableCell align="center">Saldo</TableCell>
                          <TableCell align="center">Data de cadastro</TableCell>
                          <TableCell align="right">Opções</TableCell>
                        </TableRow>

                      </TableHead>

                      <TableBody>

                        {getUsers()}

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