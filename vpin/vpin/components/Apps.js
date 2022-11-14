import { Platform, View, StatusBar } from "react-native";
import { AppBar } from "./AppBar";
import { CameraType } from "expo-camera";
import { Body } from "./Body";
import { loadAndStoreVCS } from "../lib/db";
import { CameraView } from "./CameraView";
import { styles } from "../styles/app";
import { useState } from "react";

export function Apps({ navigation, route }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [type, setType] = useState(CameraType.back);
  const [codeError, setCodeError] = useState(false);
  const { params } = route;
  const { loggedIn } = params || {};
  return (
    <View
      style={{
        paddingTop:
          Platform.OS === "android" && !cameraActive
            ? StatusBar.currentHeight
            : 0,
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      {!cameraActive && (
        <>
          <AppBar styles={styles} setCameraActive={setCameraActive} />
          <Body styles={styles} navigation={navigation} update={loggedIn} />
        </>
      )}
      {cameraActive && (
        <CameraView
          type={type}
          onClose={() => {
            setCameraActive(false);
          }}
          onFlip={() => {
            setType(
              type === CameraType.back ? CameraType.front : CameraType.back
            );
          }}
          onScan={async (data) => {
            setCameraActive(false);
            let result = await loadAndStoreVCS(data);
            if (result.status === "error") {
              setCodeError(true);
            }
          }}
          styles={styles}
        />
      )}
    </View>
  );
}
