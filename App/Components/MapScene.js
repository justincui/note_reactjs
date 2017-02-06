/**
 * Created by justincui on 1/18/17.
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import MapView from 'react-native-maps';
import _ from 'lodash';

const {width:win_width, height:win_height} = Dimensions.get('window');
const headerHeight=64;

export default class MapScene extends Component {
    render() {
        const ASPECT_RATIO = win_width / (win_height - headerHeight);
        const LATITUDE_DELTA = 0.002;
        const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

        let markers = [];
        return (
            <View style={styles.container}>
                <MapView
                    //provoider="google"
                    initialRegion={{
                        latitude: this.props.initialPosition.latitude,
                        longitude: this.props.initialPosition.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                    showsUserLocation={true}
                    style={styles.map}
                >
                    {_.values(this.props.notes).map(note =>
                        <MapView.Marker
                            key={note.id}
                            coordinate={note.location.coords}
                            ref={(mrk) => markers.push(mrk)}
                        >
                            <MapView.Callout
                                style={{flex: 1, position: 'relative'}}
                                onPress={() => this.props.onSelectNote(note)}>
                                <Text>{note.title}</Text>
                            </MapView.Callout>
                        </MapView.Marker>)}
                </MapView>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => markers.forEach((mrk) => mrk.showCallout())}
                        style={styles.bubble}
                    >
                        <Text>Show</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => markers.forEach((mrk) => mrk.hideCallout())}
                        style={styles.bubble}
                    >
                        <Text>Hide</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
        marginTop: headerHeight,
    },
    bubble: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: 'center',
        paddingHorizontal: 40,

    },
    buttonContainer: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 10,
        width: win_width,
    },
});