import flet as ft


HEALTH_CONDITIONS = [

    "Diabetes Type 1",
    "Diabetes Type 2",
    "Hypertension",
    "Heart Disease",
    "High Cholesterol",
    "Celiac Disease",
    "Lactose Intolerance",
    "Kidney Disease",
    "PKU (Phenylketonuria)",
    "GERD / Acid Reflux",
    "IBS",
    "Hypothyroidism",
    "Gout",
    "Anemia",
    "Peanut Allergy",
    "Tree Nut Allergy",
    "None",
]

ACTIVITY_LEVELS = [
    "Sedentary",
    "Light",
    "Moderate",
    "Active",
    "Very Active",
]

GOALS = [
    "Lose Weight",
    "Maintain Weight",
    "Gain Weight",
    "Build Muscle",
]

GENDERS = [
    "Male",
    "Female",
    "Other",
]


class OnboardingView:

    def __init__(
        self,
        page: ft.Page,
        store,
    ):

        self.page = page
        self.store = store

        self.step = 0

        self.selected_conditions = []

        self.name_input = ft.TextField(
            label="Full Name"
        )

        self.age_input = ft.TextField(
            label="Age",
            keyboard_type=ft.KeyboardType.NUMBER,
        )

        self.gender_dropdown = ft.Dropdown(
            label="Gender",
            value="Male",
            options=[
                ft.dropdown.Option(g)
                for g in GENDERS
            ],
        )

        self.weight_input = ft.TextField(
            label="Weight (kg)",
            keyboard_type=ft.KeyboardType.NUMBER,
        )

        self.height_input = ft.TextField(
            label="Height (cm)",
            keyboard_type=ft.KeyboardType.NUMBER,
        )

        self.activity_dropdown = ft.Dropdown(
            label="Activity Level",
            value="Moderate",
            options=[
                ft.dropdown.Option(a)
                for a in ACTIVITY_LEVELS
            ],
        )

        self.goal_dropdown = ft.Dropdown(
            label="Goal",
            value="Maintain Weight",
            options=[
                ft.dropdown.Option(g)
                for g in GOALS
            ],
        )

        self.allergies_input = ft.TextField(
            label="Allergies",
            hint_text="Peanuts, Gluten...",
        )

  

    def build(self):

        return ft.SafeArea(
            expand=True,
            content=ft.Container(

                expand=True,

                padding=20,

                bgcolor="#ffffff",

                content=self._build_step(),
            )
        )


    def _build_step(self):

        content = ft.Column(
            spacing=20,
            expand=True,
        )

        content.controls.append(

            ft.ProgressBar(
                value=(self.step + 1) / 4,
                height=8,
                color="#16a34a",
            )
        )

        titles = [

            (
                "Personal Info",
                "Tell us about yourself"
            ),

            (
                "Body Metrics",
                "Used for calorie calculations"
            ),

            (
                "Health Conditions",
                "Select all that apply"
            ),

            (
                "Goals & Allergies",
                "Personalize your experience"
            ),
        ]

        title, subtitle = titles[self.step]

        content.controls.append(

            ft.Column(
                controls=[

                    ft.Text(
                        f"Step {self.step + 1} of 4",
                        color="#16a34a",
                        weight=ft.FontWeight.BOLD,
                    ),

                    ft.Text(
                        title,
                        size=32,
                        weight=ft.FontWeight.BOLD,
                    ),

                    ft.Text(
                        subtitle,
                        color="grey",
                    ),
                ]
            )
        )

        # STEP CONTENT

        if self.step == 0:

            content.controls.extend([

                self.name_input,
                self.age_input,
                self.gender_dropdown,
            ])

        elif self.step == 1:

            content.controls.extend([

                self.weight_input,
                self.height_input,
                self.activity_dropdown,
            ])

        elif self.step == 2:

            content.controls.append(
                self._conditions_grid()
            )

        elif self.step == 3:

            content.controls.extend([

                self.goal_dropdown,
                self.allergies_input,
            ])

        content.controls.append(
            ft.Container(height=20)
        )

        buttons = ft.Row(
            alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
        )

        if self.step > 0:

            buttons.controls.append(

                ft.OutlinedButton(
                    "Back",
                    on_click=self._go_back,
                )
            )

        buttons.controls.append(

            ft.ElevatedButton(

                "Next"
                if self.step < 3
                else "Get Started",

                bgcolor="#16a34a",
                color="white",

                on_click=self._go_next,
            )
        )

        content.controls.append(buttons)

        return ft.Container(
            content=content,
            padding=20,
            expand=True,
        )

 

    def _conditions_grid(self):

        controls = []

        for condition in HEALTH_CONDITIONS:

            selected = (
                condition
                in self.selected_conditions
            )

            controls.append(

                ft.Container(

                    padding=10,

                    border_radius=15,

                    bgcolor=(
                        "#16a34a"
                        if selected
                        else "#f1f5f9"
                    ),

                    ink=True,

                    on_click=lambda e, c=condition:
                    self._toggle_condition(c),

                    content=ft.Text(

                        condition,

                        color=(
                            "white"
                            if selected
                            else "black"
                        ),
                    ),
                )
            )

        return ft.Row(
            wrap=True,
            spacing=10,
            run_spacing=10,
            controls=controls,
        )

    def _toggle_condition(
        self,
        condition,
    ):

        if condition == "None":

            self.selected_conditions = []

        else:

            if condition in self.selected_conditions:

                self.selected_conditions.remove(
                    condition
                )

            else:

                self.selected_conditions.append(
                    condition
                )

        self._refresh()

   

    def _go_back(
        self,
        e,
    ):

        if self.step > 0:

            self.step -= 1
            self._refresh()

    def _go_next(
        self,
        e,
    ):

        self._save_current_step()

        if self.step < 3:

            self.step += 1
            self._refresh()

        else:

            self._finish()

    def _refresh(self):

        self.page.views[-1] = ft.View(
            route="/onboarding",
            padding=0,
            spacing=0,
            bgcolor="#ffffff",
            controls=[self.build()],
        )
        self.page.update()

    def _save_current_step(self):

        if self.step == 0:

            self.store.update_profile(

                name=self.name_input.value or "User",

                age=int(
                    self.age_input.value or 0
                ),

                gender=self.gender_dropdown.value.lower(),
            )

        elif self.step == 1:

            activity_map = {

                "Sedentary": "sedentary",
                "Light": "light",
                "Moderate": "moderate",
                "Active": "active",
                "Very Active": "very_active",
            }

            self.store.update_profile(

                weight_kg=float(
                    self.weight_input.value or 0
                ),

                height_cm=float(
                    self.height_input.value or 0
                ),

                activity_level=activity_map.get(
                    self.activity_dropdown.value,
                    "moderate",
                ),
            )

        elif self.step == 2:

            self.store.update_profile(
                health_conditions=self.selected_conditions
            )

        elif self.step == 3:

            goal_map = {

                "Lose Weight": "lose_weight",
                "Maintain Weight": "maintain_weight",
                "Gain Weight": "gain_weight",
                "Build Muscle": "build_muscle",
            }

            allergies = [

                a.strip()

                for a in (
                    self.allergies_input.value or ""
                ).split(",")

                if a.strip()
            ]

            self.store.update_profile(

                goal=goal_map.get(
                    self.goal_dropdown.value,
                    "maintain_weight",
                ),

                allergies=allergies,
            )



    def _finish(self):

        tdee = self.store.calculate_tdee()

        goal = self.store.profile.get(
            "goal",
            "maintain_weight"
        )

        cal_adjustment = {

            "lose_weight": -500,
            "gain_weight": 300,
            "build_muscle": 200,

        }.get(goal, 0)

        daily_cals = max(
            1200,
            tdee + cal_adjustment
        )

        self.store.update_profile(

            daily_calorie_goal=daily_cals,

            setup_complete=True,
        )

        self.page.go("/dashboard")