import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { API_URL } from '@env';

const GameScreen = ({ route, navigation }) => {
    const { roomId, userId, participants } = route.params;
    const [categories, setCategories] = useState([]);
    const [randomCategory, setRandomCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
        navigation.setOptions({
            headerLeft: null,
        });
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/categoriess`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setCategories(data);
                const randomIndex = Math.floor(Math.random() * data.length);
                setRandomCategory(data[randomIndex]);
            } else {
                console.error('Fetched data is not an array:', data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Page du jeu</Text>
            <Text>Pseudos des participants dans la room {roomId} :</Text>
            {Array.isArray(participants) &&
                participants.map((pseudo, index) => <Text key={index}>{pseudo}</Text>)}

            <Text>Category Image:</Text>
            {randomCategory && (
                <Image
                    source={{ uri: `${API_URL}/uploads/images/${randomCategory.image}` }}
                    style={styles.categoryImage}
                    resizeMode="cover"
                />
            )}

            {/* Implement your swipe functionality here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E76F51',
    },
    categoryImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
});

export default GameScreen;
