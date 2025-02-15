package com.deepseek.medimate.model;

import lombok.Data;

@Data
public class ChatResponse {

    private String response;

    public ChatResponse(String response) {
        this.response = response;
    }
}
