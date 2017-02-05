/**
 * Created by justincui on 1/14/17.
 */
import RnFs from 'react-native-fs';
import _ from 'lodash';

import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import SimpleButton from './SimpleButton';

export default class NoteScene extends Component {
    constructor(props) {
        super(props);

        this.state = {
            note: this.props.note || {},
        };

        if (_.isObject(this.props.note) && _.isString(this.state.note.imagePath)) {
            RnFs.exists(this.state.note.imagePath).then(
                (file_existing) => {
                    if (!file_existing) {
                        this._cleanInvalidImage();
                    }
                }
            );
        }
    }

    _cleanInvalidImage() {
        let note = Object.assign(this.state.note, {imagePath: null});
        this.props.onChangeNote(note);
        this.setState(note);
    }

    _updateTitle(title) {
        let note = Object.assign(this.state.note, {title});
        this.props.onChangeNote(note);
        this.setState(note);
    }

    _updateBody(body) {
        let note = Object.assign(this.state.note, {body});
        this.props.onChangeNote(note);
        this.setState(note);
    }

    blurInputs() {
        this.refs.body.blur();
        this.refs.title.blur();
    }

    render() {
        let pictureButton = null;
        if (this.props.showCameraButton) {
            pictureButton = _.isString(this.state.note.imagePath) ?
                (
                    <SimpleButton
                        onPress={() => {
                            this.blurInputs();
                            this.props.navigator.push({
                                name: 'noteImage',
                                note: this.state.note
                            });
                        }}
                        customText="View Picture"
                        style={styles.takePictureButton}
                        textStyle={styles.takePictureButtonText}
                    />
                ) : (
                    <SimpleButton
                        onPress={() => {
                            this.blurInputs();
                            this.props.navigator.push({
                                name: 'camera',
                                note: this.state.note
                            });
                        }}
                        customText="Take Picture"
                        style={styles.takePictureButton}
                        textStyle={styles.takePictureButtonText}
                    />
                );
        }
        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Untitled"
                        style={[styles.title, styles.textInput]}
                        autoFocus={true}
                        autoCapitalize="sentences"
                        ref="title"
                        onEndEditing={(text) => this.refs.body.focus()}
                        value={this.state.note.title}
                        onChangeText={(title) => this._updateTitle(title)}
                    />
                    {pictureButton}
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        multiline={true}
                        placeholder="Start typing"
                        style={[styles.body, styles.textInput]}
                        ref="body"
                        value={this.state.note.body}
                        onChangeText={(body) => this._updateBody(body)}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightblue',
        marginTop: 64,
        padding: 20
    },
    inputContainer: {
        borderBottomColor: '#9E7CE3',
        borderBottomWidth: 1,
        flexDirection: 'row',
        marginBottom: 10
    },
    title: {
        height: 40
    },
    body: {
        height: 250
    },
    textInput: {
        flex: 1,
        fontSize: 16
    },
    takePictureButton: {
        backgroundColor: '#5B29C1',
        borderColor: '#48209A',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        shadowColor: 'darkgrey',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 0.8,
        shadowRadius: 1
    },
    takePictureButtonText: {
        color: 'white'
    }
});