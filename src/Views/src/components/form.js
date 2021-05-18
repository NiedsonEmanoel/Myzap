import React, { useState } from 'react';
import SendIcon from "@material-ui/icons/Send";
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import Grid from '@material-ui/core/Grid';
import api from '../services/api'
import Popover from '@material-ui/core/Popover';

const Forme = (props) => {
    const [text, setText] = useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);
    let spacing = props.mobile == 's' ? '5%':'0%';
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const onEmojiClick = (event, emojiObject) => {
        setText(text + '' + emojiObject.emoji);
    };

    return (
        <>

            <form id='form' onSubmit={async (event) => {

                event.preventDefault();

                if (props.number.chatId) {
                    if (text) {
                        let message = `${text} `;
                        let data = {
                            numbers: props.number.chatId.replace('@c.us', ''),
                            worker: props.worker,
                            messages: message
                        }

                        setText('');
                        await api.post('/api/whatsapp/message?id=0', data);
                    }
                }
            }}>

                <Grid container style={{ marginTop: '1%' }}>
                    {
                        props.mobile == 's' ? <></> : <Grid item xs={1} align="center">
                            <Fab color="primary" component="span" onClick={handleClick} >
                                <EmojiEmotionsIcon color='inherit' />
                            </Fab>
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                            >
                                <Picker
                                    onEmojiClick={onEmojiClick}
                                    disableAutoFocus={true}
                                    preload={true}
                                    disableSearchBar={true}
                                    skinTone={SKIN_TONE_MEDIUM_DARK}
                                    native={false}
                                    groupNames={{
                                        smileys_people: 'SORRISOS E PESSOAS',
                                        animals_nature: 'ANIMAIS E NATUREZA',
                                        food_drink: 'COMIDAS E BEBIDAS',
                                        travel_places: 'VIAGEM E LUGARES',
                                        activities: 'ATIVIDADES',
                                        objects: 'OBJETOS',
                                        symbols: 'SÍMBOLOS',
                                        flags: 'BANDEIRAS',
                                        recently_used: 'MAIS USADOS'
                                    }}
                                    groupVisibility={{
                                        flags: false
                                    }}
                                />
                            </Popover>
                        </Grid>
                    }


                    {props.number.firstAttendace ? <Grid item xs={props.mobile == 's' ? 9:10} align="center">
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
                        <input style={{ display: "none", marginLeft: spacing }} id="envi" type="submit" />
                        <label htmlFor="envi">
                            <Fab color="primary" aria-label="upload picture" component="span" >
                                <SendIcon color='inherit'/>
                            </Fab>
                        </label>
                    </Grid>

                </Grid>
            </form>
        </>

    );
}

export default Forme;