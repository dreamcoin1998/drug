import React from "react";
import { Text, TouchableOpacity } from 'react-native';
import { styles } from "../styles/commonStyles";

export class UpperButton extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <TouchableOpacity style={[styles.button, this.props.style]} onPress={this.props.onClick}>
                <Text style={styles.bottonContent}>{this.props.buttonText}</Text>
            </TouchableOpacity>
        )
    }
}
