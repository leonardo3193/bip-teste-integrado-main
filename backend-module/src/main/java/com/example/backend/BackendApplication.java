package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {
    "com.example.backend", 
    "com.example.ejb"
})
// Essencial para o Hibernate achar a @Entity Beneficio no ejb-module
@EntityScan(basePackages = "com.example.model") 
// Essencial para o Spring achar o BeneficioRepository no backend-module
@EnableJpaRepositories(basePackages = "com.example.backend.repository")
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}