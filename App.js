/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from './src/login';
import { Register } from './src/register';
import { PasswordChange } from './src/PasswordChange';
import { DrugInteractions } from './src/interactions';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Password Change" component={PasswordChange} />
            <Stack.Screen name="Drug Interactions" component={DrugInteractions} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </>
    );
  }

};

export default App;
