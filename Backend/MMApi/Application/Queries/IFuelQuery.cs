using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MMApi.Application.Queries
{
    public interface IFuelQuery
    {
        Task<IEnumerable<FuelViewModel>> GetAllFuelByVehicleId(int vehicleId,string username);
        Task<FuelViewModel> GetFuelAsyncByFuelId(int fuelId, string username);
        Task<IEnumerable<FuelViewModel>> GetFuelByDate(DateTime frDate, DateTime toDate, int vehicleId);
    }
}
