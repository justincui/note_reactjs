/**
 * Created by justincui on 2/1/17.
 */
import React, {Component} from 'react';
import {Image, View, StyleSheet} from 'react-native';
export default class ImageScene extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image
                    source={{uri: this.props.note.imagePath}}
                    //source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
                    style={styles.image}
                />
            </View>
        );
    }
}
let styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 64
    },
    image: {
        flex: 1
    }
});
