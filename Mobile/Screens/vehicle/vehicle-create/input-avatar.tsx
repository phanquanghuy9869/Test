import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button, ButtonGroup } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { useAppDispatch } from "../../../app/hooks";
import { uploadAvatar } from "../vehicle.slice";
import { AppFileApi } from "../../../api/endpoints";
import { compressImage } from "../../../services/image.service";
import { SaveFormat } from "expo-image-manipulator";

export const InputAvatar = ({
  proccessStep,
}: {
  proccessStep?: (n: number) => void;
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [image, setImage] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dispatch = useAppDispatch();

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      base64: false,
    });
    if (result.cancelled) {
      return;
    }
    const uri = result.uri;
    setImage(uri);

    // extract metadata of image
    let filename = uri.split("/").pop() ?? "no-name";
    // // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename ?? "default");
    let type = match ? `image/${match[1]}` : `image`;

    // compress image
    const resizeImage = await compressImage(uri, 150, 0.6, SaveFormat.JPEG);

    const base64 = resizeImage.base64;
    if (base64 == null) return;
    const upload = await AppFileApi.uploadAvatarBase64(base64, filename, type);

    dispatch(uploadAvatar(upload.data));
    // await dispatch(uploadAvatarAsync(null));
  };

  const onHandleMove = (value: any) => {
    setSelectedIndex(value);
    if (proccessStep != null) proccessStep(value);
  };

  const validate = () => {};

  return (
    <View style={styles.container}>
      <View style={{ flex: 5 }}>
        <Text style={styles.pickupLabel}>Loại xe:</Text>
        <Picker
          style={styles.pickUpInput}
          selectedValue={selectedLanguage}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedLanguage(itemValue)
          }
        >
          <Picker.Item label="4 bánh" value={4} />
          <Picker.Item label="2 bánh" value={2} />
        </Picker>

        <Button title="Upload 1 bức hình bất kỳ của xe" onPress={pickImage} />
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {image != null && image.length > 0 && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          )}
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <ButtonGroup
          buttons={["Cancel", "Tiếp"]}
          selectedIndex={selectedIndex}
          onPress={(value) => onHandleMove(value)}
          containerStyle={{ marginBottom: 10 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flex: 1,
  },
  pickupLabel: {
    marginLeft: 9,
    marginRight: 9,
    fontWeight: "bold",
    marginBottom: 8,
  },
  pickUpInput: {
    marginLeft: 9,
    marginRight: 9,
    marginTop: 4,
    marginBottom: 12,
  },
});
