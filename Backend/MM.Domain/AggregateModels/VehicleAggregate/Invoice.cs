using System;
using System.Collections.Generic;
using MM.Domain.SeedWorks;

namespace MM.Domain.AggregateModels.VehicleAggregate
{
    public class Invoice : ValueObject
    {
        public string FileName { get; private set; }
        public string Url { get; private set; }
        public int FileSize { get; private set; }

        public Invoice()
        {
        }

        public Invoice(string fileName, string url, int fileSize)
        {
            FileName = fileName;
            Url = url;
            FileSize = fileSize;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Url;
        }
    }
}
