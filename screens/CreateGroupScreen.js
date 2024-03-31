import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const CreateGroupScreen = ({ route }) => {
  const { roomId } = route.params;
  const [pseudo, setPseudo] = useState(null);
  const [participants, setParticipants] = useState(0);
  const [code, setCode] = useState('');

  const generateRandomPseudo = () => {
    const randomSuffix = Math.floor(Math.random() * 10000);
    return `user_${randomSuffix}`;
  };

  const checkIfUserConnected = () => {
    const storedPseudo = '';
    if (storedPseudo) {
      setPseudo(storedPseudo);
    } else {
      const newPseudo = generateRandomPseudo();
      setPseudo(newPseudo);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`https://mathis.daniel-monteiro.fr/api/roomss/${roomId}`);
      if (response.status === 200) {
        setParticipants(response.data.participants);
        setCode(response.data.code);
      } else {
        throw new Error('Failed to fetch participants');
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  useEffect(() => {
    checkIfUserConnected();
    fetchParticipants();
  }, []);

  const startDisabled = participants < 2;

  const handleStart = () => {
    console.log('Starting game...');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un groupe</Text>
      <Text>Code du groupe: {code}</Text>
      <Text>Nombre de participants: {participants}</Text>
      <Text>Pseudo : {pseudo}</Text>
      <TouchableOpacity
        style={[styles.startButton, startDisabled && styles.disabledButton]}
        onPress={handleStart}
        disabled={startDisabled}
      >
        <Text style={styles.buttonText}>Commencer</Text>
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
  startButton: {
    backgroundColor: '#B04F08',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc', // Couleur grise pour le bouton désactivé
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CreateGroupScreen;
