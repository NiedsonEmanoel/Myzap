import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { useParams } from 'react-router-dom';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from '../../../services/api';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
                Niedson Emanoel & Apoastro
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
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

export default function SignIn() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [password, setPass] = useState('');
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        window.location.href = '/admin/login';
    };

    const { tokenUser } = useParams();

    async function Recovery(event) {
        event.preventDefault();
        try {
            const response = await api.post('/api/v1/login/change.recovery', {
                "token": tokenUser,
                "password": password
            });
            setTitle('Sucesso!');
            setMessage('Você será redirecionado a página de login.')
        }catch(e){
            setTitle('Não foi possível recuperar a senha.')
            setMessage('Você será redirecionado a página de login para gerar um novo token.')
        }
        
        setOpen(true);
    }

    return (
        <Container component="main" maxWidth="xs">

            <CssBaseline />

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

            <div className={classes.paper}>

                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>

                <Typography component="h1" variant="h5">
                    Recuperar senha
                </Typography>

                <form className={classes.form} onSubmit={Recovery}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        value={password}
                        onChange={(e) => { setPass(e.target.value) }}
                        name="password"
                        label="Nova senha"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        confirmar
                    </Button>
                </form>
            </div>

            <Box mt={8}>
                <Copyright />
            </Box>

        </Container>
    );
}