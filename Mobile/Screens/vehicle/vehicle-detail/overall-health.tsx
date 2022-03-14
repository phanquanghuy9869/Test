import React from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";
import AppConfig from "../../../configs";
import { MaintainProgress } from "./maintain-progress";

const statusColor = AppConfig.statusColor;

export const OverallHealth = ({
  healthDistance,
  healthTime,
}: {
  healthDistance: number;
  healthTime: number;
}) => {
  const health = healthDistance * 0.6 + healthTime * 0.4;
  console.log(healthDistance);
  console.log(healthTime);
  console.log(health);
  return (
    <View>
      <Text>- Sức khoẻ: </Text>
      <MaintainProgress progress={health} />
    </View>
  );
};
