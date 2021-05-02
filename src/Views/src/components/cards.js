import React from 'react';

import { Paper, Typography } from '@material-ui/core'

const card = (props) => {
    return (
        <Paper className={props.className} style={{
            display: "flex",
            flexDirection: "collum",
            justifyContent: "center",
            overflow: "hidden",
            margin: '1% 1% 1% 1%',
            alignItems: "center"
        }}>

            <Typography component="h2" variant="h6" color="primary" gutterBottom style={{ paddingBottom: "6%", marginTop: 0 }}>
                {props.title}
            </Typography>

            <Typography component="p" variant="h3" >
                {props.value}
            </Typography>

            <div style={{
                marginBottom: 0,
                paddingTop: "10.5%",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center"
            }}>
                <Typography color="textSecondary" >
                    {props.date}
                </Typography>
            </div>

        </Paper>
    );
}

export default card;