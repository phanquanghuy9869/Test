import React from "react";
import { LinearProgress } from "react-native-elements";
import AppConfig from "../../../configs";

const statusColor = AppConfig.statusColor;

const chooseColor = (progress: number) => {
  if (progress < 20) {
    return statusColor.danger;
  }
  if (progress > 60) {
    return statusColor.safe;
  }  
  return statusColor.warning;
};

export const MaintainProgress = ({ progress }: { progress: number }) => {
  const color = chooseColor(progress);

  return (
    <LinearProgress
      style={{ marginVertical: 10 }}
      value={progress / 100}
      color={color}
      variant="determinate"
    />
  );
};
