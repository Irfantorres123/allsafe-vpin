import { SafeAreaView, View, Text } from "react-native";
import { AddService } from "./components/AddService";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Apps } from "./components/Apps";
import { Login } from "./components/Login";
import { useFonts, Roboto_400Regular } from "@expo-google-fonts/roboto";
export default function App() {
  const Stack = createNativeStackNavigator();
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
  });
  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Apps"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Apps" component={Apps} />
          <Stack.Screen name="AddService" component={AddService} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
