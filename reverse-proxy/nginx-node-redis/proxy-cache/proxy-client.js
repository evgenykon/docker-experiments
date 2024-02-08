import needle from "needle";

const proxyClient = (url) => {
    return new Promise((resolve, reject) => {
        needle.get(url, {
            open_timeout: 5000,
            response_timeout: 5000,
            read_timeout: 5000,
            compressed: false,
            follow_max: 1,
            parse_response: false,
        }, async (error, response) => {
            console.log('   proxyClient: GET ', url, response.statusCode);
            if (error || response.statusCode !== 200) {
                if (response.statusCode === 404) {
                    error = {message:'Page Not Found'};
                }
                reject({message: error.message, statusCode: response.statusCode}, error);
                return;
            }
            resolve(response.body);
        });
    });

}

export default proxyClient;