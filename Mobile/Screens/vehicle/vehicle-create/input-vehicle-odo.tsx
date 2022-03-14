import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { ButtonGroup, Input } from "react-native-elements";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { NumberInput } from "../../../components/input-number";
import {
  selectVehicleCreationPreparing, updateVehiclePrepareCreation
} from "../vehicle.slice";

export const InputVehicleOdo = ({
  proccessStep,
}: {
  proccessStep?: (val: number) => void;
}) => {
  const dispatch = useAppDispatch();
  const vehiclePreparation = useAppSelector(selectVehicleCreationPreparing);
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [error, setError] = useState({
    odo: '',
    name: ''
  });

  const onHandleMove = (val: number) => {
    if (!validateOdo(vehiclePreparation.odo)) {
      return;
    }

    setSelectedIndex(val);
    if (proccessStep != null) proccessStep(val);
  };

  const handleChangeOdo = (odo?: number) => {
    const vehiclePrepare = { ... vehiclePreparation, odo: odo};
    dispatch(updateVehiclePrepareCreation(vehiclePrepare));
    validateOdo(odo);
  }

  const validateOdo = (odo?: number) => {
    if (odo == null || odo < 0) {
      setError({...error, odo: 'Gía trị Odo không hợp lệ'})
      return false;
    } else {
      setError({...error, odo: ''})
      return true;
    }
  }

  const handleChangeName = (text: string) => {
    const vehiclePrepare = { ... vehiclePreparation, vehicleName: text};
    dispatch(updateVehiclePrepareCreation(vehiclePrepare));
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 5 }}>
        <NumberInput
          label="Số Odo"
          placeholder="Số Odo"
          errorMessage={error.odo}
          handleChangeValue={handleChangeOdo}
          value={vehiclePreparation.odo}
        />
        <Input
          label="Đặt tên cho xe"
          placeholder="Tên xe"
          errorStyle={{ color: "red" }}
          errorMessage={error.name}
          onChangeText={handleChangeName}
          value={vehiclePreparation.vehicleName}
        />
      </View>
      <View style={{ flex: 1 }}>
        <ButtonGroup
          buttons={["Quay lại", "Tiếp"]}
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
