import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { StyleSheet, Pressable, Image, Dimensions} from 'react-native';
import Loginpage from './screens/LoginPage'
import SignupPage from './screens/SignupPage'
import WelcomePage from './screens/WelcomePage';
import AuthContextProvider, { AuthContext } from './AuthContext'
import { useContext, useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NewHunt } from './screens/NewHunt';
import { useNavigation } from '@react-navigation/native';
import addHunt from './assets/icons8-add-48.png'
import InvitePlayers from './screens/InvitePlayers';
import CameraScreen from './screens/CameraScreen';
import MapScreen from './screens/MapScreen';
import ConfirmHunt from './screens/ConfirmHunt';
import logoutIcon from './assets/icons8-logout-24.png'

const Stack = createNativeStackNavigator()


const OutloggedStack = () => {
  return (
      <Stack.Navigator>
      <Stack.Screen name="Login" options={{
        headerTransparent: true,
        headerTitle: '',
      }}>
            {(props) => (
              <Loginpage
                {...props}
                styles={styles}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Signup" options={{
            headerTransparent: true,
            headerTitle: ''
          }}>
            {(props) =>(
              <SignupPage
              {...props}
              styles={styles}
              />
            )
            }
          </Stack.Screen>
      </Stack.Navigator>
  );
}

const LoggedinStack = () => {
  const [newHuntObj, setNewHuntObj] = useState({checkpoints:[], invited: [], createdBy: '', completed: [""]})
  const [hunts, setHunts] = useState([])
  const [huntPhoto, setHuntPhoto] = useState(null)
  const [placePhoto, setPlacePhoto] = useState(null)
  const [checkedOff, setCheckedOff] = useState([])

  const authCtx = useContext(AuthContext);

  const logoutHandler =() => {
    authCtx.logout();
}   


  const Headerbtn = () => {
    const navigation = useNavigation()
    return(
      <Pressable onPress={() => navigation.navigate('NewHunt')}>
      <Image source={addHunt} style={styles.add}></Image>
      </Pressable>
    )
  }

  const LogoutBtn = () => {
    return(
      <Pressable onPress={logoutHandler}>
            <Image source={logoutIcon} style={{height: 25, width: 25}}/>
          </Pressable>
    )
  }
  return(
    <Stack.Navigator>
      <Stack.Screen name="WelcomePage" options={{
        headerTransparent: true,
        headerTitle: '',
        headerLeft: () => (<Headerbtn></Headerbtn>),
        headerRight: () => (<LogoutBtn/>),
      }}>
    {(props) => (
      <WelcomePage
      {...props}
      styles={styles}
      setHunts={setHunts}
      hunts={hunts}
      setHuntPhoto={setHuntPhoto}
      />
    )}
      </Stack.Screen>
      <Stack.Screen name="NewHunt" options={{
        headerTitle: 'Create new hunt',
        headerTransparent: true,
        headerTitleAlign: 'center',
        headerTitleStyle:{
          color: 'rgb(180, 180, 180)'
        },
        headerTintColor: 'white'
      }}>
      {(props) =>(
        <NewHunt
        {...props}
        setNewHuntObj={setNewHuntObj}
        newHuntObj={newHuntObj}
        styles={styles}
        huntPhoto={huntPhoto}
        setHuntPhoto={setHuntPhoto}
        />
      )}
      </Stack.Screen>
      <Stack.Screen name="InvitePlayers" options={{
        headerTransparent: true,
        headerTitle: 'Invite players',
        headerTitleAlign: 'center',
        headerTitleStyle:{
          color: 'rgb(180, 180, 180)'
        },
        headerTintColor: 'white'
      }}>
      {(props) =>(
        <InvitePlayers
        {...props}
        styles={styles}
        setNewHuntObj={setNewHuntObj}
        newHuntObj={newHuntObj}
        setHunts={setHunts}
        huntPhoto={huntPhoto}
        />
      )}
      </Stack.Screen>
      <Stack.Screen name="CameraScreen" options={{
        headerTransparent: true,
        headerTitle: '',
        headerTintColor: 'white'
      }}>
      {(props) =>(
        <CameraScreen
        {...props}
        styles={styles}
        setHuntPhoto={setHuntPhoto}
        setPlacePhoto={setPlacePhoto}
        setCheckedOff={setCheckedOff}
        checkedOff={checkedOff}
        setHunts={setHunts}
        />
      )}
      </Stack.Screen>
      <Stack.Screen name="MapScreen" options={{
        headerTransparent: true,
        headerTitle: 'Select locations',
        headerTitleAlign: 'center'
      }}>
      {(props) =>(
        <MapScreen
        {...props}
        styles={styles}
        setNewHuntObj={setNewHuntObj}
        newHuntObj={newHuntObj}
        setPlacePhoto={setPlacePhoto}
        placePhoto={placePhoto}
        checkedOff={checkedOff}
        />
      )}
      </Stack.Screen>
      <Stack.Screen name="ConfirmHunt"  options={{
        headerTransparent: true,
        headerTitle: '',
        headerTitleAlign: 'center'
      }}>
      {(props) =>(
        <ConfirmHunt
        {...props}
        styles={styles}
        />
      )}
      </Stack.Screen>
    </Stack.Navigator>
  )}

const Navigation = () => {
  const authCtx = useContext(AuthContext);

  useEffect(() => {
   
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("appToken");
      if (token) {
        authCtx.authenticate(token);
      }
    };
    fetchToken(); 
  }, [authCtx]);

  return (
    <NavigationContainer>
      {authCtx.isAuthenticated ? <LoggedinStack /> : <OutloggedStack />}
    </NavigationContainer>
  );
};

const {width, height} = Dimensions.get('window')

export default function App() {
  return (
    <>
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(37, 37, 37)',
    width: width,
    height: height,
    alignSelf:'center',
    paddingTop: 90,
    
  },
  add:{
    width: 30,
    height: 30
  },
  addPhoto:{
    width: 45,
    height: 45,
    position: 'absolute',
    alignSelf: 'center',
     zIndex: 1,
  },
  photo:{
    width: 65,
    height: 65,
    borderRadius: 32
  },
  camera:{
    height: height*1.048,
    width: width
  },
  preview:{
    width: width,
    height: height*1.06,
    top: '49%'
  },
  takenphotos:{
    height: '100%',
    width: '100%',
    marginTop: '-100%'
  },
  img: {
    width: 120,
    height:120,
    borderRadius: 75,
    alignSelf: 'center'
},
huntImg:{
  width: 60,
  height: 60,
  borderRadius: 30
},
row:{
  flexDirection: 'row',
  paddingTop: '3%',
  paddingBottom: '3%',
  paddingLeft: '4%'
},
header:{
  fontSize: 24,
  alignSelf: 'center',
  marginTop: 10,
  marginBottom: 20,
  color: 'rgb(180, 180, 180)',
},
subHeader:{
  alignSelf: 'center',
  fontSize: 18,
  marginTop: 10,
  marginBottom: 10,
  color: 'rgb(180, 180, 180)'
},
italic:{
  alignSelf: 'center',
  marginTop: 10,
  marginBottom: 10,
  color: 'rgb(180, 180, 180)'
},
hunt:{
  width: width/1.02,
  backgroundColor: '#b671b6',
  borderRadius: 40,
  alignItems: 'left',
  marginTop: 1

},
hunt1:{
  width: width/1.02,
  backgroundColor: '#669bbc',
  borderRadius: 40,
  alignItems: 'left',
  marginBottom: 10

},
huntTitle:{
  fontSize: 20,
  marginLeft: '5%',
  paddingTop: '2%',
  color: 'rgb(37, 37, 37)'
},
playing:{
  marginLeft: '26%',
  marginTop: -25,
  paddingBottom: 15,
  color: 'rgb(37, 37, 37)'
},
inputField:{
  width: '80%', 
  height: 50,
  backgroundColor: '#669bbc',
  borderRadius: 10,
  textAlign: 'center',
},
picturebtn:{
  borderStyle: 'dashed',
  borderColor: 'white',
  borderWidth: 3,
  width: '80%',
  paddingBottom: 20,
  alignSelf: 'center',
  textAlign: 'center',
  marginTop: 30,
  borderRadius: 10
},
friendContainer: {
  flex: 1,
  margin: 5,
  padding: 5,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 5
},
huntText:{
  color: '#669bbc',
  marginBottom: -5,
  paddingLeft: '10%'
}
});
