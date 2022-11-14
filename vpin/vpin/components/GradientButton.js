import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, Text } from "react-native";
import { styles } from "../styles/app";

export function GradientButton(props) {
  return (
    <LinearGradient
      colors={["#ffaf1a", "#C850C0", "#4158D0"]}
      locations={[0, 0.46, 1]}
      start={{ x: 0.95, y: 0.5 }}
      style={{
        padding: 5,
        borderRadius: 10,
        elevation: 10,
        shadowOffset: { width: 2, height: 2 },
      }}
    >
      <TouchableOpacity
        style={{
          ...styles.addServiceButton,
          flex: 0,
          backgroundColor: "#2196f3",
        }}
        onPress={props.onPress}
      >
        <Text>{props.text}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
