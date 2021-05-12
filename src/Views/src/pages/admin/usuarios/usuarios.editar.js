import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import MenuAdmin from '../../../components/menu-admin';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Copyright from '../../../components/footer';
import { Grid } from '@material-ui/core';
import api from '../../../services/api';
import io from '../../../services/socket.io';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import {getIdUsuario, getTipoUsuario, setTipoUsuario} from '../../../services/auth';

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

export default function Dashboard() {

  const [fullName, setFullName] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [chatId, setChatId] = useState('');

  const { idUsuario } = useParams();

  useEffect(async () => {
    let response = await api.get('/api/clients/details/' + idUsuario);
    let client = response.data.Client[0];
    client.chatId = new Number(client.chatId.replace('@c.us', ''));

    setFullName(client.fullName);
    setProfileUrl(client.profileUrl);
    setChatId(client.chatId);
  }, []);

  useEffect(()=>{
    async function s(){
      let res = await (await api.get('/api/workers/details/'+getIdUsuario())).data.Worker[0].tipo_usuario;
      setTipoUsuario(`${res}`);
      if((getTipoUsuario() != '3')&&(getTipoUsuario()!= '2')){
        window.location.href='/admin'
      }
    }
    s();
  }, [])

  async function handleSubmit() {
    try {
      const data = { fullName, profileUrl, chatId };

      if ((!fullName) || (!profileUrl) || (!chatId)) {
        return (enqueueSnackbar('Prencha todos os campos!', { variant: "warning" }));
      }

      const response = await api.put('/api/clients/update/' + idUsuario, data);
      console.log(response);

      if (response.status == 200) {
        enqueueSnackbar('Atualização efetuada com sucesso!', { variant: "success" });
      }
    } catch (e) {
      console.log(e);
      return (enqueueSnackbar('Erro, tente novamente mais tarde!', { variant: "error" }))
    }
  }

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />

      <MenuAdmin name="Atualização de Contatos" image={'https://avatars.githubusercontent.com/u/25508594?s=88&u=5b5d48594bf2e0858c8e35ea14ca670bed657b05&v=4'} />

      <main className={classes.content}>

        <div className={classes.appBarSpacer} />

        <Container maxWidth="lg" className={classes.container}>

          <Grid>

            <Grid sm={12}>

              <Paper className={classes.paper}>

                <h2>Atualização de Cadastro</h2>

                <Grid container spacing={3}>

                  <Grid item xs={10} sm={10}>
                    <TextField
                      required
                      id="fullName"
                      name="fullName"
                      label="Nome Completo"
                      value={fullName}
                      variant="outlined"
                      onChange={e => setFullName(e.target.value)}
                      fullWidth
                    />
                  </Grid>

                  <Grid>
                    <img src={profileUrl} style={{ maxHeight: "100px", maxWidth: "100px", marginLeft: "25%" }}></img>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="profileUrl"
                      name="profileUrl"
                      variant="outlined"
                      value={profileUrl}
                      onChange={e => setProfileUrl(e.target.value)}
                      label="Link da imagem do perfil"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      type='number'
                      id="chatId"
                      variant="outlined"
                      name="chatId"
                      value={chatId}
                      onChange={e => setChatId(e.target.value)}
                      label="Número do WhatsApp"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={3} sm={3}>
                    <Button variant="contained" onClick={handleSubmit} className={classes.btnSuccess}>
                      <SaveIcon />  Atualizar
                    </Button>
                  </Grid>

                </Grid>

              </Paper>

            </Grid>

          </Grid>

          <Box pt={4}>
            <Copyright />
          </Box>

        </Container>

      </main>
    </div>
  );
}