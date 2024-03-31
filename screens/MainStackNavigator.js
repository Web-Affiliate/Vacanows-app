import { createStackNavigator } from '@react-navigation/stack';
import VueArticlesScreen from './VueArticlesScreen';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="VueArticlesScreen" component={VueArticlesScreen} />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
