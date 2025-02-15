package com.deepseek.medimate;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MediMateApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load(); // Load .env file into environment
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
        SpringApplication.run(MediMateApplication.class, args);
    }

}
