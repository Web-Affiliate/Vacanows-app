import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

const generateToken = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
};

const NewsletterScreen = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailChange = (text) => {
        setEmail(text);
        setEmailError('');
    };

    const handleSubmit = () => {
        setIsLoading(true);

        const token = generateToken(64);
        const siteId = "/api/sitess/1";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Veuillez entrer une adresse e-mail valide.');
            setIsLoading(false);
            return;
        }

        axios.post(`${API_URL}/todos`, {
            mail: email,
            site: siteId,
            token: token,
        }, {
            headers: {
                'Content-Type': 'application/ld+json; charset=utf-8'
            }
        })
        .then((response) => {
            setIsLoading(false);
            if (response.status === 201 || response.status === 200) {
                Alert.alert('Inscription réussie', 'Votre adresse e-mail a été enregistrée avec succès.');
                setEmail('');
            } else {
                throw new Error('Une erreur s\'est produite lors de l\'enregistrement de votre adresse e-mail.');
            }
        })
        .catch((error) => {
            setIsLoading(false);
            console.error('Erreur :', error.message);
            Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'enregistrement de votre adresse e-mail. Veuillez réessayer plus tard.');
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Inscription à la newsletter</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Entrez votre adresse e-mail"
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCompleteType="email"
                    placeholderTextColor="#999"
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>S'inscrire</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E76F51',
        marginBottom: 20,
        textAlign: 'center',
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
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default NewsletterScreen;
