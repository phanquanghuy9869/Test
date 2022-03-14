using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using MM.Domain.AggregateModels.MaintainCatalogAggregate;

namespace MMApi.Application.Commands
{
    public class CreateMaintainCatalogHandler : IRequestHandler<CreateMaintainCatalogCommand, MaintainCatalog>
    {
        private readonly ILogger _logger;
        private readonly IMaintainCatalogRepository _maintainCatalogRepo;

        public CreateMaintainCatalogHandler(ILogger<CreateMaintainCatalogHandler> logger, IMaintainCatalogRepository maintainCatalogRepo)
        {
            _logger = logger;
            _maintainCatalogRepo = maintainCatalogRepo;
        }

        public async Task<MaintainCatalog> Handle(CreateMaintainCatalogCommand request, CancellationToken cancellationToken)
        {
            var maintainCatalog = new MaintainCatalog(vehicleType: request.VehicleType, vehicleBrand: request.VehicleBrand
                , vehicleName: request.VehicleName, yearMade: request.YearMade, engineCapacity: request.EngineCapacity, fuelAverage: request.FuelAverage);           
            var result = _maintainCatalogRepo.Add(maintainCatalog);
            await _maintainCatalogRepo.UnitOfWork.SaveChangesAsync();
            return result;
        }
    }
}
