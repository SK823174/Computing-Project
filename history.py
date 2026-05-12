import flet as ft


class HistoryView:

    def __init__(
        self,
        page: ft.Page,
        store,
    ):
        self.page = page
        self.store = store

    def build(self):

        analyses = self.store.today_entries()

        content = ft.Column(
            scroll=ft.ScrollMode.AUTO,
            spacing=15,
            expand=True,
        )

        content.controls.append(

            ft.Row(
                alignment=ft.MainAxisAlignment.SPACE_BETWEEN,

                controls=[

                    ft.Row(
                        controls=[

                            ft.IconButton(
                                icon=ft.Icons.ARROW_BACK,
                                on_click=lambda e: self.page.go("/dashboard"),
                            ),

                            ft.Text(
                                "Food History",
                                size=30,
                                weight=ft.FontWeight.BOLD,
                            ),
                        ]
                    ),

                    ft.IconButton(
                        icon=ft.Icons.DELETE_SWEEP,
                        tooltip="Clear History",
                        on_click=self._confirm_clear,
                    ),
                ]
            )
        )

        if not analyses:

            content.controls.append(
                ft.Container(height=60)
            )

            content.controls.append(

                ft.Column(
                    horizontal_alignment=ft.CrossAxisAlignment.CENTER,

                    controls=[

                        ft.Text(
                            "🍎",
                            size=60,
                        ),

                        ft.Text(
                            "No food logs yet",
                            size=24,
                            weight=ft.FontWeight.BOLD,
                        ),

                        ft.Text(
                            "Log your first meal from the scanner.",
                            color="grey",
                            text_align=ft.TextAlign.CENTER,
                        ),

                        ft.Container(height=20),

                        ft.ElevatedButton(
                            "Go to Scanner",
                            icon=ft.Icons.SEARCH,
                            on_click=lambda e: self.page.go("/scanner"),
                        ),
                    ]
                )
            )

        else:

            content.controls.append(

                ft.Text(
                    f"{len(analyses)} food log entrie(s)",
                    color="grey",
                )
            )

            for entry in analyses[-50:]:

                content.controls.append(
                    self._entry_card(entry)
                )

        content.controls.append(
            ft.Container(height=40)
        )

        return ft.Column(
            expand=True,

            controls=[

                ft.Container(
                    content=content,
                    padding=20,
                    expand=True,
                ),
            ]
        )

    def _entry_card(
        self,
        entry,
    ):

        product = entry.get(
            "product_name",
            "Food Item"
        )

        scan_date = entry.get(
            "date",
            "—"
        )

        calories = int(entry.get(
            "calories",
            0
        ))

        protein = int(entry.get(
            "protein_g",
            0
        ))

        carbs = int(entry.get(
            "carbs_g",
            0
        ))

        fat = int(entry.get(
            "fat_g",
            0
        ))

        return ft.Container(

            bgcolor="#fafafa",

            border_radius=18,

            padding=15,

            content=ft.Row(

                alignment=ft.MainAxisAlignment.SPACE_BETWEEN,

                controls=[

                    ft.Column(

                        spacing=5,

                        expand=True,

                        controls=[

                            ft.Text(
                                product,
                                size=18,
                                weight=ft.FontWeight.BOLD,
                            ),

                            ft.Text(
                                scan_date,
                                color="grey",
                            ),

                            ft.Text(
                                f"P: {protein}g  •  C: {carbs}g  •  F: {fat}g",
                                size=12,
                                color="grey",
                            ),
                        ]
                    ),

                    ft.Container(

                        padding=10,

                        border_radius=12,

                        bgcolor="#16a34a",

                        content=ft.Text(
                            f"{calories} kcal",
                            color="white",
                            weight=ft.FontWeight.BOLD,
                        ),
                    ),
                ]
            )
        )

    def _confirm_clear(self, e):

        dialog = ft.AlertDialog(
            modal=True,

            title=ft.Text(
                "Clear History?"
            ),

            content=ft.Text(
                "This will remove all saved food logs."
            ),

            actions=[

                ft.TextButton(
                    "Cancel",
                    on_click=lambda e: self._close_dialog(),
                ),

                ft.ElevatedButton(
                    "Clear",
                    bgcolor="#dc2626",
                    color="white",
                    on_click=lambda e: self._clear_history(),
                ),
            ],
        )

        self.page.dialog = dialog
        dialog.open = True
        self.page.update()

    def _clear_history(self):

        self.store._data["analyses"] = []

        if hasattr(self.store, "save"):
            self.store.save()

        self.page.dialog.open = False
        self.page.update()

        self.page.go("/history")

    def _close_dialog(self):

        self.page.dialog.open = False
        self.page.update()
