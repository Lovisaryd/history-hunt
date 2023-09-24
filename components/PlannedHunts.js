import { View, Text, Pressable, Image } from "react-native";
import * as http from '../util/http';
import { useEffect } from "react";
import axios from "axios";
import { playHunt } from "../functions/playfunction";
import { useNavigation } from "@react-navigation/native";

const PlannedHunts = ({ setPlannedHunts, plannedHunts, hunts, setHunts, token, styles }) => {   

    const navigation = useNavigation()
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`https://history-hunt-5b4c7-default-rtdb.europe-west1.firebasedatabase.app/hunts.json?auth=${token}`);
            const arrayResult = Object.keys(response.data).map((hunt) => ({
                id: hunt,
                createdBy: response.data[hunt].createdBy,
                invited: response.data[hunt].invited,
                checkpoints: response.data[hunt].checkpoints,
                title: response.data[hunt].title,
                duration: response.data[hunt].duration,
                avatar: response.data[hunt].avatar,
                completed: response.data[hunt].completed
            }));
            setHunts(arrayResult);
        };
        
        fetchData();
    }, [token]);
    
    useEffect(() => {
        if (hunts.length > 0) {
            const setIdAndFilterHunts = async () => {
                const localId = await http.fetchID();
                const filteredHunts = hunts.filter((hunt) => {
                    return (hunt.createdBy === localId) && !hunt.completed.includes(localId);
                });
                setPlannedHunts(filteredHunts);
            };
    
            setIdAndFilterHunts();
        }
    }, [hunts]);
    
    const HowMany = ({hunt}) => {
        const playing = hunt.invited?.length
        if(playing <= 0){
            return(<Text style={styles.playing}>Soloing it!</Text>)
        } else {
            return(<Text style={styles.playing}>Playing with {playing} others!</Text>)
        }
    }

    const Hunt = ({ hunt }) => {

        return (
            <View style={styles.subHeader}>
                <View style={styles.hunt}>
                <Pressable onPress={() => playHunt(navigation, {hunt})}>
                    <View style={styles.row}>
                        <Image source={{uri: hunt.avatar}} style={styles.huntImg}></Image>
                <Text style={styles.huntTitle}>{hunt.title}</Text>
                </View>
                <HowMany hunt={hunt}/>
                </Pressable>
                </View>
            </View>
        );
    };

    if (plannedHunts.length === 0) {
        return (
            <View>
            <Text style={styles.italic}>No planned hunts</Text>
            </View>
            )
    }

    return (
        <View>
            {plannedHunts.map((hunt) => (
                <Hunt key={hunt.id} hunt={hunt} />
            ))}
        
        </View>
    );
};

export default PlannedHunts
