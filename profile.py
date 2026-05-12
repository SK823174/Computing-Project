import flet as ft


class ProfileView:

    def __init__(
        self,
        page,
        store,
    ):

        self.page = page
        self.store = store

  

    def _info_tile(
        self,
        label,
        value,
    ):

        return ft.Container(

            padding=15,

            border_radius=12,

            bgcolor="#F5F5F5",

            content=ft.Column(

                spacing=4,

                controls=[

                    ft.Text(
                        label,
                        size=12,
                        color=ft.Colors.GREY_700,
                        weight=ft.FontWeight.W_500,
                    ),

                    ft.Text(
                        str(value),
                        size=16,
                        weight=ft.FontWeight.BOLD,
                    ),
                ],
            ),
        )

    def _metric_card(
        self,
        title,
        value,
    ):

        return ft.Container(

            expand=True,

            padding=15,

            bgcolor="#F7F7F7",

            border_radius=14,

            content=ft.Column(

                horizontal_alignment=ft.CrossAxisAlignment.CENTER,

                controls=[

                    ft.Text(
                        title,
                        size=12,
                        color=ft.Colors.GREY_700,
                    ),

                    ft.Text(
                        value,
                        size=18,
                        weight=ft.FontWeight.BOLD,
                    ),
                ],
            ),
        )



    def build(self):

        profile = self.store.profile

        bmi = self.store.calculate_bmi()
        bmi_cat = self.store.bmi_category()
        tdee = self.store.calculate_tdee()

        conditions = profile.get(
            "health_conditions",
            []
        )

        allergies = profile.get(
            "allergies",
            []
        )

        goal_map = {

            "lose_weight": "Lose Weight",
            "maintain_weight": "Maintain Weight",
            "gain_weight": "Gain Weight",
            "build_muscle": "Build Muscle",
        }

        initial = profile.get(
            "name",
            "U"
        )[:1].upper()

        avatar = ft.Container(

            width=70,
            height=70,

            border_radius=35,

            bgcolor="#16A34A",

            alignment=ft.Alignment.CENTER,

            content=ft.Text(
                initial,
                size=30,
                weight=ft.FontWeight.BOLD,
                color="white",
            ),
        )

        header_card = ft.Container(

            padding=20,

            border_radius=18,

            bgcolor="#F7F7F7",

            content=ft.Row(

                spacing=20,

                controls=[

                    avatar,

                    ft.Column(

                        spacing=5,

                        controls=[

                            ft.Text(
                                profile.get(
                                    "name",
                                    "User"
                                ),
                                size=22,
                                weight=ft.FontWeight.BOLD,
                            ),

                            ft.Text(

                                goal_map.get(
                                    profile.get(
                                        "goal",
                                        ""
                                    ),
                                    "No goal set"
                                ),

                                color=ft.Colors.GREY_700,
                            ),
                        ],
                    ),
                ],
            ),
        )

        metrics_row = ft.Row(

            spacing=10,

            controls=[

                self._metric_card(
                    "BMI",
                    f"{bmi} {bmi_cat}"
                    if bmi
                    else "—"
                ),

                self._metric_card(
                    "TDEE",
                    f"{tdee} kcal"
                ),

                self._metric_card(
                    "Goal",
                    f"{profile.get('daily_calorie_goal', 0)} kcal"
                ),
            ],
        )

        personal_section = ft.Column(

            spacing=10,

            controls=[

                ft.Text(
                    "Personal Information",
                    size=20,
                    weight=ft.FontWeight.BOLD,
                ),

                self._info_tile(
                    "Age",
                    f"{profile.get('age', '—')} years"
                ),

                self._info_tile(
                    "Gender",
                    profile.get(
                        "gender",
                        "—"
                    ).title()
                ),

                self._info_tile(
                    "Weight",
                    f"{profile.get('weight_kg', 0)} kg"
                ),

                self._info_tile(
                    "Height",
                    f"{profile.get('height_cm', 0)} cm"
                ),

                self._info_tile(
                    "Activity Level",
                    profile.get(
                        "activity_level",
                        "—"
                    ).replace(
                        "_",
                        " "
                    ).title()
                ),
            ],
        )

        condition_controls = []

        if conditions:

            for c in conditions:

                condition_controls.append(

                    ft.Container(

                        padding=10,

                        border_radius=10,

                        bgcolor="#FEF3C7",

                        content=ft.Text(
                            f"⚕️ {c}",
                            weight=ft.FontWeight.W_500,
                        ),
                    )
                )

        else:

            condition_controls.append(

                ft.Text(
                    "No conditions recorded",
                    color=ft.Colors.GREY_700,
                )
            )

        conditions_section = ft.Column(

            spacing=10,

            controls=[

                ft.Text(
                    "Health Conditions",
                    size=20,
                    weight=ft.FontWeight.BOLD,
                ),

                *condition_controls,
            ],
        )


        allergies_section = ft.Column(

            spacing=10,

            controls=[

                ft.Text(
                    "Allergies",
                    size=20,
                    weight=ft.FontWeight.BOLD,
                ),

                ft.Container(

                    padding=15,

                    border_radius=12,

                    bgcolor="#F7F7F7",

                    content=ft.Text(

                        ", ".join(allergies)

                        if allergies
                        else "None recorded"
                    ),
                ),
            ],
        )



        buttons = ft.Column(

            spacing=12,

            controls=[

                ft.ElevatedButton(

                    "Redo Setup / Update Profile",

                    icon=ft.Icons.REFRESH,

                    bgcolor="#16A34A",

                    color="white",

                    height=50,

                    on_click=lambda e:
                    self._redo_setup(),
                ),

                ft.OutlinedButton(

                    "Back to Dashboard",

                    icon=ft.Icons.ARROW_BACK,

                    height=50,

                    on_click=lambda e:
                    self.page.go("/dashboard"),
                ),
            ],
        )

 

        content = ft.Column(

            scroll=ft.ScrollMode.AUTO,

            spacing=20,

            expand=True,

            controls=[

                ft.Row(

                    alignment=ft.MainAxisAlignment.SPACE_BETWEEN,

                    controls=[

                        ft.IconButton(
                            icon=ft.Icons.ARROW_BACK,
                            on_click=lambda e:
                            self.page.go("/dashboard"),
                        ),

                        ft.Text(
                            "My Profile",
                            size=26,
                            weight=ft.FontWeight.BOLD,
                        ),

                        ft.IconButton(
                            icon=ft.Icons.PERSON,
                            disabled=True,
                        ),
                    ],
                ),

                header_card,

                ft.Text(
                    "Health Metrics",
                    size=20,
                    weight=ft.FontWeight.BOLD,
                ),

                metrics_row,

                personal_section,

                conditions_section,

                allergies_section,

                buttons,

                ft.Container(height=30),
            ],
        )

        return ft.SafeArea(
            expand=True,
            content=ft.Container(

                expand=True,

                padding=20,

                bgcolor="#ffffff",

                content=content,
            )
        )


    def _redo_setup(self):

        self.store.update_profile(
            setup_complete=False
        )

        # Clear history
        if "analyses" in self.store._data:
            self.store._data["analyses"] = []

        # Clear dashboard food logs
        if "entries" in self.store._data:
            self.store._data["entries"] = []

        if "food_logs" in self.store._data:
            self.store._data["food_logs"] = []

        if "today_entries" in self.store._data:
            self.store._data["today_entries"] = []

        # Reset totals cache
        if "totals" in self.store._data:
            self.store._data["totals"] = {}

        if hasattr(self.store, "save"):
            self.store.save()

        self.page.go("/onboarding")
