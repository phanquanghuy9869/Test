import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Card, Text } from "react-native-elements";
import { VehicleStatusApi } from "../../../api/endpoints";
import { Vehicle, VehicleStatus } from "../../../models";
import { MaintainProgress } from "./maintain-progress";
import { OverallHealth } from "./overall-health";

export const VehicleDetail = ({ route }: { route: any }) => {
  const { selectedVehicle }: { selectedVehicle: Vehicle } = route.params;
  const [vehicleStatus, setVehicleStatus] = useState<VehicleStatus[]>([]);

  useEffect(() => {
    fetchVehicleStatus();
  }, []);

  const fetchVehicleStatus = async () => {
    const vehicleId = selectedVehicle.id;

    if (vehicleId != null && vehicleId > 0) {
      try {
        var vehicleStatusRes = await VehicleStatusApi.getVehicleStatus(
          vehicleId
        );
        if (vehicleStatusRes == null || vehicleStatusRes.data == null) {
          return;
        }
        setVehicleStatus(vehicleStatusRes.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <ScrollView>
        <Card>
          <Card.Title>{`${selectedVehicle.vehicleBrand} ${selectedVehicle.vehicleModel}`}</Card.Title>
          <Card.Divider />
          <Card.Image
            source={{
              uri: selectedVehicle.imageUrl,
            }}
          />
          <Text style={{ marginTop: 8 }}>
            - Biển số: {selectedVehicle.licensePlate} - đời{" "}
            {selectedVehicle.year}
          </Text>
          <Text style={{ marginTop: 8 }}>- Số Odo: {selectedVehicle.odo}</Text>
          <OverallHealth healthDistance={selectedVehicle.healthDistance ?? 0} healthTime={selectedVehicle.healthTime ?? 0} />
        </Card>
        <Card>
          <Card.Title>Trạng thái bảo dưỡng</Card.Title>
          <Card.Divider />
          <View style={[{ flexDirection: "row" }, styles.elementsContainer]}>
            <View style={{ flex: 2 }} />
            <View style={{ flex: 2 }}>
              <Text>Quãng đường</Text>
            </View>
            <View style={{ flex: 2, minHeight: 30, alignContent: "center" }}>
              <Text>Thời gian</Text>
            </View>
          </View>
          {vehicleStatus.map((s, i) => {
            return (
              <View
                key={i}
                style={[{ flexDirection: "row" }, styles.elementsContainer]}
              >
                <View style={{ flex: 2 }}>
                  <Text>{s.name}</Text>
                </View>
                <View style={{ flex: 2, paddingRight: 10 }}>
                  <MaintainProgress progress={s.lastestHealthDistance ?? 0} />
                </View>
                <View style={{ flex: 2, minHeight: 10, paddingLeft: 5 }}>
                  <MaintainProgress progress={s.lastestHealthTime ?? 0} />
                </View>
              </View>
            );
          })}
        </Card>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  elementsContainer: {
    flex: 1,
    marginLeft: 2,
    marginRight: 2,
    marginBottom: 4,
  },
});
