import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JoinGroupScreen = ({ navigation }) => {
  const [groupCode, setGroupCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigation();

  const generateRandomPseudo = () => {
    const randomSuffix = Math.floor(Math.random() * 10000);
    const user = `user_${randomSuffix}`;
    return user;
  }

  const joinGroup = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/roomss?code=${groupCode}`);
      console.log('Join group response:', response.data);
      console.log('Group code:', groupCode);

      if (response.data['hydra:totalItems'] === 1) {
        const room = response.data['hydra:member'][0];

        const pseudo = generateRandomPseudo();

        const userResponse = await axios.post(
          `${API_URL}/users_apps`,
          {
            nom: pseudo,
            rooms: `/api/roomss/${room.id}`
          },
          {
            headers: {
              'Content-Type': 'application/ld+json'
            }
          }
        );

        if (userResponse.status === 201) {
          console.log('User created successfully:', userResponse.data);
          await AsyncStorage.setItem('randomPseudo', pseudo);
          const userId = userResponse.data.id;

          navigation.navigate('CreateGroup', { roomId: room.id, groupCode: groupCode, userId: userId });
        } else {
          throw new Error('Failed to create user');
        }
      } else if (response.data['hydra:totalItems'] === 0) {
        Alert.alert('Code de groupe invalide', 'Veuillez saisir un code de groupe valide.');
      } else {
        Alert.alert('Erreur', 'Plusieurs salles de jeu correspondent au code de groupe saisi.');
      }
    } catch (error) {
      console.error('Error joining group:', error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
      <Text style={styles.title}>Rejoindre un groupe</Text>
      <TextInput
        style={styles.input}
        placeholder="Code du groupe"
        keyboardType="numeric"
        value={groupCode}
        onChangeText={setGroupCode}
        maxLength={5}
      />
      <TouchableOpacity
        style={[styles.button, isLoading && styles.disabledButton]}
        onPress={isLoading ? null : joinGroup}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Rejoindre</Text>
        )}
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  formContainer: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
},
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E76F51',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#333',
  },
  button: {
    backgroundColor: '#E76F51',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default JoinGroupScreen;
