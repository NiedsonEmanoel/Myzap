import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';

import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import BarChartIcon from '@material-ui/icons/BarChart';
import { getTipoUsuario, getPreferenceColor } from '../services/auth'
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import { Link } from 'react-router-dom'

let colorText = getPreferenceColor() == 'dark' ? 'white' : 'black'

export const mainListItems = (
  <div>
    <Link to='/admin' style={{ textDecorationLine: 'none', color: colorText, color: colorText }}>
      <ListItem component="a">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </Link>

    <Link to='/admin/pedidos' style={{ textDecorationLine: 'none', color: colorText }}>
      <ListItem component="a">
        <ListItemIcon>
          <BusinessCenterIcon />
        </ListItemIcon>
        <ListItemText primary="Pedidos" />
      </ListItem>
    </Link>

    {
      getTipoUsuario() == '3' ?
        <Link to='/admin/contatos' style={{ textDecorationLine: 'none', color: colorText }}>
          <ListItem component="a" >
            <ListItemIcon>
              <EmojiPeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Contatos" />
          </ListItem>
        </Link>
        :
        getTipoUsuario() == '2' ?
          <Link to='/admin/contatos' style={{ textDecorationLine: 'none', color: colorText }}>
            <ListItem component="a" >
              <ListItemIcon>
                <EmojiPeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Contatos" />
            </ListItem>
          </Link>
          :
          <></>
    }

    {getTipoUsuario() == '3' ? <Link to='/admin/funcionarios' style={{ textDecorationLine: 'none', color: colorText }}>
      <ListItem component="a" >
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Funcionários" />
      </ListItem>
    </Link> : <></>}

    <Link to='/admin/whatsapp' style={{ textDecorationLine: 'none', color: colorText }}>
      <ListItem component="a">
        <ListItemIcon>
          <WhatsAppIcon />
        </ListItemIcon>
        <ListItemText primary="WhatsApp" />
      </ListItem>
    </Link>

    {
      getTipoUsuario() == '3' ? <Link to='/admin/sessions' style={{ textDecorationLine: 'none', color: colorText }}>
        <ListItem component="a">
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Sessões" />
        </ListItem>
      </Link> : <></>
    }

  </div>
);

export const secondaryListItems = (
  <>
  </>
);