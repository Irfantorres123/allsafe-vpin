import { ActivityIndicator, View } from "react-native";

export function Loading() {
  return (
    <View style={{ marginTop: 50 }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}
