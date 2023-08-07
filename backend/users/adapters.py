from typing import Any

from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.utils import perform_login
from django.http import HttpResponseRedirect
from django.contrib.auth import get_user_model
from django.conf import settings
from django.http import HttpRequest

User = get_user_model()

class AccountAdapter(DefaultAccountAdapter):
    def is_open_for_signup(self, request: HttpRequest):
        return getattr(settings, "ACCOUNT_ALLOW_REGISTRATION", True)


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def is_open_for_signup(self, request: HttpRequest, sociallogin: Any):
        return getattr(settings, "SOCIALACCOUNT_ALLOW_REGISTRATION", True)
    
    def is_auto_signup_allowed(self, request, sociallogin):
        if sociallogin.user.email:
            try:
                user = User.objects.get(email=sociallogin.user.email)
                if user:
                    perform_login(request, user, 'none')
                    return HttpResponseRedirect('/')
            except User.DoesNotExist:
                pass
        return super().is_auto_signup_allowed(request, sociallogin)
