import json
import os
import re
import threading
from typing import Any, Callable, Dict, List

from dotenv import load_dotenv

# Load .env
load_dotenv()

try:
    import requests

    REQUESTS_AVAILABLE = True

except ImportError:

    REQUESTS_AVAILABLE = False



CONDITION_RULES: Dict[str, Dict[str, Any]] = {

    "Diabetes Type 2": {
        "watch": [
            "sugar",
            "glucose",
            "fructose",
            "corn syrup",
            "sucrose",
            "maltose",
            "dextrose",
            "high-fructose",
        ],

        "safe": [
            "stevia",
            "erythritol",
            "xylitol",
        ],

        "tip": "Prefer low glycemic index foods.",
    },

    "Hypertension": {
        "watch": [
            "sodium",
            "salt",
            "msg",
            "soy sauce",
            "sodium nitrate",
        ],

        "safe": [],

        "tip": "Reduce sodium intake.",
    },

    "Heart Disease": {
        "watch": [
            "trans fat",
            "partially hydrogenated",
            "saturated fat",
            "palm oil",
        ],

        "safe": [
            "olive oil",
            "omega-3",
        ],

        "tip": "Avoid trans fats and excess saturated fats.",
    },

    "Lactose Intolerance": {
        "watch": [
            "milk",
            "lactose",
            "whey",
            "casein",
            "cream",
            "cheese",
        ],

        "safe": [
            "almond milk",
            "oat milk",
        ],

        "tip": "Choose lactose-free alternatives.",
    },

    "Peanut Allergy": {
        "watch": [
            "peanut",
            "groundnut",
            "arachis oil",
        ],

        "safe": [],

        "tip": "Strictly avoid peanut-containing products.",
    },
}




def _rule_based_analysis(
    ingredients_text: str,
    profile: Dict,
) -> Dict[str, Any]:

    conditions: List[str] = profile.get(
        "health_conditions",
        []
    )

    allergies: List[str] = profile.get(
        "allergies",
        []
    )

    lower_ing = ingredients_text.lower()

    flags = []
    warnings = []
    safe_notes = []
    tips = []

    # Check conditions
    for condition in conditions:

        rules = CONDITION_RULES.get(condition)

        if not rules:
            continue

        found_bad = [
            w for w in rules["watch"]
            if w in lower_ing
        ]

        found_safe = [
            s for s in rules["safe"]
            if s in lower_ing
        ]

        if found_bad:

            flags.append({
                "condition": condition,
                "triggers": found_bad,
            })

            warnings.append(
                f"⚠️ {condition}: contains "
                f"{', '.join(found_bad[:3])}"
            )

        if found_safe:

            safe_notes.append(
                f"✅ {condition}: safer ingredients found "
                f"({', '.join(found_safe)})"
            )

        tips.append(rules["tip"])

    # Check allergies
    for allergy in allergies:

        if allergy.lower() in lower_ing:

            flags.append({
                "condition": allergy,
                "triggers": [allergy],
            })

            warnings.append(
                f"🚨 ALLERGEN ALERT: {allergy} detected!"
            )

    # Verdict logic
    if not flags:

        verdict = "SAFE"

        summary = (
            "No major harmful ingredients detected."
        )

        color = "green"

    elif any("🚨" in w for w in warnings):

        verdict = "UNSAFE"

        summary = (
            "This product contains dangerous allergens."
        )

        color = "red"

    else:

        verdict = "CAUTION"

        summary = (
            "Some ingredients may not be suitable."
        )

        color = "orange"

    return {

        "verdict": verdict,
        "summary": summary,
        "color": color,
        "warnings": warnings,
        "safe_notes": safe_notes,
        "tips": list(dict.fromkeys(tips)),
        "source": "rule-based",
    }



GROQ_API_URL = (
    "https://api.groq.com/openai/v1/chat/completions"
)

GROQ_MODEL = "llama-3.3-70b-versatile"




def _call_groq_api(
    ingredients_text: str,
    profile: Dict,
) -> Dict[str, Any]:

    api_key = os.getenv("GROQ_API_KEY", "")

    if not api_key:

        raise RuntimeError(
            "Missing GROQ_API_KEY in .env"
        )

    if not REQUESTS_AVAILABLE:

        raise RuntimeError(
            "requests package not installed"
        )

    conditions = profile.get(
        "health_conditions",
        []
    )

    allergies = profile.get(
        "allergies",
        []
    )

    system_prompt = (
        "You are a clinical nutrition expert. "
        "Analyze food ingredients according to "
        "medical conditions and allergies. "
        "Return ONLY valid JSON."
    )

    user_prompt = f"""
User Conditions:
{', '.join(conditions) if conditions else 'None'}

Allergies:
{', '.join(allergies) if allergies else 'None'}

Ingredients:
{ingredients_text}

Return JSON with:
- verdict
- summary
- warnings
- safe_notes
- tips
- explanation
"""

    response = requests.post(

        GROQ_API_URL,

        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },

        json={

            "model": GROQ_MODEL,

            "messages": [

                {
                    "role": "system",
                    "content": system_prompt,
                },

                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],

            "temperature": 0.2,
            "max_tokens": 1024,
        },

        timeout=30,
    )

    response.raise_for_status()

    raw = response.json()["choices"][0]["message"]["content"]

    # Clean markdown formatting
    raw = re.sub(
        r"```(?:json)?",
        "",
        raw,
    ).strip().rstrip("`").strip()

    result = json.loads(raw)

    result["source"] = "groq-ai"

    verdict_colors = {
        "SAFE": "green",
        "CAUTION": "orange",
        "UNSAFE": "red",
    }

    result["color"] = verdict_colors.get(
        result.get("verdict", ""),
        "orange",
    )

    return result



def analyze_ingredients(
    ingredients_text: str,
    profile: Dict,
    callback: Callable[[Dict], None],
):
    """
    Async ingredient analysis.

    1. Try Groq AI
    2. Fallback to rule-based engine
    """

    def _worker():

        try:

            result = _call_groq_api(
                ingredients_text,
                profile,
            )

        except Exception as e:

            print(
                f"[Analyzer] AI failed: {e}"
            )

            result = _rule_based_analysis(
                ingredients_text,
                profile,
            )

        callback(result)

    threading.Thread(
        target=_worker,
        daemon=True,
    ).start()


