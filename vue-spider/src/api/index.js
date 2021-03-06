import axios from 'axios';
function getCookie(cname) {
  const name = cname + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return '';
}
function addToken() {
  const csrfToken = getCookie('csrfToken');
  axios.defaults.headers['x-csrf-token'] = csrfToken; // attach cookie to axiosInstance for future requests
  // axios.defaults.headers['x-csrf-token'] = 'iKR4tho-ZwEA4zDWvk-4twH4'; // attach cookie to axiosInstance for future requests
}


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
  addToken();
  const list = await axios.post('/api/user/submit', { url });
  return list;
}
export async function submitAccount(title) {
  addToken();
  const list = await axios.post('/api/wechat/submit', { title });
  return list;
}
export async function analyze({ user_id } = {}) {
  const list = await axios.get('/api/weibo/analyze/' + user_id, { user_id });
  return list;
}

// 微信公众号相关api
export async function fetchAccount(params) {
  return await axios.get('/api/mysql/wechat/account', { params });
}
export async function findAccountById(id) {
  return await axios.get('/api/mysql/wechat/account/' + id);
}
export async function fetchArticle(params) {
  return await axios.get('/api/mysql/wechat/article', { params });
}