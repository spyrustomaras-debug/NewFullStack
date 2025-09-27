from rest_framework import permissions

class IsWorkerOrReadOnly(permissions.BasePermission):
    """
    Allow SAFE_METHODS for authenticated users.
    For unsafe methods (POST/PUT/PATCH/DELETE), only allow users with role == WORKER.
    """

    def has_permission(self, request, view):
        # allow any authenticated user to read
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated

        # for unsafe methods require worker role
        return request.user and request.user.is_authenticated and getattr(request.user, "role", None) == "WORKER"
