using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;

namespace MMApi.Application.Queries
{
    public class FuelViewModel
    {
        public int Id { get; init; }
        public DateTime Fuel_Date { get; init; }
        public int Odo { get; init; }
        public double Refuel_Amount { get; init; }
        public double Fuel_Remain { get; init; }
        public double Fuel_Average { get; init; }
        public string Fuel_Status { get;init; }
        public string Location { get; init; }
        public double Cost { get; init; }
        public string Note { get; init; }
        public string Create_Date { get; init; }
        public string Create_By { get; init; }
        public int Previous_Mileage { get; init; }  
        public int City_Percentage { get; init; }
        public string Fuel_Type { get; init; }
        public DateTime Last_Edited_Date { get; init; }
        public string Edited_By { get; init; }
        public int Vehicle_Id { get; init; }      
        public string Vehicle_Model { get; init; }
        public string Vehicle_Brand { get; init; }
        public string Vehicle_Image_Url { get; init; }
        public int Vehicle_Years { get; init; }
    }


    public class FuelQuery : BaseQuery, IFuelQuery
    {
        public FuelQuery(IDbConnection con) : base(con)
        {
        }
        public async Task<IEnumerable<FuelViewModel>> GetAllFuelByVehicleId(int vehicleId, string username)
        {
            var query = "select fu.*, ve.vehicle_model, ve.vehicle_brand, ve.year as vehicle_year, ve.image_url as vehicle_image_url " +
                        "from mm.Fuel_tracking fu " +
                        "left join mm.vehicles ve on fu.vehicle_id = ve.id " +
                        "where fu.vehicle_id = @vehicle_id and fu.created_by = @username and fu.is_deleted is not true ";
            return await _dbConnection.QueryAsync<FuelViewModel>(query, new {vehicleId,username});
                
        }

        public async Task<FuelViewModel> GetFuelAsyncByFuelId(int fuelId, string username)
        {
            var query = "select fu.*, ve.vehicle_model, ve.vehicle_brand, ve.year as vehicle_year, ve.image_url as vehicle_image_url " +
                   "from mm.Fuel_tracking fu " +
                   "left join mm.vehicles ve on fu.vehicle_id = ve.id " +
                   "where fu.id = @fuelid and fu.created_by = @username and fu.is_deleted is not true ";
            return (await _dbConnection.QueryAsync<FuelViewModel>(query, new { fuelId,username })).SingleOrDefault();
        }

        public async Task<IEnumerable<FuelViewModel>> GetFuelByDate(DateTime frDate, DateTime toDate, int vehicleId)
        {
            var query = "select fu.*, ve.vehicle_model, ve.vehicle_brand, ve.year as vehicle_year, ve.image_url as vehicle_image_url " +
                "from mm.Fuel_tracking fu " +
                "left join mm.vehicles ve on fu.vehicle_id = ve.id " +
                "where fu.vehicle_id = @vehicleId and fu.created_date >= @frDate and fu.created_date <= @toDate " +
                "and fu.is_deleted is not true ";
            return await _dbConnection.QueryAsync<FuelViewModel>(query, new { frDate, toDate,vehicleId });
        }
    }
}
