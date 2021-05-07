import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import Card from '../../../components/cards'
import Container from '@material-ui/core/Container';
import {getIdUsuario, getTipoUsuario, setTipoUsuario} from '../../../services/auth';
import MenuAdmin from '../../../components/menu-admin';
import Copyright from '../../../components/footer';
import api from '../../../services/api'
import io from '../../../services/socket.io'
import { Grid, Paper, TextField, MenuItem, Button } from '@material-ui/core';

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
  burron: {
    height: "55px"
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
}));

export default function Dashboard() {
  const classes = useStyles();
  const [usersInAttendance, setUsersInAttendance] = useState([]);
  const [usersInFirstAttendance, setUsersInFirstAttendance] = useState([]);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  async function getUsers() {
    const response = await (await api.get('/api/clients/attendance')).data.Client;
    let first = [];
    for (let key in response) {
      if (response[key].firstAttendace == true) {
        first.push(response[key]);
      }
    }
    setUsersInFirstAttendance(first);
    setUsersInAttendance(response);
  }

  useEffect(()=>{
    async function s(){
      let res = await (await api.get('/api/workers/details/'+getIdUsuario())).data.Worker[0].tipo_usuario;
      setTipoUsuario(`${res}`);
      if((getTipoUsuario() != '3')&&(getTipoUsuario()!= '2')){
        window.location.href='/admin/whatsapp'
      }
    }
    s();
  }, [])

  useEffect(() => {
    io.on('userChanged', (e) => {
      getUsers();
    });
  })

  useEffect(() => {
    getUsers();
  }, [])

  return (
    <div className={classes.root}>
      <CssBaseline />

      <MenuAdmin name="Dashboard" />

      <main className={classes.content}>

        <div className={classes.appBarSpacer} />

        <Container maxWidth="lg" className={classes.container}>

          <Grid>

            <Grid>

              <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
              >
                <Card
                  className={fixedHeightPaper}
                  title={'Em atendimento'}
                  value={`${usersInAttendance.length}`}
                  date={`${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`}
                />

                <Card
                  className={fixedHeightPaper}
                  title={"Sem designação"}
                  value={`${usersInFirstAttendance.length}`}
                  date={`${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`}
                />

                <Card
                  className={fixedHeightPaper}
                  title={"Com designação"}
                  value={`${usersInAttendance.length - usersInFirstAttendance.length}`}
                  date={`${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`}
                />


              </Grid>

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