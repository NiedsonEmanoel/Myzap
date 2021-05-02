import React, { useEffect, useState } from 'react';
import api from './api';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import io from './socket.io'
import { logout, getToken, getNotifPreference } from './auth';
import { useSnackbar } from 'notistack';
import { Route, Redirect } from 'react-router-dom';

export default function WAuth({ component: Component, ...rest }) {
    const [redirect, setRedirect] = useState(false);
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const audioNotify = new Audio('/notify.mp3');

    useEffect(() => {
        io.on('newNotification', (notification) => {
            enqueueSnackbar(notification.message, {
                variant: notification.type,
                title: notification.title,
                autoHideDuration: notification.timeOut,
                onClick: notification.callback
            });
            if (getNotifPreference() == 'true') {
                audioNotify.play();
            }
        });


        (async () => {
            let res = await api.get('/api/login/checktoken/' + getToken());
            if (res.data.status == 200) {
                setLoading(false);
                setRedirect(false);
            } else {
                logout();
                setLoading(false);
                setRedirect(true);
            }
        })()
    }, []);

    return (
        loading ? <Backdrop open={true}><CircularProgress color="inherit" /></Backdrop>
            :
            <Route {...rest} render={props => !redirect ?

                (
                    <>
                        <Component {...props} />
                    </>
                )

                :

                <Redirect to={{ pathname: "/admin/login", state: { from: props.location } }}></Redirect>}>

            </Route>
    );

}
