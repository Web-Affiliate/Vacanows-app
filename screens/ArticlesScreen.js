import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


const ArticlesScreen = () => {
  const [articles, setArticles] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('https://mathis.daniel-monteiro.fr/api/articless');
      if (response.status === 200) {
        // Extract the necessary fields from each article
        const extractedArticles = response.data['hydra:member'].map(async article => {
          const sousCategoriesResponse = await axios.get(`https://mathis.daniel-monteiro.fr${article.sous_categories_2}`);
          console.log(sousCategoriesResponse);
          const sousCategories2 = sousCategoriesResponse.data;
          return {
            nom: sousCategories2.nom,
            titre_1: article.titre_1,
            image: article.image_1,
            created_date: new Date(article.created_date).toLocaleDateString('fr-FR'),
            id: article.id,
          };
        });
        const resolvedArticles = await Promise.all(extractedArticles);
        setArticles(resolvedArticles);
      } else {
        throw new Error('Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const handleArticlePress = (article) => {
    navigation.navigate('VueArticlesScreen', { articleId: article.id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nos articles</Text>
      <ScrollView style={styles.scrollView}>
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <TouchableOpacity key={index} style={styles.card} onPress={() => handleArticlePress(article)}>
              <Image
                source={{ uri: `https://mathis.daniel-monteiro.fr/uploads/images/${article.image}` }}
                style={styles.leftImage}
              />
              <View style={styles.contentContainer}>
                <Text style={styles.cardTitle}>Voyage à {article.nom}</Text>
                <Text style={styles.cardDescription}>{article.titre_1}</Text>
                <Text style={styles.cardDate}>{article.created_date}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.notfoundArticles}>Loading ...</Text>
        )}
      </ScrollView>
    </View>
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
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 10,
  },
  leftImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 5,
    margin: 5,
  },
  rightImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 5,
    position: 'absolute',
    margin: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B04F08',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 16,
    marginBottom: 5,
  },
  cardDate: {
    fontSize: 14,
    color: '#555',
  },
  notfoundArticles: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
});


export default ArticlesScreen;
