const BASE_URL = "http://127.0.0.1:8000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("maya_auth_token");
}

async function handleResponse(response: Response) {
  if (response.status === 401) {
    // Unauthorized - clear auth
    if (typeof window !== "undefined") {
      localStorage.removeItem("maya_auth_token");
      localStorage.removeItem("maya_auth_user");
      window.dispatchEvent(new Event("authchange"));
    }
    throw new Error("Unauthorized. Please log in again.");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: `Request failed with status ${response.status}`,
    }));
    throw new Error(error.detail || "Request failed");
  }

  return response.json();
}

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    return handleResponse(response);
  } catch (error) {
    // Handle network errors (CORS, connection refused, etc.)
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "Cannot connect to the server. Please make sure the backend is running at http://127.0.0.1:8000"
      );
    }
    throw error;
  }
}

export const api = {
  chat: async (message: string, wantVideo: boolean = false) => {
    return apiRequest("/chat", {
      method: "POST",
      body: JSON.stringify({ message, want_video: wantVideo }),
    });
  },

  getVideo: async (jobId: string) => {
    return apiRequest(`/video/${jobId}`, {
      method: "GET",
    });
  },
};


