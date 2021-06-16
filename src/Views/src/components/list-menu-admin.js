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
import { getTipoUsuario } from '../services/auth'
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import { useHistory, Link } from 'react-router-dom'

export const MainListItems = () => {
  let history = useHistory()

  const ListButton = (props) => {
    return (
      <div>
        <ListItem component="a" button={true} onClick={(e) => { history.push(props.link) }}>
          <ListItemIcon>
            {props.icon}
          </ListItemIcon>
          <ListItemText primary={props.name} />
        </ListItem>
      </div>
    );
  }

  return (
    <div>
      {getTipoUsuario() == '3' ?
      <ListButton link="/admin" name="Dashboard" icon={<DashboardIcon />} />
      :
        getTipoUsuario() == '2' ?
        <ListButton link="/admin" name="Dashboard" icon={<DashboardIcon />} />
        :
          <></>
      }
     {/* <ListButton link="/admin/pedidos" name="Pedidos" icon={<BusinessCenterIcon />} />*/}

      {getTipoUsuario() == '3' ?
        <ListButton link="/admin/contatos" name="Contatos" icon={<EmojiPeopleIcon />} />
        :
        getTipoUsuario() == '2' ?
          <ListButton link="/admin/contatos" name="Contatos" icon={<EmojiPeopleIcon />} />
          :
          <></>
      }

      {
        getTipoUsuario() == '3' ?
          <ListButton link="/admin/funcionarios" name="Funcionários" icon={<PeopleIcon />} />
          :
          <></>
      }

      <ListButton link="/admin/whatsapp" name="WhatsApp" icon={<WhatsAppIcon />} />

      {
        getTipoUsuario() == '3' ?
          <ListButton link="/admin/sessions" name="Sessões" icon={<BarChartIcon />} />
          :
          <></>
      }

    </div>
  );
}

export const secondaryListItems = (
  <>
  </>
);