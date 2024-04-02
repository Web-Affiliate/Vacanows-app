import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const CreateGroupScreen = ({ route }) => {
  const { roomId } = route.params;
  const { userId } = route.params;
  const [participants, setParticipants] = useState(0);
  const [code, setCode] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [pseudo, setPseudo] = useState('');

  const navigation = useNavigation();

  const removeUserFromTable = async () => {
    try {
      const response = await axios.delete(`${API_URL}/users_apps/${userId}`);
      if (response.status === 204) {
        console.log('User successfully removed from table');
      } else {
        throw new Error('Failed to remove user from table');
      }
    } catch (error) {
      console.error('Error removing user from table:', error);
    }
  };

  const removePseudo = async () => {
    try {
      await removeUserFromTable();
      await AsyncStorage.removeItem('randomPseudo');
      setPseudo('');
    } catch (error) {
      console.error('Error removing random pseudo:', error);
    }
  };

  const removeRoomIfEmpty = async () => {
    if (participants === 0) {
        const response = await axios.delete(`${API_URL}/roomss/${roomId}`);
        if (response.status === 204) {
          console.log('Room successfully removed');
        } else {
          throw new Error('Failed to remove room');
        }

    } else {
      console.log('Room cannot be removed as it still has participants.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      removePseudo();
      console.log('Pseudo removed');
      removeRoomIfEmpty();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchParticipants = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/roomss/${roomId}`);
      if (response.status === 200) {
        setParticipants(response.data.participants);
        setCode(response.data.code);
        const usersResponse = await axios.get(`${API_URL}/users_apps?rooms=/api/roomss/${roomId}`);
        if (usersResponse.status === 200) {
          setUsers(usersResponse.data['hydra:member']);
          setParticipants(usersResponse.data['hydra:member'].length);

          // Vérifier si le jeu a commencé
          if (response.data.isStarted) {
            // Si le jeu a commencé, rediriger chaque utilisateur vers la page du jeu
            usersResponse.data['hydra:member'].forEach(user => {
              navigation.navigate('GameScreen', { roomId, userId: user.id, participants });
            });
          }
        } else {
          throw new Error('Failed to fetch users');
        }
      } else {
        throw new Error('Failed to fetch participants');
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isStarting) {
      fetchParticipants();
    }
  }, [isStarting]);


  useEffect(() => {
    retrieveRandomPseudo();
    fetchParticipants();

    const interval = setInterval(() => {
      fetchParticipants();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const retrieveRandomPseudo = async () => {
    try {
      const storedPseudo = await AsyncStorage.getItem('randomPseudo');
      if (storedPseudo !== null) {
        setPseudo(storedPseudo);
      }
    } catch (error) {
      console.error('Error retrieving random pseudo:', error);
    }
  };

  const startDisabled = participants < 2;

  const handleStart = async () => {
    console.log('Starting game...');

    try {
      const response = await axios.patch(`${API_URL}/roomss/${roomId}`, { isStarted: true }, {
        headers: {
          'Content-Type': 'application/merge-patch+json'
        }
      });
      if (response.status === 200) {
        console.log('Game started successfully');
        navigation.navigate('GameScreen', { roomId, userId, participants });
      } else {
        throw new Error('Failed to start game');
      }
    }
    catch (error) {
      console.error('Error starting game:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un groupe</Text>
      <Text style={styles.text}>Code du groupe: {code}</Text>
      <Text style={styles.text}>Nombre de participants: {participants}</Text>
      <Text style={styles.text}>Username : {pseudo}</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeaderCell, styles.headerColor]}>Participants</Text>
          </View>
          {users.map(user => (
            <View key={user.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{user.nom} {user.nom === pseudo ? "(Vous)" : ""}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[styles.startButton, startDisabled && styles.disabledButton]}
        onPress={handleStart}
        disabled={startDisabled}
      >
        <Text style={styles.buttonText}>Commencer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={fetchParticipants}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Actualiser</Text>
        )}
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
    color: '#B04F08',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#777',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  table: {
    width: '100%',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#B04F08',
    borderRadius: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#B04F08',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  headerColor: {
    backgroundColor:  '#B04F08',
  },
  tableCell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#B04F08',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginTop: 20,
  },
  refreshButton: {
    backgroundColor: '#B04F08',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CreateGroupScreen;
