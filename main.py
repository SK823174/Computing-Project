import flet as ft

from data.store import AppStore
from screens.splash import SplashScreen
from screens.onboarding import OnboardingView
from screens.dashboard import DashboardView
from screens.scanner import ScannerScreen
from screens.analysis import AnalysisView
from screens.analytics import AnalyticsView
from screens.history import HistoryView
from screens.profile import ProfileView


def main(page: ft.Page):

    page.title = "NutriGuard"
    page.theme_mode = ft.ThemeMode.LIGHT
    page.padding = 0
    page.spacing = 0
    page.window.width = 400
    page.window.height = 800
    page.window.resizable = True
    page.bgcolor = "#ffffff"
    page.horizontal_alignment = ft.CrossAxisAlignment.CENTER

    
    store = AppStore()
    store.current_scan = {}
    page.app_state = store

    
    def route_change():

        page.views.clear()

        if page.route in ("/", ""):

            splash = SplashScreen(page, store)
            page.views.append(
                ft.View(
                    route="/",
                    padding=0,
                    spacing=0,
                    bgcolor="#16A34A",   
                    controls=[splash.build()],
                )
            )

        elif page.route == "/onboarding":

            onboarding = OnboardingView(page, store)
            page.views.append(
                ft.View(
                    route="/onboarding",
                    padding=0,
                    spacing=0,
                    bgcolor="#ffffff",
                    controls=[onboarding.build()],
                )
            )

        elif page.route == "/dashboard":

            dashboard = DashboardView(page, store)
            page.views.append(
                ft.View(
                    route="/dashboard",
                    padding=0,
                    spacing=0,
                    bgcolor="#ffffff",
                    controls=[dashboard.build()],
                )
            )

        elif page.route == "/scanner":

            scanner = ScannerScreen(page, store)
            page.views.append(
                ft.View(
                    route="/scanner",
                    padding=0,
                    spacing=0,
                    bgcolor="#ffffff",
                    controls=[scanner.build()],
                )
            )

        elif page.route == "/analysis":

            scan_data = store.current_scan
            analysis = AnalysisView(
                page=page,
                ingredients=scan_data.get("ingredients", ""),
                profile=store.profile,
                product_name=scan_data.get("product_name", "Product"),
            )
            page.views.append(
                ft.View(
                    route="/analysis",
                    padding=0,
                    spacing=0,
                    bgcolor="#ffffff",
                    controls=[analysis.build()],
                )
            )

        elif page.route == "/analytics":

            analytics = AnalyticsView(page, store)
            page.views.append(
                ft.View(
                    route="/analytics",
                    padding=0,
                    spacing=0,
                    bgcolor="#ffffff",
                    controls=[analytics.build()],
                )
            )

        elif page.route == "/history":

            history = HistoryView(page, store)
            page.views.append(
                ft.View(
                    route="/history",
                    padding=0,
                    spacing=0,
                    bgcolor="#ffffff",
                    controls=[history.build()],
                )
            )

        elif page.route == "/profile":

            profile_view = ProfileView(page, store)
            page.views.append(
                ft.View(
                    route="/profile",
                    padding=0,
                    spacing=0,
                    bgcolor="#ffffff",
                    controls=[profile_view.build()],
                )
            )

        page.update()

    def view_pop(e):

        if len(page.views) > 1:
            page.views.pop()

        top_view = page.views[-1]
        page.route = top_view.route
        route_change()

    page.on_route_change = route_change
    page.on_view_pop = view_pop
    route_change()   


ft.run(main)
