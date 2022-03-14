import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { ButtonGroup, Input } from "react-native-elements";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { NumberInput } from "../../../components/input-number";
import {
  selectVehicleCreationPreparing,
  updateVehiclePrepareCreation,
} from "../vehicle.slice";

export const InputVehiclePlate = ({
  proccessStep,
}: {
  proccessStep?: (val: number) => void;
}) => {
  const dispatch = useAppDispatch();
  const vehiclePreparation = useAppSelector(selectVehicleCreationPreparing);
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [error, setError] = useState({
    licensePlate: "",
    year: "",
  });

  const onHandleMove = (val: number) => {
    if (
      !validateVehiclePlate(vehiclePreparation.licensePlate) ||
      !validateYearMade(vehiclePreparation.year)
    ) {
      return;
    }

    setSelectedIndex(val);
    if (proccessStep != null) proccessStep(val);
  };

  const onchangeVehiclePlate = (vehiclePlate: string) => {
    const vehiclePrepare = {
      ...vehiclePreparation,
      licensePlate: vehiclePlate,
    };
    dispatch(updateVehiclePrepareCreation(vehiclePrepare));
    validateVehiclePlate(vehiclePlate);
  };

  const onchangeYearMade = (year?: number) => {
    const vehiclePrepare = { ...vehiclePreparation, year: year };
    dispatch(updateVehiclePrepareCreation(vehiclePrepare));
    validateYearMade(year);
  };

  const validateVehiclePlate = (vehiclePlate?: string) => {
    const isValid =
      vehiclePlate != null &&
      vehiclePlate.length > 5 &&
      vehiclePlate.length < 15;

    if (isValid) {
      setError({ ...error, licensePlate: "" });
      return true;
    } else {
      setError({ ...error, licensePlate: "Biển số không hợp lệ" });
      return false;
    }
  };

  const validateYearMade = (year?: number) => {
    const isValid = year && year > 1900 && year < 2100;
    if (isValid) {
      setError({ ...error, year: "" });
      return true;
    } else {
      setError({ ...error, year: "Năm sản xuất không hợp lệ" });
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 5 }}>
        <Input
          label="Biển số xe"
          placeholder="Biển số xe"
          errorStyle={{ color: "red" }}
          errorMessage={error.licensePlate}
          value={vehiclePreparation.licensePlate ?? ""}
          onChangeText={onchangeVehiclePlate}
        />
        <NumberInput
          label="Năm sản xuất"
          placeholder="Some cool name"
          errorMessage={error.year}
          value={vehiclePreparation.year}
          handleChangeValue={onchangeYearMade}
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
