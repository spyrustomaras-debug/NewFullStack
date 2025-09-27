from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Project
from .serializers import RegisterSerializer, ProjectSerializer
from .permissions import IsWorkerOrReadOnly
from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        }
        return Response(data, status=status.HTTP_201_CREATED)


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return Project.objects.all()  # Admin sees everything
        return Project.objects.filter(created_by=user)  # Worker sees only their own

    def create(self, request, *args, **kwargs):
        user = request.user
        if user.role != "WORKER":
            return Response({"detail": "Admins cannot create projects."},
                            status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def update(self, request, *args, **kwargs):
        user = request.user
        project = self.get_object()

        if user.role != "WORKER":
            return Response({"detail": "Admins cannot update projects."},
                            status=status.HTTP_403_FORBIDDEN)

        if project.created_by != user:
            return Response({"detail": "You can only update your own projects."},
                            status=status.HTTP_403_FORBIDDEN)

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        user = request.user
        project = self.get_object()

        if user.role != "WORKER":
            return Response({"detail": "Admins cannot delete projects."},
                            status=status.HTTP_403_FORBIDDEN)

        if project.created_by != user:
            return Response({"detail": "You can only delete your own projects."},
                            status=status.HTTP_403_FORBIDDEN)

        return super().destroy(request, *args, **kwargs)
