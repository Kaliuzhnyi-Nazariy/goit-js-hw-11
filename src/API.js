import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '39742414-f9e02f0b1fec26f910bcd5038';


async function makeRequest(info, page, perPage) {
  const result = await axios.get(
    `?key=${API_KEY}&q=${info}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return result.data;
}

export { makeRequest };
