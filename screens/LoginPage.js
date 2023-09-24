import { useState, useContext } from 'react';
import AuthContent from '../components/AuthContent.js'
import { AuthContext } from '../AuthContext.js';
import * as http from "../util/http";

const LoginPage = () => {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthContext);

  const authenticationHandler = async ({ email, password }) => {
    setIsAuthenticating(true);
    try {
      const {idToken, localId} = await http.signinUser(email, password);
      authCtx.authenticate(idToken, localId);
    } catch (error) {
        console.log(error)
      alert("Wrong credentials");
    }
    setIsAuthenticating(false);
  };

    return <AuthContent isLogin onAuthenticate={authenticationHandler}></AuthContent>
}

export default LoginPage