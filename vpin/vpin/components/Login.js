import { useEffect, useState } from "react";
import { TextInput, TouchableOpacity, View, Text } from "react-native";
import { styles } from "../styles/app";
import { MaterialIcons } from "@expo/vector-icons";
import { useServer } from "../hooks/use_server";
import { loadAndStoreVCS } from "../lib/db";
import { LinearGradient } from "expo-linear-gradient";

export function Login({ navigation, route }) {
  const [username, setUsername] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const { params } = route;
  const { service } = params;
  let server = useServer();
  useEffect(() => {
    setUsername("");
    setAccountNumber("");
  }, []);
  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: "auto",
        height: "100%",
      }}
    >
      <LinearGradient
        colors={["#FFCC70", "#C850C0", "#4158D0"]}
        locations={[0, 0.46, 1]}
        start={{ x: 0.95, y: 0.5 }}
        style={[
          styles.loginCenterContainer,
          {
            padding: 10,
            borderRadius: 10,
            marginBottom: 10,
            shadowOffset: { width: 2, height: 2 },
            elevation: 5,
          },
        ]}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            textAlign: "center",
            padding: 20,
            color: "#000",
          }}
        >
          Authenticate with {service.name}
        </Text>
        <MaterialIcons
          name="login"
          size={48}
          color="#000"
          style={{
            marginBottom: 40,
          }}
        />
        <TextInput
          style={styles.loginInput}
          placeholder="Username"
          placeholderTextColor="gray"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
          }}
        />
        <TextInput
          style={[styles.loginInput, { marginBottom: 40 }]}
          placeholder="Account Number"
          placeholderTextColor="gray"
          keyboardType="numeric"
          value={accountNumber}
          onChangeText={(text) => {
            setAccountNumber(text.replace(/[^0-9]/g, ""));
          }}
        />
        <TouchableOpacity
          style={{
            padding: 10,
            borderRadius: 5,
            backgroundColor: "#2196f3",
            elevation: 5,
          }}
          onPress={async () => {
            try {
              let { code, userId } = await server.login(
                username,
                accountNumber,
                service.token
              );
              const result = await loadAndStoreVCS(code, userId, username);
              navigation.navigate("Apps", { loggedIn: Date.now() });
            } catch (err) {
              console.log(err);
            }
          }}
        >
          <Text>Authenticate</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
