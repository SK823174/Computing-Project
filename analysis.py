import flet as ft

from utils.ai_analyzer import analyze_ingredients


VERDICT_COLORS = {
    "SAFE": "#198754",
    "CAUTION": "#f59e0b",
    "UNSAFE": "#dc2626",
}

VERDICT_BG = {
    "SAFE": "#e8fff1",
    "CAUTION": "#fff8e6",
    "UNSAFE": "#ffeaea",
}

VERDICT_EMOJI = {
    "SAFE": "✅",
    "CAUTION": "⚠️",
    "UNSAFE": "🚫",
}


class AnalysisView:

    def __init__(
        self,
        page: ft.Page,
        ingredients: str,
        profile: dict,
        product_name: str = "Product",
    ):

        self.page = page
        self.ingredients = ingredients
        self.profile = profile
        self.product_name = product_name

        self.result_column = ft.Column(
            expand=True,
            spacing=15,
            scroll=ft.ScrollMode.AUTO,
        )


    def build(self):

        self.result_column.controls = [

            ft.Container(height=40),

            ft.ProgressRing(),

            ft.Text(
                "Analyzing ingredients...",
                size=24,
                weight=ft.FontWeight.BOLD,
            ),

            ft.Text(
                "Checking against your health profile",
                color="grey",
            ),
        ]

        # Start AI analysis
        analyze_ingredients(
            self.ingredients,
            self.profile,
            self.show_results,
        )

        return ft.SafeArea(

            ft.Container(

                expand=True,

                padding=20,

                content=ft.Column(

                    expand=True,

                    scroll=ft.ScrollMode.AUTO,

                    controls=[

                        # Top Bar
                        ft.Row(

                            controls=[

                                ft.IconButton(
                                    icon=ft.Icons.ARROW_BACK,
                                    on_click=lambda e: self.page.go(
                                        "/scanner"
                                    ),
                                ),

                                ft.Text(
                                    "Analysis Result",
                                    size=24,
                                    weight=ft.FontWeight.BOLD,
                                ),
                            ]
                        ),

                        self.result_column,
                    ],
                ),
            ),

            expand=True,
        )

    

    def show_results(self, result):

        verdict = result.get(
            "verdict",
            "CAUTION",
        )

        summary = result.get(
            "summary",
            "",
        )

        warnings = result.get(
            "warnings",
            [],
        )

        safe_notes = result.get(
            "safe_notes",
            [],
        )

        tips = result.get(
            "tips",
            [],
        )

        explanation = result.get(
            "explanation",
            "",
        )

        source = result.get(
            "source",
            "rule-based",
        )

        color = VERDICT_COLORS.get(
            verdict,
            "#666666",
        )

        bg = VERDICT_BG.get(
            verdict,
            "#f5f5f5",
        )

        emoji = VERDICT_EMOJI.get(
            verdict,
            "❓",
        )

        controls = []

       

        controls.append(

            ft.Text(
                self.product_name,
                size=30,
                weight=ft.FontWeight.BOLD,
            )
        )

        

        controls.append(

            ft.Container(

                bgcolor=bg,

                border_radius=20,

                padding=20,

                content=ft.Column(

                    spacing=10,

                    controls=[

                        ft.Row(

                            alignment=ft.MainAxisAlignment.SPACE_BETWEEN,

                            controls=[

                                ft.Text(
                                    f"{emoji} {verdict}",
                                    size=32,
                                    weight=ft.FontWeight.BOLD,
                                    color=color,
                                ),

                                ft.Container(

                                    padding=10,

                                    bgcolor="#ffffff",

                                    border_radius=10,

                                    content=ft.Text(
                                        "AI"
                                        if source == "groq-ai"
                                        else "Rule Engine",

                                        size=12,
                                        color="grey",
                                    ),
                                ),
                            ],
                        ),

                        ft.Text(
                            summary,
                            size=16,
                        ),
                    ],
                ),
            )
        )

        

        if warnings:

            controls.append(

                ft.Text(
                    "⚠️ Warnings",
                    size=22,
                    weight=ft.FontWeight.BOLD,
                )
            )

            for warning in warnings:

                controls.append(

                    ft.Container(

                        bgcolor="#ffe5e5",

                        border_radius=12,

                        padding=15,

                        content=ft.Text(
                            warning,
                            size=15,
                        ),
                    )
                )

        

        if safe_notes:

            controls.append(

                ft.Text(
                    "✅ Positive Notes",
                    size=22,
                    weight=ft.FontWeight.BOLD,
                )
            )

            for note in safe_notes:

                controls.append(

                    ft.Container(

                        bgcolor="#e8fff1",

                        border_radius=12,

                        padding=15,

                        content=ft.Text(
                            note,
                            size=15,
                        ),
                    )
                )

        

        if tips:

            controls.append(

                ft.Text(
                    "💡 Health Tips",
                    size=22,
                    weight=ft.FontWeight.BOLD,
                )
            )

            for tip in tips:

                controls.append(

                    ft.Row(

                        controls=[

                            ft.Icon(
                                ft.Icons.CHECK_CIRCLE,
                                color="#198754",
                                size=18,
                            ),

                            ft.Text(
                                tip,
                                size=15,
                                expand=True,
                            ),
                        ]
                    )
                )

       

        if explanation:

            controls.append(

                ft.Text(
                    "📋 Detailed Explanation",
                    size=22,
                    weight=ft.FontWeight.BOLD,
                )
            )

            controls.append(

                ft.Container(

                    bgcolor="#f5f5f5",

                    border_radius=12,

                    padding=15,

                    content=ft.Text(
                        explanation,
                        size=15,
                    ),
                )
            )

        

        controls.append(
            ft.Container(height=20)
        )

        controls.append(

            ft.ElevatedButton(

                "Analyze Another Product",

                icon=ft.Icons.SEARCH,

                width=320,

                height=50,

                bgcolor="#198754",

                color="white",

                on_click=lambda e: self.page.go(
                    "/scanner"
                ),
            )
        )

        controls.append(

            ft.TextButton(

                "Back to Dashboard",

                on_click=lambda e: self.page.go(
                    "/dashboard"
                ),
            )
        )

        controls.append(
            ft.Container(height=40)
        )

        self.result_column.controls = controls

        self.page.update()