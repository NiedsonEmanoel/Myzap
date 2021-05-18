import React from 'react';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import logo from '../assets/img/logo-empresa.png';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

import Brightness7Icon from '@material-ui/icons/Brightness7'; // quando ta no dark
import Brightness4Icon from '@material-ui/icons/Brightness4';

import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';

import { logout } from '../services/auth'
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {
  getProfileLinkUsuario,
  getPreferenceColor,
  setPreferenceColor,
  setMenuPreference,
  getMenuPreference,
  getNotifPreference,
  setNotifPreference
} from '../services/auth';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import { MainListItems } from './list-menu-admin';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export default function MenuAdmin(props) {
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
  const [open, setOpen] = React.useState(getMenuPreference() == 'true');
  const [dopen, setDOpen] = React.useState(false);
  const [notif, setNotif] = React.useState(getNotifPreference() == 'true');

  const handleNotif = () => {
    if (notif == true) {
      setNotifPreference('false')
      setNotif(false)
    } else {
      setNotifPreference('true')
      setNotif(true)
    }
  }

  const handleDrawerOpen = () => {
    setMenuPreference('true');
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setMenuPreference('false');
    setOpen(false);
  };

  const handleClickOpen = () => {
    setDOpen(true);
  };

  const handleClose = () => {
    setDOpen(false);
  };

  const handleColor = () => {
    if (getPreferenceColor() == 'dark') {
      setPreferenceColor('light');
    } else {
      setPreferenceColor('dark');
    }
    window.location.reload();
  }

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
            {props.name}
          </Typography>

          <IconButton color="inherit" onClick={handleNotif}>
            {notif ? <NotificationsActiveIcon /> : <NotificationsOffIcon />}
          </IconButton>

          <IconButton color="inherit" onClick={handleColor}>
            {getPreferenceColor() == 'light' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <IconButton color="inherit">

            <Avatar src={getProfileLinkUsuario()} />

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
          <MainListItems/>
        </List>

        <Divider />

        <List>
          <>
            <Dialog open={dopen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
              <DialogTitle id="alert-dialog-title">{"Deseja sair?"}</DialogTitle>

              <DialogContent>

                <DialogContentText id="alert-dialog-description">
                  Você será redirecionado para a página de Login.
                </DialogContentText>

              </DialogContent>

              <DialogActions>

                <Button onClick={handleClose} color="primary">
                  Cancelar
                </Button>

                <Button onClick={() => {
                  logout();
                }} color="primary" autoFocus>
                  Sair
                </Button>

              </DialogActions>

            </Dialog>

            <div>
              <ListSubheader inset>Opções rápidas</ListSubheader>

              <ListItem button={true} onClick={handleClickOpen}>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Sair" />
              </ListItem>

            </div>
          </>
        </List>
      </Drawer>
    </>
  );
}