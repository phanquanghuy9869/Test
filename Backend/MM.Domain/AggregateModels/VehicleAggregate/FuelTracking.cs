using System;
using MM.Domain.SeedWorks;

namespace MM.Domain.AggregateModels.VehicleAggregate
{
    public class FuelTracking : BaseEntity, IAggregateRoot
    {
        public DateTime FuelDate { get; private set; }
        public int Odo { get; private set; }
        public double RefuelAmount { get; private set; }
        public double FuelRemain { get; private set; }
        public string FuelStatus { get; private set; }
        public string Location { get; private set; }
        public double Cost { get; private set; }
        public string Note { get; private set; }
        public DateTime CreatedDate { get; private set; }
        public string CreatedBy { get; private set; }
        public int PreviousMileage { get; private set; }
        public double CityPercentage { get; private set; }
        public string FuelType { get; private set; }
        public DateTime LastEditedDate { get; private set; }
        public string EditedBy { get; private set; }
        public double FuelAverage { get; private set; }
        public int VehicleId { get; private set; }
        public bool? IsDeleted { get; private set; }

        public FuelTracking()
        {
        }

        public FuelTracking(int vehicleId, DateTime fuelDate, int odo, double refuelAmount, double fuelRemain, string fuelStatus, string location, double cost, string note, DateTime createdDate, string createdBy, int previousMileage, double cityPercentage, string fuelType, DateTime lastEditedDate, string editedBy)
        {
            VehicleId = vehicleId;
            FuelDate = fuelDate;
            Odo = odo;
            RefuelAmount = refuelAmount;
            FuelRemain = fuelRemain;
            FuelStatus = fuelStatus;
            Location = location;
            Cost = cost;
            Note = note;
            CreatedDate = createdDate;
            CreatedBy = createdBy;
            PreviousMileage = previousMileage;
            CityPercentage = cityPercentage;
            FuelType = fuelType;
            LastEditedDate = lastEditedDate;
            EditedBy = editedBy;
        }

        public FuelTracking(int id, DateTime fuelDate, int odo, double refuelAmount, double fuelRemain, string fuelStatus, string location, double cost, string note, int previousMileage, double cityPercentage, string fuelType, DateTime lastEditedDate, string editedBy)
        {
            Id = id;
            FuelDate = fuelDate;
            Odo = odo;
            RefuelAmount = refuelAmount;
            FuelRemain = fuelRemain;
            FuelStatus = fuelStatus;
            Location = location;
            Cost = cost;
            Note = note;
            PreviousMileage = previousMileage;
            CityPercentage = cityPercentage;
            FuelType = fuelType;
            LastEditedDate = lastEditedDate;
            EditedBy = editedBy;
        }

        // methods
        /// <summary>
        /// Công thức : M = (L/ S) x 100
        /// S: Độ dài quãng đương đi được (km)
        /// L: Dung tích xăng đổ lần 2 (lít)
        /// </summary>
        /// <param name="oldOdo"></param>
        /// <param name="newOdo"></param>
        /// <param name="FuelUsed"></param>
        /// <returns></returns>
        public double CaculateFuelAverage(int oldOdo, int newOdo, double FuelUsed)
        {
            return (FuelUsed / (newOdo - oldOdo)) * 100;
        }

        public void UpdateFuelAverage(int oldOdo, int newOdo, double FuelUsed)
        {
            this.FuelAverage = CaculateFuelAverage(oldOdo, newOdo, FuelUsed);
        }

        public void DeleteFuelTracking()
        {
            this.IsDeleted = true;
        }
    }
}
