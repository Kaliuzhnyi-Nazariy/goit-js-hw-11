import Notiflix from 'notiflix';
import { makeRequest, seeMore } from './addition.js';

const form = document.querySelector('#search-form');
const inputUser = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

loadMore.style.display = 'none';

let page = 1;
const perPage = 40;
// const perPage = 3; // temprorary
let isShown = 0;

form.addEventListener('submit', formSubmit);

function formSubmit(e) {
  e.preventDefault();

  gallery.innerHTML = '';
  const input = e.currentTarget;
  const formData = new FormData(input);
  const info = formData.getAll('searchQuery');

  if (info[0] === '') {
    Notiflix.Notify.failure('Please input some value.');
  } else {
    makeRequest(info, page, perPage)
      .then(data => {
        if (data.totalHits === 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else {
          renderGallery(data.hits);
          Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

          loadMore.style.display = 'flex';
        }
      })
      .catch(error => console.log(error));
  }
}

function renderGallery(images) {
  const markup = images
    .map(image => {
      const {
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `
        <a class="gallery__link" href="${largeImageURL}">
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
      `;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

loadMore.addEventListener('click', addOptions);

async function addOptions(e) {
  e.preventDefault;

  const input = inputUser.value;
  console.log(input);

  page += 1;
  console.log(page);
  // debugger;
  await seeMore(input, page, perPage)
    .then(dataInf => {

      const totalPages = Math.ceil(dataInf.totalHits / perPage);

      if (page > totalPages) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      renderGallery(dataInf.hits);
      Notiflix.Notify.success(`Hooray! We found ${dataInf.totalHits - perPage * page} images.`);

      loadMore.style.display = 'flex';
    })
    .catch(error => console.log(error));
}
