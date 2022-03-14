using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using MMApi.Application.Queries.QueryModels;

namespace MMApi.Application.Queries
{
    public class MaintainRequirementQuery : BaseQuery, IMaintainRequirementQuery
    {
        public MaintainRequirementQuery(IDbConnection con) : base(con)
        {
        }

        public async Task<IEnumerable<MaintainRequirementQueryModel>> GetRequirementsByCatalogAsync(int catalogId)
        {
            var query = @"select maintain_catalog_id as MaintainCatalogId, id Id, part_name PartName, ""name"" as ""Name"", day_interval DayInterval, distance_interval DistanceInterval,
                    maintainance_code MaintainanceCode, weight_number WeightNumber, description description
                    from mm.maintain_requirement
                    where maintain_catalog_id = @catalogId";
            var result = await _dbConnection.QueryAsync<MaintainRequirementQueryModel>(query, new { catalogId });
            return result;
        }
    }
}
