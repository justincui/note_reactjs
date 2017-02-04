/**
 * Created by justincui on 1/29/17.
 */
import Camera from 'react-native-camera';
import SimpleButton from './SimpleButton';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default class CameraScene extends Component {
    _takePicture() {
        //console.log("Capture taken:", this.refs.cam);
        this.refs.cam.capture()
            .then((data) => {
                //console.log(data);
                this.props.onPicture(data.path);
            })
            .catch(err => console.error(err));
    }

    render() {
        return (
            <Camera
                captureTarget={Camera.constants.CaptureTarget.disk}
                ref="cam"
                style={styles.container}
            >
                <View style={styles.cameraButtonContainer}>
                    <SimpleButton
                        onPress={this._takePicture.bind(this)}
                        customText="Capture"
                        style={styles.cameraButton}
                        textStyle={styles.cameraButtonText}
                    />
                </View>
            </Camera>
        );
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 64
    },
    cameraButtonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20
    },
    cameraButton: {
        backgroundColor: '#5B29C1',
        borderRadius: 4,
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    cameraButtonText: {
        color: 'white',
        textAlign: 'center'
    }
});