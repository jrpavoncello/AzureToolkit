using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System.Net;
using WebApplicationBasic.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage.Auth;

namespace WebApplicationBasic.Controllers
{
    [Route("api/[controller]")]
    public class ImagesController : Controller
    {
        private CloudBlobContainer container;
        private AzureToolkitContext context;
        private IConfiguration config;

        public ImagesController(IConfiguration config, AzureToolkitContext context)
        {
            this.config = config;
            this.context = context;

            var accountName = config.GetValue<string>("StorageCredentials.accountName");
            var keyValue = config.GetValue<string>("StorageCredentials.keyValue");

            CloudStorageAccount storageAccount = new CloudStorageAccount(
                new StorageCredentials(accountName, keyValue), 
                true);
            // Create a blob client.
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
            this.container = blobClient.GetContainerReference("savedimages");
        }
        
        [HttpPost]
        public async Task<IActionResult> PostImage([FromBody]ImagePostRequest request)
        {
            CloudBlockBlob blockBlob = this.container.GetBlockBlobReference($"{request.Id}.{request.EncodingFormat}");
            HttpWebRequest aRequest = (HttpWebRequest)WebRequest.Create(request.URL);
            HttpWebResponse aResponse = (HttpWebResponse)(await aRequest.GetResponseAsync());

            using(var stream = aResponse.GetResponseStream())
            {
                await blockBlob.UploadFromStreamAsync(stream);
            }

            //Save metadata
            var savedImage = new SavedImage();
            savedImage.UserId = request.UserId;
            savedImage.Description = request.Description;
            savedImage.StorageUrl = blockBlob.Uri.ToString();
            savedImage.Tags = new List<SavedImageTag>();

            foreach(var tag in request.Tags)
            {
                savedImage.Tags.Add(new SavedImageTag() {Tag = tag});
            }

            context.Add(savedImage);
            context.SaveChanges();

            return Ok(new { ok = true });
        }
    }

    public class ImagePostRequest
    {
        public string UserId { get; set; }
        public string Description { get; set; }
        public string[] Tags { get; set; }
        public string URL { get; set; }
        public string Id { get; set; }
        public string EncodingFormat { get; set; }
    }
}