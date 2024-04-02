import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';
import { Picker } from '@react-native-picker/picker';

const ArticlesScreen = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchCategories();
    fetchArticles(); // Call fetchArticles() on initial render to display all articles by default
  }, []);

  useEffect(() => {
    if (selectedCategory !== '') {
      fetchArticles();
    }
  }, [selectedCategory]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/articless`;
      const response = await axios.get(url, {
        params: {
          'sous_categories_2.sous_categorie_1.categories': selectedCategory
        }
      });
      if (response.status === 200) {
        const extractedArticles = response.data['hydra:member'].map(async article => {
          // Extract the necessary fields from each article
          const sousCategoriesResponse = await axios.get(`https://mathis.daniel-monteiro.fr${article.sous_categories_2}`);
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
        setLoading(false);
      } else {
        throw new Error('Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setLoading(false);
    }
  };

  const handleCategoryChange = (itemValue, itemIndex) => {
    setSelectedCategory(itemValue);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categoriess`);
      if (response.status === 200) {
        setCategories(response.data['hydra:member']);
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleArticlePress = (article) => {
    navigation.navigate('VueArticlesScreen', { articleId: article.id });
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={handleCategoryChange}
        style={styles.picker}
        dropdownIconColor="#fff"
      >
        <Picker.Item label="Toutes les catégories" value={`${API_URL}/articless`} style={styles.pickerItem} />
        {categories.map((category, index) => (
          <Picker.Item key={index} label={category.nom} value={category.id} style={styles.pickerItem} />
        ))}
      </Picker>
      {loading ? (
        <ActivityIndicator size="large" color="#B04F08" style={styles.loader} />
      ) : (
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
            <Text style={styles.notfoundArticles}>Aucun article trouvé.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
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
  picker: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#B04F08',
    color: '#fff',
    fontWeight: 'bold',
  },
  pickerItem: {
    fontSize: 18,
  },
  loader: {
    marginTop: 20,
  },
});

export default ArticlesScreen;
