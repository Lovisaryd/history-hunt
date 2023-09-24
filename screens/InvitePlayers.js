import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, FlatList, Image, Pressable, Button } from 'react-native';
import { AuthContext } from "../AuthContext";
import * as http from '../util/http';
import { useNavigation } from '@react-navigation/native';


const InvitePlayers = ({styles, setNewHuntObj, newHuntObj, setHunts, huntPhoto}) => {
    const [friends, setFriends] = useState([]);
    const [selected, setSelected] = useState([])
    const authCtx = useContext(AuthContext);
    const token = authCtx.token;
    let localId

    const navigation = useNavigation()

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                localId = await http.fetchID()
                const response = await axios.get(
                    `https://history-hunt-5b4c7-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=${token}`
                );
                const arrayResult = Object.keys(response.data).map((user) => ({
                    localId: user,
                    displayName: response.data[user].displayName,
                    avatarURL: response.data[user].avatarURL,
                }));

                const filteredFriends = arrayResult.filter((friend) =>{
                   return friend.localId !== localId; 
                })

                const sortedFriends = [...filteredFriends].sort((friend, friend2) => {
                    return friend.displayName.localeCompare(friend2.displayName);
                  });
                
                setFriends(sortedFriends);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
                    };
           fetchFriends(); 
           
        
    }, [localId, token]);
    
    const Friend = ({ name, img, id }) => {
        const invite = selected.includes(id)

        return (
            <View style={invite ? { ...styles.friendContainer, backgroundColor: '#669bbc' } : styles.friendContainer}>
                <Image source={{uri: img}} style={styles.photo}></Image>
                <Text style={{color: 'white'}}>{name}</Text>
            </View>
        );
    }

    const handleSelected = (id) => {
            let duplicate = selected.includes(id)
            if(duplicate){
              const newList = selected.filter((friend) =>{
                return friend !== id
              })
              setSelected(newList)
            }else {
                setSelected([...selected, id])
            }
    }

    const createHuntBtn = async () => {
        const fetchedId = await http.fetchID()
        setNewHuntObj({...newHuntObj, invited: selected, createdBy: fetchedId, avatar: huntPhoto.uri})
        if(newHuntObj.createdBy !== "" && newHuntObj.invited.length !== 0 && newHuntObj.completed !== undefined){
          await http.createNewHunt(token,{newHuntObj})
          const response = await axios.get(`https://history-hunt-5b4c7-default-rtdb.europe-west1.firebasedatabase.app/hunts.json?auth=${token}`);
            const arrayResult = Object.keys(response.data).map((hunt) => ({
                id: hunt,
                createdBy: response.data[hunt].createdBy,
                invited: response.data[hunt].invited,
                checkpoints: response.data[hunt].checkpoints,
                title: response.data[hunt].title,
                duration: response.data[hunt].duration,
                playing: response.data[hunt].playing,
                avatar: response.data[hunt].avatar,
                completed: response.data[hunt].completed
            }));
            setHunts(arrayResult);
        navigation.navigate('WelcomePage')  
        }
    }
    
    return (
        <View style={styles.container}>
            <FlatList
            style={{marginRight: 10}}
                numColumns={4} 
                data={friends}
                renderItem={({ item }) => (
                    <Pressable onPress={()=> handleSelected(item.localId)}>
                <Friend name={item.displayName} img={item.avatarURL} id={item.localId} />
                </Pressable>
                )}
                keyExtractor={item => item.localId}
            />
            <Button title="Create Hunt" onPress={() => createHuntBtn()}></Button>
        </View>
    );
}

export default InvitePlayers