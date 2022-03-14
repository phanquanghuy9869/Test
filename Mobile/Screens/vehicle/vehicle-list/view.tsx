import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { useAppSelector } from "../../../app/hooks";
import { Vehicle } from "../../../models";
import { selectOwnVehicles } from "../vehicle.slice";
import { BottomSheet, ListItem, Avatar } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface VehicleListItemView {
  vehicle: Vehicle;
  pos: number;
  expanded: boolean;
}

interface VehicleControlBtn {
  icon: string;
  title: string;
  subTitle: string;
  navigation: string;
}

const controlButton: VehicleControlBtn[] = [
  {
    icon: "beer",
    title: "Đổ xăng",
    subTitle: "Tính toán lượng xăng tiêu thụ",
    navigation: "create-fuel-tracking",
  },
  {
    icon: "cog",
    title: "Thông số",
    subTitle: "Các thông số về chất lượng bảo dưỡng",
    navigation: "vehicle-detail",
  },
  {
    icon: "automobile",
    title: "Cập nhật Odo",
    subTitle: "Cập nhật nhanh Odo của phương tiện",
    navigation: "odo",
  },
];

export const VehicleListView = ({ navigation }: { navigation: any }) => {
  const ownVehicles = useAppSelector(selectOwnVehicles) as Vehicle[];
  let selectedVehicle: Vehicle = ownVehicles[0];
  const [isVisible, setIsVisible] = useState(false);

  const toggleExpand = (v: Vehicle) => {
    selectedVehicle = v;
    setIsVisible(true);
  };

  const handleVehicle = (nav: string) => {
    setIsVisible(false);
    navigation.navigate(nav, {
      selectedVehicle: selectedVehicle,
    });
  };

  return (
    <ScrollView>
      {ownVehicles.map((v, i) => (
        <ListItem key={i} onPress={() => toggleExpand(v)} bottomDivider>     
          <ListItem.Content>
            <ListItem.Title>{v.vehicleBrand}</ListItem.Title>
            <ListItem.Subtitle>{v.vehicleModel}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}

      <SafeAreaProvider>
        {/* <Button
        title="Open Bottom Sheet"
        onPress={() => setIsVisible(true)}
        // buttonStyle={styles.button}
      /> */}
        <BottomSheet isVisible={isVisible}>
          <ListItem
              containerStyle={{backgroundColor: '#517fa4'}}
              onPress={() => setIsVisible(false)}
            >
              <ListItem.Content>
                <ListItem.Title style={{color: '#fff'}}>Quay lại</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          {controlButton.map((b, index) => (
            <ListItem
              key={index}
              onPress={() => handleVehicle(b.navigation)}
              bottomDivider
            >
              <Icon name={b.icon} type="font-awesome" color="#517fa4" />
              <ListItem.Content>
                <ListItem.Title>{b.title}</ListItem.Title>
                <ListItem.Subtitle>{b.subTitle}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          ))}
        </BottomSheet>
      </SafeAreaProvider>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
