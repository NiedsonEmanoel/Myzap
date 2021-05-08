import React from 'react'
import AudioPlayer from 'material-ui-audio-player';
import Button from '@material-ui/core/Button';

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
    return (
        <Card className={props.classe} style={{maxHeight: "400px"}}>
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
    let max = props.mobile == 's' ? '150px':'400px';
    return (
        <Card className={props.classe} style={{maxHeight: max}} onClick={()=>{window.open(props.src, '_blank');}}>
            <img style={{ height: "100%", width: "100%"}} src={props.src}></img>
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