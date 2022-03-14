using System;
using System.Collections.Generic;
using MM.Domain.SeedWorks;

namespace MM.Domain.AggregateModels.VehicleAggregate
{
    public class Maintainance : BaseEntity
    {
        public int MaintainType { get; private set; } // 1 == schedule, 0 == non-schedule
        public DateTime MaintainanceDate { get; private set; }
        public string Title { get; private set; }
        public string Comment { get; private set; }
        public int Odo { get; private set; }
        public DateTime CreatedDate { get; private set; }
        private int? _vehicleId;

        //public readonly List<Invoice> Invoices;
        ////public IReadOnlyCollection<Invoice> Invoices => _invoices;

        //private readonly List<MaintainDetail> MaintainDetails;
        //public IReadOnlyCollection<MaintainDetail> MaintainDetails => _maintainDetails;
        public ICollection<Invoice> Invoices { get; private set; }
        public ICollection<MaintainDetail> MaintainDetails { get; private set; }

        public Maintainance()
        {
            MaintainDetails = new List<MaintainDetail>();
            Invoices = new List<Invoice>();
        }

        public Maintainance(int maintainType, DateTime maintainanceDate, string title, string comment, int odo
            , DateTime createdDate) : base()
        {
            MaintainType = maintainType;
            MaintainanceDate = maintainanceDate;
            Title = title;
            Comment = comment;
            Odo = odo;
            CreatedDate = createdDate;
        }

        public void AddMaintainDetail(string name, string description, string partName, string maintainCode, int dayInterval, int distanceInterval
            , decimal cost, int vehicleReqId)
        {
            var detail = new MaintainDetail(name: name, description: description, partName: partName, maintainCode: maintainCode, dayInterval: dayInterval,
                distanceInterval: distanceInterval, cost: cost, vehicleReqId: vehicleReqId);
            this.MaintainDetails.Add(detail);
        }

        public void AddInvoice(string name, string url, int size)
        {
            Invoices.Add(new Invoice(name, url, size));
        }

    }
}
