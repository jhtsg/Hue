using Hue.API.Controllers;
using Hue.Data.Utils;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
var CORS = "CORS";

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(o => {
    o.SwaggerDoc("1", new OpenApiInfo {
        Version = "1",
        Title = "Hue",
        Description = "Hue makes it easy to visualize and manage your commissions as a commissioner, or as an artist",
    });

});


builder.Services.AddCors(o => {
    o.AddPolicy(name: CORS,
    builder => {
        builder.AllowAnyHeader();
        builder.AllowAnyMethod();

        builder.SetIsOriginAllowed(origin =>
            !string.IsNullOrEmpty(origin) && (
                origin.Contains("localhost") ||
                new Uri(origin).Host.EndsWith(new EnvironmentKey("FRONTEND_HOST_NAME").ToString())
            )
        );

        builder.AllowCredentials();
    });
});


builder.WebHost.ConfigureKestrel(serverOptions => {
    serverOptions.Limits.MaxRequestBodySize = null; // Disable limit
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI(options => options.SwaggerEndpoint($"/swagger/1/swagger.json", "Hue"));
    app.UseDeveloperExceptionPage();
}

app.UseCors(CORS);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

PingPongController.StartupTime = DateTime.UtcNow;

app.Run();
