import json
import os
from datetime import date
from typing import Any, Dict, List, Optional


DATA_FILE = os.path.join(os.path.dirname(__file__), "nutriguard_data.json")

DEFAULT_PROFILE = {
    "name": "",
    "age": 0,
    "weight_kg": 0.0,
    "height_cm": 0.0,
    "gender": "male",
    "activity_level": "moderate",
    "health_conditions": [],   
    "allergies": [],            
    "goal": "maintain_weight",  
    "target_weight_kg": 0.0,
    "daily_calorie_goal": 2000,
    "macro_targets": {
        "protein_g": 150,
        "carbs_g": 200,
        "fat_g": 65,
    },
    "setup_complete": False,
}


class AppStore:
    """Thread-safe in-memory store backed by a JSON file."""

    def __init__(self):
        self._data: Dict[str, Any] = {
            "profile": dict(DEFAULT_PROFILE),
            "log": [],        
            "analyses": [],   
        }
        self.load()

    

    def load(self):
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, "r", encoding="utf-8") as f:
                    saved = json.load(f)
                # Merge – keep defaults for any missing keys
                if "profile" in saved:
                    self._data["profile"].update(saved["profile"])
                self._data["log"] = saved.get("log", [])
                self._data["analyses"] = saved.get("analyses", [])
            except (json.JSONDecodeError, IOError):
                pass  # start fresh

    def save(self):
        try:
            with open(DATA_FILE, "w", encoding="utf-8") as f:
                json.dump(self._data, f, indent=2, ensure_ascii=False)
        except IOError as e:
            print(f"[Store] Could not save: {e}")


    @property
    def profile(self) -> Dict[str, Any]:
        return self._data["profile"]

    def update_profile(self, **kwargs):
        self._data["profile"].update(kwargs)
        self.save()

    def profile_complete(self) -> bool:
        p = self.profile
        return bool(p.get("setup_complete") and p.get("name"))

    

    @property
    def log(self) -> List[Dict]:
        return self._data["log"]

    def add_log_entry(self, entry: Dict):
        entry.setdefault("date", str(date.today()))
        self._data["log"].append(entry)
        self.save()

    def today_entries(self) -> List[Dict]:
        today = str(date.today())
        return [e for e in self._data["log"] if e.get("date") == today]

    def today_totals(self) -> Dict[str, float]:
        entries = self.today_entries()
        return {
            "calories": sum(e.get("calories", 0) for e in entries),
            "protein_g": sum(e.get("protein_g", 0) for e in entries),
            "carbs_g": sum(e.get("carbs_g", 0) for e in entries),
            "fat_g": sum(e.get("fat_g", 0) for e in entries),
            "sodium_mg": sum(e.get("sodium_mg", 0) for e in entries),
            "sugar_g": sum(e.get("sugar_g", 0) for e in entries),
        }


    @property
    def analyses(self) -> List[Dict]:
        return self._data["analyses"]

    def add_analysis(self, result: Dict):
        result.setdefault("date", str(date.today()))
        self._data["analyses"].append(result)
        self.save()

    def recent_analyses(self, n: int = 10) -> List[Dict]:
        return list(reversed(self._data["analyses"]))[:n]

    
    def calculate_bmi(self) -> Optional[float]:
        p = self.profile
        h = p.get("height_cm", 0)
        w = p.get("weight_kg", 0)
        if h > 0 and w > 0:
            return round(w / ((h / 100) ** 2), 1)
        return None

    def bmi_category(self) -> str:
        bmi = self.calculate_bmi()
        if bmi is None:
            return "Unknown"
        if bmi < 18.5:
            return "Underweight"
        if bmi < 25:
            return "Normal"
        if bmi < 30:
            return "Overweight"
        return "Obese"

    def calculate_bmr(self) -> float:
        p = self.profile
        w, h, age = p.get("weight_kg", 70), p.get("height_cm", 175), p.get("age", 30)
        if p.get("gender") == "male":
            return 10 * w + 6.25 * h - 5 * age + 5
        return 10 * w + 6.25 * h - 5 * age - 161

    def calculate_tdee(self) -> int:
        multipliers = {
            "sedentary": 1.2, "light": 1.375, "moderate": 1.55,
            "active": 1.725, "very_active": 1.9,
        }
        level = self.profile.get("activity_level", "moderate")
        return round(self.calculate_bmr() * multipliers.get(level, 1.55))
