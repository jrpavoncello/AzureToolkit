using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System.Net;
using WebApplicationBasic.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Configuration;

namespace WebApplicationBasic.Controllers
{
    [Route("api/[controller]")]
    public class SettingsController : Controller
    {
        private readonly IConfiguration config;
        public SettingsController(IConfiguration config)
        {
            this.config = config;
        }

        [HttpPost]
        public IActionResult GetSettings([FromBody]SettingsRequest request)
        {
            var bingSearchApiKey = config.GetValue<string>("bingSearchApiKey");
            var computerVisionAPIKey = config.GetValue<string>("computerVisionAPIKey");

            return Json(new {
                bingSearchApiKey = bingSearchApiKey,
                computerVisionAPIKey = computerVisionAPIKey
            });
        }
    }

    public class SettingsRequest
    {
        public string Token { get; set; }
    }
}