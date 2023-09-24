 import axios from "axios";
    import { useContext, useEffect, useState } from "react";
    import { Text, View } from "react-native";
    import { AuthContext } from "../AuthContext";
import * as http from '../util/http'
import { useNavigation } from "@react-navigation/native";
import ActiveHunts from '../components/ActiveHunts'
import PlannedHunts from "../components/PlannedHunts";
import * as Font from 'expo-font'
import { ScrollView } from "react-native";
import Medals from "../components/Medals";
import UserImg from "../components/UserImg";

const WelcomePage = ({styles, setHunts, hunts}) => {
      const [user, setUser] = useState('');
      const [avatar, setAvatar] = useState(null)
      const [activeHunts, setActiveHunts] = useState([])
      const [plannedHunts, setPlannedHunts] = useState([])
      const [finishedHunts, setFinishedHunts] = useState([])
      const [loading, setLoading] = useState(true);
      const authCtx = useContext(AuthContext);
      let localId = authCtx.localId
      const token = authCtx.token

      const navigation = useNavigation()
        
      useEffect(() => {
        if (localId === undefined) {
          const fetchID = async () => {
            try {
              const id = await http.fetchID();
              localId = id
            } catch (error) {
              console.error(error);
            }
          };
          fetchID();
        }
        if (localId && token) {
          const fetchData = async () => {
            try {
              const response = await axios.get(`https://history-hunt-5b4c7-default-rtdb.europe-west1.firebasedatabase.app/users/${localId}.json?auth=${token}`);
              setUser(response.data.displayName);
              setAvatar(response.data.avatarURL)
                  } catch (error) {
              console.log(error);
            }finally {
                setLoading(false);
              }
          };
          fetchData();
        }
      }, [localId,token]);
        
        return (
        <View style={styles.container}>
            <UserImg navigation={navigation} avatar={avatar} styles={styles}/>
          <Text style={styles.header}>{user}</Text>
          <Text style={styles.subHeader}>Active Hunts</Text>
          <ScrollView>
        <ActiveHunts
            hunts={hunts}
            setActiveHunts={setActiveHunts}
            activeHunts={activeHunts}
            setHunts={setHunts}
            token={token}
            styles={styles}
          /></ScrollView>
          <Text style={styles.subHeader}>Planned hunts</Text>
          <ScrollView>
          <PlannedHunts
            hunts={hunts}
            setHunts={setHunts}
            setPlannedHunts={setPlannedHunts}
            plannedHunts={plannedHunts}
            token={token}
            styles={styles}
          /></ScrollView>
            <Medals finishedHunts={finishedHunts} styles={styles} hunts={hunts} setFinishedHunts={setFinishedHunts}/>
        </View>
       
      );
    };

export default WelcomePage