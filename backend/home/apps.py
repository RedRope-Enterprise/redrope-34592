from django.apps import AppConfig


class HomeConfig(AppConfig):
    name = "home"

    def ready(self):
        try:
            import home.signals  # noqa F401

            print("Signals imported")
        except ImportError:
            raise Exception("Error importing signals")
