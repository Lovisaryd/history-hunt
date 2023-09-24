import { Pressable, View,Text, Image } from "react-native"


const PickPhotoBtn = ({huntPhoto, styles, navigation}) => {

    const pickphoto = () =>{
        navigation.navigate('CameraScreen', {context: 'create'})
      }
      
    return(
      <Pressable onPress={pickphoto}>
        <View style={styles.picturebtn} >
        <Text style={{color: 'white', alignSelf: 'center', paddingTop: '5%'}}>Choose an avatar for you hunt</Text>
        
        {huntPhoto && <Image source={{uri: huntPhoto.uri}} style={{width: 100, height:100, borderRadius: 50, alignSelf: 'center', marginTop: 20}}/>}
        </View>
      </Pressable>
    )
  }

  export default PickPhotoBtn