using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using MMApi.ViewModels;

namespace MMApi.Application.Queries
{
    public class MaintainCatalogQuery : BaseQuery, IMaintainCatalogQuery
    {
        public MaintainCatalogQuery(IDbConnection con) : base(con)
        {
        }

        //public async Task<IEnumerable<MaintainCatalogViewModel>> GetPaging(MaintainCatalogPagingInput input)
        public async Task<PagingViewModel<MaintainCatalogViewModel>> GetPaging(MaintainCatalogPagingInput input)
        {
            var queryPaging = @"select mc.id as Id, mc.vehicle_type as VehicleType, mc.vehicle_brand  as VehicleBrand, mc.vehicle_name  as vehicle_name 
	                        , mc. year_made  as YearMade, mc.engine_capacity  as EngineCapacity 
                        from mm.maintain_catalog mc 
                        where mc.id > @ActivePos";
            if (!string.IsNullOrEmpty(input.VehicleBrand))
            {
                queryPaging += @" and vehicle_brand = @VehicleBrand";
            }
            if (!string.IsNullOrEmpty(input.VehicleName))
            {
                queryPaging += @" and vehicle_name = @VehicleName";
            }
            queryPaging += @" order by mc.id limit @Take";

            var queryCount = @"select count(1) from mm.maintain_catalog where 1=1";
            if (!string.IsNullOrEmpty(input.VehicleBrand))
            {
                queryCount += @" and vehicle_brand = @VehicleBrand";
            }
            if (!string.IsNullOrEmpty(input.VehicleName))
            {
                queryCount += @" and vehicle_name = @VehicleName";
            }
            var query = $"{queryPaging}; {queryCount}";

            var reader = await _dbConnection.QueryMultipleAsync(query, new { input.ActivePos, input.VehicleBrand, input.VehicleName, input.Take });
            var paging = reader.Read<MaintainCatalogViewModel>().ToList();
            var count = reader.Read<int>().FirstOrDefault();
            return new PagingViewModel<MaintainCatalogViewModel> { Pages = paging, Total = count };
        }

        public async Task<MaintainCatalogViewModel> GetCatalog(int maintainCatalogId)
        {
            var query = @"select * from mm.maintain_catalog mc where id = @maintainCatalogId limit 1";
            var result = (await _dbConnection.QueryAsync<MaintainCatalogViewModel>(query, new { maintainCatalogId })).SingleOrDefault();
            return result;
        }

        public async Task<IEnumerable<MaintainRequirementViewModel>> GetRequirements(int maintainCatalogId)
        {
            var query = @"select * from mm.maintain_requirement mr where maintain_catalog_id  = @maintainCatalogId";
            var result = await _dbConnection.QueryAsync<MaintainRequirementViewModel>(query, new { maintainCatalogId });
            return result;
        }

        public async Task<MaintainCatalogViewModel> GetCatalog(string brand, string model)
        {
            var query = @"select * from mm.maintain_catalog mc where vehicle_brand  = @brand and vehicle_name = @model limit 1";
            var result = (await _dbConnection.QueryAsync<MaintainCatalogViewModel>(query, new { brand, model })).SingleOrDefault();
            return result;
        }
    }
}
