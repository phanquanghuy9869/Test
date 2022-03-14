using System;
using MM.Domain.SeedWorks;

namespace MM.Domain.AggregateModels.VehicleAggregate
{
    public class VehicleStatus : BaseEntity
    {
        public string Name { get; private set; }
        public int? Odo { get; private set; }
        public DateTime? MaintainDate { get; private set; }
        public int Weight { get; private set; }
        public string MaintainCode { get; private set; }
        public int? VehicleRequirementId { get; private set; }
        public int MaintainDayInterval { get; private set; }
        public int MaintainDistanceInterval { get; private set; }
        public int? MaintainanceId { get; private set; }
        public int? PreviousMaintainanceOdo { get; private set; }
        public DateTime? PreviousMaintainanceDate { get; private set; }
        public bool? IsLatestVersion { get; private set; }
        public int Version { get; private set; }
        private int? _vehicleId;
        public decimal? HealthFromPreviousMaintainDistance { get; private set; }
        public decimal? HealthFromPreviousMaintainTime { get; private set; }
        public decimal? DistanceFromPreviousMaintain { get; private set; }
        public decimal? DayFromPreviousMaintain { get; private set; }
        public decimal? MonthFromPreviousMaintain { get; private set; }
        public decimal? LastestHealthDistance { get; private set; }
        public decimal? LastestHealthTime { get; private set; }
        public DateTime CreatedDate { get; private set; }

        public VehicleStatus()
        {
        }

        public VehicleStatus(string name, int? odo, DateTime? maintainDate, int weight, string maintainCode, int? vehicleRequirementId, int maintainDayInterval
            , int maintainDistanceInterval, int? maintainanceId, int? lastMaintainanceOdo, DateTime? lastMaintainanceDate, int version)
        {
            Name = name;
            Odo = odo;
            MaintainDate = maintainDate;
            Weight = weight;
            MaintainCode = maintainCode;
            VehicleRequirementId = vehicleRequirementId;
            MaintainDayInterval = maintainDayInterval;
            MaintainDistanceInterval = maintainDistanceInterval;
            MaintainanceId = maintainanceId;
            PreviousMaintainanceOdo = lastMaintainanceOdo;
            PreviousMaintainanceDate = lastMaintainanceDate;
            Version = version;
            CreatedDate = DateTime.Now;
        }

        public void SetPreviousMaintainOdo(int? previousOdo)
        {
            this.PreviousMaintainanceOdo = previousOdo;
        }

        public void SetPreviousMaintainDate(DateTime? previousMaintainDate)
        {
            this.PreviousMaintainanceDate = previousMaintainDate;
        }

        /// <summary>
        /// After apply an maintainance, calculate health right before the maintain
        /// </summary>
        public void CalculateStatusBeforeMaintain()
        {
            DistanceFromPreviousMaintain = Odo - PreviousMaintainanceOdo.GetValueOrDefault();
            DayFromPreviousMaintain = MaintainDate.HasValue && PreviousMaintainanceDate.HasValue ? (MaintainDate.Value - PreviousMaintainanceDate.Value).Days : 0;

            if (DistanceFromPreviousMaintain >= MaintainDistanceInterval || DayFromPreviousMaintain >= MaintainDayInterval)
            {
                HealthFromPreviousMaintainDistance = 0;
                HealthFromPreviousMaintainTime = 0;
                return;
            }

            HealthFromPreviousMaintainDistance = 100 - ((decimal)DistanceFromPreviousMaintain / MaintainDistanceInterval * 100);
            HealthFromPreviousMaintainTime = 100 - ((decimal)DayFromPreviousMaintain / MaintainDayInterval * 100);
        }

        /// <summary>
        /// Calculate health at selected odo and date
        /// </summary>
        [Obsolete]
        public decimal CalculateHealth(int nextOdo, DateTime nextDate)
        {
            var distanceFromLastMaintainance = nextOdo - Odo;
            var dayFromLastMaintainance = MaintainDate.HasValue ? (nextDate - MaintainDate.Value).Days : 0;
            decimal maintainProgressDistance;
            decimal maintainProgressDay;
            if (distanceFromLastMaintainance >= MaintainDistanceInterval || dayFromLastMaintainance >= MaintainDayInterval)
            {
                maintainProgressDistance = 0;
                maintainProgressDay = 0;
            }
            else
            {
                maintainProgressDistance = 100 - ((decimal)distanceFromLastMaintainance / MaintainDistanceInterval * 100);
                maintainProgressDay = 100 - ((decimal)dayFromLastMaintainance / MaintainDayInterval * 100);
            }
            var result = maintainProgressDistance * 0.8m + maintainProgressDay * 0.2m;
            return result;
        }

        /// <summary>
        /// Calculate distance health
        /// </summary>
        public decimal? CalculateHealthDistance(int nextOdo)
        {
            var distance = Odo.HasValue ? nextOdo - Odo : (decimal?)null;

            if (!distance.HasValue)
            {
                return (decimal?)null;
            }

            if (distance.Value >= MaintainDistanceInterval)
            {
                return 0;
            }

            return 100 - ((decimal)distance.Value / MaintainDistanceInterval * 100);
        }

        public decimal? CalculateHealthTime(DateTime nextDate)
        {
            if (!MaintainDate.HasValue)
            {
                return (decimal?)null;
            }

            var days = (nextDate.Date - MaintainDate.Value.Date).Days;

            if (days >= MaintainDayInterval) return 0;

            return 100 - ((decimal)days / MaintainDayInterval * 100);
        }


        public void SetLatestVersion()
        {
            this.IsLatestVersion = true;
        }

        public void RemoveLatestVersion()
        {
            this.IsLatestVersion = false;
        }

        public void SetLatestHealthDistance(decimal? healthDistance)
        {
            this.LastestHealthDistance = healthDistance;
        }

        public void SetLatestHealthTime(decimal? healthTime)
        {
            this.LastestHealthTime = healthTime;
        }
    }
}
