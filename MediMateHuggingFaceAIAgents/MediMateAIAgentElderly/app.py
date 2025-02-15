import os
import gradio as gr
import requests

API_KEY = os.environ.get("API_KEY")

def generate_elderly_health_advice(age, assistance_type, additional_concerns):
    # Build a detailed user query message.
    user_message = (
        f"Age: {age} years. Request: {assistance_type}. Additional Concerns: {additional_concerns}."
    )
    
    # Enhanced system prompt for elderly health queries.
    system_message = (
        "You are an AI Elderly Health Assistant providing clear, compassionate, and medically accurate advice tailored for elderly care. "
        "For each query, first output your full chain-of-thought reasoning (prefixed with <think>) outlining your analysis, "
        "then provide a final bullet-point summary of key actionable advice. Include recommendations on health precautions, "
        "routine check-ins, and any necessary lifestyle adjustments for elderly individuals. "
        "Do not provide advice outside of elderly health. "
        "If the query is off-topic, respond with 'I only answer elderly health questions.'"
    )
    
    payload = {
        "model": "deepseek-ai/deepseek-llm-67b-chat",
        "messages": [
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message}
        ]
    }
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post("https://api.aimlapi.com/v1/chat/completions",
                                 json=payload, headers=headers)
        response.raise_for_status()
        message = response.json()["choices"][0]["message"]["content"]
        return message
    except Exception as e:
        try:
            error_details = response.json()
        except Exception:
            error_details = response.text
        return f"Error: {e}. Details: {error_details}"

iface = gr.Interface(
    fn=generate_elderly_health_advice,
    inputs=[
        gr.Number(label="Age", value=70, precision=0),
        gr.Dropdown(choices=["Precaution", "Health Tips", "Both"],
                    label="Assistance Type", value="Precaution"),
        gr.Textbox(lines=2, placeholder="Enter any additional concerns", label="Additional Concerns")
    ],
    outputs="text",
    title="Elderly Health Assistant",
    description=(
        "Receive friendly, detailed, and medically accurate health advice for elderly care. "
        "Your response will include internal reasoning and a final bullet-point summary of key advice."
    )
)

if __name__ == "__main__":
    iface.launch()
