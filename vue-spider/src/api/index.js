import axios from 'axios';
axios.defaults.headers['x-csrf-token'] = 'iKR4tho-ZwEA4zDWvk-4twH4'; // attach cookie to axiosInstance for future requests

export async function fetchPeople(params) {
  const list = await axios.get('/api/user', { params });
  return list;
}
export async function findUserById(id) {
  return await axios.get('/api/user/' + id);

}
export async function fetchWeibo(params) {
  const list = await axios.get('/api/weibo', { params });
  return list;
}
export async function submit(url) {
  const list = await axios.post('/api/user/submit', { url });
  return list;
}