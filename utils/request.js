/**
 * 网络请求hook
 */

import Toast from 'react-native-toast-message';
import SyncStorage from './syncStorage';

// 拦截器

export const request = (url, method, payload, handler) => {
    console.log(url)
    // 获取本地token
    let token = SyncStorage.getValue("token");
    console.log("token", token)
    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "Authorization": token ? token : '',
    }
    let body = JSON.stringify(payload)
    console.log("body", body)
    // 请求拦截器
    let fetchInstance
    switch (method){ 
        case "GET":
            fetchInstance = _get_request(url, body, headers)
            break
        case "POST":
            fetchInstance = _post_request(url, body, headers)
            break
        case "PUT":
            fetchInstance = _put_request(url, body, headers)
            break
        default:
            fetchInstance = _get_request(url, body, headers)
    }
    // 响应拦截器
    return fetchInstance
        .then(response => response.json())
        .then(response => {
            console.log("response", response)
            if (response.code !== 200) {
                Toast.show({
                    type: 'error',
                    text1: "Login Failed",
                    text2: response.msg
                })
            } else {
                handler(response)
            }
        })
        .catch((error) => {
            console.log(error)
            return null
        })
    
}

// get 请求
const _get_request = (url, body, header) => {
    return fetch(url, {
        method: "GET",
        headers: header,
        payload: body
    })
}

// POST 请求
const _post_request = (url, body, header) => {
    return fetch(url, {
        method: "POST",
        headers: header,
        body: body
    })
}

// PUT 请求
const _put_request = (url, body, header) => {
    return fetch(url, {
        method: "PUT",
        headers: header,
        body: body
    })
}
