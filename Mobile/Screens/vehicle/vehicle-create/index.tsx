import React, { useEffect, useState } from "react";
import { InputAvatar } from "./input-avatar";
import { InputVehicleBrand } from "./input-vehicle-brand";
import { InputVehicleOdo } from "./input-vehicle-odo";
import { MultiStep } from "../../../components/multi-step";
import { InputVehicleReqs } from "./input-vehicle-reqs.controller";
import { InputVehicleReview } from "./input-vehicle-review";
import { InputVehiclePlate } from "./input-vehicle-plate";
import { useAppDispatch } from "../../../app/hooks";
import { resetVehicleCreationState } from "../vehicle.slice";

const labels = ["Ảnh", "Hãng", "Biển số", "Odo", "Bảo trì", "Lưu"];

const stepMapping = [
  <InputAvatar />,
  <InputVehicleBrand />,
  <InputVehiclePlate />,
  <InputVehicleOdo />,
  <InputVehicleReqs />,
  <InputVehicleReview />,
];

export const CreateVehicleController = () => {
  const [pos, setPos] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dispatch = useAppDispatch();

  // Reset the caching data for vehicle creation preparing
  useEffect(() => {
    dispatch(resetVehicleCreationState());
  }, []);

  return <MultiStep labels={labels} views={stepMapping} />;
};
