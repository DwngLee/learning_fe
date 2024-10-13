import axios from "axios";

const fetchAllUser = () => {
  return axios.get("https://randomuser.me/api?results=18");
};

export { fetchAllUser };
