import axios from 'axios';


export async function fetchPeople() {
  const list = await axios.get('/api/user');
  return list;
}