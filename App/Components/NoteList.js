/**
 * Created by justincui on 1/16/17.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    TouchableOpacity
} from 'react-native';

export default class NoteList extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })
    }

    render() {
        return (
            <ListView
                style={styles.list}
                enableEmptySections={true}
                dataSource={
                    this.ds.cloneWithRows(this.props.notes)
                }
                renderRow={(rowData) => {
                    return (
                        <TouchableOpacity onPress={() => this.props.onSelectNote(rowData)}>
                            <View style={styles.row}>
                                <Text style={styles.text}>{rowData.title}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        );
    }
}
const styles = StyleSheet.create({
    list: {
        flex: 1
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'lightgray',
        borderBottomWidth: 1,
        borderBottomColor: 'purple'
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'blue'
    }
});