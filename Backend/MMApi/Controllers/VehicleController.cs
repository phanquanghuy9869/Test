using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MMApi.Application.Commands;
using MMApi.Application.Queries;

namespace MMApi.Controllers
{
    public class UpdateOdoInput
    {
        public int Odo { get; set; }
    }

    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class VehicleController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<VehicleController> _logger;
        private readonly IVehicleQuery _vehicleQuery;

        public VehicleController(IMediator mediator, IVehicleQuery vehicleQuery, ILogger<VehicleController> logger)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _vehicleQuery = vehicleQuery;
        }

        #region query
        [Route("items/user/{username}")]
        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(VehicleViewModel), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> ItemsByUserAsync(string username)
        {
            if (String.IsNullOrEmpty(username))
            {
                return Unauthorized();
            }

            var result = await _vehicleQuery.GetVehiclesAsync(username);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [Route("items/{id:int}")]
        [HttpGet]
        public async Task<IActionResult> Item(int id)
        {
            if (id <= 0)
            {
                return BadRequest();
            }

            return Ok(await _vehicleQuery.GetVehicleAsync(id));
        }

        [Route("items/maintainances/create")]
        [HttpPost]
        public async Task<IActionResult> CreateMaintainanceAsync(CreateMaintainanceCommand createMaintainanceCommand)
        {
            var result = await _mediator.Send(createMaintainanceCommand);
            return Ok(result);
        }

        [Route("items/{vehicleId:int}/maintainances")]
        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<ActionResult<IEnumerable<MaintainanceViewModel>>> GetMaintainances(int vehicleId)
        {
            if (vehicleId == 0)
            {
                return BadRequest();
            }

            var result = await _vehicleQuery.GetVehicleMaintainances(vehicleId);

            if (result == null || !result.Any())
            {
                return NotFound();
            }

            return Ok(result);
        }

        [Route("items/{vehicleId}/requirements")]
        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetRequirements(int vehicleId)
        {
            if (vehicleId == 0)
            {
                return BadRequest();
            }

            var result = await _vehicleQuery.GetVehicleRequirements(vehicleId);

            if (result == null || !result.Any())
            {
                return NotFound();
            }

            return Ok(result);
        }

        [Route("items/{vehicleId}/status")]
        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetVehicleStatus(int vehicleId)
        {
            if (vehicleId == 0)
            {
                return BadRequest();
            }

            var result = await _vehicleQuery.GetVehicleStatusLastestAsync(vehicleId);

            return Ok(result);
        }
        #endregion

        #region command
        ///<summary>
        ///
        ///</summary>
        ///<remarks>
        ///{
        ///"maintainCatalogId": 1,
        ///"vehicleType": 4,
        ///"vehicleModel": "Altis",
        ///"vehicleBrand": "Toyota",
        ///"licensePlate": "24A-02425",
        ///"vehicleName": "My sweet altis",
        ///"year": 2012,
        ///"odo": 6000,
        ///"imageUrl": "string",
        ///"username": "admin",
        /// "health": 100,
        /// "avatarId": 100,
        /// "requirements": [
        ///   {
        ///     "name": "oil",
        ///     "description": "string",
        ///     "partName": "string",
        ///     "maintainanceCode": "OIL",
        ///     "dayInterval": 6000,
        ///     "distanceInterval": 180,
        ///     "weightNumber": 300,
        ///     "recentChangeInDay": 500,
        ///     "recentChangeInDistance": 120,
        ///     "maintainRequirementId": 1,
        ///     "vehicleRequirementId": 0
        ///   },
        ///   {
        ///     "name": "breake",
        ///     "description": "BRAKE",
        ///     "partName": "BRAKE",
        ///     "maintainanceCode": "BRAKE",
        ///     "dayInterval": 12000,
        ///     "distanceInterval": 800,
        ///     "weightNumber": 3000,
        ///     "recentChangeInDay": 200,
        ///     "recentChangeInDistance": 2000,
        ///     "maintainRequirementId": 2,
        ///     "vehicleRequirementId": 0
        ///   },
        ///   {
        ///   "name": "tire",
        ///     "description": "string",
        ///     "partName": "Tire",
        ///     "maintainanceCode": "TIRE",
        ///     "dayInterval": 10000,
        ///     "distanceInterval": 1080,
        ///     "weightNumber": 300,
        ///     "recentChangeInDay": 600,
        ///     "recentChangeInDistance": 220,
        ///     "maintainRequirementId": 3,
        ///     "vehicleRequirementId": 0
        ///   }
        /// ]
        //}
        ////</remarks>
        [Route("initial")]
        [HttpPost]
        public async Task<IActionResult> InitialVehicle(CreateVehicleDTO vehicleDTO)
        {
            var initialVehicleCommand = new InitialVehicleCommand(vehicleDTO);
            var result = await _mediator.Send(initialVehicleCommand);
            return Ok(result);
        }

        [Route("maintain/add")]
        [HttpPost]
        public async Task<IActionResult> CreateMaintain(CreateMaintainanceCommand createMaintainCommand)
        {
            var result = await _mediator.Send(createMaintainCommand);
            return Ok(result);
        }

        [Route("items/{vehicleId}/odo/update")]      
        [HttpPatch]
        public async Task<IActionResult> UpdateVehicleOdo(int vehicleId, [FromBody] UpdateOdoInput updateOdoInput)
        {
            if (vehicleId <= 0)
            {
                return BadRequest();
            }

            var vehicleCommand = new UpdateVehicleOdoCommand(vehicleId: vehicleId, odo: updateOdoInput.Odo);
            var result = await _mediator.Send(vehicleCommand);
            return Ok(result);
        }

        [Route("items/{vehicleId}/delete")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [HttpDelete]
        public async Task<IActionResult> DeleteVehicle(int vehicleId)
        {
            if(vehicleId <= 0)
            {
                return BadRequest();
            }
            var checkExistsVehicle = _vehicleQuery.GetVehicleAsync(vehicleId);
            if(checkExistsVehicle == null)
            {
                return NotFound();
            }
            var vehicleCommand = new DeleteVehicleCommand(vehicleId: vehicleId);
            var result = await _mediator.Send(vehicleCommand);
            return Ok(result);
        }
        #endregion
    }

}

