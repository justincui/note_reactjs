/**
 * Created by justincui on 1/18/17.
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import MapView from 'react-native-maps';
import _ from 'lodash';

export default class MapScene extends Component {
    render() {
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
                {_.values(this.props.notes).map(note =>
                    <MapView.Marker
                        key={note.id}
                        coordinate={note.location.coords}
                    >
                        <MapView.Callout
                            style={{ flex: 1, position: 'relative' }}
                            onPress={() => this.props.onSelectNote(note)}>
                            <Text>{note.title}</Text>
                        </MapView.Callout>
                    </MapView.Marker>)}
            </MapView>
        );
    }
}
MapScene.propTypes = {
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