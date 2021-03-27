import AudioPlayer from 'material-ui-audio-player';
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

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
        <Card className={props.classe}>
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
    return (
        <Card className={props.classe}>
            <img style={{ height: "100%", width: "100%", }} src={props.src}></img>
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
                {props.author}
            </Typography>

            <CardContent>
                <Typography color="black" variant="body" display="block">
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
            <DocViewer pluginRenderers={DocViewerRenderers} config={{ header: { disableHeader: true, disableFileName: true } }} style={{ height: "100%", width: "100%" }} documents={docs} />
            <Typography style={{ marginLeft: "3%", marginBottom: "3%" }} variant="subtitle2">
                {props.date}
            </Typography>

        </Card>
    );
}