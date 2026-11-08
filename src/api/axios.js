import axios from "axios";

const sairnaApi = axios.create({
    baseURL: "https://sairna.abdulrahman-hares.com/api/v1/website",
})

export default sairnaApi