using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using MM.Domain.SeedWorks;

namespace MM.Domain.AggregateModels.VehicleAggregate
{
    public interface IVehicleRepository: IRepository<Vehicle>
    {
        Task<Vehicle> AddAsync(Vehicle vehicle);
        void Update(Vehicle vehicle);
        Task<IEnumerable<Vehicle>> GetAsync(string username);
        Task<Vehicle> GetAsync(int id);
    }
}
