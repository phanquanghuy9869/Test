import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { NumberInput } from "../../../components/input-number";
import { FuelTracking, Vehicle } from "../../../models";
import { CustomDatePicker } from "../../../components/custom-date-picker";
import { FuelTrackingApi } from "../../../api/endpoints";

export const CreateFuelTracking = ({ route }: { route: any }) => {
  const { selectedVehicle }: { selectedVehicle: Vehicle } = route.params;
  const [fuelTracking, setFuelTracking] = useState<FuelTracking>({
    vehicleId: selectedVehicle?.id,
    fuelDate: new Date(),
    odo: selectedVehicle?.odo,
  });
  const [formError, setFormError] = useState({
    fuelRemainErr: "",
    refuelAmountErr: "",
    odoErr: ""
  });

  const handleChangeRefuelAmount = (refuelAmount?: number) => {
    setFuelTracking({ ...fuelTracking, refuelAmount: refuelAmount });
    if (validateRefuelAmount(refuelAmount)) {
      setFormError({ ...formError, refuelAmountErr: "" });
    } else {
      setFormError({ ...formError, refuelAmountErr: "Giá trị không hợp lệ!" });
    }
  };

  const validateRefuelAmount = (refuelAmount?: number) =>
    refuelAmount != null && refuelAmount > 0 && refuelAmount < 200
      ? true
      : false;

  const validateFuelRemain = (fuelRemain?: number) =>
    fuelRemain != null && fuelRemain > 0 && fuelRemain < 200 ? true : false;

  const validateOdo = (odo?: number) =>
    odo != null && odo > 0 ? true : false;

  const handleChangeOdo = (odo?: number) => {
    setFuelTracking({ ...fuelTracking, odo: odo });
    if (validateOdo(odo)) {
      setFormError({ ...formError, odoErr: '' });
    } else {
      setFormError({ ...formError, odoErr: 'Gía trị odo không hợp lệ' });
    }
  };

  const handleChangeFuelRemain = (fuelRemain?: number) => {
    setFuelTracking({ ...fuelTracking, fuelRemain: fuelRemain });
    if (validateFuelRemain(fuelRemain)) {
      setFormError({ ...formError, fuelRemainErr: "" });
    } else {
      setFormError({ ...formError, fuelRemainErr: "Giá trị không hợp lệ!" });
    }
  };

  const handleChangeFuelDate = (evn: any, d?: Date) => {
    const selectedDate = d ?? new Date();
    setFuelTracking({ ...fuelTracking, fuelDate: selectedDate });
  }

  const validateForm = () => {
    const isValidOdo = validateOdo(fuelTracking.odo);
    if (isValidOdo) {
      setFormError({ ...formError, odoErr: '' });
    } else {
      setFormError({ ...formError, odoErr: 'Gía trị odo không hợp lệ' });
    }

    const isValidFuelRemain = validateFuelRemain(fuelTracking.fuelRemain);
    if (isValidFuelRemain) {
      setFormError({ ...formError, fuelRemainErr: "" });
    } else {
      setFormError({ ...formError, fuelRemainErr: "Giá trị không hợp lệ!" });
    }

    const isValidRefuelAmount = validateRefuelAmount(fuelTracking.refuelAmount);
    if (isValidRefuelAmount) {
      setFormError({ ...formError, refuelAmountErr: "" });
    } else {
      setFormError({ ...formError, refuelAmountErr: "Giá trị không hợp lệ!" });
    }

    return isValidOdo && isValidFuelRemain && isValidRefuelAmount;
  }

  const submit = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      var result = await FuelTrackingApi.createFuelTracking(fuelTracking);
      
    } catch (error) {
      
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 5 }}>
        <ScrollView>
          <NumberInput
            label="Lượng xăng đã bơm"
            placeholder="Số lít"
            errorMessage={formError.refuelAmountErr}
            handleChangeValue={handleChangeRefuelAmount}
            value={fuelTracking.refuelAmount}
          />
          <NumberInput
            label="Lượng xăng còn trong bình"
            placeholder="Số lít"
            errorMessage={formError.fuelRemainErr}
            handleChangeValue={handleChangeFuelRemain}
            value={fuelTracking.fuelRemain}
          />
          {/* <Input
            label="Nơi bơm"
            placeholder="Địa chỉ cây xăng"
            errorStyle={{ color: "red" }}
            errorMessage={"error.name"}
          /> */}
          <Input
            label="Loại xăng"
            placeholder="Loại xăng"
            errorStyle={{ color: "red" }}
            // errorMessage={"error.name"}
            value={fuelTracking.fuelType}
            onChangeText={(text) => {
              setFuelTracking({ ...fuelTracking, fuelType: text });
            }}
          />
          <NumberInput
            label="Số odo khi bơm xăng"
            placeholder="Odo"
            errorMessage={formError.odoErr}
            value={fuelTracking.odo}
            handleChangeValue={handleChangeOdo}
          />
          <NumberInput
            label="Tổng số tiền (VND)"
            placeholder="VND"
            // errorMessage={"error.name"}
            value={fuelTracking.cost}
            handleChangeValue={(cost) => setFuelTracking({ ...fuelTracking, cost: cost })}
          />
          {/* <Input
            label="Loại xăng"
            placeholder="Loại xăng"
            errorStyle={{ color: "red" }}
            // errorMessage={"error.name"}
            value={fuelTracking.fuelType}
            onChangeText={(fuelType: string) => setFuelTracking({...fuelTracking, fuelType: fuelType})}
          /> */}
          <Text>Ngày bơm xăng</Text>
          {/* <DateTimePicker
            value={fuelTracking.fuelDate}
            onChange={handleChangeFuelDate}
          /> */}
          <CustomDatePicker
            value={fuelTracking.fuelDate}
            onChange={handleChangeFuelDate} />
        </ScrollView>
      </View>
      <View style={{ flex: 1 }}>
        <Button
          title="Lưu"
          buttonStyle={{
            backgroundColor: "rgba(78, 116, 289, 1)",
            borderRadius: 3,
          }}
          containerStyle={{
            // width: 200,
            marginHorizontal: 10,
            marginVertical: 2,
          }}
          onPress={submit}
        />
        <Button
          title="Huỷ"
          buttonStyle={{
            // backgroundColor: "rgba(78, 116, 289, 1)",
            borderRadius: 3,
          }}
          containerStyle={{
            // width: 200,
            marginHorizontal: 10,
            marginVertical: 2,
          }}
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
});
