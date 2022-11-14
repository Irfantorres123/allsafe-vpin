import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { decrypt } from "../cryptography/ciphers";
import { Call, decodeCall } from "../vcs/call";
import { VCS } from "../vcs/vcs";
import CryptoJS from "crypto-js";
import * as Clipboard from "expo-clipboard";
import SnackBar from "react-native-snackbar-component";
import { styles } from "../styles/app";
import { useServer } from "../hooks/use_server";
import { LinearGradient } from "expo-linear-gradient";

export function VPINApps(props) {
  let [apps, setApps] = useState([]);
  let [snackbarVisible, setSnackbarVisible] = useState(false);
  let [snackbarText, setSnackbarText] = useState("");
  useEffect(() => {
    (async () => {
      let appKeys = await AsyncStorage.getAllKeys();
      let appValues = await AsyncStorage.multiGet(appKeys);
      let vcss = [];
      for (let i = 0; i < appValues.length; i++) {
        let vcs = JSON.parse(appValues[i][1]);
        vcss.push(vcs);
      }
      setApps(vcss);
    })();
  }, [props.update]);
  return (
    <>
      <SnackBar visible={snackbarVisible} textMessage={snackbarText} />

      <View style={{ marginTop: 20 }} />
      <View style={{ flex: 1, flexDirection: "column", width: "100%" }}>
        {apps.map((vcs, i) => {
          return (
            <VApp
              vcs={vcs}
              showSnackbar={(text) => {
                setSnackbarText(text);
                setSnackbarVisible(true);
                setTimeout(() => {
                  setSnackbarVisible(false);
                  setSnackbarText("");
                }, 2000);
              }}
              styles={styles}
              key={i}
            />
          );
        })}
      </View>
    </>
  );
}
function applyLetterSpacing(string, count = 1) {
  return string.split("").join("\u200A".repeat(count));
}

function VApp(props) {
  const { vcs, showSnackbar } = props;
  let [code, setCode] = useState("");
  const server = useServer();
  return (
    <LinearGradient
      colors={["#FFCC70", "#C850C0", "#4158D0"]}
      locations={[0, 0.46, 1]}
      start={{ x: 0.95, y: 0.5 }}
      style={{
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        shadowOffset: { width: 2, height: 2 },
        elevation: 5,
      }}
    >
      <View
        style={{
          flexDirection: "column",
        }}
        key={vcs.appName}
      >
        <Text style={{ width: "100%", padding: 5, color: "white" }}>
          {vcs.appName}
        </Text>
        <Text style={{ width: "100%", padding: 5, color: "white" }}>
          {vcs.username}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={{
              ...styles.button,
              flex: 0,
              backgroundColor: "#2196F3",
              alignSelf: "flex-start",
              elevation: 10,
              shadowOffset: { width: 2, height: 2 },
            }}
            onPress={async () => {
              try {
                let { call } = await server.getCode(vcs.userId);
                let callObj = new Call(2, call.serialNumbers, call.charset);
                let bytes = decrypt(vcs.matrix);
                let plaintext = bytes.toString(CryptoJS.enc.Utf8);
                let matrix = JSON.parse(plaintext);
                let vcsObject = new VCS(
                  vcs.rows,
                  vcs.cols,
                  matrix,
                  vcs.charset
                );
                let resp = decodeCall(callObj, vcsObject);
                setCode(resp);
              } catch (err) {
                showSnackbar("No new code found");
              }
            }}
          >
            <Text>Get Code</Text>
          </TouchableOpacity>
          <View>
            <TouchableOpacity
              style={styles.modalText}
              onPress={async () => {
                if (code.length > 0) {
                  await Clipboard.setStringAsync(code);
                  showSnackbar("Code copied to clipboard");
                } else {
                  showSnackbar("No code to copy");
                }
              }}
            >
              <Text style={{ fontSize: 16, color: "#0ff", margin: 5 }}>
                {applyLetterSpacing(code || "No code")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
