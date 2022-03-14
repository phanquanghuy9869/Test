using System;
using System.Collections;
using System.Collections.Generic;
using MediatR;
using MM.Domain.AggregateModels.MaintainCatalogAggregate;

namespace MMApi.Application.Commands
{
    public class CreateMaintainCatalogCommand : IRequest<MaintainCatalog>
    {
        public int VehicleType { get; private set; }
        public string VehicleBrand { get; private set; }
        public string VehicleName { get; private set; }
        public int YearMade { get; private set; }
        public string EngineCapacity { get; private set; }
        public double? FuelAverage { get; private set; }

        public CreateMaintainCatalogCommand(int vehicleType, string vehicleBrand, string vehicleName, int yearMade
            , string engineCapacity, double? fuelAverage)
        {
            VehicleType = vehicleType;
            VehicleBrand = vehicleBrand;
            VehicleName = vehicleName;
            YearMade = yearMade;
            EngineCapacity = engineCapacity;
            FuelAverage = fuelAverage;
        }
    }
}
