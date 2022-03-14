using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MMApi.Application.Queries
{
    public interface IVehicleQuery
    {
        Task<IEnumerable<VehicleViewModel>> GetVehiclesAsync(string username);
        Task<IEnumerable<VehicleViewModel>> GetAllVehicle();
        Task<IEnumerable<MaintainanceViewModel>> GetVehicleMaintainances(int vehicleId);
        Task<VehicleViewModel> GetVehicleAsync(int id);
        Task<IEnumerable<VehicleRequirementViewModel>> GetVehicleRequirements(int vehicleId);
        Task<IEnumerable<VehicleStatusViewModel>> GetVehicleStatusLastestAsync(int vehicleId);
    }
}
