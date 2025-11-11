package com.instagram.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Value("${cors.allowed-origins}")
    private String allowedOrigins;
    
    @Value("${app.upload-dir:uploads}")
    private String uploadDir;
    
    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
    String[] origins = allowedOrigins == null ? new String[]{} :
        java.util.Arrays.stream(allowedOrigins.split(","))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .toArray(String[]::new);

    registry.addMapping("/api/**")
        .allowedOriginPatterns(origins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Serve uploaded files from file system under /uploads/**
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
        String location = uploadPath.toUri().toString(); // e.g., file:/abs/path/
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}
