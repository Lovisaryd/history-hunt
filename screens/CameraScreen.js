import { Camera, CameraType } from "expo-camera"
import { View, Image, Pressable, Dimensions, Text, Button, CameraRoll } from "react-native"
import { useLayoutEffect, useRef, useState, useContext } from "react"
import cameraIcon from '../assets/icons8-camera-50.png'
import Preview from "../components/Preview"
import changeCamera from '../assets/icons8-refresh-50.png'

const CameraScreen = ({styles, route, setHuntPhoto, setPlacePhoto, setCheckedOff, checkedOff, setHunts}) => {
    const cameraRef = useRef()
    const [photo, setPhoto] = useState()
    const context = route.params.context;
    const location = route.params.lat;
    const markers = route.params.markers
    const huntObj = route.params.hunt
    const [cameraPermission, requestCameraPermission] =
    Camera.useCameraPermissions();

  if (!cameraPermission) {
    return <View />;
  }
  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestCameraPermission} title="grant permission" />
      </View>
    );
  }

    const takePicture = async () =>{
        if(cameraRef.current){
            const aspectRatio = '4:3'
           const takenPhoto = await cameraRef.current.takePictureAsync({quality: 1 , exif: false, pictureSizes: [aspectRatio]})
           setPhoto(takenPhoto)
        }
    }
 
    if(photo){
      return (
          <Preview photo={photo} styles={styles} context={context} setHuntPhoto={setHuntPhoto} setPlacePhoto={setPlacePhoto} location={location} setCheckedOff={setCheckedOff} checkedOff={checkedOff} markers={markers} huntObj={huntObj} setHunts={setHunts}/>)
    } else{
      return(
        <View> 
            <Camera ref={cameraRef} type={CameraType.back} style={styles.camera} ratio="16:9"/>
            <Pressable onPress={takePicture} style={{position: 'absolute', zIndex:1, alignSelf: 'center', bottom: '10%'}}>
            <Image source={cameraIcon} style={styles.addPhoto} />
            </Pressable>
        </View>
      )
    }
}

export default CameraScreen