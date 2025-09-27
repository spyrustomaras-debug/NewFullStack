// src/utils/auth.ts
export const refreshAccessToken = async (): Promise<string | null> => {
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) return null;

  try {
    const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) throw new Error("Refresh failed");

    const data = await response.json();
    const newAccessToken = data.access;
    localStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (err) {
    console.error(err);
    return null;
  }
};
