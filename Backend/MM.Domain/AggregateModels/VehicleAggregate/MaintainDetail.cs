using System;
using System.Collections.Generic;
using MM.Domain.SeedWorks;

namespace MM.Domain.AggregateModels.VehicleAggregate
{
    public class MaintainDetail : ValueObject
    {
        public string Name { get; private set; }
        public string Description { get; private set; }
        public string PartName { get; private set; }
        public string MaintainanceCode { get; private set; }
        public int DayInterval { get; private set; }
        public int DistanceInterval { get; private set; }
        public decimal Cost { get; private set; }
        public int VehicleRequirementId { get; private set; }

        public MaintainDetail()
        {
        }

        public MaintainDetail(string name, string description, string partName, string maintainCode, int dayInterval, int distanceInterval
            , decimal cost, int vehicleReqId)
        {
            Name = name;
            Description = description;
            PartName = partName;
            MaintainanceCode = maintainCode;
            DayInterval = dayInterval;
            DistanceInterval = distanceInterval;
            Cost = cost;
            VehicleRequirementId = vehicleReqId;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Name;
            yield return Description;
            yield return MaintainanceCode;
            yield return DayInterval;
            yield return DistanceInterval;
            yield return Cost;
        }
    }
}
