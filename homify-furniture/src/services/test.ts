export async function getTestData() {
  try {
    const response = await fetch("/api/auth");
    return response;
  } catch (error) {
    return error;
  }
}
