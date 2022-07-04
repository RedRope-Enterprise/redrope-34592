from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerAndReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        print(SAFE_METHODS)
        if request.method in SAFE_METHODS:
            return True

        return obj.user == request.user


class IsUserOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.pk == request.user.pk


class IsEventPlannerOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.event_planner


class IsEventPlanner(BasePermission):
    def has_permission(self, request, view):
        return request.user.event_planner
