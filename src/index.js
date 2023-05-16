"use strict"
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

  countryList.innerHTML = '';
  countryInfo.innerHTML = '';

  if (searchTerm === '') {
    countryList.style.display = 'block'; 
    return;
  }

  try {
    const countries = await fetchCountries(searchTerm);

    const exactMatch = countries.find(
      (country) => country.name.official.toLowerCase() === searchTerm.toLowerCase()
    );

    if (exactMatch) {
      renderCountryList(exactMatch);
      displayCountryInfo(exactMatch);
      countryList.style.display = 'none'; 
    } else {
      const matchingCountries = countries.filter((country) =>
        country.name.official.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (matchingCountries.length === 0) {
        Notiflix.Notify.failure('Oops, there is no country with that name.');
      } else if (matchingCountries.length === 1) {
        renderCountryList(matchingCountries[0]);
        displayCountryInfo(matchingCountries[0]);
        countryList.style.display = 'none'; 
      } else {
        renderCountryList(matchingCountries);
        countryList.style.display = 'block'; 
      }
    }
  } catch (error) {
    const errorMessage =
      error.message === 'Country not found'
        ? 'An error occurred. Please try again later.'
        : 'Oops, there is no country with that name.';
    Notiflix.Notify.failure(errorMessage);
  }
}, DEBOUNCE_DELAY);

searchBox.addEventListener('input', handleSearch);

function renderCountry(country) {
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
    displayCountryInfo(country);
  });

  countryList.appendChild(listItem);
}

function renderCountryList(countries) {
  countryList.innerHTML = '';

  if (!Array.isArray(countries)) {
    countries = [countries];
  }

  if (countries.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }

  countries.forEach((country) => {
    renderCountry(country);
  });
}

function displayCountryInfo(country) {
  const languages = Object.values(country.languages).join(', ');
  countryInfo.innerHTML = `
    <h2>
      <img src="${country.flags.svg}" alt="${country.name.official} flag" class="flag">
      ${country.name.official}
    </h2>
    <p><strong>Capital:</strong> <em>${country.capital}</em></p>
    <p><strong>Population:</strong> <em>${country.population}</em></p>
    <p><strong>Languages:</strong> <em>${languages}</em></p>
  `;
}