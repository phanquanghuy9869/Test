using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;

namespace MMApi.Application.Queries
{
    public class VehicleViewModel
    {
        public int Id { get; init; }

        public int VehicleType { get; init; }

        public string VehicleModel { get; init; }

        public string VehicleBrand { get; init; }

        public string LicensePlate { get; init; }

        public int? Year { get; init; }

        public int Odo { get; init; }

        public string ImageUrl { get; init; }

        public string Username { get; init; }

        public decimal HealthDistance { get; private set; }

        public decimal HealthTime { get; private set; }

        public byte[] Avatar { get; init; }
    }

    public class MaintainanceViewModel
    {
        public int Id { get; init; }
        public int MaintainType { get; init; } // 1 == schedule, 0 == non-schedule
        public DateTime MaintainanceDate { get; init; }
        public string Title { get; init; }
        public string Comment { get; init; }
        public int Odo { get; init; }
        public double Cost { get; init; }
        public DateTime CreatedDate { get; init; }
        public string MaintainCode { get; init; }
        public int? VehicleRequirementId { get; init; }

        public IEnumerable<MaintainDetailViewModel> MaintainDetails { get; set; }
    }

    public class MaintainDetailViewModel
    {
        public string Name { get; init; }
        public string Description { get; init; }
        public string PartName { get; init; }
        public string MaintainanceCode { get; init; }
        public int DayInterval { get; init; }
        public int DistanceInterval { get; init; }
        public decimal Cost { get; init; }
    }

    public class VehicleRequirementViewModel
    {
        public string Name { get; init; }
        public string Description { get; init; }
        public string PartName { get; init; }
        public string MaintainanceCode { get; init; }
        public int DayInterval { get; init; }
        public int DistanceInterval { get; init; }
        public int WeightNumber { get; init; }
    }

    public class VehicleStatusViewModel
    {
        public string Name { get; private set; }
        public int? Odo { get; private set; }
        public DateTime? MaintainDate { get; private set; }
        public int Weight { get; private set; }
        public string MaintainCode { get; private set; }
        public int? VehicleRequirementId { get; private set; }
        public int MaintainDayInterval { get; private set; }
        public int MaintainDistanceInterval { get; private set; }
        public int? MaintainanceId { get; private set; }
        public int? PreviousMaintainanceOdo { get; private set; }
        public DateTime? PreviousMaintainanceDate { get; private set; }
        public bool? IsLatestVersion { get; private set; }
        public int Version { get; private set; }
        private int? _vehicleId;
        public decimal? HealthFromPreviousMaintainDistance { get; private set; }
        public decimal? HealthFromPreviousMaintainTime { get; private set; }
        public decimal? DistanceFromPreviousMaintain { get; private set; }
        public decimal? DayFromPreviousMaintain { get; private set; }
        public decimal? MonthFromPreviousMaintain { get; private set; }
        public decimal? LastestHealthDistance { get; private set; }
        public decimal? LastestHealthTime { get; private set; }
        public DateTime CreatedDate { get; private set; }
    }

    public class VehicleQuery : BaseQuery, IVehicleQuery
    {
        public VehicleQuery(IDbConnection con) : base(con)
        {
        }

        public async Task<IEnumerable<VehicleViewModel>> GetAllVehicle()
        {
            var query = "select * from mm.vehicles where is_deleted is not true";
            return await _dbConnection.QueryAsync<VehicleViewModel>(query);
        }

        public async Task<IEnumerable<VehicleViewModel>> GetVehiclesAsync(string username)
        {
            var query = @"select f.data as avatar,v.*
                        from mm.vehicles v
                        left join mm.files f on v.avatar_file_id = f.id
                        where username = @username
                        and v.is_deleted is not true";
            return await _dbConnection.QueryAsync<VehicleViewModel>(query, new { username });
        }

        public async Task<VehicleViewModel> GetVehicleAsync(int id)
        {
            var query = "select top 1 * from mm.vehicles where id = @id and is_deleted is not true";
            return (await _dbConnection.QueryAsync<VehicleViewModel>(query, new { id })).SingleOrDefault();
        }

        public async Task<IEnumerable<MaintainanceViewModel>> GetVehicleMaintainances(int vehicleId)
        {
            var maintainanceQuery = "select * from mm.maintainances where vehicle_id = @vehicleId";
            var maintainance = await _dbConnection.QueryAsync<MaintainanceViewModel>(maintainanceQuery, new { vehicleId });
            return maintainance;
        }

        public async Task<IEnumerable<VehicleRequirementViewModel>> GetVehicleRequirements(int vehicleId)
        {
            var requirementQuery = "select * from mm.vehicle_requirements where vehicle_id = @vehicleId";
            var requirements = await _dbConnection.QueryAsync<VehicleRequirementViewModel>(requirementQuery, new { vehicleId });
            return requirements;
        }

        public async Task<IEnumerable<VehicleStatusViewModel>> GetVehicleStatusLastestAsync(int vehicleId)
        {
            var vehicleStatusQuery = "select * from mm.vehicle_status where vehicle_id = @vehicleId and is_latest_version = true";
            var status = await _dbConnection.QueryAsync<VehicleStatusViewModel>(vehicleStatusQuery, new { vehicleId });
            return status;
        }
    }
}
