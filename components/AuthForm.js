import { useState } from "react"
import { View } from "react-native"
import Input from "../ui/Input"
import Button from "../ui/Button"

const AuthForm = ({isLogin, onSubmit, credentialsInvalid, setDisplayName}) => {
    const [enteredEmail, setEnteredEmail] = useState("")
    const [enteredConfirmEmail, setConfirmedEmail] = useState('')
    const [enteredPassword, setEnteredPassword] = useState('')
    const [enteredConfirmPass, setEnteredConfirmPass] = useState('')
    const [username, setUsername] = useState('')

    const {
        email: emailIsInvalid,
        confirmEmail: emailsDontMatch,
        password: passwordIsInvalid,
        confirmPassword: passwordsDontMatch,
    } = credentialsInvalid
    
    const updateInputValue = (inputType, enteredValue) =>{
        switch(inputType){
            case 'email':
                setEnteredEmail(enteredValue);
                break;
            case 'confirmEmail':
                setConfirmedEmail(enteredValue);
                break;
            case 'password':
                setEnteredPassword(enteredValue);
                break;
            case 'confirmPassword':
                setEnteredConfirmPass(enteredValue);
                break;
            case 'displayName':
                setUsername(enteredValue);
                setDisplayName(enteredValue);
                break;
        }
    }

    const submitHandler = () => {

        onSubmit({
            email: enteredEmail,
            confirmEmail: enteredConfirmEmail,
            password: enteredPassword,
            confirmPassword: enteredConfirmPass,
        })
    }

    return(
        <View>
            {!isLogin && (
                <Input
                label= "Display Name"
                onUpdateValue={updateInputValue.bind(this, 'displayName')}
                value={username}
                keyboardType='email-address'
                />
            )}
            <Input
            label= "Email Address"
            onUpdateValue= {updateInputValue.bind(this, 'email')}
            value={enteredEmail}
            keyboardType='email-address'
            isInvalid ={emailIsInvalid}
            />
            {!isLogin && (
                <Input
                label= "Confirm Email"
                onUpdateValue={updateInputValue.bind(this, 'confirmEmail')}
                value={enteredConfirmEmail}
                keyboardType='email-address'
                isInvalid={emailsDontMatch}
                />
            )}
               <Input
          label="Password"
          onUpdateValue={updateInputValue.bind(this, "password")}
          secure
          value={enteredPassword}
          isInvalid={passwordIsInvalid}
        />
        {!isLogin && (
          <Input
            label="Confirm Password"
            onUpdateValue={updateInputValue.bind(
              this,
              "confirmPassword"
            )}
            secure
            value={enteredConfirmPass}
            isInvalid={passwordsDontMatch}
          />
        )}
            <View>
          <Button onPress={submitHandler}>
            {isLogin ? "Log In" : "Sign Up"}
          </Button>
        </View>
        </View>
    )
}

export default AuthForm