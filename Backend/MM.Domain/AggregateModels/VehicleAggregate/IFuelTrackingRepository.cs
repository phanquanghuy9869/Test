using System.Collections.Generic;
using System.Threading.Tasks;
using MM.Domain.SeedWorks;

namespace MM.Domain.AggregateModels.VehicleAggregate
{
    public interface IFuelTrackingRepository: IRepository<FuelTracking>
    {
        /// <summary>
        /// Add Fueltracking
        /// </summary>
        /// <param name="FuelTracking"></param>
        /// <returns></returns>
        Task<FuelTracking> AddAsync(FuelTracking FuelTracking);
        /// <summary>
        /// Update FuelTracking
        /// </summary>
        /// <param name="FuelTracking"></param>
        void Update(FuelTracking FuelTracking);      
        /// <summary>
        /// Get Fueltracking by fueltrackingId
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<FuelTracking> GetAsync(int id);        
        /// <summary>
        /// Get Lastest FuelTracking
        /// </summary>
        /// <param name="vehicleId"></param>
        /// <param name="username"></param>
        /// <returns></returns>
        Task<FuelTracking> GetLastFuelTracking(int vehicleId, string username);
    }
}
