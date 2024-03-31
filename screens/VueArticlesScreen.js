import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Linking } from 'react-native';
import { Button } from 'react-native-elements';
import axios from 'axios';

const VueArticlesScreen = ({ route }) => {
    const { articleId } = route.params;
    const [article, setArticle] = useState(null);

    useEffect(() => {
        fetchArticle();
    }, []);

    const fetchArticle = async () => {
        try {
            const response = await axios.get(`https://mathis.daniel-monteiro.fr/api/articless/${articleId}`);
            if (response.status === 200) {
                setArticle(response.data);
            } else {
                throw new Error('Failed to fetch article');
            }
        } catch (error) {
            console.error('Error fetching article:', error);
        }
    };

    const removeHtmlTags = (textWithHtml) => {
        return textWithHtml.replace(/<[^>]+>/g, '');
    };

    const openAffiliateLink = () => {
        if (article && article.affiliate_link) {
            Linking.openURL(article.affiliate_link);
        }
    };

    return (
        <ScrollView style={styles.container}>
            {article ? (
                <>
                    <Text style={styles.title}>{article.titre_1}</Text>
                    <Text style={styles.paragraph}>{removeHtmlTags(article.paragraph_1)}</Text>
                    <Text style={styles.temps_lecture}>Temps de lecture: {article.temps_lecture} min</Text>
                    <Image
                        source={{ uri: `https://mathis.daniel-monteiro.fr/uploads/images/${article.image_1}` }}
                        style={styles.image}
                    />
                    <Text style={styles.title}>{article.titre_2}</Text>
                    <Text style={styles.paragraph}>{removeHtmlTags(article.paragraph_2)}</Text>
                    <Text style={styles.title}>{article.titre_3}</Text>
                    <Text style={styles.paragraph}>{removeHtmlTags(article.paragraph_3)}</Text>
                    <Button
                        title="Lien vers TripAdvisor"
                        buttonStyle={{ backgroundColor: '#B04F08', borderRadius: 10, marginBottom: 50 }}
                        onPress={openAffiliateLink}
                    />
                </>
            ) : (
                <Text>Loading...</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#B04F08',
        marginBottom: 20,
    },
    content: {
        fontSize: 16,
        color: '#555',
    },
    paragraph: {
        fontSize: 16,
        color: '#777',
        marginBottom: 20,
        textAlign: 'justify',
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 20,
        marginTop: 20,
        borderRadius: 10,
    },
    temps_lecture: {
        fontSize: 16,
        backgroundColor: '#B04F08',
        color: '#fff',
        borderRadius: 15,
        width: 220,
        height: 55,
        padding: 10,
        textAlign: 'center',
        lineHeight: 30,
    },
});

export default VueArticlesScreen;
