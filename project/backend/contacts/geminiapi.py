from google import genai
from google.api_core.exceptions import GoogleAPIError
import json
from pydantic import BaseModel


API_KEY = "AIzaSyBhs7tC1Uv4BY9xoxCTEX1XJvmyd_6g4Ko"


class GeminiAPIError(Exception):
    """Custom exception to handle Gemini API errors."""
    def __init__(self, message, status_code=None):
        super().__init__(message)
        self.status_code = status_code

class Rating(BaseModel):
    """JSON response structure for Gemini to return"""
    relationship_rating: int


prompt = """You are an AI model that analyzes relationship strength and intent based on user responses to a set of 
questions. Your task is to evaluate the user's relationship with a specific person, based on their answers, 
and provide a single integer score (0-100) representing their relationship rating. A higher score (closer to 100) 
means a stronger, closer relationship, while a lower score (closer to 0) means a weaker or distant relationship.

Input Data Format
The input will be a JSON string containing a list of questions and corresponding answers.

Scoring Guidelines
80-100: Strong relationship (frequent interaction, mutual understanding, or strong intent to improve).
50-79: Moderate relationship (some connection, but with occasional friction or distance).
20-49: Weak relationship (limited interaction, misunderstandings, or lack of commitment to improvement).
0-19: Very weak or no relationship (little to no contact, strong detachment, or no intent to strengthen).

Output Data Format
The relationship rating must be a single integer between 0 and 100 (inclusive).
"""

def get_relationship_rating(user_data):
    """Returns relationship rating integer, takes in user_data JSON list of {question: answer}"""

    try:
        json_input = json.dumps(user_data)

        client = genai.Client(api_key=API_KEY)
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=f"{prompt}\n\nInput JSON:\n{json_input}",
            config={
                'response_mime_type': 'application/json',
                'response_schema': Rating,
            },
        )

        if not response or not response.text:
            raise ValueError("Empty response from Gemini.")

        # Parse json
        parsed_data = json.loads(response.text.strip())
        relationship_rating = parsed_data["relationship_rating"]

        if relationship_rating > 100 or relationship_rating < 0:
            raise ValueError("relationship_rating is not between 0 and 100")

        # print(response.text)
        return relationship_rating

    except ValueError as ve:
        raise GeminiAPIError(f"ValueError: {ve}")

    except (ConnectionError, TimeoutError) as ce:
        raise GeminiAPIError(f"Network error: {ce}")

    except GoogleAPIError as api_error:
        status_code = getattr(api_error, "code", None)
        raise GeminiAPIError(f"Gemini API error: {api_error}", status_code)
