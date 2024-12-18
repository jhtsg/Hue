# Build the React app
FROM node:22 AS frontend-builder
WORKDIR /app

# Copy package files and install dependencies
COPY Hue.Web/package.json Hue.Web/package-lock.json ./
RUN npm install

# Remember to grab the backend url
ENV VITE_BACKEND_URL=

# Copy the rest (dist, node_modules, obj are excluded via .dockerignore)
COPY Hue.Web ./
RUN npm run build

# ----------------------------------------------------------------------------------

# Build the backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-builder
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Hue.API/Hue.API.csproj", "Hue.API/"]
RUN dotnet restore "Hue.API/Hue.API.csproj"
COPY . .
WORKDIR "/src/Hue.API"
RUN dotnet publish "Hue.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# ----------------------------------------------------------------------------------

# Final stage: Combine NGINX and ASP.NET backend
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy the backend publish output
COPY --from=backend-builder /app/publish .

# Install NGINX
RUN apt-get update && apt-get install -y nginx && apt-get clean

# Copy the React build to the NGINX html directory
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Configure NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80

# Start NGINX and ASP.NET backend
COPY start.sh /start.sh
RUN chmod +x /start.sh
CMD ["/start.sh"]
