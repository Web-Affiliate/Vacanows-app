import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ImageBackground, ScrollView, Image  } from 'react-native';
import PropTypes from 'prop-types';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [content, setContent] = useState(null);
  const [groupCode, setGroupCode] = useState(null);


  const generateCode = () => {
    const code = Math.floor(10000 + Math.random() * 90000);
    return code;
  };

  const geenrateRandomPseudo = () => {
    const randomSuffix = Math.floor(Math.random() * 10000);
    const user = `user_${randomSuffix}`;

    return user;
  }

  const generateGroupCode = async () => {
    try {
      const code = generateCode();
      setGroupCode(code);
      console.log('Group code:', code);
      const response = await axios.post(
        `${API_URL}/roomss`,
        {
          code: code,
          participants: 1
        },
        {
          headers: {
            'Content-Type': 'application/ld+json'
          }
        }
      );
      if (response.status === 201) {
        console.log('Room created successfully:', response.data);
        const roomId = response.data.id;
        const pseudo = geenrateRandomPseudo();
        await AsyncStorage.setItem('randomPseudo', pseudo);
        console.log('Pseudo:', pseudo);
        console.log('Room ID:', `/api/roomss/${roomId}`);
        const userResponse = await axios.post(
          `${API_URL}/users_apps`,
          {
            nom: pseudo,
            rooms: `/api/roomss/${roomId}`
          },
          {
            headers: {
              'Content-Type': 'application/ld+json'
            }
          }
        );
        if (userResponse.status === 201) {
          console.log('User created successfully:', userResponse.data);
          const userId = userResponse.data.id;
          navigation.navigate('CreateGroup', { roomId: roomId, userId: userId });
        } else {
          throw new Error('Failed to create user');
        }
            } else {
        throw new Error('Failed to create room');
            }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };


  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${API_URL}/contents`);
      if (response.status === 200) {
        setContent(response.data);
      } else {
        throw new Error('Failed to fetch content');
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };


  const navigateToJoinGroup = () => {
    navigation.navigate('JoinGroup');
  };

//   const removeHtmlTags = (textWithHtml) => {
//     return textWithHtml.replace(/<[^>]+>/g, '');
// };

  const carouselItems = [
    {
      image: require('../assets/app/image_1.webp'),
      title: 'Nos Guides',
    },
    {
      image: require('../assets/app/image_2.png'),
      title: 'Nos Hotels',
    },
    {
      image: require('../assets/app/image_3.webp'),
      title: 'Nos Restaurants',
    },
    {
      image: require('../assets/app/image_4.webp'),
      title: 'Nos Activités',
    }
  ];

  const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <ImageBackground source={item.image} style={styles.carouselImage}>
        <Text style={styles.carouselTitle}>{item.title}</Text>
      </ImageBackground>
    </View>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <Carousel
          layout="default"
          data={carouselItems}
          sliderWidth={400}
          itemWidth={300}
          renderItem={renderCarouselItem}
          loop={true}
        />
        {content && (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>{content['hydra:member'][0].titre_1}</Text>
            <Text style={styles.contentParagraph}>Découvrez Vacanows, votre guide ultime pour des voyages sans frontières. Explorez des destinations exotiques, des guides pratiques et des recommandations de restaurants, le tout à portée de clic.</Text>
            <Image
              source={{ uri: `https://mathis.daniel-monteiro.fr/uploads/images/${content['hydra:member'][0].image_1_no_border}` }}
              style={{ width: '100%', height: 200, marginBottom: 20 }}
            />
          </View>
        )}
        <Text style={styles.contentTitle2}>Créez ou rejoignez un groupe pour démarrer votre recherche de voyage à plusieurs</Text>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={generateGroupCode}>
          <Text style={styles.buttonText}>Créer un groupe</Text>
        </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToJoinGroup}>
            <Text style={styles.buttonText}>Rejoindre un groupe</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};


HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  carouselItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselImage: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
    overflow: 'hidden',
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 'auto',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    width: '100%',
  },
  contentContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    padding: 10,
    width: '100%',
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B04F08',
    marginBottom: 20,
    textAlign: 'center',
  },
  contentParagraph: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
    lineHeight: 20,
    textAlign: 'center',
    },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
    textAlign: 'justify',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#B04F08',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentTitle2: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#B04F08',
    marginBottom: 20,
    marginTop: 20,
  },
});

export default HomeScreen;
