import axios from 'axios';
import {
  logOut
} from '../redux/modules/auth';
import { store } from '../../src';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 30000
});

const refreshingToken = async (refreshToken) => {
  try {
    const res = await instance.request({
      url: 'auth/refresh_token',
      method: 'POST',
      data: {"refresh_token": refreshToken},
      headers: {
        'Content-Type': 'text/html'
      }
    });
    return res;
  } catch (error) {
    // store.dispatch(logOut());
  }
}

const request = (method, url, data, headers, onUploadProgress) => {
  const requestInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 30000
  });

  requestInstance.interceptors.response.use(
    response => response,
    async error => {
      if(error.config && error.response && error.response.data.error === "invalid_token" && error.response.status === 401) {
        try {
          let refreshToken = localStorage.getItem('refreshToken');
          // let refreshTokenResponse = await refreshingToken(refreshToken, dispatch);
          let refreshTokenResponse = await refreshingToken(refreshToken);
          if(refreshTokenResponse.data.access_token) {
            let newToken = refreshTokenResponse.data.access_token;
            // debugger;
            headers = {
              "access-token": newToken
            }
            localStorage.removeItem('accessToken');
            localStorage.setItem('accessToken', newToken);
          }
          // return request(method, url, data, headers);
          if (method === 'get') {
            return requestInstance.request({
              url,
              method,
              params: data,
              headers
            });
          } else {
            return requestInstance.request({
              url,
              method,
              data,
              onUploadProgress,
              headers: {
                'Content-Type': 'text/html',
                ...headers,
              },
            });
          }
        } catch (error) {
          return Promise.reject(error.response);
        }
      }
    }
  )

  return new Promise((resolve, reject) => {
    (() => {
      if (method === 'get') {
        return requestInstance.request({
          url,
          method,
          params: data,
          headers: {
            'Content-Type': 'text/html',
            ...headers,
          }
        });
      } else {
        return requestInstance.request({
          url,
          method,
          data,
          headers: {
            'Content-Type': 'text/html',
            ...headers,
          },
          onUploadProgress,
        });
      }
    })()
    .then((res) => {
      resolve(res.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}

// const request = (method, url, data, headers) => {
//   return new Promise((resolve, reject) => {
//     (() => {
//       if (method === 'get') {
//         return instance.request({
//           url,
//           method,
//           params: data,
//           headers: {
//             'Content-Type': 'text/html',
//             ...headers,
//           }
//         });
//       } else {
//         return instance.request({
//           url,
//           method,
//           data,
//           headers: {
//             'Content-Type': 'text/html',
//             ...headers,
//           }
//         });
//       }
//     })()
//     .then((res) => {
//       resolve(res.data);
//     })
//     .catch((err) => {
//       reject(err.response);
//     })
//   ;
//   });
// };

export default {
  get: (endpoint, data, headers, dispatch) => {
    return request('get', endpoint, data, headers);
  },
  post: (endpoint, data, headers, dispatch, onUploadProgress) => {
    return request('post', endpoint, data, headers, onUploadProgress);
  },
  put: (endpoint, data, headers, dispatch, onUploadProgress) => {
    return request('put', endpoint, data, headers, onUploadProgress);
  },
  del: (endpoint, data, headers, dispatch) => {
    return request('delete', endpoint, data);
  },
};
