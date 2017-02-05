/**
 * Created by justincui on 2/5/17.
 */


import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Navigator,
    StatusBar,
    AsyncStorage
} from 'react-native';
import RnFs from 'react-native-fs';
import uuid from 'uuid/v1';
import _ from 'lodash';

import ImageScene from './Components/ImageScene';
import NoteScene from './Components/NoteScene';
import HomeScene from './Components/HomeScene';
import CameraScene from './Components/CameraScene';
import NoteLocationScene from './Components/NoteLocationScene';
import SimpleButton from './Components/SimpleButton';

const NoteStorageKey = "@ReactNotes:notes";

export default class App extends Component {
    constructor(props) {
        super(props);

        this.renderScene = this.renderScene.bind(this);
        this.updateNote = this.updateNote.bind(this);
        this.deleteNote = this.deleteNote.bind(this);

        StatusBar.setBarStyle('light-content');

        this.state = {
            notes: {}
        };
        this.loadNotes();
        this.trackLocation();
    }

    async saveNotes(notes) {
        try {
            await AsyncStorage.setItem(NoteStorageKey, JSON.stringify(notes));
        }
        catch (error) {
            console.log("AsyncStorage error: ", error.message);
        }
    }

    async loadNotes() {
        try {
            var notes = await AsyncStorage.getItem(NoteStorageKey);
            if (notes !== null) {
                this.setState({notes: JSON.parse(notes)});
            }
        }
        catch (error) {
            console.log("AsyncStorage error: ", error.message);
        }
    }

    deleteNoteImage(note) {
        if(_.isString(note.imagePath) && RnFs.exists(note.imagePath)){
            RnFs.unlink(note.imagePath);
        }
        note.imagePath = null;
        this.updateNote(note);
    }

    updateNote(note) {
        let newNotes = Object.assign({}, this.state.notes);
        if (!note.isSaved) {
            note.location = this.state.lastPosition;
        }
        note.isSaved = true;
        newNotes[note.id] = note;
        this.setState({notes: newNotes});
        this.saveNotes(newNotes);
    }

    deleteNote(note) {
        let newNotes = Object.assign({}, this.state.notes);
        if(_.isString(note.imagePath) && RnFs.exists(note.imagePath)){
            RnFs.unlink(note.imagePath);
        }
        delete newNotes[note.id];
        this.setState({notes: newNotes});
        this.saveNotes(newNotes);
    }

    trackLocation() {
        navigator.geolocation.getCurrentPosition(
            (lastPosition) => {
                this.setState({lastPosition});
                //console.log("init_pos=",JSON.stringify(initialPosition));
            },
            (error) => alert(error.message)
        );
        this.watchID = navigator.geolocation.watchPosition(
            (lastPosition) => {
                this.setState({lastPosition});
                //console.log("last_pos=",JSON.stringify(lastPosition));
            }
        );
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    saveNoteImage(imagePath, note) {
        if(_.isString(note.imagePath) && RnFs.exists(note.imagePath)){
            RnFs.unlink(note.imagePath);
        }
        note.imagePath = imagePath;
        this.updateNote(note);
    }

    renderScene(route, navigator) {
        switch (route.name) {
            case 'home':
                return (
                    <HomeScene
                        navigator={navigator}
                        notes={this.state.notes}
                        onSelectNote={(note) => navigator.push({
                            name: "createNote",
                            note: note
                        })}
                        onCreateNote={() => navigator.push({
                            name: 'createNote',
                            note: {
                                id: uuid(),
                                title: '',
                                body: '',
                                isSaved: false
                            }
                        })}
                    />
                );
            case 'createNote':
                return (
                    <NoteScene
                        note={route.note}
                        onChangeNote={
                            (note) => this.updateNote(note)
                        }
                        navigator={navigator}
                        showCameraButton={true}
                    />
                );
            case 'noteLocations':
                return (
                    <NoteLocationScene
                        notes={this.state.notes}
                        onSelectNote={
                            (note) => navigator.push({
                                name: 'createNote',
                                note: note
                            })
                        }
                        initialPosition={this.state.lastPosition.coords}
                    />
                );
            case 'camera':
                return <CameraScene
                    onPicture={(imagePath) => {
                        this.saveNoteImage(imagePath, route.note);
                    }}
                />;
            case 'noteImage':
                return <ImageScene note={route.note}/>;
        }
    }

    render() {
        var navigator =
            <Navigator
                initialRoute={{name: 'home'}}
                renderScene={this.renderScene}
                navigationBar={
                    <Navigator.NavigationBar
                        routeMapper={NavigationBarRouteMapper}
                        style={styles.navBar}
                    />
                }
                onDeleteNote={
                    (note) => this.deleteNote(note)
                }
                onDeleteNoteImage={
                    (note) => this.deleteNoteImage(note)
                }
            />;
        return navigator;
    }
};

const NavigationBarRouteMapper = {
    LeftButton: (route, navigator, index, navState) => {
        switch (route.name) {
            case 'home':
                return (
                    <SimpleButton
                        onPress={() => navigator.push({name: 'noteLocations'})}
                        customText="Map"
                        style={styles.navBarLeftButton}
                        textStyle={styles.navBarButtonText}
                    />
                );
            case 'createNote':
            case 'noteLocations':
            case 'camera':
            case 'noteImage':
                return (
                    <SimpleButton
                        onPress={() => navigator.pop()}
                        customText="Back"
                        style={styles.navBarLeftButton}
                        textStyle={styles.navBarButtonText}
                    />
                );
            default:
                return null;
        }
    },
    RightButton: (route, navigator, index, navState) => {
        switch (route.name) {
            case 'home':
                return (<SimpleButton
                    onPress={() => navigator.push({
                        name: 'createNote',
                        note: {
                            id: uuid(),
                            title: '',
                            body: '',
                            isSaved: false
                        }
                    })}
                    customText="Create Note"
                    style={styles.navBarRightButton}
                    textStyle={styles.navBarButtonText}
                />);
            case 'createNote':
                if (route.note.isSaved) {
                    return (
                        <SimpleButton
                            onPress={
                                () => {
                                    navigator.props.onDeleteNote(route.note);
                                    navigator.pop();
                                }
                            }
                            customText="Delete"
                            style={styles.navBarRightButton}
                            textStyle={styles.navBarButtonText}
                        />
                    );
                }
                else {
                    return null;
                }
            case 'noteImage':
                return (
                    <SimpleButton
                        onPress={
                            ()=>{
                                navigator.props.onDeleteNoteImage(route.note);
                                navigator.pop();
                            }
                        }
                        customText="Delete"
                        style={styles.navBarRightButton}
                        textStyle={styles.navBarButtonText}
                    />
                );
            default:
                return null;
        }
        return (<Text>Right</Text>);
    },
    Title: (route, navigator, index, navState) => {
        switch (route.name) {
            case 'home':
                return (<Text style={styles.navBarTitleText}> React Notes </Text>);
            case 'createNote':
                return (<Text style={styles.navBarTitleText}> Create Note </Text>);
            case 'noteLocations':
                return (<Text style={styles.navBarTitleText}> Note Locations </Text>)
            case 'camera':
                return <Text style={styles.navBarTitleText}> Take Picture </Text>
            case 'noteImage':
                return <Text style={styles.navBarTitleText}> {`Image ${route.note.title}`} </Text>
        }
    },
};

const styles = StyleSheet.create({
    navContainer: {
        flex: 1
    },
    navBar: {
        backgroundColor: '#5B29C1',
        borderBottomColor: '#48209A',
        borderBottomWidth: 1
    },
    navBarTitleText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        marginVertical: 9 //IOS
    },
    navBarLeftButton: {
        paddingLeft: 10
    },
    navBarRightButton: {
        paddingRight: 10
    },
    navBarButtonText: {
        color: '#EEE',
        fontSize: 16,
        marginVertical: 10 //IOS
    }
});
