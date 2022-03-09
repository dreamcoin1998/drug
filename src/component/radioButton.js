import React from "react";
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    redioStyle: {
        width: 14,
        height: 14,
        borderColor: 'black',
        borderWidth: 0.5,
    },
    textStyle: {
        fontSize: 15,
        color: 'black',
    },
    selected: {
        borderWidth: 0,
        backgroundColor: "orange"
    }
});

export class RadioButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          selected: this.props.selected ? this.props.selected : true
        }
    }

    onChange() {
        const selected = this.state.selected
        this.setState({
            selected: !selected
        })
    }

    render() {

        return (
            <Text onPress={this.onChange.bind(this)}>
                <View style={[styles.redioStyle, this.props.redioStyle]}>
                    {
                        this.state.selected ?
                        <View style={{
                            height: 8,
                            width: 8,
                            margin: 2.5,
                            backgroundColor: 'orange',
                            }}
                        /> :
                        null
                    }
                </View>  <Text style={[styles.textStyle, this.props.textStyle]}>{this.props.textContent}</Text>
            </Text>
        )
    }
}
