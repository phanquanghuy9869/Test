using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using MM.Domain.AggregateModels.VehicleAggregate;

namespace MMApi.Application.Commands
{
    public class CreateVehicleCommandHandler : IRequestHandler<CreateVehicleCommand, int>
    {
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IMediator _mediator;
        private readonly ILogger _logger;

        public CreateVehicleCommandHandler(IMediator mediator, IVehicleRepository vehicleRepository
            , ILogger<CreateVehicleCommandHandler> logger)
        {
            _mediator = mediator;
            _vehicleRepository = vehicleRepository;
            _logger = logger;
        }

        public async Task<int> Handle(CreateVehicleCommand vehicleCommand, CancellationToken cancellationToken)
        {
            var vehicle = new Vehicle(vehicleCommand.MaintainCatalogId, vehicleCommand.Type, vehicleCommand.VehicleModel, vehicleCommand.VehicleBrand,
            vehicleCommand.LicensePlate, vehicleCommand.Year, vehicleCommand.Odo, vehicleCommand.ImageUrl, vehicleCommand.Username
            , vehicleCommand.Health, vehicleCommand.AvatarId);
            await _vehicleRepository.AddAsync(vehicle);
            return await _vehicleRepository.UnitOfWork.SaveEntitiesAsync(cancellationToken);
        }
    }
}
