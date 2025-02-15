package com.deepseek.medimate.exception;

public class InvalidPromptException extends RuntimeException {

    public InvalidPromptException(String message) {
        super(message);
    }
}
