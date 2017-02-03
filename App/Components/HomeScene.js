/**
 * Created by justincui on 1/15/17.
 */
import React, {Component} from 'react';
import {StyleSheet, Text, View, Navigator} from 'react-native';
import SimpleButton from './SimpleButton';
import NoteList from './NoteList'

export default class HomeScene extends Component {
    render() {
        var noteNum = Object.keys(this.props.notes).length;

        return (
            <View style={styles.container}>
                <NoteList
                    navigator={this.props.navigator}
                    notes={this.props.notes}
                    onSelectNote={this.props.onSelectNote}
                />
                <View style={styles.container2}>
                    <Text style={styles.noNotesText}>
                        {noteNum===0?"you haven't created any notes!": ("you have created "+noteNum+" notes!")}
                    </Text>
                    <SimpleButton
                        onPress={this.props.onCreateNote}
                        style={styles.simpleButton}
                        textStyle={styles.simpleButtonText}
                        customText="Create Note"
                    />
                </View>
            </View>
        )
    }
}
HomeScene.propTypes = {
    navigator: React.PropTypes.instanceOf(Navigator)
};

var styles = StyleSheet.create({
    container: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: 'white',
        marginTop: 60
    },
    container2: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noNotesText: {
        color: '#48209A',
        marginBottom: 10
    },
    simpleButton: {
        backgroundColor: '#5B29C1',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderColor: '#48209A',
        borderWidth: 1,
        borderRadius: 4,
        shadowColor: 'gray',
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.8,
        shadowRadius: 1
    },
    simpleButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    }
});