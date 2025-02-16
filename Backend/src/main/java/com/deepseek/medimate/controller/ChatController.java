package com.deepseek.medimate.controller;

import com.deepseek.medimate.model.ChatRequest;
import com.deepseek.medimate.model.ChatResponse;
import com.deepseek.medimate.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"http://localhost:3000", "https://medi-mate-black.vercel.app/"})
@RestController
@RequestMapping("")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/")
    public String homePage() {
        return "Welcome to MediMate Home Page!";
    }

    @PostMapping("/")
    public ResponseEntity<ChatResponse> handleMainPrompt(@RequestBody ChatRequest chatRequest) {
        ChatResponse response = chatService.handleMainPrompt(chatRequest.getPrompt());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{doctor}")
    public ResponseEntity<ChatResponse> handleSpecializedPrompt(
            @PathVariable String doctor,
            @RequestBody ChatRequest chatRequest) {
        ChatResponse response = chatService.handleSpecializedPrompt(doctor, chatRequest.getPrompt());
        return ResponseEntity.ok(response);
    }
}
