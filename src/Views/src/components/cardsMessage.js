import React from 'react'
import AudioPlayer from 'material-ui-audio-player';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import api from '../services/api'
import { getNomeUsuario } from '../services/auth'
import {
    Typography,
    Card,
    CardContent,
} from "@material-ui/core";

export const AudioMessage = (props) => {
    return (
        <Card className={props.classe}>
            <CardContent style={{ marginTop: "2%", marginLeft: "2%" }}>
                <AudioPlayer
                    download={false}
                    autoplay={false}
                    volume={false}
                    width="100%"
                    variation="default"
                    spacing={3}
                    preload
                    src={props.src}
                />
            </CardContent>
            <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                {props.date}
            </Typography>
        </Card>
    );
}

export const VideoMessage = (props) => {
    let max = props.mobile == 's' ? '80px' : '400px';
    return (
        <Card className={props.classe} style={{ maxHeight: max }}>
            <CardContent style={{}}>
                <video style={{ height: "100%", width: "100%" }} src={props.src} controls="true"></video>
            </CardContent>
            <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                {props.date}
            </Typography>
        </Card>
    );
}

export const ImageMessage = (props) => {
    let max = props.mobile == 's' ? '80px' : '400px';
    return (
        <Card className={props.classe} style={{ maxHeight: max }} onClick={() => { window.open(props.src, '_blank'); }}>
            <img style={{ height: "100%", width: "100%" }} src={props.src}></img>
            <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                {props.date}
            </Typography>
        </Card>
    );
}

export const TextMessage = (props) => {
    return (
        <Card className={props.classe}>

            <Typography variant="button" style={{ marginLeft: "3%", marginTop: "3%" }} color="black" display="inline" gutterBottom>
                {props.author}:
            </Typography>

            <CardContent>
                <Typography color="black" variant="body2" display="block">
                    {props.message}
                </Typography>
            </CardContent>

            <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                {props.date}
            </Typography>

        </Card>
    );
}

export const DocumentMessage = (props) => {
    let docs = [{ uri: props.src }]
    return (
        <Card className={props.classe}>
            <p style={{ marginLeft: "3%", marginBottom: "3%" }}>Documento ({props.name})<br></br></p>
            <Button style={{ marginLeft: "3%", marginBottom: "5%" }} href={props.src} target="new_blank">Abrir</Button>
            <br></br>
            <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                {props.date}
            </Typography>

        </Card>
    );
}

export const PaymentMessage = (props) => {
    const [messHelpers, setMess] = React.useState('none');
    return (
        <Card className={props.classe}>
            <Typography variant="button" style={{ marginLeft: "3%", marginTop: "3%" }} color="black" display="inline" gutterBottom>
                {props.author}
            </Typography>

            <Typography
                onClick={
                    (e) => {
                        if (messHelpers == 'yes') {
                            setMess('none')
                        } else {
                            setMess('yes')
                        }
                    }
                } gutterBottom variant="h5" component="h2" style={{ marginLeft: "5%", marginTop: "2%" }}>
                {props.amount.replace('.', ',')}R$
            </Typography>

            <Typography variant="body2" color="textSecondary" component="p" style={{ marginLeft: '5%', marginBottom: '2%' }}>
                {props.note}
            </Typography>

            <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                {props.date}
            </Typography>
            {
                messHelpers == 'yes' ? <>
                    <hr></hr>
                    <Button onClick={async (e) => {
                        let data = {
                            numbers: props.message.chatId.replace('@c.us', ''),
                            worker: getNomeUsuario(),
                            messages: 'Recebido!'
                        }
                        await api.post('/api/whatsapp/message?id=0', data);
                        setMess('none')
                    }}>
                        Recebido!
                    </Button>

                    <Button onClick={async (e) => {
                        let data = {
                            numbers: props.message.chatId.replace('@c.us', ''),
                            worker: getNomeUsuario(),
                            messages: 'Obrigado!'
                        }
                        await api.post('/api/whatsapp/message?id=0', data);
                        setMess('none')
                    }}>
                        Obrigado!
                    </Button>

                    <Button onClick={async (e) => {
                        let data = {
                            numbers: props.message.chatId.replace('@c.us', ''),
                            worker: getNomeUsuario(),
                            messages: 'Ok!'
                        }
                        await api.post('/api/whatsapp/message?id=0', data);
                        setMess('none')
                    }}>
                        Ok!
                    </Button>

                    <Button onClick={(e) => { setMess('none') }}>
                        <CloseIcon />
                    </Button>
                </>
                    :
                    <></>
            }
        </Card >
    );
}