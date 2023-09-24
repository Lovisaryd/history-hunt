
import { useContext, useState } from "react";
import AuthContent from '../components/AuthContent.js'
import * as http from "../util/http";
import { AuthContext } from '../AuthContext.js';

const Signup = () => {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [displayName, setDisplayName] = useState('')
    const authCtx = useContext(AuthContext);
  
    const authenticationHandler = async ({ email, password}) => {
      setIsAuthenticating(true);
      try {
        const {idToken, localId} = await http.signupUser(email, password);
        authCtx.authenticate(idToken, localId);
        await http.addUserToDb(localId, idToken, displayName)
        console.log("Success!")
      } catch (error) {
        console.log(error);
        alert("Wrong credentials");
      }
      setIsAuthenticating(false);
    };

    return <AuthContent onAuthenticate={authenticationHandler} setDisplayName={setDisplayName}></AuthContent>
}

export default Signup