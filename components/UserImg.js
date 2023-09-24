import { Pressable, Image, View } from "react-native"

const UserImg = ({navigation, avatar, styles}) => {
    if(avatar != ''){
        return(
        <View>
            <Pressable onPress={() => navigation.navigate('CameraScreen', {context: 'avatar'})}>
            <Image source={{uri: avatar}} style={styles.img} onError={(error) => console.log(error)}></Image>
            </Pressable>
        </View>
    )
    }
    
  }

  export default UserImg