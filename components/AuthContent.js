import { useState } from "react"
import { View, Text } from "react-native"
import { StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"

import AuthForm from "./AuthForm"
import FlatButton from "../ui/FlatButton"


const AuthContent = ({isLogin, onAuthenticate, setDisplayName}) => {
    const [credentialsInvalid, setCredentialsInvalid] = useState({
        email: false,
        password: false,
        confirmEmail: false,
        confirmPassword: false,
    })

    const navigation = useNavigation();


    const switchAuthModeHandler = () => {
        if (isLogin) {
          navigation.replace("Signup");
        } else {
          navigation.replace("Login");
        }
      };

    const submitHandler = (credentials) => {
        let {email, confirmEmail, password, confirmPassword} = credentials

        email = email.trim()
        password = password.trim()

        const validEmail = email.includes('@')


        if(!validEmail){
            console.log("Not valid email")
            setCredentialsInvalid({
                email: !validEmail
            })
            return;
        }
        onAuthenticate({email, password})
    }
    return(
        <View style={styles.bg}>
            <Text style={{fontSize: 24, textAlign: 'center', color: 'white', marginBottom: 20}}>History Hunt</Text>
            <AuthForm
            isLogin={isLogin}
            onSubmit={submitHandler}
            setDisplayName={setDisplayName}
            credentialsInvalid={credentialsInvalid}
            />
            {isLogin ? <Text style={{textAlign: 'center', color: 'white', marginTop: 20}}>Don't have an account yet?</Text> : ''}
            <FlatButton onPress={switchAuthModeHandler}>
                
          {isLogin ? "Create a new user" : "Log in instead"}
        </FlatButton>
        </View>
    )
}

const styles = StyleSheet.create({
    bg:{
        backgroundColor: 'rgb(37, 37, 37)',
    width: '100%',
    height: '100%',
    alignSelf:'center',
    paddingTop: 90,
    
    }
})

export default AuthContent