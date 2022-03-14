using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace MMApi.Application.Commands
{
    [DataContract]
    public class CreateVehicleCommand : IRequest<int>
    {
        [DataMember]
        public int Type { get; private set; }
        [DataMember]
        public string VehicleModel { get; private set; }
        [DataMember]
        public string VehicleBrand { get; private set; }
        [DataMember]
        public string LicensePlate { get; private set; }
        [DataMember]
        public int Year { get; private set; }
        [DataMember]
        public int Odo { get; private set; }
        [DataMember]
        public string ImageUrl { get; private set; }
        [DataMember]
        public string Username { get; private set; }
        [DataMember]
        public int Health { get; private set; }
        [DataMember]
        public int AvatarId { get; private set; }
        [DataMember]
        public int MaintainCatalogId { get; private set; }

        public CreateVehicleCommand(int maintainCatalogId,int type, string vehicleModel, string vehicleBrand, string licensePlate, int year, int odo, string imageUrl, string username, int health, int avatarId)
        {
            Type = type;
            VehicleModel = vehicleModel;
            VehicleBrand = vehicleBrand;
            LicensePlate = licensePlate;
            Year = year;
            Odo = odo;
            ImageUrl = imageUrl;
            Username = username;
            Health = health;
            AvatarId = avatarId;
            MaintainCatalogId = maintainCatalogId;
        }
    }

    public class CreateVehicleDTO
    {
        public int MaintainCatalogId { get; set; }
        public int VehicleType { get; set; }
        public string VehicleModel { get; set; }
        public string VehicleBrand { get; set; }
        public string LicensePlate { get; set; }
        public string VehicleName { get; set; }
        public int Year { get; set; }
        public int Odo { get; set; }
        public string ImageUrl { get; set; }
        public string Username { get; set; }
        public int Health { get; set; }
        public int AvatarId { get; set; }
        public List<VehicleRequirementDTO> Requirements { get; set; }
    }
}
