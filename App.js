import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Image } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import ArticlesScreen from './screens/ArticlesScreen';
import NewsletterScreen from './screens/NewsletterScreen';
import CreateGroupScreen from './screens/CreateGroupScreen';
import JoinGroupScreen from './screens/JoinGroupScreen';
import VueArticlesScreen from './screens/VueArticlesScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CustomHeader = () => {
  return (
    <View style={{ alignItems: 'center', marginBottom: 10 }}>
    <Image
      source={require('./assets/app/logo_vacanows.png')}
      style={{ width: 60, height: 60, alignSelf: 'center', marginBottom: 90, marginTop: 90, justifyContent: 'center', alignItems: 'center'}}
    />
    </View>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#ccc', // Couleur grise pour les icônes inactives
      tabBarStyle: {
        backgroundColor: '#B04F08',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
      },
      tabBarLabelStyle: {
        fontSize: 14,
        fontWeight: 'bold',
      },
      tabBarIcon: ({ color }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Articles') {
          iconName = 'newspaper';
        } else if (route.name === 'Newsletter') {
          iconName = 'email';
        }

        return <MaterialCommunityIcons name={iconName} color={color} size={26} />;
      },
    })}
  >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
          headerTitle: () => <CustomHeader />,
          headerStyle: {
            backgroundColor: '#f9f9f9',
          },
          headerTitleAlign: 'center', // Align the header title to the center
        }}
      />
      <Tab.Screen
        name="Articles"
        component={ArticlesScreen}
        options={{
          tabBarLabel: 'Articles',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="newspaper" color={color} size={26} />
          ),
          headerTitle: () => <CustomHeader />,
          headerStyle: {
            backgroundColor: '#f9f9f9',
          },
          headerTitleAlign: 'center', // Align the header title to the center
        }}
      />
      <Tab.Screen
        name="Newsletter"
        component={NewsletterScreen}
        options={{
          tabBarLabel: 'Newsletter',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="email" color={color} size={26} />
          ),
          headerTitle: () => <CustomHeader />,
          headerStyle: {
            backgroundColor: '#f9f9f9',
          },
          headerTitleAlign: 'center', // Align the header title to the center
        }}
      />
    </Tab.Navigator>
  );
};

// Composant de navigation pour l'écran CreateGroupScreen
const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: () => <CustomHeader />, // Utilize the custom header component
        headerStyle: {
          backgroundColor: '#f9f9f9',
        },
        headerTintColor: '#000', // Set the color of the header text
        headerTitleAlign: 'center', // Align the header title to the center
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateGroup"
        component={CreateGroupScreen}
        options={{ title: 'Créer un groupe' }}
      />
      <Stack.Screen
        name="JoinGroup"
        component={JoinGroupScreen}
        options={{ title: 'Rejoindre un groupe' }}
      />
      <Stack.Screen
        name="VueArticlesScreen"
        component={VueArticlesScreen}
        options={{ title: 'Article' }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
