from datetime import date, timedelta

import flet as ft


class AnalyticsView:

    def __init__(
        self,
        page: ft.Page,
        store,
    ):

        self.page = page
        self.store = store

    
    def build(self):

        profile = self.store.profile

        target = profile.get(
            "daily_calorie_goal",
            2000,
        )

        log = self.store.log

        

        days_data = []

        for i in range(6, -1, -1):

            day = date.today() - timedelta(days=i)

            day_str = str(day)

            day_entries = [

                e for e in log
                if e.get("date") == day_str
            ]

            total_cal = sum(
                e.get("calories", 0)
                for e in day_entries
            )

            label = day.strftime("%a")

            days_data.append(
                (label, total_cal)
            )

        calories_vals = [
            v for _, v in days_data
            if v > 0
        ]

        avg_cal = (

            int(sum(calories_vals) / len(calories_vals))

            if calories_vals
            else 0
        )

        days_on_target = sum(

            1 for _, v in days_data

            if 0 < v <= target * 1.1
        )

        

        content = ft.Column(

            expand=True,

            scroll=ft.ScrollMode.AUTO,

            spacing=20,
        )

       

        content.controls.append(

            ft.Row(

                alignment=ft.MainAxisAlignment.START,

                controls=[

                    ft.IconButton(
                        icon=ft.Icons.ARROW_BACK,
                        on_click=lambda e: self.page.go(
                            "/dashboard"
                        ),
                    ),

                    ft.Text(
                        "Analytics",
                        size=28,
                        weight=ft.FontWeight.BOLD,
                    ),
                ],
            )
        )

        

        content.controls.append(

            ft.Text(
                "7-Day Overview",
                size=24,
                weight=ft.FontWeight.BOLD,
            )
        )

        overview_cards = ft.Row(

            scroll=ft.ScrollMode.AUTO,

            spacing=12,
        )

        overview_items = [

            (
                "Avg Calories",
                f"{avg_cal} kcal",
                "#e8f5e9",
            ),

            (
                "On Target",
                f"{days_on_target}/7",
                "#fff8e1",
            ),

            (
                "Food Entries",
                str(len(log)),
                "#e3f2fd",
            ),
        ]

        for label, value, color in overview_items:

            overview_cards.controls.append(

                ft.Container(

                    width=150,

                    padding=20,

                    bgcolor=color,

                    border_radius=18,

                    content=ft.Column(

                        spacing=8,

                        controls=[

                            ft.Text(
                                value,
                                size=24,
                                weight=ft.FontWeight.BOLD,
                            ),

                            ft.Text(
                                label,
                                color="grey",
                            ),
                        ],
                    ),
                )
            )

        content.controls.append(
            overview_cards
        )

       

        content.controls.append(

            ft.Text(
                "Daily Calories",
                size=24,
                weight=ft.FontWeight.BOLD,
            )
        )

        max_cal = max(
            max((v for _, v in days_data), default=0),
            target,
            1,
        )

        chart_bars = ft.Row(

            alignment=ft.MainAxisAlignment.SPACE_AROUND,

            vertical_alignment=ft.CrossAxisAlignment.END,

            height=260,
        )

        for day_label, calories in days_data:

            bar_height = (
                calories / max_cal
            ) * 180

            bar_color = (

                "#dc2626"

                if calories > target

                else "#16a34a"
            )

            chart_bars.controls.append(

                ft.Column(

                    horizontal_alignment=ft.CrossAxisAlignment.CENTER,

                    spacing=6,

                    controls=[

                        ft.Text(
                            str(int(calories)),
                            size=12,
                        ),

                        ft.Container(

                            width=28,

                            height=max(
                                bar_height,
                                6,
                            ),

                            bgcolor=bar_color,

                            border_radius=8,
                        ),

                        ft.Text(
                            day_label,
                            size=14,
                            weight=ft.FontWeight.BOLD,
                        ),
                    ],
                )
            )

        content.controls.append(

            ft.Container(

                padding=20,

                bgcolor="#fafafa",

                border_radius=18,

                content=chart_bars,
            )
        )

        
        legend = ft.Row(

            spacing=20,

            controls=[

                ft.Row(

                    spacing=6,

                    controls=[

                        ft.Container(
                            width=16,
                            height=16,
                            bgcolor="#16a34a",
                            border_radius=5,
                        ),

                        ft.Text("Within Goal"),
                    ],
                ),

                ft.Row(

                    spacing=6,

                    controls=[

                        ft.Container(
                            width=16,
                            height=16,
                            bgcolor="#dc2626",
                            border_radius=5,
                        ),

                        ft.Text("Over Goal"),
                    ],
                ),
            ],
        )

        content.controls.append(
            legend
        )

        

        content.controls.append(

            ft.Text(
                "Today's Food Log",
                size=24,
                weight=ft.FontWeight.BOLD,
            )
        )

        today_entries = self.store.today_entries()

        if not today_entries:

            content.controls.append(

                ft.Container(

                    padding=20,

                    border_radius=15,

                    bgcolor="#f5f5f5",

                    content=ft.Text(
                        "No food logged today."
                    ),
                )
            )

        else:

            for entry in today_entries[-5:]:

                content.controls.append(

                    ft.Container(

                        padding=16,

                        border_radius=16,

                        bgcolor="#fafafa",

                        content=ft.Row(

                            alignment=ft.MainAxisAlignment.SPACE_BETWEEN,

                            controls=[

                                ft.Column(

                                    spacing=4,

                                    controls=[

                                        ft.Text(
                                            entry.get(
                                                "product_name",
                                                "Item",
                                            ),

                                            size=16,

                                            weight=ft.FontWeight.BOLD,
                                        ),

                                        ft.Text(
                                            entry.get(
                                                "date",
                                                "",
                                            ),

                                            size=12,

                                            color="grey",
                                        ),
                                    ],
                                ),

                                ft.Text(
                                    f"{int(entry.get('calories', 0))} kcal",

                                    weight=ft.FontWeight.BOLD,

                                    size=16,
                                ),
                            ],
                        ),
                    )
                )

       

        content.controls.append(
            ft.Container(height=20)
        )

        content.controls.append(

            ft.ElevatedButton(

                "Analyze New Product",

                icon=ft.Icons.SEARCH,

                height=50,

                bgcolor="#198754",

                color="white",

                on_click=lambda e: self.page.go(
                    "/scanner"
                ),
            )
        )

        content.controls.append(
            ft.Container(height=40)
        )

        

        return ft.SafeArea(

            ft.Container(

                expand=True,

                padding=20,

                content=ft.Column(

                    expand=True,

                    scroll=ft.ScrollMode.AUTO,

                    controls=[content],
                ),
            ),

            expand=True,
        )
