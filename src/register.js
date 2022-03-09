/**
 * 注册页
 */

import React from "react";
import { View, Image, Text, TextInput } from 'react-native';
import { UpperButton } from "./component/upperButton";
import { styles } from "./styles/commonStyles";
import config from "../config";
import Toast from 'react-native-toast-message';
import { request } from "../utils/request";
import SyncStorage from "../utils/syncStorage";

export class Register extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            phonenumber: '',
            password: ''
        }
    }

    handleRegisterSuccess(response) {
        Toast.show({
            type: "success",
            text1: "Register Success",
            text2: "welcome to drug"
        })
        // 缓存token
        console.log(response.token)
        SyncStorage.setValue('token', response.token)
        // TODO 跳转页面
    }

    handleRegister() {
        var emailFormat = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
        if (this.state.name.length <= 0) {
            Toast.show({
                type: 'error',
                text1: "nickname is empty"
            })
        }
        if (this.state.phonenumber.length !== 11){
            Toast.show({
              type: 'error',
              text1: "tel number must be 11 digits"
            })
        }
        if (!emailFormat.test(this.state.email)) {
            Toast.show({
              type: 'error',
              text1: "email format error"
            })
        }
        if (this.state.password === '') {
            Toast.show({
              type: 'error',
              text1: "password is empty"
            })
        }
        const url = config.HOST + "/user/register"
        const payload = {
            name: this.state.name,
            tel: this.state.phonenumber,
            email: this.state.email,
            password: this.state.password
        }
        request(url, "POST", payload, this.handleRegisterSuccess.bind(this))
    }

    handleChangeEmail(value) {
        this.setState({
            email: value
        })
    }

    handleChangePhone(value) {
        this.setState({
            phonenumber: value
        })
    }

    handleChangePassword(value) {
        this.setState({
            password: value
        })
    }

    handleChangeNickName(value) {
        this.setState({
            name: value
        })
    }

    render() {
        return (
            <View style={styles.center}>
                {/* logo图片 */}
                <Image
                    style={styles.tinyLogo}
                    source={{ uri: "https://s3-alpha-sig.figma.com/img/c4bb/2925/0e65291124a4fefffd458f01ee42c110?Expires=1646611200&Signature=Dd6Fcih3yGYreagQXzmZEhfDbIsXz3BfCQfIy67IUruvI6whDxXXLd9A0I~HB9mT16uAbXsFuhv2VDk424XHynNKCI3AyLfmXxFGnyRe3MZ0EL2tHCQEHtUeoQBiwzJZr4uIP1xBtPqo-BTwOziE-UAuOVPxikvY~nEt5R105RDyb7-24jUD58PegpQ8kZwx7dYFd95-NWwuc2JXxMCnCNppCgVxgFmQH0ALT7T79KzimNbmW71DODaEARddfNZkgTC4Am5Jpmr4vncVQdTPHLylq3WDq2pi-1H-ZnW~IFVhYk0s9OekTFYZ7LBjsq2ENy-4lDSrTVsN6Onqdao4Ng__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA" }}
                />
                <View style={styles.marginSpace}></View>
                 {/* 输入框区域 */}
                <View>
                    <View>
                        <Text style={styles.originText}>nickname</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor={'#000'}
                            textContentType='username'
                            onChangeText={this.handleChangeNickName.bind(this)}
                        />
                    </View>
                    <View>
                        <Text style={styles.originText}>Phone</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor={'#000'}
                            textContentType='username'
                            onChangeText={this.handleChangePhone.bind(this)}
                        />
                    </View>
                    <View>
                        <Text style={styles.originText}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor={'#000'}
                            textContentType='username'
                            onChangeText={this.handleChangeEmail.bind(this)}
                        />
                    </View>
                    <View>
                        <Text style={styles.originText}>password</Text>
                        <TextInput
                            style={styles.input2}
                            placeholderTextColor={'#000'}
                            textContentType='password'
                            secureTextEntry={true}
                            onChangeText={this.handleChangePassword.bind(this)}
                        />
                    </View>
                </View>
                <View style={styles.marginSpace}></View>
                 {/* 注册按钮 */}
                <UpperButton buttonText='Register' onClick={this.handleRegister.bind(this)} />
            </View>
        )
    }
}
