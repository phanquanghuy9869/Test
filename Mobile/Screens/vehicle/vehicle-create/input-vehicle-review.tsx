import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { ButtonGroup } from "react-native-elements";
import { Divider } from "react-native-elements/dist/divider/Divider";
import { VehicleApi } from "../../../api/endpoints";
import { useAppSelector } from "../../../app/hooks";
import { OverlayComponent } from "../../../components/overlay/dialog";
import { selectUserName } from "../../login/login.slice";
import { selectVehicleCreationPreparing } from "../vehicle.slice";

export const InputVehicleReview = ({
  proccessStep,
}: {
  proccessStep?: (val: number) => void;
}) => {
  const vehicle = useAppSelector(selectVehicleCreationPreparing);
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [message, setMessage] = useState({ visible: false, content: "" });
  const username = useAppSelector(selectUserName);

  const handleSubmitClick = async (value: number) => {
    try {
      let vehicleCreation = {
        ...vehicle,
        username: username,
      };
      const response = await VehicleApi.create(vehicleCreation);      
      setMessage({visible: true, content: 'Thêm phương tiện thành công'});
    } catch (err) {
      console.log(err);
      setMessage({visible: true, content: 'Thêm phương tiện thất bại'});
    }
  };

  const toggle = () => {
    setMessage({ ...message, visible: !message.visible });
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 4 }}>
        <ScrollView>
          <Text style={styles.textLabel}> Thông tin xe: </Text>
          <Text style={styles.textLabel}>
            {" "}
            {`Xe: ${vehicle.vehicleBrand} ${vehicle.vehicleModel} đời ${vehicle.year} `}{" "}
          </Text>
          <Text style={styles.textLabel}>
            {" "}
            {`Biển số: ${vehicle.licensePlate}, odo: ${vehicle.odo} km`}{" "}
          </Text>
          <Divider />
          <Text style={styles.textLabel}>Lịch bảo dưỡng: </Text>
          <Divider />
          {vehicle.requirements?.map(
            (r, index) =>
              (<Text key={index} style={styles.textLabel}>{` - ${r.name}(${r.maintainanceCode}) bảo dưỡng mỗi ${r.distanceInterval} km hoặc ${r.dayInterval} ngày. `}</Text>)
          )}
          <Divider />
        </ScrollView>
      </View>
      <View style={{ flex: 1 }}>
        <ButtonGroup
          buttons={["Lưu"]}
          selectedIndex={selectedIndex}
          onPress={(value) => handleSubmitClick(value)}
          containerStyle={{ marginBottom: 10 }}
        />
      </View>
      <OverlayComponent
        visible={message.visible}
        message={message.content}
        toggle={toggle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flex: 1,
  },
  textLabel: {
    marginLeft: 2,
    marginRight: 2,
    // fontWeight: "bold",
    marginBottom: 6,
    fontSize: 16
  },
  pickUpInput: {
    marginLeft: 9,
    marginRight: 9,
    marginTop: 4,
    marginBottom: 12,
  },
});
