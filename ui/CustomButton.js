import { Pressable, View, Text } from "react-native"
import { playGame } from "../functions/playfunction"

export const CustomButton = ({hunt, markers, navigation}) => {
    return(
      <Pressable onPress={() => playGame(hunt, markers, navigation)}>
        <View style={{width: '90%', backgroundColor: '#b671b6', height: 40, borderRadius: 5, marginTop: 20, marginBottom: -35}}>
            <Text style={{textAlign: 'center', paddingTop: 10, color: 'white'}}>Confirm</Text>
        </View>
        </Pressable>
    )
}