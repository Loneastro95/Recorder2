import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity,ImageBackground  } from 'react-native';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        setRecording(recording);
      } else {
        setMessage("Please grant permission to app to access microphone");
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    let updatedRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI()
    });

    setRecordings(updatedRecordings);
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View>
        <Text>List</Text>
        <View key={index} style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => recordingLine.sound.replayAsync()} >
        <ImageBackground
            source={require('./assets/icons8-play-50.png')}
            style={styles.pics}
          />
        </TouchableOpacity>
        <Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration}</Text>
          <TouchableOpacity style={styles.button} onPress={() => Sharing.shareAsync(recordingLine.file)} >
          <ImageBackground
            source={require('./assets/share.png')}
            style={styles.pics}
          />
          </TouchableOpacity>
        </View></View>
      );
    });
  }

  return (
    <View style={styles.container}>
          <View style={styles.top}>
        <Text style={styles.header}>Record</Text>
      </View> 
      {getRecordingLines()}
      <Text>{message}</Text>
        <TouchableOpacity   
        onPress= {recording ? stopRecording : startRecording} style={styles.red}
        title={recording ? '' : 'Start Recording'}
                >
          <ImageBackground
            source={require('./assets/icons8-mic-50.png')}
            style={styles.pic}
          />
        </TouchableOpacity>
     
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
    top: {
    height: 100,
    width: 333,
    textAlign: 'center',
    backgroundColor: '#646464',
    marginBottom: 120,
  },
  header: {
    fontSize: 38,
    fontWeight: 'bold',
    marginTop: 15,
    color: 'white'
  },
  container: {
    flex: 1,
    backgroundColor: '#d9d9d9',
    alignItems: 'center',
    justifyContent: 'start',
  },
   row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    flex: 1,
    margin:16,
    
    
  },
   red: {
    height: 65,
    width: 65,
    backgroundColor: 'red',
    borderRadius: 50,
    
    
  },
  button: {
    margin: 16, 
  },
   pic:{
    marginLeft: 7,
    marginTop: 5
  },
  pics: {
    width: 30,
    height: 30,
  }

});