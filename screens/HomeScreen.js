import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ImageBackground, ScrollView, Image, Modal, Button } from 'react-native';
import PropTypes from 'prop-types';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [content, setContent] = useState(null);
  const [groupCode, setGroupCode] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [articles, setArticles] = useState([]);

  const generateCode = () => {
    const code = Math.floor(10000 + Math.random() * 90000);
    return code;
  };

  const generateRandomPseudo = () => {
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
          participants: 1,
          isStarted: false

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
        const pseudo = generateRandomPseudo();
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
    fetchRandomArticles();
  }, []);

  const fetchRandomArticles = async () => {
    try {
      const response = await axios.get(`${API_URL}/articless`);
      if (response.status === 200) {
        const randomArticles = response.data['hydra:member'].sort(() => 0.5 - Math.random()).slice(0, 10);
        setArticles(randomArticles);
      } else {
        throw new Error('Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const renderArticleCarouselItem = ({ item }) => (
    <TouchableOpacity style={styles.carouselItem2} onPress={() => handleArticlePress(item)}>
    <View style={styles.carouselItem2}>
      <ImageBackground source={{ uri: `https://m8abtvtsrl.vacanows.com/uploads/images/${item.image1}` }} style={styles.carouselImage}>
        <Text style={styles.carouselTitle}>{item.titre_1}</Text>
      </ImageBackground>
    </View>
    </TouchableOpacity>
  );

  const handleArticlePress = (article) => {
    navigation.navigate('VueArticlesScreen', { articleId: article.id });
  };

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

  const openModal = (text) => {
    setModalContent(text);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent('');
  };

  const removeHtmlTags = (textWithHtml) => {
    if (textWithHtml) {
      let textWithoutTags = textWithHtml.replace(/<[^>]*>?/gm, '');
      textWithoutTags = textWithoutTags.replace(/&nbsp;/g, '');
      return textWithoutTags;
    }
    return '';
  };

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

  const navigateToJoinGroup = () => {
    navigation.navigate('JoinGroup');
  };


  const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <ImageBackground source={item.image} style={styles.carouselImage}>
        <Text style={styles.carouselTitle}>{item.title}</Text>
      </ImageBackground>
    </View>
  );

  return (
    <ScrollView style={styles.background}>
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
            <View style={styles.paragraphContainer}>
              <Text numberOfLines={7} style={styles.subtitle}>{removeHtmlTags(content['hydra:member'][0].paragraph_1)}</Text>
              <TouchableOpacity onPress={() => openModal(removeHtmlTags(content['hydra:member'][0].paragraph_1))}>
                <Text style={styles.moreButtonText}>En savoir plus</Text>
              </TouchableOpacity>
            </View>
           <View>
            <Carousel
              layout="default"
              data={articles}
              sliderWidth={370}
              itemWidth={300}
              renderItem={renderArticleCarouselItem}
              loop={true}
            />
          </View>
            <Text style={styles.contentSubtitle}>{content['hydra:member'][0].sous_titre_1}</Text>
            <View style={styles.paragraphContainer}>
              <Text numberOfLines={7} style={styles.subtitle}>{removeHtmlTags(content['hydra:member'][0].paragraph_4)}</Text>
              <TouchableOpacity onPress={() => openModal(removeHtmlTags(content['hydra:member'][0].paragraph_4))}>
                <Text style={styles.moreButtonText}>En savoir plus</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.contentSubtitle}>{content['hydra:member'][0].sous_titre_2}</Text>
            <View style={styles.paragraphContainer}>
              <Text numberOfLines={7} style={styles.subtitle}>{removeHtmlTags(content['hydra:member'][0].paragraph_5)}</Text>
              <TouchableOpacity onPress={() => openModal(removeHtmlTags(content['hydra:member'][0].paragraph_5))}>
                <Text style={styles.moreButtonText}>En savoir plus</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.contentSubtitle}>{content['hydra:member'][0].sous_titre_3}</Text>
            <View style={styles.paragraphContainer}>
              <Text numberOfLines={7} style={styles.subtitle}>{removeHtmlTags(content['hydra:member'][0].paragraph_6)}</Text>
              <TouchableOpacity onPress={() => openModal(removeHtmlTags(content['hydra:member'][0].paragraph_6))}>
                <Text style={styles.moreButtonText}>En savoir plus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
          <View style={styles.contentContainerJoin}>
            <Text style={styles.contentTitle3}>Créez ou rejoignez un groupe pour démarrer votre recherche de voyage à plusieurs</Text>
            <View style={styles.formContainer}>
              <TouchableOpacity style={[styles.button, styles.buttonCreate]} onPress={generateGroupCode}>
                <Text style={styles.buttonText}>Créer un groupe</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonJoin]} onPress={navigateToJoinGroup}>
                <Text style={styles.buttonText}>Rejoindre un groupe</Text>
              </TouchableOpacity>
            </View>
          </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalText}>{modalContent}</Text>
            </ScrollView>
            <TouchableOpacity onPress={closeModal} style={{ backgroundColor: '#B04F08', marginTop: 20, paddingHorizontal: 50, paddingVertical: 10, borderRadius: 5 }}>
              <Text style={styles.buttonText}>Fermer</Text>
            </TouchableOpacity>
            </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#f9f9f9',
  },
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
  carouselItem2: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
    backgroundColor: '#fff',
  },
  contentSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B04F08',
    marginBottom: 20,
    textAlign: 'center',
  },

  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B04F08',
    marginBottom: 20,
    textAlign: 'center',
  },
  paragraphContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
    textAlign: 'justify',
  },
  moreButtonText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
    padding: 15,
    backgroundColor: '#B04F08',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#E76F51',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 25,
    width: '90%',
    maxHeight: '60%',
  },
  modalText: {
    fontSize: 16,
    color: '#777',
    lineHeight: 22,
  },
  buttonModal: {
    backgroundColor: '#B04F08',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  },
  contentContainerJoin: {
    marginTop: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    padding: 10,
    width: '100%',
    backgroundColor: '#fff',
  },
  contentTitle3: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#B04F08',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonJoin: {
    backgroundColor: '#B04F08',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginBottom: 20,
  },

  contentContainerJoin: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDEDED',
    padding: 20,
  },

  formContainer: {
    width: '80%',
  },

  buttonCreate: {
    backgroundColor: '#E76F51',
    marginBottom: 20,
    borderWidth:3,
    borderColor: '#B04F08',
  },
  buttonJoin: {
    backgroundColor: '#E76F51',
    borderWidth:3,
    borderColor: '#B04F08',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
