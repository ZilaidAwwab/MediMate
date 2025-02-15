import os
import gradio as gr
import requests

API_KEY = os.environ.get("API_KEY")

def generate_meal_plan(age, weight, activity_level, goal, dietary_restrictions):
    # Build a detailed user profile message.
    user_message = (
        f"User Profile:\n"
        f"- Age: {age} years\n"
        f"- Weight: {weight} kg\n"
        f"- Activity Level: {activity_level}\n"
        f"- Goal: {goal}\n"
        f"- Dietary Restrictions: {dietary_restrictions or 'None'}"
    )
    
    # Enhanced system prompt instructing the AI to provide a final detailed meal plan.
    system_message = (
        "You are an AI nutrition assistant specialized in meal planning and nutritional guidance. "
        "Answer only nutrition-related queries. Provide a final, detailed meal plan strictly in the following EXACT bullet format, "
        "with all placeholders replaced by specific values, and no extra commentary or chain-of-thought. Use this format:\n\n"
        "Tailored Meal Plan:\n"
        "- Calorie Estimate: Approximately [calories] calories per day.\n"
        "- Macronutrient Breakdown: Around [carbs]% carbohydrates, [protein]% protein, and [fats]% fats.\n"
        "- Sample Meals:\n"
        "   • Breakfast: [Breakfast meal]\n"
        "   • Lunch: [Lunch meal]\n"
        "   • Dinner: [Dinner meal]\n"
        "- Dietary Tips:\n"
        "   • [Tip1]\n"
        "   • [Tip2]\n"
        "   • [Tip3]\n\n"
        "Summary:\n"
        "Follow a balanced, [diet type] meal plan with lean proteins, complex carbs, and healthy fats to support [goal]."
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
    fn=generate_meal_plan,
    inputs=[
        gr.Number(label="Age", value=30, precision=0, minimum=18, maximum=100),
        gr.Number(label="Weight (kg)", value=70, minimum=40, maximum=200),
        gr.Dropdown(["Low", "Medium", "High"], label="Activity Level", value="Medium"),
        gr.Dropdown(
            choices=["Weight Loss", "Weight Maintenance", "Muscle Gain", "Improve Stamina"],
            label="Goal", value="Weight Loss"
        ),
        gr.Textbox(lines=2, placeholder="Enter any dietary restrictions", label="Dietary Restrictions")
    ],
    outputs=gr.Textbox(label="Your Meal Plan", show_copy_button=True),
    title="AI-Powered Nutrition & Meal Planning",
    description=(
        "Enter your details to receive a tailored meal plan with calorie estimates, macronutrient breakdown, "
        "sample meals, and practical dietary tips. Only nutrition-related guidance will be provided."
    )
)

if __name__ == "__main__":
    iface.launch()
