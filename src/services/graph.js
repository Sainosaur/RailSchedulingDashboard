import axios from "axios";

const BASE_URL = "http://192.168.1.40:8000/api/dashboard/graph";

const getAll = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export default getAll;
