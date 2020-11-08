import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet,Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { Marker } from 'react-native-maps';
import haversine from 'haversine';
import { Audio } from 'expo-av';




export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const end = {
    latitude: 41.7211464,
    longitude: 44.7574263
  }
  

  const playSound = async () => {
    console.log("SOUND PLAYING")
    try {
      const {
        sound: soundObject,
        status,
      } = await Audio.Sound.createAsync(require('./assets/sounds/near.mp3'), { shouldPlay: true });
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
   }
   
  useEffect(() => {
    
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }
      let location = await Location.watchPositionAsync({ accuracy: Location.Accuracy.Balanced, timeInterval: 60000, distanceInterval: 50 }, (loc) => {
        
        if (haversine({latitude: loc.coords.latitude, longitude:loc.coords.longitude}, end, {threshold: 500, unit: 'meter'})) {playSound()} ;
       
        
        setLocation(loc.coords)});
     
    })();
  }, []);


  if (location )
  return (
    <View style={styles.container}>
      <MapView
          style={{ flex: 1}}
          region={{ latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.0021, longitudeDelta: 0.0021 }}
          
        >
    <MapView.Marker
      coordinate={location}
      title="My Marker"
      description="Some description"
    />
        </MapView>
       <View style={{flex:1}}>
       <Text style={{flex:1}}>მანქანის კოორდინატები: {JSON.stringify(location.latitude)} {JSON.stringify(location.longitude)}</Text>
       <Text style={{flex:1}}>სამსახურის კოორდინატები: {JSON.stringify(end.latitude)} {JSON.stringify(end.longitude)}</Text>
       <Text style={{flex:1}}>500 მეტრის რეინჯის სტატუსი: {String(haversine({latitude: location.latitude, longitude:location.longitude}, end, {threshold: 500, unit: 'meter'}))}</Text>
       <Text style={{flex:1}}>სიჩქარე: {JSON.stringify(location.speed*3.6)} კმ/ს</Text>
       </View>
    </View>
  ); else return <View></View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row"
    
  },
  mapStyle: {
    flex:1
  }
});