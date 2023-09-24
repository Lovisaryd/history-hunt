import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PickPhotoBtn from '../ui/PickPhotoBtn';

export const NewHunt = ({setNewHuntObj, newHuntObj, styles, huntPhoto, setHuntPhoto}) => {
  const navigation = useNavigation();
  const [duration, setDuration] = useState('');
  const [huntName, setHuntName] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setHuntPhoto(null)
  },[])

  const handleNext = async () => {
    if (duration.trim() === '' || huntName.trim() === '') {
      setShowError(true);
    } else {
      setNewHuntObj({...newHuntObj, duration: duration, title: huntName})
      navigation.navigate("MapScreen", {context: 'create'});
    }

  };

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', marginTop: 40, marginBottom: 30}}>
        <Text style={styles.subHeader}>How long should it be?</Text>
        <TextInput
        style={styles.inputField}
          placeholder="You pick!"
          value={duration}
          onChangeText={text => setDuration(text)}
        />
      </View>

      <View style={{alignItems: 'center'}}>
        <Text style={styles.subHeader}>What's it called?</Text>
        <TextInput
        style={styles.inputField}
          placeholder="Name your hunt"
          value={huntName}
          onChangeText={text => setHuntName(text)}
        />
      </View>

      <PickPhotoBtn huntPhoto={huntPhoto} styles={styles} navigation={navigation} />

      {showError && (
        <Text style={{color: 'red', textAlign: 'center', marginTop: 20}}>All fields must be filled out</Text>
      )}
      <View>
        <TouchableOpacity onPress={handleNext}>
          <Text style={{alignSelf: 'center', marginTop: 30, width: '80%', backgroundColor: '#b671b6', height: 50, textAlign: 'center', paddingTop: 15, borderRadius: 10}}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}