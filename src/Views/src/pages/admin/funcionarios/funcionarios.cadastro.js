import React, { useState } from 'react';
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
import Button from '@material-ui/core/Button';
import Copyright from '../../../components/footer';
import { Grid } from '@material-ui/core';
import api from '../../../services/api';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: { display: 'flex', },
    title: { flexGrow: 1, },
    appBarSpacer: theme.mixins.toolbar,
    content: { flexGrow: 1, height: '100vh', overflow: 'auto', },
    container: { paddingTop: theme.spacing(2), paddingBottom: theme.spacing(4), },
    paper: { padding: 35, display: 'flex', overflow: 'auto', flexDirection: 'column', },
    formControl: { width: '100%'},
    btnSuccess: { backgroundColor: "green", color: "#fff", "&:hover": { backgroundColor: "#12b912" } }
}));

export default function Dashboard() {

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [tipo, setTipo] = useState('');
    const [foto, setFoto] = useState('');

    async function handleSubmit() {

        if ((!nome) || (!email) || (!senha) || (!tipo)) {
            return (alert('Preencha todos os campos!'));
        }

        try {
            const data = {
                nome_usuario: nome,
                email_usuario: email,
                senha_usuario: senha,
                tipo_usuario: tipo,
                foto_perfil: foto
            }
console.log(data)
            const response = await api.post('/api/workers', data);
            console.log(response);

            if (response.status == 200) {
                return (alert('Cadastro efetuado!'));
            }
        } catch (e) {
            if (e == 'Error: Request failed with status code 400') {
                alert('O cadastro já existe!')
            } else {
                alert(e)
                alert('Erro, tente novamente mais tarde!');
            }
        }
    }

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CssBaseline />

            <MenuAdmin name="Cadastro de Funcionários" image={'https://avatars.githubusercontent.com/u/25508594?s=88&u=5b5d48594bf2e0858c8e35ea14ca670bed657b05&v=4'} />

            <main className={classes.content}>

                <div className={classes.appBarSpacer} />

                <Container maxWidth="lg" className={classes.container}>

                    <Grid>

                        <Grid sm={12}>

                            <Paper className={classes.paper}>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={12}>
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
                                                <MenuItem value={1}>Administrador</MenuItem>
                                                <MenuItem value={2}>Gerente</MenuItem>
                                                <MenuItem value={3}>Funcionário</MenuItem>

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