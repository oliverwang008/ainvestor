import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_decision(news_text):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a stock investment decision AI."},
            {"role": "user", "content": news_text}
        ],
        temperature=0.2
    )

    return response.choices[0].message.content