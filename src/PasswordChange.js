/**
 * 注册页
 */

import React from "react";
import { View, Image, Text, TextInput, StyleSheet } from 'react-native';
import config from "../config";
import { request } from "../utils/request";
import { UpperButton } from "./component/upperButton";
import { styles } from "./styles/commonStyles";
import Toast from 'react-native-toast-message';

const theStyles = StyleSheet.create({
    VerificationCodeUndo: {
        height: 40,
        width: 200,
        marginBottom: 10
    },
    VerificationCodeDo: {
        height: 40,
        width: 200,
        marginBottom: 10,
        backgroundColor: 'grey'
    }
})

export class PasswordChange extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            selectMode: 0,
            phonenumber: '',
            email: '',
            password: '',
            verificationCode: '',
            codeDo: false,
            waitSecond: 60,
            codeSendText: "Send Verification Code"
          }
    }

    handleModeChange (mode) {
        this.setState({
            selectMode: mode,
        })
    }

    handleChangeloginInfo(value) {
        const mode = this.state.selectMode
        mode === 0 ? this.setState({phonenumber: value}) : this.setState({email: value})
    }

    handleChangePassword(value) {
        this.setState({
            password: value
        })
    }

    handleChangeVerification(value) {
        this.setState({
            verificationCode: value
        })
    }

    handlePasswordChangeSuccess(response) {
        Toast.show({
            type: 'success',
            text1: "Password Change Success",
            text2: "Welcome to Drug"
        })
        this.props.navigation.navigate("Login")
    }

    handlePasswordChangeSubmit() {
        const mode = this.state.selectMode === 0 ? 'tel' : 'email'
        var emailFormat = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
        if (mode === 'tel' && this.state.phonenumber.length !== 11){
            Toast.show({
                type: 'error',
                text1: "tel number must be 11 digits"
            })
        } else if (mode === 'email' && !emailFormat.test(this.state.email)) {
            Toast.show({
                type: 'error',
                text1: "email format error"
            })
        } else if (this.state.password === '') {
            Toast.show({
                type: 'error',
                text1: "password is empty"
            })
        } else if (this.state.verificationCode.length !== 6) {
            Toast.show({
                type: 'error',
                text1: "verificationCode must be 6 digits"
            })
        } else {
            // 调取接口修改密码
            const url = config.HOST + "/user/password/change/" + mode
            const payload = mode === "tel" ? {
                tel: this.state.phonenumber,
                password: this.state.password,
                verification: this.state.verificationCode,
            } : {
                email: this.state.email,
                password: this.state.password,
                verification: this.state.verificationCode
            }
            request(url, "POST", payload, this.handlePasswordChangeSuccess.bind(this))
        }
    }

    sendVerificationCodeSuccess() {
        Toast.show({
            type: 'success',
            text1: "Send Verification Code Success",
        })
        // TODO
        // 修改发送验证码按钮样式
        this.setState({
            codeDo: true,
        })
        setInterval(this.changeCodeSendText.bind(this), 1000)
    }

    changeCodeSendText() {
        if (this.state.waitSecond === 0) {
            this.setState({
                codeSendText: "Send Verification Code",
                waitSecond: 60,
                codeDo: false
            })
        } else {
            const codeSendText = "Try Again in " + (this.state.waitSecond - 1)
            this.setState({
                codeSendText: codeSendText,
                waitSecond: this.state.waitSecond - 1,
                codeDo: true
            })
            setTimeout(this.changeCodeSendText.bind(this), 1000)
        }
    }

    handleSendVerificationCode() {
        const mode = this.state.selectMode === 0 ? 'tel' : 'email'
        var emailFormat = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
        if (mode === 'tel' && this.state.phonenumber.length !== 11){
            Toast.show({
                type: 'error',
                text1: "tel number must be 11 digits"
            })
        } else if (mode === 'email' && !emailFormat.test(this.state.email)) {
            Toast.show({
                type: 'error',
                text1: "email format error"
            })
        } else {
            if (!this.state.codeDo) {
                // 调取接口获取验证码
                const url = config.HOST + "/user/getVerification/" + mode
                const payload = mode === "tel" ? "/" + this.state.phonenumber : "/" + this.state.email
                request(url+payload, "GET", {}, this.sendVerificationCodeSuccess.bind(this))
                // 测试发送验证码按钮的样式
                this.changeCodeSendText.bind(this)()
            } else {
                Toast.show({
                    type: 'error',
                    text1: "Dont get verification frequently"
                })
            }
        }
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
               {/* 登录切换手机号登录或邮箱登录 */}
               <View>
                   <Text>
                       <Text 
                           style={this.state.selectMode === 0 ? styles.switchBarSelected : styles.switchBar}
                           onPress={this.handleModeChange.bind(this, 0)}
                           >Change by Phone</Text>    <Text 
                           style={this.state.selectMode === 1 ? styles.switchBarSelected : styles.switchBar}
                           onPress={this.handleModeChange.bind(this, 1)}
                           >Change by Email</Text>
                   </Text>       
               </View>
               <View style={styles.marginSpace}></View>
               {/* 输入框区域 */}
                <View>
                   <View>
                       <Text style={styles.originText}>{this.state.selectMode === 0 ? 'Phone' : 'Email'}</Text>
                       <TextInput
                            style={styles.input}
                            placeholderTextColor={'#000'}
                            textContentType='username'
                            value={this.state.selectMode === 0 ? this.state.phonenumber : this.state.email}
                            onChangeText={this.handleChangeloginInfo.bind(this)}
                       />
                   </View>
                   <View>
                       <Text style={styles.originText}>Verification Code</Text>
                       <TextInput
                            style={styles.input}
                            placeholderTextColor={'#000'}
                            textContentType='username'
                            value={this.state.verificationCode}
                            onChangeText={this.handleChangeVerification.bind(this)}
                       />
                       {/* 发送验证码按钮 */}
                       <UpperButton 
                            buttonText={this.state.codeSendText}
                            style={this.state.codeDo ? theStyles.VerificationCodeDo: theStyles.VerificationCodeUndo}
                            onClick={this.handleSendVerificationCode.bind(this)}
                        />
                   </View>
                   <View>
                       <Text style={styles.originText}>password</Text>
                       <TextInput
                            style={styles.input2}
                            placeholderTextColor={'#000'}
                            textContentType='password'
                            secureTextEntry={true}
                            value={this.state.password}
                            onChangeText={this.handleChangePassword.bind(this)}
                       />
                   </View>
                </View>
                <View style={styles.marginSpace}></View>
                 {/* 注册按钮 */}
                <UpperButton buttonText='Submit' onClick={this.handlePasswordChangeSubmit.bind(this)} />
            </View>
        )
    }
 }
 