using System;
using System.Collections.Generic;
using MM.Domain.SeedWorks;

namespace MM.Domain.AggregateModels.VehicleAggregate
{
    public class VehicleRequirement : BaseEntity
    {
        public string Name { get; private set; }
        public string Description { get; private set; }
        public string PartName { get; private set; }
        public string MaintainanceCode { get; private set; }
        public int DayInterval { get; private set; }
        public int DistanceInterval { get; private set; }
        public int WeightNumber { get; private set; }
        public int? MaintainRequirementId { get; private set; }
        public bool IsActive { get; private set; }
        private int? _vehicleId;

        public VehicleRequirement()
        {
        }

        public VehicleRequirement(int vehicleId, string name, string description, string partName, string maintainanceCode, int dayInterval, int distanceInterval, int weightNumber, int? maintainRequirementId)
        {
            _vehicleId = vehicleId;
            Name = name;
            Description = description;
            PartName = partName;
            MaintainanceCode = maintainanceCode;
            DayInterval = dayInterval;
            DistanceInterval = distanceInterval;
            WeightNumber = weightNumber;
            MaintainRequirementId = maintainRequirementId;
            IsActive = true;
        }
    }
}
