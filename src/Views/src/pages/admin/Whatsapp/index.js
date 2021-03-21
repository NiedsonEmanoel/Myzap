import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import MenuAdmin from '../../../components/menu-admin';
import Copyright from '../../../components/footer';
import GridList from '@material-ui/core/GridList';
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from "@material-ui/icons/Send";
import Divider from '@material-ui/core/Divider';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ImageIcon from "@material-ui/icons/Image";
import { format } from '@flasd/whatsapp-formatting';
import AudioPlayer from 'material-ui-audio-player';
import api from '../../../services/api'
import WorkIcon from "@material-ui/icons/Work";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import {
    Paper,
    Typography,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Avatar,
    List,
    ListItem,
    ListItemText,
    IconButton,
    CardMedia
} from "@material-ui/core";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    fila: {
        zIndex: 999,
        position: "relative"
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        alignItems: 'left',
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
    card: {
        display: "flex",
        height: "calc(91.05vh - 100px)",
        width: `calc(110% - ${drawerWidth}px)`,
    },
    rightBorder: {
        borderRight: "solid #d0D0D0 1px"
    },
    content: {
        marginTop: 0
    },
    background: {
        position: "absolute",
        height: 200,
        width: "100%",
        top: 0,
        background: "#7159C1"
    },
    rightContainer: {
        background:
            "url(/wall.png) bottom",
        flex: 1
    },
    heightAdjust: {
        display: "flex",
        maxHeight: '79vh',
        flexDirection: "column"
    },
    paper: {
        background: "#9de1fe",
        padding: 20
    },
    information: {
        color: "#444"
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
    list: {
        width: '100%',
        paddingLeft: 15
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
    warnings: {
        background: "#9de1fe",
        padding: 20
    },
    fixedHeight: {
        height: 240,
    },
    sent: {
        width: "30%",
        marginTop: "5px",
        marginBottom: "5px",
        marginLeft: "70%",
        backgroundColor: "#DCF8C6"
    },
    sentImg: {
        width: "30%",
        marginTop: "5px",
        maxHeight: "500px",
        maxWidth: "500px",
        marginBottom: "5px",
        marginLeft: "70%",
        backgroundColor: "#DCF8C6"
    },
    received: {
        width: "30%",
        marginLeft: "0%",
        backgroundColor: "#ffffff"
    }
}));

export default function WhatsApp() {
    const [text, setText] = useState('');
    const [list, setList] = useState([]);

    useEffect(async () => {
        const response = await api.get('/api/clients/attendance');
        console.clear();
        console.log()
        setList(response.data.Client);
    }, [])

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CssBaseline />

            <MenuAdmin name="WhatsApp" />

            <main className={classes.content}>

                <div className={classes.appBarSpacer} />

                <Container maxWidth="80vh" className={classes.container}>

                    <Grid>

                        <Grid container className={classes.fila}>

                            <Grid item xs={12}>

                                <Card className={classes.card}>

                                    <Grid container>
                                        <Grid item xs={3}>
                                            <CardHeader
                                                className={classes.rightBorder}
                                                avatar={
                                                    <Avatar aria-label="Recipe" className={classes.avatar} src={'data:image/jpeg;base64,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'}></Avatar>
                                                }
                                                title='Niedson'
                                            />

                                            <Paper className={classes.warnings} elevation={0}>
                                                <Typography className={classes.information} variant="subheader">
                                                    Aqui estão listados todos os clientes que solicitaram atendimento.
                                                </Typography>
                                            </Paper>
                                            <GridList style={{
                                                width: '100%',
                                                display: "flex",
                                                height: window.innerHeight,
                                                flexWrap: 'nowrap'
                                            }} cols={1} cellHeight={((window.innerHeight / 4.50) * list.length)}>
                                                <List className={classes.list}>
                                                    {list.map(item => (
                                                        <>
                                                            <ListItem button>
                                                                <Avatar src={item.profileUrl}></Avatar>
                                                                <ListItemText className={classes.list} primary={item.fullName} secondary={item._id} />
                                                            </ListItem>
                                                            <Divider variant="inset" component="li" />
                                                        </>
                                                    ))}
                                                </List>
                                            </GridList>
                                        </Grid>


                                        <Grid className={classes.heightAdjust} item xs={9}>
                                            <CardHeader
                                                avatar={
                                                    <Avatar aria-label="Recipe" className={classes.avatar}>
                                                        <ImageIcon />
                                                    </Avatar>
                                                }
                                                action={
                                                    <IconButton>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                }
                                                title="Niedson"
                                            />

                                            <CardContent className={[classes.rightContainer, classes.content]}>
                                                <Grid>
                                                    <GridList cols={1} style={{ width: "100%", height: "100%" }} cellHeight={'auto'}>

                                                        <CardContent>

                                                            <Card className={classes.sent}>
                                                                <CardContent style={{ marginTop: "2%", marginLeft: "2%" }}>
                                                                    <AudioPlayer
                                                                        download={false}
                                                                        autoplay={false}
                                                                        volume={false}
                                                                        width="100%"
                                                                        variation="default"
                                                                        spacing={3}
                                                                        src={'https://tutorialehtml.com/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3'}
                                                                    />
                                                                </CardContent>
                                                                <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                                                                    <br></br> {new Date().toLocaleString('pt-BR')}
                                                                </Typography>
                                                            </Card>

                                                            <Card className={classes.sent}>
                                                                <CardContent>
                                                                    <Typography color="black" variant="body" display="inline">
                                                                        Em linguística, a noção de texto é ampla e ainda aberta a uma definição mais precisa. Grosso modo, pode ser entendido como manifestação linguística das ideias de um autor, que serão interpretadas pelo leitor de acordo com seus conhecimentos linguísticos e culturais. Seu tamanho é variável.
                                                                    </Typography>
                                                                </CardContent>
                                                                <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                                                                    <br></br> {new Date().toLocaleString('pt-BR')}
                                                                </Typography>
                                                            </Card>

                                                            <Card className={classes.received}>
                                                                <CardContent>

                                                                    <Typography color="black" variant="body" display="inline">
                                                                        Em linguística, a noção de texto é ampla e ainda aberta a uma definição mais precisa. Grosso modo, pode ser entendido como manifestação linguística das ideias de um autor, que serão interpretadas pelo leitor de acordo com seus conhecimentos linguísticos e culturais. Seu tamanho é variável.
                                                                    </Typography>
                                                                </CardContent>
                                                                <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                                                                    <br></br> {new Date().toLocaleString('pt-BR')}
                                                                </Typography>
                                                            </Card>

                                                        </CardContent>

                                                    </GridList>
                                                </Grid>
                                            </CardContent>

                                            <form id='form'>
                                                <Grid container style={{ paddingLeft: "5px", marginTop: '1%' }}>

                                                    <Grid xs={1} align="center">

                                                        <input style={{ display: "none" }} id="icon-button-file" name='file' onInputCapture={e => { alert('Arquivo upado!') }} type="file" />

                                                        <label htmlFor="icon-button-file">
                                                            <Fab color="primary" aria-label="upload picture" component="span">
                                                                <AttachFileIcon />
                                                            </Fab>
                                                        </label>

                                                    </Grid>

                                                    <Grid item xs={10}>
                                                        <input style={{ display: "none" }} id="escriba" name='text' value={text} type="text" />
                                                        <label htmlFor="escriba">
                                                            <TextField
                                                                id="outlined-basic-email"
                                                                variant="outlined"
                                                                onChange={e => setText(e.target.value)}
                                                                label="Digite aqui..."
                                                                fullWidth
                                                            />
                                                        </label>

                                                    </Grid>

                                                    <Grid xs={1} align="center">
                                                        <input style={{ display: "none" }} id="envi" type="button" />
                                                        <label htmlFor="envi">
                                                            <Fab color="primary" aria-label="upload picture" component="span">
                                                                <SendIcon />
                                                            </Fab>
                                                        </label>
                                                    </Grid>

                                                </Grid>
                                            </form>
                                        </Grid>

                                    </Grid>

                                </Card>

                            </Grid>

                        </Grid>

                    </Grid>

                    <Box pt={4}>
                        <Copyright />
                    </Box>

                </Container>

            </main>
        </div >
    );
}