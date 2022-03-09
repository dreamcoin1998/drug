/**
 * 数据同步获取本地缓存
 */

import AsyncStorageStatic from '@react-native-community/async-storage';

export default class SyncStorage {
    static cache = {}

    static async init() {
        let keys = await AsyncStorageStatic.getAllKeys()
        let items = await AsyncStorageStatic.multiGet(keys).then()
        items.map(([key, value]) => {
            this.cache[key] = value
        })
    }

    static getValue(key) {
        return this.cache[key]
    }

    static setValue(key, value) {
        if (this.cache[key] === value) return
        this.cache[key] = value
        AsyncStorageStatic.setItem(key, value)
    }

    static removeKey(key) {
        delete this.cache[key]
        AsyncStorageStatic.removeItem(key)
    }
}
