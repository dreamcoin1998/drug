/***
 * 登录页
 */

import React from "react";
import { View, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { RadioButton } from "./component/radioButton";
import { styles } from "./styles/commonStyles";
import { UpperButton } from "./component/upperButton";
import config from "../config";
import { request } from "../utils/request";
import SyncStorage from "../utils/syncStorage";

export class Login extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        selectMode: 0,
        rememberPassword: true,
        phonenumber: '',
        email: '',
        password: ''
      }
  }

  componentDidMount() {
    // 从缓存加载登录信息
    var email = SyncStorage.getValue('email')
    var phone = SyncStorage.getValue('tel')
    if (email) {
      this.setState({
        email: email
      })
    }
    if (phone) {
      this.setState({
        phonenumber: phone
      })
    }
  }

  handleModeChange (mode) {
    this.setState({
      selectMode: mode,
      rememberPassword: true,
    })
  }

  handleRememberPassword() {
    const remPass = this.state.rememberPassword
    console.log(!remPass)
    this.setState({
      rememberPassword: !remPass
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

  showLoginTipAndSwitchPage(response) {
    Toast.show({
      type: 'success',
      text1: 'Login Success',
      text2: 'Welcome to Drug'
    })
    // 缓存登录信息
    const mode = this.state.selectMode === 0 ? 'tel' : 'email'
    if (this.state.rememberPassword) {
      mode === 'tel' ? SyncStorage.setValue('tel', this.state.phonenumber) : SyncStorage.setValue('email', this.state.email)
    }
    // 缓存token
    SyncStorage.setValue('token', response.token)
    // 跳转到页面
    this.props.navigation.navigate("Drug Interactions")
  }

  handleSignIn() {
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
    }
    else if (this.state.password === '') {
      Toast.show({
        type: 'error',
        text1: "password is empty"
      })
    } else {
      const url = config.HOST + '/user/login/' + mode
      const payload = mode === "tel" ? {
        tel: this.state.phonenumber,
        password: this.state.password
      } : {
        email: this.state.email,
        password: this.state.password
      }
      request(url, "POST", payload, this.showLoginTipAndSwitchPage.bind(this))
    }
  }

  render() {

    return (
      <View style={styles.center}>
        {/* logo图片 */}
        <Image
          style={styles.tinyLogo}
          source={ require("../static/logo.png") }
        />
        <View style={styles.marginSpace}></View>
        {/* 登录切换手机号登录或邮箱登录 */}
        <View>
          <Text>
            <Text 
              style={this.state.selectMode === 0 ? styles.switchBarSelected : styles.switchBar}
              onPress={this.handleModeChange.bind(this, 0)}
            >Login by Phone</Text>    <Text 
              style={this.state.selectMode === 1 ? styles.switchBarSelected : styles.switchBar}
              onPress={this.handleModeChange.bind(this, 1)}
            >Login by Email</Text>
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
          <TouchableOpacity onPress={() => this.props.navigation.navigate("Password Change")}>
            <Text style={styles.forgetPassword}>Forget Password?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.marginSpace}></View>
        {/* 记住密码 */}
        <RadioButton textContent="Remember Me" selected={this.state.rememberPassword}></RadioButton>
        <View style={styles.marginSpace}></View>
        {/* 登录按钮 */}
        <UpperButton buttonText='Sign in' onClick={this.handleSignIn.bind(this)}></UpperButton>
        <View style={styles.marginSpace}></View>
        {/* 转为注册 */}
        <Text>
          <Text>New to Drug?</Text>    <Text onPress={() => this.props.navigation.navigate('Register')} style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>Create an account</Text>
        </Text>
      </View>
    );
  }
}
