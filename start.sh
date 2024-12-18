#!/bin/bash

# Start NGINX in the background
nginx

# Start the ASP.NET backend
dotnet Hue.API.dll
