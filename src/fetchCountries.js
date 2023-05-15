export async function fetchCountries(name) {
  const url = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(response.status);
  }

  const data = await response.json();

  if (data.status === 404) {
    throw new Error('Country not found');
  }

  return data;
}





