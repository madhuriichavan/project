using CareerX_dotnet.Model;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System.Text.Json;

namespace CareerX_dotnet.Services;

public class PdfService
{
    public PdfService()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public Task<byte[]> GenerateAssessmentReportPdf(StudentAssessment assessment, List<McqQuestion>? questions, List<int> answers, string recommendationJson)
    {
        JsonElement? recommendation = string.IsNullOrEmpty(recommendationJson)
            ? null
            : JsonSerializer.Deserialize<JsonElement>(recommendationJson);

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10));

                page.Header()
                    .Text("Career Assessment Report")
                    .SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);

                page.Content()
                    .PaddingVertical(1, Unit.Centimetre)
                    .Column(column =>
                    {
                        column.Spacing(20);

                        // Score Section
                        column.Item().Text($"Overall Score: {assessment.Score:F2}%")
                            .SemiBold().FontSize(16);

                        column.Item().Text($"Assessment Date: {assessment.CompletedAt:dd MMM yyyy}")
                            .FontSize(12).FontColor(Colors.Grey.Darken1);

                        // Recommendation Section
                        if (recommendation.HasValue)
                        {
                            column.Item().PaddingTop(10).Text("Career Recommendations")
                                .SemiBold().FontSize(14);

                            if (recommendation.Value.TryGetProperty("recommendedCareer", out var career))
                            {
                                column.Item().Text($"Recommended Career: {career.GetString()}")
                                    .FontSize(12);
                            }

                            if (recommendation.Value.TryGetProperty("skillScore", out var skillScore))
                            {
                                column.Item().Text($"Skill Score: {skillScore.GetInt32()}/100")
                                    .FontSize(12);
                            }

                            if (recommendation.Value.TryGetProperty("strengths", out var strengths))
                            {
                                column.Item().PaddingTop(5).Text("Strengths:")
                                    .SemiBold().FontSize(12);
                                
                                if (strengths.ValueKind == JsonValueKind.Array)
                                {
                                    foreach (var strength in strengths.EnumerateArray())
                                    {
                                        column.Item().PaddingLeft(10).Text($"• {strength.GetString()}")
                                            .FontSize(11);
                                    }
                                }
                                else
                                {
                                    column.Item().PaddingLeft(10).Text($"• {strengths.GetString()}")
                                        .FontSize(11);
                                }
                            }

                            if (recommendation.Value.TryGetProperty("weaknesses", out var weaknesses))
                            {
                                column.Item().PaddingTop(5).Text("Areas for Improvement:")
                                    .SemiBold().FontSize(12);
                                
                                if (weaknesses.ValueKind == JsonValueKind.Array)
                                {
                                    foreach (var weakness in weaknesses.EnumerateArray())
                                    {
                                        column.Item().PaddingLeft(10).Text($"• {weakness.GetString()}")
                                            .FontSize(11);
                                    }
                                }
                                else
                                {
                                    column.Item().PaddingLeft(10).Text($"• {weaknesses.GetString()}")
                                        .FontSize(11);
                                }
                            }
                        }

                        // Summary
                        column.Item().PaddingTop(10).Text("Next Steps")
                            .SemiBold().FontSize(14);

                        column.Item().Text("Based on your assessment results, we recommend:")
                            .FontSize(12);

                        column.Item().PaddingLeft(10).Text("1. Review the recommended career paths")
                            .FontSize(11);
                        column.Item().PaddingLeft(10).Text("2. Focus on improving identified areas")
                            .FontSize(11);
                        column.Item().PaddingLeft(10).Text("3. Consider subscribing to our career-path roadmap service")
                            .FontSize(11);
                        column.Item().PaddingLeft(10).Text("4. Complete your profile for personalized guidance")
                            .FontSize(11);
                    });

                page.Footer()
                    .AlignCenter()
                    .Element(container =>
                    {
                        container.Text(text =>
                        {
                            text.Span("CareerX - Your Career Guidance Partner | Page ");
                            text.CurrentPageNumber();
                        });
                    });
            });
        });

        return Task.FromResult(document.GeneratePdf());
    }
}

