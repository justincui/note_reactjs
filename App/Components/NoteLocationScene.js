/**
 * Created by justincui on 1/18/17.
 */
import React, {Component} from 'react';
import {StyleSheet, MapView} from 'react-native';
import _ from 'lodash';

export default class NoteLocationScene extends Component{
    render(){
        var locations = _.values(this.props.notes).map(
            (note)=> {
                return {
                    latitude: note.location.coords.latitude,
                    longitude: note.location.coords.longitude,
                    title: note.title,
                    hasLeftCallout: true,
                    onLeftCalloutPress: this.props.onSelectNote.bind(this, note),
                };
            }
        );
        return (
            <MapView
                annotations={locations}
                showsUserLocation={true}
                style={styles.map}
            />
        );
    }
}

const styles = StyleSheet.create({
    map:{
        flex:1,
        marginTop: 64
    }
});