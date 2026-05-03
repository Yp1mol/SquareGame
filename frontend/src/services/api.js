const API_URL = "http://localhost:3001";

export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}

export async function registerUser(data) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Register failed");
  }

  return res.json();
}

export async function updateUsername(token, username) {
  const res = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    throw new Error("Fail to update username");
  }

  return res.json();
}

export async function fetchProfile(token) {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Not authorized");
  }

  return res.json();
}

export async function getPositions(roomCode, token) {
  const res = await fetch(`${API_URL}/rooms/${roomCode}/positions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to get positions");
  }

  return res.json();
}

export async function savePositions(roomCode, positions, token) {
  const res = await fetch(`${API_URL}/rooms/${roomCode}/positions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ positions }),
  });

  if (!res.ok) {
    throw new Error("Failed to save positions");
  }

  return res.json();
}

export async function createRoom(roomCode, token, cost) {
  const res = await fetch(`${API_URL}/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code: roomCode, cost }),
  });

  if (!res.ok) {
    throw new Error("Failed to create room");
  }

  return res.json();
}

export async function fetchRooms(token) {
  const res = await fetch(`${API_URL}/rooms`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch rooms");
  }

  return res.json();
}

export async function joinRoom(roomCode, token) {
  const res = await fetch(`${API_URL}/rooms/${roomCode}/join`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to join room");
  }

  return res.json();
}

export async function addCredit(token) {
  const res = await fetch(`${API_URL}/users/credits/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to add credit");
  }

  const data = await res.json();
  return data;
}

export async function fetchMyRooms(token) {
  const res = await fetch(`${API_URL}/rooms/mine`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch rooms");
  }

  return res.json();
}

export async function deleteRoom(roomCode, token) {
  const res = await fetch(`${API_URL}/rooms/${roomCode}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete room");
  }

  return res.json();
}

export async function finishRoomSetup(roomCode, token) {
  const res = await fetch(`${API_URL}/rooms/${roomCode}/finish`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to finish setup");
  }

  return res.json();
}

export async function getRoom(roomCode, token) {
  const res = await fetch(`${API_URL}/rooms/${roomCode}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to get room");
  }

  return res.json();
}

export async function getUserHistory(token) {
  const res = await fetch(`${API_URL}/history/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to get history");
  }

  return res.json();
}

export async function getBattleById(battleId, token) {
  const res = await fetch(`${API_URL}/history/${battleId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!res.ok) {
    throw new Error("Failed to get history");
  }

  return res.json();
}