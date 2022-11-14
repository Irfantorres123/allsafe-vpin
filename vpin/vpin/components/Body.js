import { LinearGradient } from "expo-linear-gradient";
import { View, TouchableOpacity, Text } from "react-native";
import { GradientButton } from "./GradientButton";
import { VPINApps } from "./VPINApps";

export function Body({ styles, navigation, update }) {
  return (
    <View style={styles.body}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <GradientButton
          onPress={() => {
            navigation.navigate("AddService");
          }}
          text="+ Add New Service"
        />
      </View>
      <VPINApps update={update} />
    </View>
  );
}
