import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_KEY = "AIzaSyA7C-LCa8lmyGy2fry6fSr10S1K0FvtOv8";

const authenticate = async (mode, email, password) => {
  const resp = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`,
    {
      email,
      password,
      returnSecureToken: true,
    }
  );

  await AsyncStorage.setItem("localId", resp.data.localId);
  return {
    idToken: resp.data.idToken,
    localId: resp.data.localId,
  };
};

export const addUserToDb = async (localId, idToken, displayName) => {
  const avatar = "https://firebasestorage.googleapis.com/v0/b/history-hunt-5b4c7.appspot.com/o/userAvatars%2Fistockphoto-1300845620-612x612.jpg?alt=media&token=53a10e22-f1c1-479b-a95f-fbf1d058510f"
  const profile = {
    displayName: displayName,
    avatarURL: avatar
  };

  try {
    const response = await axios.put(
      `https://history-hunt-5b4c7-default-rtdb.europe-west1.firebasedatabase.app/users/${localId}.json?auth=` + idToken, profile)
}catch(error){
  console.log(error)
}
}

export const createNewHunt = async (token, {newHuntObj}) =>{
  try{
    const response = await axios.post(
      `https://history-hunt-5b4c7-default-rtdb.europe-west1.firebasedatabase.app/hunts.json?auth=` + token, newHuntObj
    )
  }catch(error){
    console.log(error)
  }
    
}

export const updateProfile = async (token, photo) =>{
  try{
    const id = await fetchID()
    const newprofile ={
      avatarURL: photo.uri
    }
    const response = await axios.patch(`https://history-hunt-5b4c7-default-rtdb.europe-west1.firebasedatabase.app/users/${id}.json?auth=` + token, newprofile)
    if(response.status !== 400){
      console.log("Posted!")
    }
  }catch(error){
    console.log(error)
  }
}

export const updateHunt = async (huntObj, token) => {
  
  const id = await fetchID()
  console.log(id)
  if(id !== undefined){
   const invited = huntObj.hunt.invited
  const newInvited = invited.filter((item) => item !== id)
  try {
    const currentCompleted = huntObj.hunt.completed || [];

    const updatedCompleted = [...currentCompleted, id];

    const updateHunt = {
      invited: newInvited,
      completed: updatedCompleted
    };
    const response = await axios.patch(`https://history-hunt-5b4c7-default-rtdb.europe-west1.firebasedatabase.app/hunts/${huntObj.hunt.id}.json?auth=` + token, updateHunt)
    return response.status
  }catch(error){
    console.log(error)
  }
  }
  
}

export const fetchID = async () => {
    const localId = await AsyncStorage.getItem('localId')
    return (localId)
}

export const signupUser = (email, password) => {
  return authenticate("signUp", email, password);
};

export const signinUser = (email, password) => {
  return authenticate("signInWithPassword", email, password);
};