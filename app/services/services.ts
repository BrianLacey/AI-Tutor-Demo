export const readProfile = async () => {
  const response = await fetch("/api/chat");
  //   console.log(response);

  if (!response.ok) {
    throw await response.json();
  } else {
    return response.json();
  }
};
