import asyncio

import flet as ft


class SplashScreen:

    def __init__(
        self,
        page: ft.Page,
        store,
    ):

        self.page = page
        self.store = store


    async def navigate(self):

        await asyncio.sleep(2)



        if self.store.profile.get(
            "setup_complete",
            False
        ):

            self.page.go("/dashboard")



        else:

            self.page.go("/onboarding")

   
    def build(self):

        splash = ft.Container(

            expand=True,

            bgcolor="#16A34A",

            alignment=ft.Alignment.CENTER,

            content=ft.Column(

                alignment=ft.MainAxisAlignment.CENTER,

                horizontal_alignment=ft.CrossAxisAlignment.CENTER,

                spacing=20,

                controls=[

                    # Logo
                    ft.Container(

                        width=130,
                        height=130,

                        border_radius=65,

                        bgcolor="white",

                        alignment=ft.Alignment.CENTER,

                        shadow=ft.BoxShadow(
                            blur_radius=20,
                            color="#15803d55",
                            spread_radius=2,
                        ),

                        content=ft.Text(
                            "🥗",
                            size=70,
                        ),
                    ),

                    # App Name
                    ft.Text(
                        "NutriGuard",
                        size=42,
                        weight=ft.FontWeight.BOLD,
                        color="white",
                    ),

                    # Tagline
                    ft.Text(
                        "Eat Smart. Stay Safe.",
                        size=18,
                        color="#D1FAE5",
                    ),

                    ft.Container(height=10),

                    # Loader
                    ft.ProgressRing(
                        width=42,
                        height=42,
                        stroke_width=4,
                        color="white",
                    ),
                ],
            ),
        )

        # Start async navigation
        self.page.run_task(self.navigate)

        return ft.SafeArea(splash, expand=True)