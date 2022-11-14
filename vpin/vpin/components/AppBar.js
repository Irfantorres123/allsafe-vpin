import { View, Text, Button, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Camera } from "expo-camera";
import { styles } from "../styles/app";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export function AppBar(props) {
  const { setCameraActive } = props;
  return (
    <LinearGradient
      colors={["#FFCC70", "#C850C0", "#4158D0"]}
      locations={[0, 0.54, 1]}
      start={{ x: 0.9, y: 0 }}
      style={{ ...styles.appBar, height: 50 }}
    >
      <View style={{ flexDirection: "row" }}>
        <Title title="VPIN" style={{ flex: 1, alignSelf: "center" }} />
        <ActionButton
          style={{ flex: 0, backgroundColor: "white", borderRadius: 5 }}
          onOpen={() => {
            setCameraActive(true);
          }}
        />
      </View>
      <StatusBar style="auto" />
    </LinearGradient>
  );
}

function Title(props) {
  return (
    <Text
      style={{ ...props.style, textAlignVertical: "center", color: "white" }}
    >
      {props.title}
    </Text>
  );
}

function ActionButton(props) {
  const [hasPermission, setHasPermission] = useState(null);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.getCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  });
  if (hasPermission === null) {
    return <View />;
  }
  return (
    <View style={{ ...props.style, flexDirection: "row", borderRadius: 10 }}>
      <TouchableOpacity
        style={{
          backgroundColor: "#2196f3",
          display: "flex",
          flexDirection: "row",
          padding: 5,
          borderRadius: 5,
        }}
        onPress={async () => {
          if (!hasPermission) {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
          }
          if (hasPermission) {
            props.onOpen();
          }
        }}
      >
        <Text
          style={{
            marginRight: 5,
            alignSelf: "center",
            textAlignVertical: "center",
            fontSize: 15,
          }}
        >
          Scan
        </Text>
        <MaterialIcons name="qr-code-scanner" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}
