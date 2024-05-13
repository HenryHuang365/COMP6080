// API CALL promises
const config = require('../config.json');
const BACKEND_PORT = config.BACKEND_PORT;

export const genApiCall = (methodT) => {
  const apiCall = (token, path, body, data = '', authed = false) => {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:${BACKEND_PORT}/${path}` + ((methodT === 'GET') ? (data) : ('')), {
        method: methodT,
        body: (methodT === 'POST' || methodT === 'PUT' || methodT === 'DELETE') ? JSON.stringify(body) : undefined,
        headers: {
          'Content-type': 'application/json',
          Authorization: authed ? `Bearer ${token}` : undefined
        }
      })
        .then((response) => response.json())
        .then((body) => {
          if (body.error) {
            reject(body.error);
          } else {
            resolve(body);
          }
        });
    });
  };

  return apiCall;
}

export const apiCallPost = genApiCall('POST');
export const apiCallGet = genApiCall('GET');
export const apiCallPut = genApiCall('PUT');
export const apiCallDelete = genApiCall('DELETE');
