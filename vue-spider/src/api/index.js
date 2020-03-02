import axios from 'axios';


export async function fetchPeople() {
  const list = await axios.get('/user');
  return list;
}