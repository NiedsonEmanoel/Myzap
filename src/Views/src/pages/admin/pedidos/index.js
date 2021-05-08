import React, { useState, useEffect } from 'react';

import MenuAdmin from '../../../components/menu-admin';
import Copyright from '../../../components/footer';

import api from '../../../services/api'
import io from '../../../services/socket.io'

import {
    Grid,
    makeStyles,
    CssBaseline,
    Box,
    Button,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
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
    container: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    cardGrid: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
}));

export default function Dashboard() {
    const classes = useStyles();
    const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <div className={classes.root}>
            <CssBaseline />

            <MenuAdmin name="Pedidos" />

            <main className={classes.content}>

                <div className={classes.appBarSpacer} />

                <Container maxWidth="lg" className={classes.container}>
                    <main>
                        <Container className={classes.cardGrid} maxWidth="md">

                            <Grid container spacing={4}>

                                {cards.map((card) => (
                                    <Grid item key={card} xs={12} sm={6} md={4}>

                                        <Card className={classes.card}>
                                            <CardMedia
                                                className={classes.cardMedia}
                                                image="https://source.unsplash.com/random"
                                                title="Image title"
                                            />

                                            <CardContent className={classes.cardContent}>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    Heading
                                                </Typography>
                                                <Typography>
                                                    This is a media card. You can use this section to describe the content.
                                                </Typography>
                                            </CardContent>

                                            <CardActions>
                                                <Button size="small" color="primary">
                                                    View
                                                </Button>
                                                <Button size="small" color="primary">
                                                    Edit
                                                </Button>
                                            </CardActions>

                                        </Card>

                                    </Grid>
                                ))}

                            </Grid>

                        </Container>
                    </main>
                    <Box pt={4}>
                        <Copyright />
                    </Box>

                </Container>

            </main>
        </div>
    );
}