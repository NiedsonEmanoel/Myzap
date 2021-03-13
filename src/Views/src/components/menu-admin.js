import React from 'react';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List'; 
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider'; 
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import logo from '../assets/img/logo-empresa.png';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import { mainListItems, secondaryListItems } from './list-menu-admin';

export default function MenuAdmin() {
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
      }));
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    return (
        <>
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>

                <Toolbar className={classes.toolbar}>

                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Dashboard
                    </Typography>

                    <IconButton color="inherit">

                        <Avatar alt="Cindy Baker" src="data:image/jpeg;base64,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" />

                    </IconButton>

                </Toolbar>

            </AppBar>

            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>

                    <img src={logo} />

                    <IconButton onClick={handleDrawerClose}>

                        <ChevronLeftIcon />

                    </IconButton>

                </div>

                <Divider />

                <List>
                    {mainListItems}
                </List>

                <Divider />

                <List>{secondaryListItems}</List>

            </Drawer>
        </>
    );
}