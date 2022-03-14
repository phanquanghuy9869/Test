import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ButtonGroup } from "react-native-elements";
import { useAppSelector } from "../../../app/hooks";
import { VehicleRequirement } from "../../../models";
import { VehicleRequirementDetail } from "../vehicle-requirement-detail/vehicle-requirement-detail";
import { selectVehicleCreateionOdo } from "../vehicle.slice";

let activeRequirementIndex = 0;
let isReqFormValid = false;

export const InputVehicleReqsView = ({
  proccessStep,
  vehicleRequirements,
  onHandleMove,
  updateVehicleRequirement,
}: {
  proccessStep?: (val: number) => void;
  vehicleRequirements: VehicleRequirement[];
  onHandleMove: (val: number) => void;
  updateVehicleRequirement: (reqs: VehicleRequirement[]) => void;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [activeRequirement, setActiveRequirement] =
    useState<VehicleRequirement>({
      name: "",
      description: "",
      partName: "",
      maintainanceCode: "",
      dayInterval: undefined,
      distanceInterval: undefined,
      weightNumber: undefined,
      recentChangeInDay: undefined,
      recentChangeInDistance: undefined,
      maintainRequirementId: undefined,
    });
  const odo = useAppSelector(selectVehicleCreateionOdo);
  const [isVehicleReqFormValid, setVehicleReqFormValid] = useState(false);

  const onBtnGroupClick = (value: number) => {
    setSelectedIndex(value);
    // if vehicle requirement form is not valid then can not change screen
    if (!isReqFormValid) {
      return;
    }
    // if go foward
    if (value == 1) {
      activeRequirementIndex += 1;
      // if there's no more vehicle requirements to display => go a bit foward
      if (activeRequirementIndex >= vehicleRequirements?.length) {
        activeRequirementIndex = 0;
        onHandleMove(1);
        return;
      } else {
        setActiveRequirement(vehicleRequirements[activeRequirementIndex]);
        return;
      }
    }
    // if go backward
    if (value == 0) {
      activeRequirementIndex -= 1;
      if (activeRequirementIndex < 0) {
        activeRequirementIndex = 0;
        onHandleMove(0);
      } else {
        setActiveRequirement(vehicleRequirements[activeRequirementIndex]);
        return;
      }
    }
  };

  useEffect(() => {
    if (vehicleRequirements != null && vehicleRequirements.length > 0) {
      setActiveRequirement(vehicleRequirements[activeRequirementIndex]);
    }
  }, []);

  const handleRequirementChange = (requirement: VehicleRequirement) => {
    let vh = [...vehicleRequirements];
    vh[activeRequirementIndex] = requirement;
    updateVehicleRequirement(vh);
  };

  return (
    <View style={styles.container}>
      <Text style={{ marginLeft: 9, marginBottom: 10, marginRight: 9 }}>
        Danh sách bảo dưỡng / bảo hành của xe có thể thay đổi cho phù hợp nhu
        cầu sử dụng
      </Text>
      <View style={{ flex: 5 }}>
        <VehicleRequirementDetail
          requirement={activeRequirement}
          onChange={handleRequirementChange}
          askForRecentMaintain={odo != null && odo > 0}
          onFormValidation={(valid: boolean) => {
            isReqFormValid = valid;
          }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <ButtonGroup
          buttons={["Quay lại", "Tiếp"]}
          selectedIndex={selectedIndex}
          onPress={(value) => onBtnGroupClick(value)}
          containerStyle={{ marginBottom: 10 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 8,
    flex: 1,
  },
});
