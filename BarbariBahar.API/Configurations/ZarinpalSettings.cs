namespace BarbariBahar.API.Configurations
{
    public class ZarinpalSettings
    {
        public const string SectionName = "ZarinpalSettings";

        public string MerchantId { get; set; } = string.Empty;
        public bool IsSandbox { get; set; } = true;
    }
}
