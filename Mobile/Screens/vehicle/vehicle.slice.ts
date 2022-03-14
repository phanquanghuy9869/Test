import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";
import {
  AppFileApi,
  MaintainCatalogApi,
  VehicleApi,
} from "../../api/endpoints";
import { RootState } from "../../app/store";
import {
  MaintainCatalog,
  MaintainRequirement,
  Vehicle,
  VehicleRequirement,
} from "../../models";

export interface VehicleState {
  ownVehicles: Vehicle[];
  selectedVehicle: Vehicle;
  isLoading: boolean;
  vehicleCreation: {
    activeStep: number;
    preparingCreation: Vehicle;
    // vehicleReqs: VehicleRequirement[];
    createSuccess: string;
    createPending: boolean;
    uploadAvatarSuccess: string;
    uploadAvatarPending: boolean;
  };
}

const initialState: VehicleState = {
  ownVehicles: [],
  selectedVehicle: {
    id: 0,
    vehicleType: 0,
    vehicleModel: "",
    vehicleBrand: "",
    imageUrl: "",
    year: -1,
    odo: -1,
    licensePlate: "",
    healthDistance: -1,
    healthTime: -1,
    avatar: "",
  },
  isLoading: false,
  vehicleCreation: {
    activeStep: 0,
    preparingCreation: {},
    // vehicleReqs: [],
    createSuccess: "",
    createPending: false,
    uploadAvatarSuccess: "",
    uploadAvatarPending: false,
  },
};

export const fetchOwnVehiclesAsync = createAsyncThunk(
  "vehicle/fetchOwnVehicles",
  async (input, { getState }) => {
    const rootState = getState() as RootState;
    const username = rootState.auth.username;
    const response = await VehicleApi.list(username);
    return response.data;
  }
);

export const createVehicleAsync = createAsyncThunk(
  "vehicle/createVehicle",
  async (
    vehicleRequirement: VehicleRequirement[],
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const rootState = getState() as RootState;
      let vehicleCreation = {
        ...rootState.vehicle.vehicleCreation.preparingCreation,
        username: rootState.auth.username,
      };
      vehicleCreation.requirements = vehicleRequirement;
      const response = await VehicleApi.create(vehicleCreation);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const uploadAvatarAsync = createAsyncThunk(
  "vehicle/uploadImage",
  async (file: any, { dispatch, rejectWithValue }) => {
    let response;
    try {
      response = await AppFileApi.uploadAvatar(file);
    } catch (err) {
      return rejectWithValue("Unable to upload");
    }
    dispatch(uploadAvatar(response.data));
    dispatch(createVehicleHandledNext());
    return response.data;
  }
);

export const fetchMaintainRequirementAsync = createAsyncThunk(
  "fetchMaintainCatalog",
  async (catalogId, { getState, rejectWithValue }) => {
    const rootState = getState() as RootState;
    const vehiclePreparation =
      rootState.vehicle.vehicleCreation.preparingCreation;
    if (vehiclePreparation?.maintainCatalogId == null) {
      return rejectWithValue("Null maintain catalog value");
    }
    try {
      const catalogs = (
        await MaintainCatalogApi.getMaintainRequirements(
          vehiclePreparation.maintainCatalogId
        )
      ).data as any[];
      return catalogs;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateSelectedVehicleAsync = createAsyncThunk(
  "vehicle/updateSelectedVehicle",
  async (vehicleId: number, { rejectWithValue }) => {}
);

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    selectVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.selectedVehicle = action.payload;
    },
    createVehicleHandleBack: (state) => {
      state.vehicleCreation.activeStep -= 1;
    },
    createVehicleHandledNext: (state) => {
      state.vehicleCreation.activeStep += 1;
    },
    createVehicleResetStep: (state) => {
      state.vehicleCreation.activeStep = 0;
    },
    updateVehiclePrepareCreation: (state, action: PayloadAction<any>) => {
      state.vehicleCreation.preparingCreation = action.payload;
    },
    createVehiclePrepareCreation: (state, action: PayloadAction<any>) => {
      const url = state.vehicleCreation.preparingCreation.imageUrl;
      state.vehicleCreation.preparingCreation = action.payload;
      state.vehicleCreation.preparingCreation.imageUrl = url;
    },
    uploadAvatar: (state, action: PayloadAction<string>) => {
      state.vehicleCreation.preparingCreation.imageUrl = action.payload;
    },
    resetVehicleCreationState: (state) => {
      state.vehicleCreation = {
        activeStep: 0,
        preparingCreation: {},
        createSuccess: "",
        createPending: false,
        uploadAvatarSuccess: "",
        uploadAvatarPending: false
      };
    },
    updateSelectedVehicleOdo: (state, action: PayloadAction<number>) => {
      state.selectedVehicle.odo = action.payload;
    },
    updateVehiclePrepareCreationRequirements: (
      state,
      action: PayloadAction<VehicleRequirement[]>
    ) => {
      state.vehicleCreation.preparingCreation.requirements =
        action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnVehiclesAsync.fulfilled, (state, action) => {
        state.ownVehicles = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOwnVehiclesAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchOwnVehiclesAsync.rejected, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(createVehicleAsync.pending, (state) => {
        state.vehicleCreation.createPending = true;
        state.vehicleCreation.createSuccess = "";
      })
      .addCase(createVehicleAsync.fulfilled, (state, payload) => {
        // state.vehicleCreation.preparingCreation = {
        //   vehicleType: 0,
        //   vehicleModel: "",
        //   vehicleBrand: "",
        //   vehicleName: "",
        //   year: 2020,
        //   odo: 0,
        //   licensePlate: "",
        //   health: 100,
        //   avatarPath: ''
        // };
        state.vehicleCreation.createSuccess = "success";
        state.vehicleCreation.createPending = false;
      })
      .addCase(createVehicleAsync.rejected, (state, payload) => {
        state.vehicleCreation.createPending = false;
        state.vehicleCreation.createSuccess = "error";
      });

    builder
      .addCase(uploadAvatarAsync.fulfilled, (state) => {
        state.vehicleCreation.uploadAvatarPending = false;
        state.vehicleCreation.uploadAvatarSuccess = "success";
      })
      .addCase(uploadAvatarAsync.rejected, (state, { payload }) => {
        state.vehicleCreation.uploadAvatarPending = false;
        state.vehicleCreation.uploadAvatarSuccess = "error";
      })
      .addCase(uploadAvatarAsync.pending, (state) => {
        state.vehicleCreation.uploadAvatarPending = true;
      });

    builder.addCase(
      fetchMaintainRequirementAsync.fulfilled,
      (state, action) => {
        const maintainReqs = action.payload as MaintainRequirement[];
        state.vehicleCreation.preparingCreation.requirements =
          maintainReqs.map<VehicleRequirement>((x) => ({
            name: x.name,
            description: "",
            partName: x.partName,
            maintainanceCode: x.maintainanceCode,
            dayInterval: x.dayInterval,
            distanceInterval: x.distanceInterval,
            weightNumber: x.weightNumber,
            recentChangeInDay: 0,
            recentChangeInDistance: 0,
            maintainRequirementId: x.id,
          }));
      }
    );
  },
});

export const {
  selectVehicle,
  createVehicleHandledNext,
  createVehicleHandleBack,
  createVehicleResetStep,
  createVehiclePrepareCreation,
  updateVehiclePrepareCreation,
  uploadAvatar,
  resetVehicleCreationState,
  updateSelectedVehicleOdo,
  updateVehiclePrepareCreationRequirements,
} = vehicleSlice.actions;

export const selectVehicleState = (state: RootState) => state.vehicle;
export const selectOwnVehicles = (state: RootState) =>
  state.vehicle.ownVehicles;
export const selectCreateVehicleActiveStep = (state: RootState) =>
  state.vehicle.vehicleCreation.activeStep;
export const selectVehicleCreationPreparing = (state: RootState) =>
  state.vehicle.vehicleCreation.preparingCreation;
export const selectVehicleCreateSuccess = (state: RootState) =>
  state.vehicle.vehicleCreation.createSuccess;
export const selectVehicleCreatePending = (state: RootState) =>
  state.vehicle.vehicleCreation.createPending;
export const selectVehicleUploadSuccess = (state: RootState) =>
  state.vehicle.vehicleCreation.uploadAvatarSuccess;
export const selectVehicleAvatar = (state: RootState) =>
  state.vehicle.vehicleCreation.preparingCreation.avatar;
export const selectVehicleUploadPending = (state: RootState) =>
  state.vehicle.vehicleCreation.uploadAvatarPending;
export const selectVehicleCreationVehicleReqs = (state: RootState) =>
  state.vehicle.vehicleCreation.preparingCreation.requirements;
export const selectVehicleCreateionOdo = (state:RootState) => state.vehicle.vehicleCreation.preparingCreation.odo;
export default vehicleSlice.reducer;
