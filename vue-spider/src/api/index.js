import axios from 'axios';


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