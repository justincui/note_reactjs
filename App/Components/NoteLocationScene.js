/**
 * Created by justincui on 1/18/17.
 */
import React, {Component} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import MapView from 'react-native-maps';
import _ from 'lodash';

export default class NoteLocationScene extends Component {
    render() {
        let markers = _.values(this.props.notes).map(
            (note) => ({
                key: note.id,
                coordinate: {
                    latitude: note.location.coords.latitude,
                    longitude: note.location.coords.longitude
                },
                title: note.title,
                description: note.body,
            })
        );
        const {width, height} = Dimensions.get('window');

        const ASPECT_RATIO = width / (height - styles.map.marginTop);
        const LATITUDE_DELTA = 0.0922;
        const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
        const SPACE = 0.01;

        return (
            <MapView
                //provoider="google"
                initialRegion={{
                    latitude: this.props.initialPosition.latitude,
                    longitude: this.props.initialPosition.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                style={styles.map}
            >
                {markers.map(m =>
                    <MapView.Marker
                        {...m}
                    />
                )}
            </MapView>
        );
    }
}
NoteLocationScene.propTypes = {
    notes: React.PropTypes.object,
    onSelectNote: React.PropTypes.func,
    initialPosition: React.PropTypes.shape({
        latitude: React.PropTypes.number,
        longitude: React.PropTypes.number,
    }).isRequired
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
        marginTop: 64,
    }
});