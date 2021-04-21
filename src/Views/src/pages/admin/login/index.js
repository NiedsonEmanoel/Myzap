import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Copyright from '../../../components/footer';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { login, setIdUsuario, setNomeUsuario, setProfileLinkUsuario, setTipoUsuario, setMenuPreference, getMenuPreference } from '../../../services/auth'

import api from '../../../services/api';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },

  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },

  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },

  submit: {
    margin: theme.spacing(3, 0, 2),
  },

}));

export default function SignInSide() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    Draw();
    setEmail('');
    setSenha('');
  };

  const classes = useStyles();

  async function Login(event) {
    event.preventDefault();
    try {
      const response = await api.post('/api/login', { email, senha });
      if (response.data.status == 1) {
        login(response.data.token);
        setIdUsuario(response.data.user._id);
        setProfileLinkUsuario(response.data.user.foto_perfil);
        setNomeUsuario(response.data.user.nome_usuario);
        setTipoUsuario(response.data.user.tipo_usuario);
        if(!getMenuPreference()){
          setMenuPreference('true');
        }
        window.location.href = '/admin'
      }
      else {
        setTitle("Acesso não autorizado");
        setMessage("Seu email ou senha estão incorretos.");
        handleClickOpen();
      }
    } catch (e) {
      setTitle("Erro no servidor!");
      setMessage("Ocorreu um erro interno no servidor, tente novamente mais tarde!");
      handleClickOpen();
    }

  }

  function Draw() {
    return (
      <Grid container component="main" className={classes.root}>

        <CssBaseline />

        <Grid item xs={false} sm={4} md={7} className={classes.image} />

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>

            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {message}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {
                  handleClose();
                }} color="primary" autoFocus>
                  Ok
                </Button>
              </DialogActions>
            </Dialog>

            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>

            <Typography component="h1" variant="h5">
              Login
            </Typography>

            <form className={classes.form} id="form" onSubmit={Login} >
              <input style={{ display: "none" }} id="sub" type="submit" />

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="email"
                id="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
              />

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={senha}
                onChange={(e) => { setSenha(e.target.value) }}
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <label htmlFor="sub">
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Login
                </Button>
              </label>


              <Grid container>
                <Grid item xs>

                  <Link href="#" variant="body2">
                    Esqueceu a senha?
                  </Link>

                </Grid>

                <Grid item>

                </Grid>
              </Grid>
            </form>
            <Box mt={5}>
              <Copyright />
            </Box>


          </div>

        </Grid>

      </Grid>
    );
  }

  return Draw();

}