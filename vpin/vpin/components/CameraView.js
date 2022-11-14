import { View, TouchableOpacity, Text } from "react-native";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { styles } from "../styles/app";
export function CameraView({ type, onScan, onClose }) {
  return (
    <Camera
      style={styles.camera}
      type={type}
      ratio="16:9"
      onMountError={(error) => {
        console.log(error);
      }}
      barCodeScannerSettings={{
        barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
      }}
      onBarCodeScanned={(scan) => {
        const data = scan.data;
        onScan(data);
      }}
    >
      <View style={styles.cameraActionButtons}>
        <TouchableOpacity
          style={styles.cameraCloseButton}
          onPress={() => {
            onClose();
          }}
        >
          <Text style={styles.text}> Close </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cameraOverlayContainer}>
        <View style={styles.cameraCenter} />
      </View>
    </Camera>
  );
}
