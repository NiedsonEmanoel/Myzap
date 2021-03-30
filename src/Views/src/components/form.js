import React, { useState } from 'react';
import SendIcon from "@material-ui/icons/Send";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import Grid from '@material-ui/core/Grid';
import api from '../services/api'

const Forme = (props) => {
    const [text, setText] = useState('');

    return (
        <>

            <form id='form' onSubmit={async (event) => {

                event.preventDefault();

                if (props.number.chatId) {
                    if (text) {
                        let data = {
                            numbers: props.number.chatId.replace('@c.us', ''),
                            worker: props.worker,
                            messages: text
                        }

                        await api.post('/api/whatsapp/message?id=0', data);
                        setText('');
                    }
                }
            }}>
                <Grid container style={{ paddingLeft: "5px", marginTop: '1%' }}>

                    {props.number.firstAttendace ? <Grid item xs={10}>
                        <TextField
                            id="outlined-basic-email"
                            variant="outlined"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            label="Digite aqui..."
                            fullWidth
                            disabled
                        />
                    </Grid> : <Grid item xs={10}>
                        <TextField
                            id="outlined-basic-email"
                            variant="outlined"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            label="Digite aqui..."
                            fullWidth
                        />
                    </Grid>}

                    <Grid xs={1} align="center">
                        <input style={{ display: "none" }} id="envi" type="submit" />
                        <label htmlFor="envi">
                            <Fab color="primary" aria-label="upload picture" component="span">
                                <SendIcon />
                            </Fab>
                        </label>
                    </Grid>

                </Grid>
            </form>
        </>

    );
}

export default Forme;