import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ButtonGroup } from "react-native-elements";
import { MaintainCatalog } from "../../../models";
import { MaintainCatalogApi } from "../../../api/endpoints";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchMaintainRequirementAsync,
  selectVehicleCreationPreparing,
  updateVehiclePrepareCreation,
} from "../vehicle.slice";

let maintainCatalogs: MaintainCatalog[] = [];
export const InputVehicleBrand = ({
  proccessStep,
}: {
  proccessStep?: (val: number) => void;
}) => {
  const dispatch = useAppDispatch();
  const vehiclePreparation = useAppSelector(selectVehicleCreationPreparing);
  const [formErrorState, setFormErrorState] = useState({
      vehicleType: "",
      vehicleModel: "",
      vehicleBrand: "",
      year: "",
      odo: ""
  });
  // const [maintainCatalogs, setMaintainCatalogs] = useState<MaintainCatalog[]>(
  //   []
  // );
  const [selectedIndex, setSelectedIndex] = useState(2);

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  // validata form data and move to the next step
  const onHandleMove = (val: number) => {
    // validate before move step
    const isFormValid = validateBrand(vehiclePreparation.vehicleBrand ?? '') && validateModel(vehiclePreparation.vehicleModel ?? '');
    if (!isFormValid) {
      // can not move if data not valid
      return;
    }

    dispatch(fetchMaintainRequirementAsync());
    setSelectedIndex(val);
    if (proccessStep != null) proccessStep(val);
  };

  const handleChangeBrand = (brand: string) => {
    validateBrand(brand);
    let prepare = { ... vehiclePreparation};
    prepare.vehicleBrand = brand;

    const vehicleModels = getModelByBrand(brand);
    setModels(vehicleModels);
    // change vehicle model according to vehicle brand
    if (vehicleModels != null && vehicleModels.length > 0) {
      prepare.vehicleModel = vehicleModels[0];
    } else {
      prepare.vehicleModel = "";
    }

    // set catalog id
    var catalogId = maintainCatalogs.find((x) => x.vehicleBrand == brand)?.id;
    if (catalogId != null) {
      prepare.maintainCatalogId = catalogId;
    }
    dispatch(updateVehiclePrepareCreation(prepare));
  };

  const validateBrand = (brand: string) => {
    if (brand == null || brand.trim().length === 0) {
      setFormErrorState({...formErrorState, vehicleBrand: 'Hãng xe không hợp lệ'});
      return false;
    } else {
      setFormErrorState({...formErrorState, vehicleBrand: ''});
      return true;
    }
  }

  const validateModel = (model: string) => {
    if (model == null || model.trim().length === 0) {
      setFormErrorState({...formErrorState, vehicleModel: 'Loại xe không hợp lệ'});
      return false;
    } else {
      setFormErrorState({...formErrorState, vehicleModel: ''});
      return true;
    }
  }

  const fetchCatalogs = async () => {
    try {
      var catalogs = (await MaintainCatalogApi.getMaintainCatalogs())?.data
        .pages as MaintainCatalog[];
      if (catalogs != null) {
        // setMaintainCatalogs(catalogs);
        maintainCatalogs = catalogs;
        var extractBrands = catalogs.map((x) => x.vehicleBrand);
        var distinctBrands = Array.from(new Set(extractBrands));
        setBrands(distinctBrands);
        var names = catalogs.map((x) => x.vehicleName);
        setModels(names); 

        // trigger first click select brand to filter vehicle model and maintain catalog id
        handleChangeBrand(distinctBrands[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getModelByBrand = (brand: string) => {
    return maintainCatalogs
      .filter((x) => x.vehicleBrand == brand)
      .map((v) => v.vehicleName);
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 5 }}>
        <Text style={styles.pickupLabel}>Hãng xe:</Text>
        <Picker
          style={styles.pickUpInput}
          selectedValue={vehiclePreparation.vehicleBrand}
          onValueChange={(itemValue, itemIndex) => {handleChangeBrand(itemValue)}}
        >
          {brands?.map((b, index) => (
            <Picker.Item key={index} label={b} value={b} />
          ))}
        </Picker>

        <Text style={styles.pickupLabel}>Loại xe:</Text>
        <Picker
          style={styles.pickUpInput}
          selectedValue={vehiclePreparation.vehicleModel}
          onValueChange={(itemValue, itemIndex) => {}}
        >
          {models?.map((m, index) => (
            <Picker.Item key={index} label={m} value={m} />
          ))}
        </Picker>
      </View>
      <View style={{ flex: 1 }}>
        <ButtonGroup
          buttons={["Quay lại", "Tiếp"]}
          selectedIndex={selectedIndex}
          onPress={(value) => onHandleMove(value)}
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
  pickupLabel: {
    marginLeft: 9,
    marginRight: 9,
    fontWeight: "bold",
    marginBottom: 8,
  },
  pickUpInput: {
    marginLeft: 9,
    marginRight: 9,
    marginTop: 4,
    marginBottom: 12,
  },
});
