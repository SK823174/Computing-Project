import flet as ft

from screens.analysis import AnalysisView


EXAMPLE_INGREDIENTS = (
    "Water, Sugar, Wheat Flour, Palm Oil, Salt, Dextrose, "
    "Sodium Bicarbonate, High Fructose Corn Syrup, Soy Lecithin, "
    "Natural Flavour, Citric Acid"
)


class ScannerScreen:

    def __init__(
        self,
        page,
        store,
    ):

        self.page = page
        self.store = store

 

    @staticmethod
    def to_float(value):

        try:
            return float(value)

        except Exception:
            return 0.0

  

    def go_dashboard(self, e=None):

        self.page.go("/dashboard")


    def load_example(self, e=None):

        self.product_field.value = "Example Snack Product"

        self.ingredients_field.value = EXAMPLE_INGREDIENTS

        self.calories_field.value = "450"
        self.sugar_field.value = "22"
        self.sodium_field.value = "380"

        self.protein_field.value = "5"
        self.carbs_field.value = "58"
        self.fat_field.value = "18"

        self.page.update()

  

    def go_analysis(self, e=None):

        ingredients = (
            self.ingredients_field.value or ""
        ).strip()

        if not ingredients:

            self.page.open(ft.SnackBar(
                content=ft.Text(
                    "Please enter ingredients first."
                )
            ))

            return

        pending_scan = {

            "product_name": (
                (
                    self.product_field.value
                    or ""
                ).strip()
                or "Unknown Product"
            ),

            "ingredients": ingredients,

            "calories": self.to_float(
                self.calories_field.value
            ),

            "protein_g": self.to_float(
                self.protein_field.value
            ),

            "carbs_g": self.to_float(
                self.carbs_field.value
            ),

            "fat_g": self.to_float(
                self.fat_field.value
            ),

            "sugar_g": self.to_float(
                self.sugar_field.value
            ),

            "sodium_mg": self.to_float(
                self.sodium_field.value
            ),
        }

        page_state = self.page.app_state

        page_state.current_scan = pending_scan

        if hasattr(self.store, "add_log_entry"):

            self.store.add_log_entry(
                pending_scan
            )

        self.page.go("/analysis")


    def log_only(self, e=None):

        calories = self.to_float(
            self.calories_field.value
        )

        if calories <= 0:

            self.page.open(ft.SnackBar(
                content=ft.Text(
                    "Please enter calories."
                )
            ))

            return

        entry = {

            "product_name": (
                (
                    self.product_field.value
                    or ""
                ).strip()
                or "Logged Item"
            ),

            "calories": calories,

            "protein_g": self.to_float(
                self.protein_field.value
            ),

            "carbs_g": self.to_float(
                self.carbs_field.value
            ),

            "fat_g": self.to_float(
                self.fat_field.value
            ),

            "sugar_g": self.to_float(
                self.sugar_field.value
            ),

            "sodium_mg": self.to_float(
                self.sodium_field.value
            ),
        }

        if hasattr(self.store, "add_log_entry"):

            self.store.add_log_entry(entry)

        self.page.open(ft.SnackBar(
            content=ft.Text(
                f"Logged {int(calories)} kcal successfully!"
            )
        ))

        self.go_dashboard()

 

    def build(self):

        profile = self.store.profile

        conditions = profile.get(
            "health_conditions",
            []
        )

     

        self.product_field = ft.TextField(

            label="Product Name",

            hint_text="Oreo Cookies, Cola Drink...",

            border_radius=12,
        )

        self.ingredients_field = ft.TextField(

            label="Ingredients List",

            hint_text="Paste ingredients from the label...",

            multiline=True,

            min_lines=6,

            max_lines=10,

            border_radius=12,
        )

        self.calories_field = ft.TextField(

            label="Calories",

            keyboard_type=ft.KeyboardType.NUMBER,

            expand=True,
        )

        self.sugar_field = ft.TextField(

            label="Sugar (g)",

            keyboard_type=ft.KeyboardType.NUMBER,

            expand=True,
        )

        self.sodium_field = ft.TextField(

            label="Sodium (mg)",

            keyboard_type=ft.KeyboardType.NUMBER,

            expand=True,
        )

        self.protein_field = ft.TextField(

            label="Protein (g)",

            keyboard_type=ft.KeyboardType.NUMBER,

            expand=True,
        )

        self.carbs_field = ft.TextField(

            label="Carbs (g)",

            keyboard_type=ft.KeyboardType.NUMBER,

            expand=True,
        )

        self.fat_field = ft.TextField(

            label="Fat (g)",

            keyboard_type=ft.KeyboardType.NUMBER,

            expand=True,
        )

    

        reminder = None

        if conditions:

            reminder = ft.Container(

                padding=15,

                border_radius=14,

                bgcolor="#ECFDF5",

                content=ft.Row(

                    controls=[

                        ft.Text(
                            "⚕️",
                            size=22,
                        ),

                        ft.Text(
                            "Checking against: "
                            + ", ".join(
                                conditions[:3]
                            ),

                            size=14,

                            weight=ft.FontWeight.W_500,
                        ),
                    ]
                ),
            )

      

        controls = [

            ft.Row(

                alignment=ft.MainAxisAlignment.SPACE_BETWEEN,

                controls=[

                    ft.IconButton(
                        icon=ft.Icons.ARROW_BACK,
                        on_click=self.go_dashboard,
                    ),

                    ft.Text(
                        "Ingredient Log",
                        size=26,
                        weight=ft.FontWeight.BOLD,
                    ),

                    ft.Container(width=48),
                ],
            ),
        ]

        if reminder:

            controls.append(reminder)

        controls.extend([

            ft.Text(
                "Product Name",
                size=18,
                weight=ft.FontWeight.BOLD,
            ),

            self.product_field,

            ft.Text(
                "Ingredients",
                size=18,
                weight=ft.FontWeight.BOLD,
            ),

            self.ingredients_field,

            ft.TextButton(
                "Load Example Ingredients",
                icon=ft.Icons.CONTENT_PASTE,
                on_click=self.load_example,
            ),

            ft.Divider(),

            ft.Text(
                "Nutrition Facts",
                size=18,
                weight=ft.FontWeight.BOLD,
            ),

            ft.Row(

                spacing=10,

                controls=[
                    self.calories_field,
                    self.sugar_field,
                    self.sodium_field,
                ],
            ),

            ft.Row(

                spacing=10,

                controls=[
                    self.protein_field,
                    self.carbs_field,
                    self.fat_field,
                ],
            ),

            ft.Container(height=10),

            ft.ElevatedButton(

                "Analyse Ingredients",

                icon=ft.Icons.SEARCH,

                bgcolor="#16A34A",

                color="white",

                height=55,

                on_click=self.go_analysis,
            ),

            ft.OutlinedButton(

                "Back to Dashboard",

                icon=ft.Icons.ARROW_BACK,

                height=50,

                
             on_click=lambda e: self.page.go("/dashboard"),
            ),

            ft.Container(height=30),
        ])

      

        return ft.SafeArea(

    ft.Container(

        expand=True,

        padding=20,

        content=ft.Column(

            expand=True,

            scroll=ft.ScrollMode.AUTO,

            spacing=18,

            controls=controls,
        ),
    ),

    expand=True,
)

