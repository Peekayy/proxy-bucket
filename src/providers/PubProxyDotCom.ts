import axios from "axios";


// TODO
async function getProxy() {
    const response = await axios.get("http://pubproxy.com/api/proxy?format=json&type=http&https=false");
    return response.data.data[0];
}
