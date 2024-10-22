import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import axios from 'axios';
import { API_URL } from '@env';
import { Dimensions } from 'react-native';

const GameScreen = ({ route, navigation }) => {
  const { roomId, userId } = route.params;
  const [randomCategory, setRandomCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchRandomCategory();
  }, []);

const fetchRandomCategory = async () => {
    try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/categoriess`);
        if (response.status === 200) {
            const categories = response.data['hydra:member'];
            const randomIndex = Math.floor(Math.random() * categories.length);
            setRandomCategory(categories[randomIndex]);
            // Reset the translateX value to 0
            translateX.setValue(0);
        } else {
            throw new Error('Failed to fetch categories');
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    } finally {
        setIsLoading(false);
    }
};

  const onGestureEvent = Animated.event([{ nativeEvent: { translationX: translateX } }], {
    useNativeDriver: true,
  });

  const onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
        const { translationX, velocityX } = event.nativeEvent;

        if (translationX > 100 && velocityX > 500) {
            console.log('Validé');
            // Animer la translation vers la droite
            Animated.spring(translateX, {
                toValue: 500,
                useNativeDriver: true,
            }).start(() => fetchRandomCategory());
        } else if (translationX < -100 && velocityX < -500) {
            console.log('Non validé');
            // Animer la translation vers la gauche
            Animated.spring(translateX, {
                toValue: -500,
                useNativeDriver: true,
            }).start(() => fetchRandomCategory());
        } else {
            // Retourner à la position initiale
            Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        }
    }
};

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.categoryContainer,
            {
              transform: [
                { translateX: translateX },
                { scaleX: translateX.interpolate({
                    inputRange: [-500, 0, 500],
                    outputRange: [0.5, 1, 0.5],
                  })
                },
                { rotate: translateX.interpolate({
                    inputRange: [-500, 0, 500],
                    outputRange: ['-30deg', '0deg', '30deg'],
                  })
                },
              ],
            },
          ]}
        >
          {randomCategory ? (
            <>
              <Image
                source={{ uri: `https://m8abtvtsrl.vacanows.com/uploads/images/${randomCategory.image}` }}
                style={styles.categoryImage}
                resizeMode="cover"
              />
              <Text style={styles.categoryTitle}>{randomCategory.nom}</Text>
            </>
          ) : isLoading ? (
            <ActivityIndicator size="large" color="#B04F08" />
          ) : (
            <Text>No category available</Text>
          )}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    categoryContainer: {
        alignItems: 'center',
    },
    categoryImage: {
        width: windowWidth * 0.95,
        height: windowWidth * 0.95,
        borderRadius: 10,
        marginBottom: 10,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
    },
});

export default GameScreen;
