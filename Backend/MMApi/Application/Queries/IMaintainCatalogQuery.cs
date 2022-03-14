using System.Collections.Generic;
using System.Threading.Tasks;
using MMApi.ViewModels;

namespace MMApi.Application.Queries
{
    public interface IMaintainCatalogQuery
    {
        Task<PagingViewModel<MaintainCatalogViewModel>> GetPaging(MaintainCatalogPagingInput input);
        Task<MaintainCatalogViewModel> GetCatalog(int maintainCatalogId);
        Task<MaintainCatalogViewModel> GetCatalog(string brand, string model);
        Task<IEnumerable<MaintainRequirementViewModel>> GetRequirements(int maintainCatalogId);
    }
}
