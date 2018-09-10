 using System.Threading.Tasks;
 using Microsoft.AspNetCore.Mvc;
 using Microsoft.WindowsAzure.Storage;
 using Microsoft.WindowsAzure.Storage.Blob;
 using System.Net;
 namespace WebApplicationBasic.Controllers
 {
     [Route("api/[controller]")]
     public class ImagesController : Controller
     {
         private CloudBlobContainer container;
         public ImagesController()
         {
             CloudStorageAccount storageAccount = new CloudStorageAccount(
                 new Microsoft.WindowsAzure.Storage.Auth.StorageCredentials(
                         "wfaliatraininghotstorage",
                         "/h9pFUa/uvqP48sJJ3e4AbelALGllA1ILYXW5FjBv9nzsZ+h89kyxiSXKHARojIWnsLCj4aLhRYsg08h0J/HsA=="), true);
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
            return Ok(new { ok = true });
        }
     }

    public class ImagePostRequest
    {
        public string URL { get; set; }
        public string Id { get; set; }
        public string EncodingFormat { get; set; }
    }
 }