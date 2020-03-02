import axios from 'axios';


export async function fetchPeople() {
  const list = await axios.get('/api/user');
  return list;
}
export async function fetchWeibo() {
  const list = await axios.get('/api/weibo');
  return list;
}