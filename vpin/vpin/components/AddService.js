import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { styles } from "../styles/app";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Loading } from "./Loading";
import { useEffect, useState } from "react";
import { useServer } from "../hooks/use_server";

export function AddService({ navigation }) {
  const [services, setServices] = useState(false);
  const [error, setError] = useState(false);
  const server = useServer();
  useEffect(() => {
    server
      .getServices()
      .then(async (services) => {
        let appKeys = await AsyncStorage.getAllKeys();
        let appValues = await AsyncStorage.multiGet(appKeys);
        let vcss = [];
        for (let i = 0; i < appValues.length; i++) {
          let vcs = JSON.parse(appValues[i][1]);
          vcss.push(vcs);
        }
        let filteredServices = services.filter((service) => {
          for (let i = 0; i < vcss.length; i++) {
            if (vcss[i].id === service._id) {
              return false;
            }
          }
          return true;
        });
        setServices((prev) => filteredServices);
      })
      .catch((err) => {
        setError(true);
      });
  }, []);
  if (error) {
    return (
      <View style={{ display: "flex", alignItems: "center", padding: 15 }}>
        <Text style={{ color: "red" }}>Error while loading the services</Text>
      </View>
    );
  }
  return services ? (
    <View
      style={[
        styles.centeredView,
        { width: "100%", marginTop: Platform.OS === "android" ? 40 : 0 },
      ]}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          alignSelf: "stretch",
          padding: 10,
          borderLeftColor: "#000",
          borderLeftWidth: 1,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text
            style={{
              flex: 0,
              height: 45,
              fontSize: 20,
              display: "flex",
              fontWeight: "bold",
              flexDirection: "row",
              padding: 10,
              textAlignVertical: "center",
            }}
          >
            Services
          </Text>
        </View>

        <View style={{ width: "100%", backgroundColor: "black", height: 2 }} />
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            alignSelf: "stretch",
          }}
        >
          <ScrollView style={{ alignSelf: "stretch", padding: 10 }}>
            {services.map((service, i) => {
              return (
                <TouchableOpacity
                  key={service._id}
                  style={[
                    styles.button,
                    styles.buttonClose,
                    {
                      display: "flex",
                      flexDirection: "row",
                      alignSelf: "stretch",
                      borderRadius: 10,
                      alignItems: "center",
                      backgroundColor: "#fff",
                      margin: 3,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 2,
                        height: 2,
                      },
                      height: 50,
                      shadowOpacity: 0.25,
                      shadowRadius: 2,
                      elevation: 5,
                      paddingHorizontal: 10,
                    },
                    ,
                    i === services.length - 1 ? { marginBottom: 20 } : {},
                  ]}
                  onPress={() => {
                    navigation.navigate("Login", { service: service });
                  }}
                >
                  <FontAwesome
                    name="bank"
                    size={24}
                    color={["#000", "#2069e0", "#f4d47c"][i % 3]}
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={{
                      color: "black",
                      textAlignVertical: "center",
                      alignSelf: "center",
                    }}
                  >
                    {service.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  ) : (
    <Loading />
  );
}
