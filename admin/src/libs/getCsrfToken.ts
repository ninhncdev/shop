import axios from "axios";
export default async function getCsrfToken() {
  await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
    withCredentials: true,
  });
}
