import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    center: {
      display:'flex',
      alignItems:'center',
      justifyContent: 'center',
    },
    tinyLogo: {
      marginTop: 59,
      width: 176,
      height: 162,
    },
    logo: {
      width: 66,
      height: 58,
    },
    marginSpace: {
      height: 20
    }, 
    input: {
      width: 250,
      height: 40,
      borderColor: 'orange',
      borderWidth: 2,
      marginBottom: 15,
      borderRadius: 5,
    },
    input2: {
      width: 250,
      height: 40,
      borderColor: 'orange',
      borderWidth: 2,
      marginBottom: 5,
      borderRadius: 5,
    },
    originText: {
      color: 'orange',
      // fontWeight: 'bold',
    },
    forgetPassword: {
      color: 'black',
      fontWeight: '400',
      textDecorationLine: 'underline'
    },
    switchBar: {
      fontSize: 16,
      color: "black",
      fontWeight: 'bold',
    },
    switchBarSelected: {
      fontSize: 16,
      color: "orange",
      fontWeight: 'bold',
    },
    button: {
      borderRadius: 20,
      width: 166,
      height: 40,
      alignItems:'center',
      justifyContent: 'center',
      backgroundColor: '#F2994A',
      color: "#000",
      fontWeight: 'bold'
    },
    bottonContent: {
      color: 'white',
      fontWeight: 'bold',
      textTransform: 'uppercase',
    }
});