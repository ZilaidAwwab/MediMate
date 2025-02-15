import os
import gradio as gr
import requests

API_KEY = os.environ.get("API_KEY")

def generate_child_health_advice(age, weight, height, vaccination_status, additional_concerns):
    # Build a detailed child health profile message.
    user_message = (
        f"Child Health Profile:\n"
        f"• Age: {age} years\n"
        f"• Weight: {weight} kg\n"
        f"• Height: {height} cm\n"
        f"• Vaccination Status: {vaccination_status}\n"
        f"• Additional Concerns: {additional_concerns or 'None'}"
    )
    
    # Enhanced system prompt for detailed, evidence-based guidance.
    system_message = (
        """You are an expert AI Child Health & Growth Monitor. Based on the patient profile provided, 
deliver detailed, evidence-based guidance on the child's growth, vaccination schedule, 
and health milestones. Provide clear, actionable recommendations and any necessary precautions. 
Answer strictly within the domain of child health. If the query is off-topic, reply with:
"I only answer questions about child health and growth."."""
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
        response = requests.post("https://api.aimlapi.com/v1/chat/completions", json=payload, headers=headers)
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
    fn=generate_child_health_advice,
    inputs=[
        gr.Number(label="Child's Age (years)", value=5, precision=0, minimum=0, maximum=100),
        gr.Number(label="Weight (kg)", value=20, minimum=0, maximum=200),
        gr.Number(label="Height (cm)", value=110, minimum=0, maximum=250),
        gr.Dropdown(
            choices=["Up-to-date", "Due for vaccination", "Incomplete", "Not sure"],
            label="Vaccination Status", value="Up-to-date"
        ),
        gr.Textbox(lines=3, placeholder="Enter any additional health concerns", label="Additional Concerns")
    ],
    outputs=gr.Textbox(label="Your Child Health Guidance", show_copy_button=True),
    title="Child Health & Growth Monitor",
    description=(
        "Enter your child's details to receive detailed, evidence-based guidance on growth, "
        "vaccinations, and health milestones."
    )
)

if __name__ == "__main__":
    iface.launch()
