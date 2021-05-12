import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import MenuAdmin from '../../../components/menu-admin';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import SaveIcon from '@material-ui/icons/Save';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { getIdUsuario, getTipoUsuario, setTipoUsuario } from '../../../services/auth';
import Copyright from '../../../components/footer';
import { Grid } from '@material-ui/core';
import api from '../../../services/api';
import { useSnackbar } from 'notistack';
import io from '../../../services/socket.io'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: { display: 'flex', },
    title: { flexGrow: 1, },
    appBarSpacer: theme.mixins.toolbar,
    content: { flexGrow: 1, height: '100vh', overflow: 'auto', },
    container: { paddingTop: theme.spacing(2), paddingBottom: theme.spacing(4), },
    paper: { padding: 35, display: 'flex', overflow: 'auto', flexDirection: 'column', },
    formControl: { width: '100%' },
    btnSuccess: { backgroundColor: "green", color: "#fff", "&:hover": { backgroundColor: "#12b912" } }
}));

export default function Dashboard() {

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [tipo, setTipo] = useState('');
    const [foto, setFoto] = useState('');

    const { idFuncionario } = useParams();

    useEffect(() => {
        async function S() {
            let response = await api.get('/api/workers/details/' + idFuncionario);
            let client = response.data.Worker[0];
            console.log(client)
            setNome(client.nome_usuario);
            setEmail(client.email_usuario);
            setSenha(client.senha_usuario);
            setTipo(client.tipo_usuario);
            setFoto(client.foto_perfil)
        }
        S();

    }, []);

    useEffect(() => {
        async function s() {
            let res = await (await api.get('/api/workers/details/' + getIdUsuario())).data.Worker[0].tipo_usuario;
            setTipoUsuario(`${res}`);
            if ((getTipoUsuario() != '3')) {
                window.location.href = '/admin'
            }
        }
        s();
    }, [])

    async function handleSubmit() {

        if ((!nome) || (!email) || (!senha) || (!tipo)) {
            return (enqueueSnackbar('Prencha todos os campos!', { variant: "warning" }));
        }

        let data = {
            nome_usuario: nome,
            email_usuario: email,
            tipo_usuario: tipo,
            senha_usuario: senha,
            foto_perfil: foto
        }

        await api.put('/api/workers/' + idFuncionario, data, { timeout: 3000 }).then(() => {
            enqueueSnackbar('Atualização efetuada com sucesso!', { variant: "success" });
        }).catch(() => {
            return (enqueueSnackbar('Erro, tente novamente mais tarde!', { variant: "error" }))
        })

    }

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CssBaseline />

            <MenuAdmin name="Atualização de Funcionários" />

            <main className={classes.content}>

                <div className={classes.appBarSpacer} />

                <Container maxWidth="lg" className={classes.container}>

                    <Grid>

                        <Grid sm={12}>

                            <Paper className={classes.paper}>
                                <h2>Atualização de Funcionários</h2>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={10}>
                                        <TextField
                                            required
                                            id="nome"
                                            name="nome"
                                            variant="outlined"
                                            label="Nome completo"
                                            fullWidth
                                            autoComplete="nome"
                                            value={nome}
                                            onChange={e => setNome(e.target.value)}
                                        />
                                    </Grid>
                                    <img src={foto} style={{ maxHeight: "100px", marginLeft: "4%", maxWidth: "100px", height: "100px", width: "100px" }}></img>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id="email"
                                            name="email"
                                            label="Email"
                                            variant="outlined"
                                            fullWidth
                                            autoComplete="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="labelTipo">Tipo</InputLabel>
                                            <Select
                                                labelId="labelTipo"
                                                id="tipo"
                                                variant="outlined"
                                                value={tipo}
                                                onChange={e => setTipo(e.target.value)}
                                            >
                                                <MenuItem value={3}>Administrador</MenuItem>
                                                <MenuItem value={2}>Gerente</MenuItem>
                                                <MenuItem value={1}>Funcionário</MenuItem>

                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            type="password"
                                            required
                                            id="senha"
                                            variant="outlined"
                                            name="senha"
                                            label="Senha"
                                            fullWidth
                                            autoComplete="senha"
                                            value={senha}
                                            onChange={e => setSenha(e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            required
                                            id="foto"
                                            name="foto"
                                            label="Foto de perfil"
                                            fullWidth
                                            variant="outlined"

                                            autoComplete="foto"
                                            value={foto}
                                            onChange={e => setFoto(e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={12}>
                                        <Button variant="contained" onClick={handleSubmit} className={classes.btnSuccess}>
                                            <SaveIcon />  Salvar
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