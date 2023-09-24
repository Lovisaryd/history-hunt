import { useEffect } from "react"
import { View, Text, Image, FlatList } from "react-native"
import * as http from '../util/http'

const Medals = ({finishedHunts, styles, hunts, setFinishedHunts}) => {

    useEffect(() => {
        
        if (hunts.length > 0) {
            const setIdAndFilterHunts = async () => {
                const localId = await http.fetchID();
                const filteredHunts = hunts.filter((hunt) => {
                    return(hunt.completed.includes(localId));
                });
                setFinishedHunts(filteredHunts);
            };
    
            setIdAndFilterHunts();
        }
    }, [hunts])



    if (finishedHunts.length === 0) {
        return (
            <View>
            <Text style={styles.subHeader}>MEDALS</Text>
            <Text style={styles.italic}>No medals won yet</Text>
            </View>
            )
    }
    return(
       <View style={{paddingBottom:10, paddingLeft:10, paddingRight: 10}}>
         <Text style={styles.subHeader}>MEDALS</Text>
         <FlatList
                numColumns={5} 
                data={finishedHunts}
                renderItem={({ item }) => (
                <Image source={{uri: item.avatar}} style={{width: 60, height: 60, borderRadius: 30, marginLeft: 10
                }}></Image>
                )}
                keyExtractor={item => item.id}
            />
        </View> 
    )
}

export default Medals