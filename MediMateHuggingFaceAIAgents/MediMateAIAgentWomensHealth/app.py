import os
import gradio as gr
import requests

API_KEY = os.environ.get("API_KEY")

def generate_womens_health_advice(age, cycle_length, pregnancy_status, additional_concerns):
    # Construct a clear patient profile message.
    user_message = (
        f"Patient Profile:\n"
        f"• Age: {age} years\n"
        f"• Average Menstrual Cycle Length: {cycle_length} days\n"
        f"• Pregnancy Status: {pregnancy_status}\n"
        f"• Additional Concerns: {additional_concerns or 'None'}"
    )
    
    # Enhanced system prompt that instructs the AI to provide detailed, evidence-based reproductive health guidance.
    system_message = (
        "You are an expert AI Women's Health Guide focusing exclusively on reproductive health. "
        "Based on the patient profile provided, deliver clear and detailed, evidence-based advice on tracking menstrual cycles, "
        "monitoring pregnancy status, and managing overall reproductive health. Include specific recommendations, actionable tips, "
        "and any necessary precautions. Your response should be strictly within the domain of women's reproductive health. "
        "If the query is off-topic, respond with: 'I only answer questions about women's reproductive health.'"
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
    fn=generate_womens_health_advice,
    inputs=[
        gr.Number(label="Age", value=25, precision=0, minimum=12, maximum=100),
        gr.Number(label="Average Menstrual Cycle Length (days)", value=28, precision=0, minimum=20, maximum=40),
        gr.Dropdown(
            choices=["Not Pregnant", "Pregnant", "Postpartum", "Trying to conceive"],
            label="Pregnancy Status", value="Not Pregnant"
        ),
        gr.Textbox(lines=3, placeholder="Enter any additional reproductive health concerns", label="Additional Concerns")
    ],
    outputs=gr.Textbox(label="Your Reproductive Health Guidance", show_copy_button=True),
    title="Women's Health Guide: Reproductive Health Tracker",
    description=(
        "Track your menstrual cycle, pregnancy status, and overall reproductive health. "
        "Enter your details to receive detailed, evidence-based guidance tailored to your needs."
    )
)

if __name__ == "__main__":
    iface.launch()

