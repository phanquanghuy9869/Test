import React, { useEffect } from "react";
import { VehicleRequirement } from "../../../models";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchMaintainRequirementAsync,
  selectVehicleCreationPreparing,
  selectVehicleCreationVehicleReqs,
  updateVehiclePrepareCreationRequirements,
} from "../vehicle.slice";
import { InputVehicleReqsView } from "./input-vehicle-reqs.view";

export const InputVehicleReqs = ({
  proccessStep,
}: {
  proccessStep?: (val: number) => void;
}) => {
  const vehicleRequirements = useAppSelector(selectVehicleCreationVehicleReqs);
  const dispatch = useAppDispatch();

  // load vehicle requirement for this type of vehicle
  useEffect(() => {
    if (vehicleRequirements != null && vehicleRequirements.length > 0) {
      return;
    }
    dispatch(fetchMaintainRequirementAsync());
  }, []);

  // move foward and backward
  const onHandleMove = (val: number) => {
    if (proccessStep != null) proccessStep(val);
  };

  const updateVehicleRequirement = (reqs: VehicleRequirement[]) => {
    dispatch(updateVehiclePrepareCreationRequirements(reqs));
  };

  return (
    <InputVehicleReqsView
      proccessStep={proccessStep}
      vehicleRequirements={vehicleRequirements ?? []}
      onHandleMove={onHandleMove}
      updateVehicleRequirement={updateVehicleRequirement}
    />
  );
};
