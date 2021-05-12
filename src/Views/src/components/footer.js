import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link target='_new_blank' color="inherit" href="https://nmsoft.com.br/">
          Nm Soft
        </Link>{' '}
        {new Date().getFullYear()}
        {''}
      </Typography>
    );
  }

export default Copyright;