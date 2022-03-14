using System;
namespace MMApi.Application.Queries.QueryModels
{
    public class MaintainRequirementQueryModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string PartName { get; set; }
        public string MaintainanceCode { get; set; }
        public int DayInterval { get; set; }
        public int DistanceInterval { get; set; }
        public int WeightNumber { get; set; }
        public int MaintainCatalogId { get; set; }

        public MaintainRequirementQueryModel() { }
    }
}
