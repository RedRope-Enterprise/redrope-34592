from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _
import logging

class UsersConfig(AppConfig):
    name = "users"
    verbose_name = _("Users")

    def ready(self):
        try:
            import users.signals  # noqa F401
        except ImportError:
            logging.warning("Cannot import user signals")
            pass
