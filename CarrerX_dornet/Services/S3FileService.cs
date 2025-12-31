using Amazon;
using Amazon.S3;
using Amazon.S3.Transfer;

public class S3FileService
{
    private readonly IConfiguration _configuration;
    private readonly IAmazonS3 _s3Client;

    public S3FileService(IConfiguration configuration)
    {
        _configuration = configuration;

        _s3Client = new AmazonS3Client(
            _configuration["AWS:AccessKey"],
            _configuration["AWS:SecretKey"],
            RegionEndpoint.GetBySystemName(_configuration["AWS:Region"])
        );
    }

    public async Task<string> UploadFileAsync(IFormFile file)
    {
        var bucketName = _configuration["AWS:BucketName"];
        var fileName = $"{Guid.NewGuid()}_{file.FileName}";

        using var stream = file.OpenReadStream();

        var uploadRequest = new TransferUtilityUploadRequest
        {
            InputStream = stream,
            Key = fileName,
            BucketName = bucketName,
            ContentType = file.ContentType
        };

        var transferUtility = new TransferUtility(_s3Client);
        await transferUtility.UploadAsync(uploadRequest);

        return $"https://{bucketName}.s3.amazonaws.com/{fileName}";
    }
}
