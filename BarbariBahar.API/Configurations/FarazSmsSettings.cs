namespace BarbariBahar.API.Configurations
{
    public class FarazSmsSettings
    {
        public const string SectionName = "FarazSmsSettings";

        public string ApiKey { get; set; } = string.Empty;
        public string Originator { get; set; } = string.Empty;
        public string PatternCode { get; set; } = string.Empty;
    }
}
