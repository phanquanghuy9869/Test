import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { fetchOwnVehiclesAsync } from "../vehicle.slice";
import { VehicleListView } from "./view";

export const VehicleListController = ({ navigation }: { navigation: any }) => {
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //     dispatch(fetchOwnVehiclesAsync());
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      dispatch(fetchOwnVehiclesAsync());
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  return <VehicleListView navigation={navigation}/>;
};
