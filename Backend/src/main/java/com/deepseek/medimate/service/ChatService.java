package com.deepseek.medimate.service;

import com.deepseek.medimate.exception.InvalidPromptException;
import com.deepseek.medimate.model.ChatResponse;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${deepseek.api.url}")
    private String deepseekApiUrl;

    @Value("${deepseek.api.key}")
    private String deepseekApiKey;

    @Value("${groq.api.url}")
    private String groqApiUrl;

    @Value("${groq.api.key}")
    private String groqApiKey;

    private String groqModel = "llama-3.3-70b-versatile";
    private String deepseekModel = "deepseek/deepseek-r1";

    public ChatResponse handleMainPrompt(String prompt) {
        // step 1: verify if the prompt is related to the medical condition
        if (!isPromptRelevant(prompt, "medical conditions")) {
            throw new InvalidPromptException("Your prompt is not relevant to a medical condition.");
        }

        // step 2: engineer the prompt
        System.out.println("Prompt is relevant, proceeding to engineer the prompt...");
        String engineeredPrompt = engineerPrompt(prompt, "medical conditions");

        // step 3: get the final response
        String response = getFinalResponse("medical", engineeredPrompt);
        return new ChatResponse(response);
    }

    public ChatResponse handleSpecializedPrompt(String doctor, String prompt) {
        // step 1: verify if the prompt is related to the specialized doctor
        if (!isPromptRelevant(prompt, doctor)) {
            throw new InvalidPromptException("Your prompt is not relevant to " + doctor + ".");
        }
        // step 2: engineer the prompt
        System.out.println("Prompt is relevant, proceeding to engineer the prompt...");
        String engineeredPrompt = engineerPrompt(prompt, doctor);

        // step 3: get the final response
        String response = getFinalResponse(doctor, engineeredPrompt);
        return new ChatResponse(response);
    }

    private boolean isPromptRelevant(String prompt, String context) {
        String verificationPrompt = "Analyze the following prompt and determine if it is relevant to a " + context + " specialist. Consider misspellings, synonyms, and implicit meaning. If the question relates in any way to the field of " + context + ", respond just 'true.' Otherwise, respond just 'false.' with no other text Prompt: " + prompt;

        String verificationResponse = callDeepseekApi(context, verificationPrompt, groqApiUrl, groqApiKey, groqModel);
        System.out.println("Verification Response: " + verificationResponse);

        // Normalize the response to handle variations like "True", "TRUE", "true", etc.
        return verificationResponse.trim().equalsIgnoreCase("true");
    }

    private String engineerPrompt(String prompt, String context) {
        // prepare the engineered prompt
        String engineeringPrompt = "Refine the following prompt for a " + context + " specialist, keeping it clear and summarize it under 120 characters without losing the actual context: " + prompt;
        String engineeredPrompt = callDeepseekApi(context, engineeringPrompt, groqApiUrl, groqApiKey, groqModel);
        // System.out.println(engineeredPrompt);

        // call deepseek API for prompt engineering
        return engineeredPrompt;
    }

    private String getFinalResponse(String context, String prompt) {
        // call deepseek API for final response
        // return callDeepseekApi(context, prompt, deepseekApiUrl, deepseekApiKey, deepseekModel);
        return callDeepseekApi(context, prompt, groqApiUrl, groqApiKey, groqModel);
    }

    private String callDeepseekApi(String context, String prompt, String url, String key, String model) {
        try {
            String refinedPrompt = "You are an expert " + context + " specialist. Answer professionally without suggesting medicines. If asked, just apologize. Query: " + prompt;

            // prepare the request payload
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", List.of(
                    Map.of("role", "user", "content", prompt)
            ));

            // set headers (including API key)
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + key);
            headers.set("Content-Type", "application/json");

            // create the HTTP entity
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            // send the request to deepseek API
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

            // extract the content from the response
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("choices")) {
                Map<String, Object> choice = ((Map<String, Object>) ((java.util.List<?>) responseBody.get("choices")).get(0));
                Map<String, Object> message = (Map<String, Object>) choice.get("message");
                return (String) message.get("content");
            } else {
                System.err.println("Invalid response from API: " + responseBody);
                throw new RuntimeException("Invalid response from API");
            }
        } catch (Exception e) {
            System.err.println("Exception occurred while calling Deepseek API: " + e.getMessage());
            throw new RuntimeException("Failed to call Deepseek API", e);
        }
    }
}
