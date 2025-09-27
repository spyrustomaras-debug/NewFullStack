import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { Navigate } from "react-router-dom";
import { JSX } from "react";

interface Props {
  children: JSX.Element;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
