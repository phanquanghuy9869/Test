import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Input } from "react-native-elements";
import { NumberInput } from "../../../components/input-number";
import { VehicleRequirement } from "../../../models";

export const VehicleRequirementDetail = ({
  requirement,
  onChange,
  askForRecentMaintain,
  onFormValidation,
}: // onChange,
// askForRecentMaintain,
{
  requirement: VehicleRequirement;
  onChange: (req: VehicleRequirement) => void;
  askForRecentMaintain: boolean;
  onFormValidation: (insFormValid: boolean) => void;
}) => {
  const [reqState, setReqState] = useState<VehicleRequirement>(requirement);

  const [formErrStates, setFormErrStates] = useState({
    nameErr: "",
    dayIntervalErr: "",
    distanceIntervalErr: "",
    recentChangeInDay: "",
    recentChangeInDistance: "",
  });

  useEffect(() => {
    if (!requirement) {
      return;
    }
    setReqState({ ...requirement });
    onFormValidation(validateForm(requirement));
  }, [requirement]);

  const handleChangeReqName = (value: string) => {
    const nextReqState = { ...reqState, name: value };
    setReqState(nextReqState);
    onChange(nextReqState);
    const isValid = setErrorName(value);
    onFormValidation(isValid);
  };

  const setErrorName = (value?: string) => {
    const isValid = isValidName(value);
    if (!isValid) {
      setFormErrStates({
        ...formErrStates,
        nameErr: "Tên bảo dưỡng không hợp lệ",
      });
    } else {
      setFormErrStates({ ...formErrStates, nameErr: "" });
    }
    return isValid;
  };

  const isValidName = (value?: string) =>
    value != null && value.trim().length > 0;

  const handleChangePartname = (value: string) => {
    const nextReqState = { ...reqState, partName: value };
    setReqState(nextReqState);
    onChange(nextReqState);
  };

  const handleChangeDayInterval = (value: string) => {
    const dayChangeInterval = value.trim() == "" ? 0 : parseInt(value, 10);
    if (Number.isNaN(dayChangeInterval)) {
      // if (dayChangeInterval == NaN) {
      return;
    }
    const nextReqState = { ...reqState, dayInterval: dayChangeInterval };
    setReqState(nextReqState);
    onChange(nextReqState);
    const isValid = validateDayInterval(dayChangeInterval);
    onFormValidation(isValid);
  };

  const handleRecentChangeInDay = (recentChangeDays?: number) => {
    if (!askForRecentMaintain) {
      return;
    }
    const nextReqState = { ...reqState, recentChangeInDay: recentChangeDays };
    setReqState(nextReqState);
    onChange(nextReqState);
    const isValid = validateRecentChangeInDay(recentChangeDays);
    onFormValidation(isValid);
  };

  const validateRecentChangeInDay = (recentChangeDays?: number) => {
    const isValid = recentChangeDays != null && recentChangeDays > 0;
    if (isValid) {
      setFormErrStates({...formErrStates, recentChangeInDay: ''});
      return true;
    } else {
      setFormErrStates({...formErrStates, recentChangeInDay: 'Dữ liệu ngày không hợp lệ'});
      return false;
    }
  }

  const handleRecentChangeInDistance = (recentChangeDistance?: number) => {
    if (!askForRecentMaintain) {
      return;
    }
    const nextReqState = {
      ...reqState,
      recentChangeInDistance: recentChangeDistance,
    };
    setReqState(nextReqState);
    onChange(nextReqState);
    const isValid = validateRecentChangeDistance(recentChangeDistance);
    onFormValidation(isValid);
  };

  const validateRecentChangeDistance = (recentChangeDistance?: number) => {
    const isValid = recentChangeDistance != null && recentChangeDistance > 0;
    if (isValid) {
      setFormErrStates({...formErrStates, recentChangeInDistance: ''});
      return true;
    } else {
      setFormErrStates({...formErrStates, recentChangeInDistance: 'Dữ liệu ngày không hợp lệ'});
      return false;
    }
  }

  const validateDayInterval = (dci?: number) => {
    const isValid = isValidDayInterval(dci);

    if (!isValid) {
      setFormErrStates({
        ...formErrStates,
        dayIntervalErr: "Khoảng cách không hợp lệ",
      });
    } else {
      setFormErrStates({ ...formErrStates, dayIntervalErr: "" });
    }
    return isValid;
  };

  const isValidDayInterval = (dci?: number) => dci != null && dci > 0;

  const handleChangeDistanceInterval = (value: string) => {
    const distanceChangeInterval = value.trim() == "" ? 0 : parseInt(value, 10);
    if (Number.isNaN(distanceChangeInterval)) {
      return;
    }
    const nextReqState = {
      ...reqState,
      distanceInterval: distanceChangeInterval,
    };
    setReqState(nextReqState);
    onChange(nextReqState);
    const isValid = validateDistanceInterval(distanceChangeInterval);
    onFormValidation(isValid);
  };

  const validateDistanceInterval = (dci?: number) => {
    const isValid = dci != null && dci > 0;

    if (!isValid) {
      setFormErrStates({
        ...formErrStates,
        distanceIntervalErr: "Khoảng cách không hợp lệ",
      });
    } else {
      setFormErrStates({ ...formErrStates, distanceIntervalErr: "" });
    }
    return isValid;
  };

  const isValidDistanceChangeInterval = (dci?: number) =>
    dci != null && dci > 0;

  const validateForm = (req: VehicleRequirement) => {
    return (
      isValidName(req.name) &&
      isValidDayInterval(req.dayInterval) &&
      isValidDistanceChangeInterval(req.distanceInterval)
    );
  };

  return (
    <View>
      <ScrollView>
        <Input
          // style={styles.inputSd}
          labelStyle={styles.labelSd}
          value={reqState?.name || ""}
          label="Tên bảo dưỡng"
          placeholder="Tên"
          errorStyle={{ color: "red" }}
          errorMessage={formErrStates.nameErr}
          onChangeText={handleChangeReqName}
        />
        <View>
          <View>
            <Input
              labelStyle={styles.labelSd}
              value={reqState?.partName || ""}
              label="Tên bộ phận"
              placeholder="Tên bộ phận"
              errorStyle={{ color: "red" }}
              onChangeText={handleChangePartname}
            />
          </View>
        </View>
        <Input
          labelStyle={styles.labelSd}
          keyboardType="numeric"
          value={reqState?.distanceInterval?.toString() || ""}
          label="Số km cần bảo dưỡng"
          placeholder="Tên"
          errorStyle={{ color: "red" }}
          errorMessage={formErrStates.distanceIntervalErr}
          onChangeText={handleChangeDistanceInterval}
        />
        <Input
          labelStyle={styles.labelSd}
          keyboardType="numeric"
          value={reqState?.dayInterval?.toString() || ""}
          label="Số ngày cần bảo dưỡng"
          placeholder="Ngày"
          errorStyle={{ color: "red" }}
          errorMessage={formErrStates.dayIntervalErr}
          onChangeText={handleChangeDayInterval}
        />
        {/* if ask for recent maintain */}
        {askForRecentMaintain && (
          <>
            <NumberInput
              label={`Lần ${reqState.name?.toLowerCase()} gần nhất cách đây bao nhiêu km?`}
              placeholder={`Số km từ lần ${reqState.name} gần nhất`}
              handleChangeValue={handleRecentChangeInDistance}
              value={reqState.recentChangeInDistance}
              errorMessage={formErrStates.recentChangeInDistance}
            />
            <NumberInput
              label={`Lần ${reqState.name?.toLowerCase()} gần nhất vào bao nhiêu ngày trước?`}
              placeholder={`Số ngày từ lần ${reqState.name} gần nhất`}
              handleChangeValue={handleRecentChangeInDay}
              value={reqState.recentChangeInDay}
              errorMessage={formErrStates.recentChangeInDay}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 8,
    flex: 1,
  },
  inputSd: {
    fontSize: 12,
  },
  labelSd: {
    fontSize: 11,
    fontWeight: "normal",
  },
});
