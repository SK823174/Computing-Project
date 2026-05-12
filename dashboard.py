from datetime import date

import flet as ft


class DashboardView:

    def __init__(
        self,
        page: ft.Page,
        store,
    ):
        self.page = page
        self.store = store

    

    def build(self):

        profile = self.store.profile

        totals = self.store.today_totals()

        bmi = self.store.calculate_bmi()

        bmi_cat = self.store.bmi_category()

        _raw_name = profile.get("name", "User") or "User"
        name = (_raw_name.split()[0] if _raw_name.split() else "User")

        goal_cal = profile.get(
            "daily_calorie_goal",
            2000
        )

        cal_done = totals["calories"]

        cal_pct = (
            min(1.0, cal_done / goal_cal)
            if goal_cal
            else 0
        )

        conditions = profile.get(
            "health_conditions",
            []
        )

        today_str = date.today().strftime(
            "%A, %B %d"
        )

        mt = profile.get(
            "macro_targets",
            {
                "protein_g": 150,
                "carbs_g": 200,
                "fat_g": 65,
            }
        )

        content = ft.Column(
            scroll=ft.ScrollMode.AUTO,
            spacing=20,
            expand=True,
        )

       

        content.controls.append(
            ft.Row(
                alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
                controls=[
                    ft.Column(
                        spacing=2,
                        controls=[
                            ft.Text(
                                f"Hello, {name}! 👋",
                                size=30,
                                weight=ft.FontWeight.BOLD,
                            ),
                            ft.Text(
                                today_str,
                                color="grey",
                            ),
                        ]
                    ),

                    ft.IconButton(
                        icon=ft.Icons.PERSON,
                        tooltip="Profile",
                        on_click=lambda e: self.page.go("/profile"),
                    )
                ]
            )
        )


        content.controls.append(
            self._section_title(
                "Today's Calories"
            )
        )

        remaining = max(
            0,
            goal_cal - int(cal_done)
        )

        calorie_card = ft.Container(
            bgcolor="#f8fff8",
            border_radius=20,
            padding=20,
            content=ft.Column(
                spacing=15,
                controls=[
                    ft.Row(
                        alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
                        controls=[
                            ft.Text(
                                f"{int(cal_done)} kcal eaten",
                                size=24,
                                weight=ft.FontWeight.BOLD,
                            ),

                            ft.Text(
                                f"{remaining} remaining",
                                color="grey",
                            ),
                        ]
                    ),

                    ft.ProgressBar(
                        value=cal_pct,
                        height=10,
                        color="#16a34a",
                    ),

                    ft.Text(
                        f"Goal: {goal_cal} kcal • "
                        f"{int(cal_pct * 100)}% complete",
                        color="grey",
                    ),
                ]
            )
        )

        content.controls.append(
            calorie_card
        )

        

        content.controls.append(
            self._section_title(
                "Macronutrients"
            )
        )

        macro_card = ft.Container(
            bgcolor="#fafafa",
            border_radius=20,
            padding=20,
            content=ft.Column(
                spacing=18,
                controls=[

                    self._macro_bar(
                        "Protein",
                        totals["protein_g"],
                        mt.get("protein_g", 150),
                        "#2563eb",
                    ),

                    self._macro_bar(
                        "Carbohydrates",
                        totals["carbs_g"],
                        mt.get("carbs_g", 200),
                        "#f59e0b",
                    ),

                    self._macro_bar(
                        "Fat",
                        totals["fat_g"],
                        mt.get("fat_g", 65),
                        "#dc2626",
                    ),
                ]
            )
        )

        content.controls.append(
            macro_card
        )

        

        content.controls.append(
            self._section_title(
                "Health Snapshot"
            )
        )

        snapshot_row = ft.Row(
            spacing=10,
            controls=[

                self._info_card(
                    "BMI",
                    f"{bmi} • {bmi_cat}"
                    if bmi
                    else "—",
                    "#e3f2fd",
                ),

                self._info_card(
                    "TDEE",
                    f"{self.store.calculate_tdee()} kcal",
                    "#fff8e1",
                ),
            ]
        )

        content.controls.append(
            snapshot_row
        )

        

        if conditions:

            content.controls.append(
                self._section_title(
                    "Health Conditions"
                )
            )

            conditions_card = ft.Container(
                bgcolor="#fff5f5",
                border_radius=18,
                padding=20,
                content=ft.Row(
                    controls=[
                        ft.Text(
                            "⚕️",
                            size=28,
                        ),

                        ft.Text(
                            ", ".join(conditions),
                            size=16,
                            expand=True,
                        ),
                    ]
                )
            )

            content.controls.append(
                conditions_card
            )

        

        content.controls.append(
            self._section_title(
                "Quick Actions"
            )
        )

        quick_actions = ft.Row(
            alignment=ft.MainAxisAlignment.SPACE_EVENLY,
            controls=[

                self._quick_action(
                    "🍎",
                    "Log",
                    lambda e: self.page.go("/scanner"),
                    "#2563eb",
                ),

                self._quick_action(
                    "📊",
                    "Analytics",
                    lambda e: self.page.go("/analytics"),
                    "#f59e0b",
                ),

                self._quick_action(
                    "🕘",
                    "History",
                    lambda e: self.page.go("/history"),
                    "#7c3aed",
                ),
            ]
        )

        content.controls.append(
            quick_actions
        )


        recent_entries = self.store.today_entries()

        if recent_entries:

            content.controls.append(
                self._section_title(
                    "Today's Food Log"
                )
            )

            for entry in recent_entries[-5:]:

                content.controls.append(

                    ft.Container(
                        padding=15,
                        border_radius=15,
                        bgcolor="#fafafa",

                        content=ft.Row(
                            alignment=ft.MainAxisAlignment.SPACE_BETWEEN,

                            controls=[

                                ft.Column(
                                    spacing=2,
                                    controls=[

                                        ft.Text(
                                            entry.get(
                                                "product_name",
                                                "Food Item"
                                            ),
                                            weight=ft.FontWeight.W_500,
                                        ),

                                        ft.Text(
                                            entry.get(
                                                "date",
                                                ""
                                            ),
                                            size=12,
                                            color="grey",
                                        ),
                                    ]
                                ),

                                ft.Text(
                                    f"{int(entry.get('calories', 0))} kcal",
                                    weight=ft.FontWeight.BOLD,
                                ),
                            ]
                        )
                    )
                )

       

        nav_bar = ft.NavigationBar(
            selected_index=0,

            destinations=[
                ft.NavigationBarDestination(
                    icon=ft.Icons.HOME,
                    label="Home",
                ),

                ft.NavigationBarDestination(
                    icon=ft.Icons.SEARCH,
                    label="Log",
                ),

                ft.NavigationBarDestination(
                    icon=ft.Icons.BAR_CHART,
                    label="Analytics",
                ),

                ft.NavigationBarDestination(
                    icon=ft.Icons.PERSON,
                    label="Profile",
                ),
            ],

            on_change=self._nav_change,
        )

       

        return ft.Column(
            expand=True,
            controls=[
                ft.Container(
                    content=content,
                    padding=20,
                    expand=True,
                ),
                nav_bar,
            ]
        )

    

    def _nav_change(self, e):

        idx = e.control.selected_index

        routes = {
            0: "/dashboard",
            1: "/scanner",
            2: "/analytics",
            3: "/profile",
        }

        self.page.go(
            routes.get(idx, "/dashboard")
        )

    

    def _section_title(self, text):

        return ft.Text(
            text,
            size=24,
            weight=ft.FontWeight.BOLD,
        )

    def _info_card(
        self,
        label,
        value,
        color,
    ):

        return ft.Container(
            expand=True,
            bgcolor=color,
            border_radius=18,
            padding=20,

            content=ft.Column(
                controls=[

                    ft.Text(
                        label,
                        color="grey",
                    ),

                    ft.Text(
                        value,
                        size=20,
                        weight=ft.FontWeight.BOLD,
                    ),
                ]
            )
        )

    def _macro_bar(
        self,
        label,
        current,
        target,
        color,
    ):

        pct = (
            min(1.0, current / target)
            if target
            else 0
        )

        return ft.Column(
            spacing=5,

            controls=[

                ft.Row(
                    alignment=ft.MainAxisAlignment.SPACE_BETWEEN,

                    controls=[

                        ft.Text(label),

                        ft.Text(
                            f"{int(current)}g / "
                            f"{int(target)}g"
                        ),
                    ]
                ),

                ft.ProgressBar(
                    value=pct,
                    color=color,
                    height=8,
                ),
            ]
        )

    def _quick_action(
        self,
        emoji,
        label,
        callback,
        color,
    ):

        return ft.Column(
            horizontal_alignment=ft.CrossAxisAlignment.CENTER,

            controls=[

                ft.Container(
                    width=65,
                    height=65,

                    bgcolor=color,

                    border_radius=20,

                    alignment=ft.Alignment(0, 0),

                    ink=True,

                    on_click=callback,

                    content=ft.Text(
                        emoji,
                        size=28,
                    ),
                ),

                ft.Text(
                    label,
                    size=14,
                ),
            ]
        )