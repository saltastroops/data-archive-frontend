import axios from "axios";

// Creating an instance of axios with the credentials enabled for handling cookies.
export default axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URI}`,
  withCredentials: true
});
