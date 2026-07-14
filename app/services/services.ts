export const readProfile = async () => {
  const response = await fetch("/api/profile");

  if (!response.ok) {
    throw await response.json();
  } else {
    return response.json();
  }
};

export const readChat = async () => {
  const response = await fetch("/api/chat");

  if (!response.ok) {
    throw await response.json();
  } else {
    return response.json();
  }
};
