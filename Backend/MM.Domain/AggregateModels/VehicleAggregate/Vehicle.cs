using System;
using System.Collections.Generic;
using System.Linq;
using MM.Domain.SeedWorks;

namespace MM.Domain.AggregateModels.VehicleAggregate
{
    public class Vehicle : BaseEntity, IAggregateRoot
    {
        public int? MaintainCatalogId { get; private set; }

        public int VehicleType { get; private set; }

        public string VehicleModel { get; private set; }

        public string VehicleBrand { get; private set; }

        public string LicensePlate { get; private set; }

        public int? Year { get; private set; }

        public int Odo { get; private set; }

        public string ImageUrl { get; private set; }

        public string Username { get; private set; }

        public decimal HealthDistance { get; private set; }

        public decimal HealthTime { get; private set; }

        public int AvatarFileId { get; private set; }

        public DateTime? LastMaintainedDate { get; private set; }

        public double? FuelAverage { get; private set; }

        public double? FuelAverageInReal { get; private set; }

        public bool? IsDeleted { get; private set; }

        private readonly List<VehicleRequirement> _vehicleRequirements;
        public IReadOnlyCollection<VehicleRequirement> VehicleRequirements => _vehicleRequirements;

        private readonly List<Maintainance> _maintainces;
        public IReadOnlyCollection<Maintainance> VehicleMaintainances => _maintainces;

        private readonly List<VehicleStatus> _status;
        public IReadOnlyCollection<VehicleStatus> Status => _status;

        private readonly List<FuelTracking> _fuelTracking;
        public IReadOnlyCollection<FuelTracking> FuelTracking => _fuelTracking;

        public Vehicle()
        {
            _vehicleRequirements = new List<VehicleRequirement>();
            _maintainces = new List<Maintainance>();
            _status = new List<VehicleStatus>();
            HealthDistance = 100;
        }

        public Vehicle(int? maintainCatalogId, int vehicleType, string vehicleModel, string vehicleBrand, string licensePlate, int? year
            , int odo, string imageUrl, string username, int health, int avatarFileId )
            : this()
        {
            VehicleType = vehicleType;
            VehicleModel = vehicleModel;
            VehicleBrand = vehicleBrand;
            LicensePlate = licensePlate;
            Year = year;
            Odo = odo;
            ImageUrl = imageUrl;
            Username = username;
            HealthDistance = health;
            HealthTime = health;
            AvatarFileId = avatarFileId;
            MaintainCatalogId = maintainCatalogId;
        }

        public VehicleRequirement AddRequirement(string name, string description, string partName, string maintainanceCode
            , int dayInterval, int distanceInterval, int weightNumber, int? maintainRequirementId)
        {
            var req = new VehicleRequirement(this.Id, name, description, partName, maintainanceCode, dayInterval
                , distanceInterval, weightNumber, maintainRequirementId);
            _vehicleRequirements.Add(req);
            return req;
        }

        /// <summary>
        /// Trying to record the nearest mantainance of vehicle as a initial status
        /// if recent maintain days and maintain distance are registered then we can record the last maintain record, if not we cant
        /// </summary>
        public void InitStatus(string name, string maintainanceCode, int dayInterval, int distanceInterval, int weightNumber
            , int? recentMaintainDays, int? recentMaintainDistance, int? vehicleReqId, int? maintainanceId)
        {
            if (_status?.Count > 0 && _status.Any(x => x.MaintainCode == maintainanceCode))
            {
                throw new InvalidOperationException("Status is already initialized");
            }

            int? lastMaintainceOdo = this.Odo >= recentMaintainDistance && recentMaintainDays.HasValue ? this.Odo - recentMaintainDistance : null;
            DateTime? lastMaintainceDate = recentMaintainDays.HasValue ? DateTime.Now.AddDays((-1) * recentMaintainDays.Value) : (DateTime?)null;

            var status = new VehicleStatus(name: name, odo: lastMaintainceOdo, maintainDate: lastMaintainceDate, weight: weightNumber, maintainCode: maintainanceCode
                , vehicleRequirementId: vehicleReqId, maintainDayInterval: dayInterval, maintainDistanceInterval: distanceInterval, maintainanceId: maintainanceId
                , lastMaintainanceOdo: null, lastMaintainanceDate: null, version: 1);

            status.SetLatestVersion();

            var healthDistance = status.CalculateHealthDistance(Odo);
            status.SetLatestHealthDistance(healthDistance);

            var healthTime = status.CalculateHealthTime(DateTime.Now);
            status.SetLatestHealthTime(healthTime);
            _status.Add(status);
        }

      
    }
}
