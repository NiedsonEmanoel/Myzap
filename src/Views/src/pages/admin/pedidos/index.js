import React, { useState, useEffect } from 'react';

import MenuAdmin from '../../../components/menu-admin';
import Copyright from '../../../components/footer';
import CardPedido from '../../../components/cardsPedidos'

import api from '../../../services/api'
import io from '../../../services/socket.io'

import {
    Add as AddIcon,
} from '@material-ui/icons';

import {
    Grid,
    makeStyles,
    CssBaseline,
    Box,
    Paper,
    Button,
    Container,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    container: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    cardGrid: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    btnSuccess: {
        backgroundColor: "green",
        marginBottom: '15px',
        color: "#fff",
        "&:hover": {
            backgroundColor: "#12b912"
        }
    }
}));

export default function Dashboard() {
    const classes = useStyles();
    const cards = [1, 2, 3];

    return (
        <div className={classes.root}>
            <CssBaseline />

            <MenuAdmin name="Pedidos" />

            <main className={classes.content}>

                <div className={classes.appBarSpacer} />

                <Container maxWidth="lg" className={classes.container}>
                    <main>
                        <Container className={classes.cardGrid} maxWidth="md">
                            <Paper className={classes.paper}>

                                <Grid
                                    container
                                    direction="row"
                                    justify="space-between"
                                    alignItems="flex-start"
                                >
                                    <h2>Pedidos Realizados</h2>

                                    <Button variant="contained" className={classes.btnSuccess} href={'/admin/contatos/cadastrar'}><AddIcon />Novo Pedido</Button>
                                </Grid>

                                <Grid container spacing={4}>

                                    {cards.map((card) => (
                                        <Grid item key={card} xs={12} sm={6} md={4}>

                                            <CardPedido
                                                srcIconClient="https://i.pinimg.com/280x280_RS/00/21/1b/00211b8db6839e80fde16ee7006991eb.jpg"
                                                clientName="Niedson Emanoel"
                                                title="Pizza 4 Queijos"
                                                date={new Date().toLocaleString("pt-BR")}
                                                srcCentralImage="https://material-ui.com/static/images/cards/paella.jpg"
                                                description="Uma pizza de 4 sabores deliciosa e maestria da casa."
                                                Obs="Sem carne"
                                            />
                                        </Grid>
                                    ))}

                                </Grid>
                            </Paper>
                        </Container>
                    </main>
                    <Box pt={4}>
                        <Copyright />
                    </Box>

                </Container>

            </main>
        </div >
    );
}