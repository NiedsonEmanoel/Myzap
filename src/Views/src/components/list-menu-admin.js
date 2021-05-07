import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import BarChartIcon from '@material-ui/icons/BarChart';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import { logout } from '../services/auth';
import { Link } from 'react-router-dom'

export const mainListItems = (
  <div>
    <Link to='/admin' style={{ textDecorationLine: 'none' }}>
      <ListItem component="a">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </Link>

    <Link to='/admin' style={{ textDecorationLine: 'none' }}>
      <ListItem component="a">
        <ListItemIcon>
          <BusinessCenterIcon />
        </ListItemIcon>
        <ListItemText primary="Pedidos" />
      </ListItem>
    </Link>

    <Link to='/admin/usuarios' style={{ textDecorationLine: 'none' }}>
      <ListItem component="a" >
        <ListItemIcon>
          <EmojiPeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Usuários" />
      </ListItem>
    </Link>

    <Link to='/admin/funcionarios' style={{ textDecorationLine: 'none' }}>
      <ListItem component="a" >
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Funcionários" />
      </ListItem>
    </Link>

    <Link to='/admin/whatsapp' style={{ textDecorationLine: 'none' }}>
      <ListItem component="a">
        <ListItemIcon>
          <WhatsAppIcon />
        </ListItemIcon>
        <ListItemText primary="WhatsApp" />
      </ListItem>
    </Link>

    {
      /*
       <Link to='/admin/sessions' style={{ textDecorationLine: 'none' }}>
          <ListItem component="a">
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
          <ListItemText primary="Sessões" />
          </ListItem>
        </Link>
      */
    }

  </div>
);

export const secondaryListItems = (
  <>
  </>
);