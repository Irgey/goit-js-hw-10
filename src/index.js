import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

import { fetchCountries } from './js/fetchCountries';
const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const divEl = document.querySelector('.country-info');
inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
  const inputValue = e.target.value.trim();
  if (inputValue !== '') {
    fetchCountries(inputValue).then(result => {
      if (result.length > 10) {
        listEl.innerHTML = '';

        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (result.length >= 2 && result.length <= 10) {
        divEl.innerHTML = '';
        const listItems = result.reduce(
          (acc, { flags: { svg: flag }, name: { common: countryName } }) =>
            acc +
            `<li class = "list__item"><img class='list__img' src="${flag}" alt="Flag of ${countryName}">  ${countryName}</li>`,
          ''
        );
        listEl.innerHTML = listItems;
      } else if (result.length === 1) {
        console.log(result);
        listEl.innerHTML = '';
        const {
          flags: { svg: flag },
          name: { common: countryName },
          capital,
          population,
          languages,
        } = result[0];

        const countryCard = `<h2><img class="card__img" src="${flag}" alt="Flag of ${countryName}" />${countryName}</h2>
<ul>
  <li><b>Capital:</b> ${capital.join(', ')}</li>
  <li><b>Population:</b> ${population}</li>
  <li><b>Languages:</b> ${Object.values(languages).join(', ')}</li>
</ul>`;
        divEl.innerHTML = countryCard;
      }
    });
  } else {
    divEl.innerHTML = '';
    listEl.innerHTML = '';
  }
}
