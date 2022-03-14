using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MMApi.Application.Queries.QueryModels;

namespace MMApi.Application.Queries
{
    public interface IMaintainRequirementQuery
    {
        Task<IEnumerable<MaintainRequirementQueryModel>> GetRequirementsByCatalogAsync(int catalogId);
    }
}
