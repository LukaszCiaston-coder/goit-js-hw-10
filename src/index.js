import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const searchBox = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

const handleSearch = debounce(async () => {
  const searchTerm = searchBox.value.trim();

  if (searchTerm === '') {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  try {
    const countries = await fetchCountries(searchTerm);

    if (countries.length > 10) {
      Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
    } else if (countries.length >= 2 && countries.length <= 10) {
      renderCountryList(countries);
      countryInfo.innerHTML = '';
    } else if (countries.length === 1) {
      renderCountryList(countries[0]);
      countryList.innerHTML = '';
    }
  } catch (error) {
    if (error.message === 'Country not found') {
      Notiflix.Notify.failure('Oops, there is no country with that name.');
    } else {
      Notiflix.Notify.failure('An error occurred. Please try again later.');
    }
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }
}, DEBOUNCE_DELAY);

searchBox.addEventListener('input', handleSearch);

function renderCountryList(countries) {
  countryList.innerHTML = '';

  if (!Array.isArray(countries)) {
    // Obsługa przypadku, gdy `countries` nie jest tablicą
    console.error('Invalid countries data');
    return;
  }

  if (countries.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }

  countries.forEach((country) => {
    const listItem = document.createElement('li');
    const flagImg = document.createElement('img');
    const countryName = document.createElement('span');

    flagImg.src = country.flags.svg;
    flagImg.alt = `${country.name.official} flag`;
    flagImg.classList.add('flag');

    countryName.textContent = country.name.official;

    listItem.appendChild(flagImg);
    listItem.appendChild(countryName);

    listItem.addEventListener('click', () => {
      renderCountryList(country);
    });

    countryList.appendChild(listItem);
  });
}