import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const JoinGroupScreen = ({ navigation }) => {
  const [groupCode, setGroupCode] = useState('');
  const navigate = useNavigation();

  const joinGroup = async () => {
    try {
      const response = await axios.get(`https://mathis.daniel-monteiro.fr/api/roomss?code=${groupCode}`);
      console.log('Join group response:', response.data);
      console.log('Group code:', groupCode);

      if (response.data['hydra:totalItems'] === 1) {
        const room = response.data['hydra:member'][0];
        navigation.navigate('CreateGroup', { roomId: room.id, groupCode: room.code });
      } else if (response.data['hydra:totalItems'] === 0) {
        Alert.alert('Code de groupe invalide', 'Veuillez saisir un code de groupe valide.');
      } else {
        Alert.alert('Erreur', 'Plusieurs salles de jeu correspondent au code de groupe saisi.');
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rejoindre un groupe</Text>
      <TextInput
        style={styles.input}
        placeholder="Code du groupe"
        keyboardType="numeric"
        value={groupCode}
        onChangeText={setGroupCode}
        maxLength={5}
      />
      <TouchableOpacity style={styles.button} onPress={joinGroup}>
        <Text style={styles.buttonText}>Rejoindre</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#B04F08',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JoinGroupScreen;
