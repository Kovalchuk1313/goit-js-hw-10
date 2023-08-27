// Імпортуємо фунції
import { fetchBreeds, fetchCatByBreed } from './js/api.js';

// Імпорти загалні
import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

// Імпортуємо стилі
import './css/style.css';

// Створюємо селектори для відстеження DOM
const elements = {
  select: document.querySelector('.breed-select'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
  catInfo: document.querySelector('.cat-info'),
};

const { select, loader, error, catInfo } = elements;
select.classList.add('is-hidden');
error.classList.add('is-hidden');
loader.classList.remove('is-hidden');

//Створюжмо змінну з пустим массивом
let breedOptions = [];

fetchBreeds()
  .then(data => {
    breedOptions = data.map(breed => ({ value: breed.id, text: breed.name }));
    initializeSelect();
    select.classList.remove('is-hidden'); // Відобразити селект
    loader.classList.add('is-hidden');
  })
  .catch(onErrorFetch);

function initializeSelect() {
  new SlimSelect({
    select: select,
    data: breedOptions,
  });
  select.addEventListener('change', onSelectBreedCats);
}

function onErrorFetch() {
  loader.classList.add('is-hidden'); // Приховати лоадер
  select.classList.remove('is-hidden'); // Відобразити селект
  Notiflix.Notify.failure(
    'Oops! Something went wrong! Try reloading the page!'
  );
}

function onSelectBreedCats(evt) {
  loader.classList.remove('is-hidden');
  select.classList.add('is-hidden');
  catInfo.classList.add('is-hidden');
  const breedId = evt.target.value;
  fetchCatByBreed(breedId)
    .then(data => {
      const { url, breeds } = data[0];
      catInfo.innerHTML = `
      <div class="info">
                <div class="img">
                    <img src="${url}" alt="${breeds[0].name}" width="600"/>
                </div>
                <div class="info">
                    <h1>${breeds[0].name}</h1>
                    <p>${breeds[0].description}</p>
                    <p><i><b>Life_span: </b></i>${breeds[0].life_span} years</p>
                    <p><i><b>Temperament:</b></i> ${breeds[0].temperament}</p>
                </div>
                </div>`;
      catInfo.classList.remove('is-hidden');
    })
    .catch(onErrorFetch)
    .finally(() => {
      loader.classList.add('is-hidden');
      select.classList.remove('is-hidden');
    });
}
