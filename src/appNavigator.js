import { createStackNavigator } from "@react-navigation/stack"
import {Login} from './login'
import { Register } from "./register"

export const AppStackNavigator = createStackNavigator({
    Login: {
        screen: Login
    },
    Register: {
        screen: Register
    }
});
