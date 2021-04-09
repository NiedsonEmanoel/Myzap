import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import MenuAdmin from '../../../components/menu-admin';
import Copyright from '../../../components/footer';
import api from '../../../services/api'
import CloseIcon from '@material-ui/icons/Close';
import BeenhereIcon from '@material-ui/icons/Beenhere';
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
  const [sessions, setSessions] = useState([]);
  const [started, setStarted] = useState(true);
  const [id, setId] = useState('0');

  const handleChange = (event) => {

    setId(event.target.value);
  }

  useEffect(() => {

    async function getSessions() {
      const response = await api.get('/api/whatsapp/sessions');
      setSessions(response.data.sessions);
    }

    getSessions();
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

              <Paper style={{ height: '269px', width: '269px' }} elevation={3}>
                <iframe style={{ height: '269px', width: '269px' }} src={`/api/whatsapp/qrcode?id=${id}`}></iframe>
              </Paper>

              <TextField
                id="standard-select-currency"
                select
                value={id}
                variant="filled"
                onChange={handleChange}
                helperText="Por favor selecione o ID da sessão."
              >
                {sessions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <Button className={classes.burron} onClick={async () => { }}>
                {started ? <BeenhereIcon className={classes.burron}/> : <CloseIcon className={classes.burron}/>}
              </Button>

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