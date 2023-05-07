'use strict';

const countryInputEl = document.querySelector('.search__input');
const searchBtnEl = document.querySelector('.search__btn');
const searchBar = document.querySelector('.search__mainBox');

searchBar.addEventListener('click', () => {
    countryInputEl.focus();
});

countryInputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const countryValue = countryInputEl.value;
        showHideElements('show');
        showResult(countryValue);
    }
});

searchBtnEl.addEventListener('click', () => {
    const countryValue = countryInputEl.value;
    showHideElements('show');
    showResult(countryValue);
});

const showHideElements = function (action) {
    const countryHeader = document.querySelector('.country__header');
    const tableContainer = document.querySelector('.country__tableContainer');

    if (action === 'hide') {
        countryHeader.classList.add('hide');
        tableContainer.classList.add('hide');
    } else if (action === 'show') {
        countryHeader.classList.remove('hide');
        tableContainer.classList.remove('hide');
    }
};

const renderError = function (errorMessage) {
    const mainEl = document.getElementById('main');
    const html = `
        <div class="error">
            <h3 class="error__emoji">⚠️</h3>
            <p class="error__text">OOPS!! ${errorMessage}</p>
        </div>
    `;

    showHideElements('hide');
    mainEl.insertAdjacentHTML('beforeend', html);
};

const getCountryData = function (country) {
    fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`)
        .then((response) => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(
                        'Country not found(404), Please check the spelling'
                    );
                }
                throw new Error('Something went wrong! Please try again.');
            }

            return response.json();
        })
        .then((data) => {
            const countryData = data[0];
            renderCountryHeader(countryData);
            renderCountryTable(countryData);
        })
        .catch((err) => {
            renderError(err.message);
        });
};

const renderCountryHeader = function (data) {
    const countryHeaderEl = document.querySelector('.country__header');
    const html = `
        <div class="country__flagBox">
            <img
                src="${data.flags.png}"
                class="country__flag"
            />
        </div>
        <div class="country__textBox">
            <div class="country__name">${data.name.common}</div>
            <div class="country__region">${data.region}</div>
        </div>
    `;

    countryHeaderEl.insertAdjacentHTML('beforeend', html);
};

const renderCountryTable = function (data) {
    const countryTableEl = document.querySelector('.country__info-table');
    const currency = Object.keys(data.currencies)[0];
    const languages = [];

    Object.keys(data.languages).forEach((element) => {
        languages.push(data.languages[element]);
    });

    const html = `
        <tbody class="country__info-table__body">
            <tr>
                <td>Capital</td>
                <td>${data.capital[0]}</td>
            </tr>
            <tr>
                <td>Population</td>
                <td>${data.population}</td>
            </tr>
            <tr>
                <td>Total Area</td>
                <td>${(data.area / 1000000).toFixed(2)} million km²</td>
            </tr>
            <tr>
                <td>Currency</td>
                <td>Name: ${data.currencies[currency].name}, Symbol: ${
        data.currencies[currency].symbol
    }</td>
            </tr>
            <tr>
                <td>Languages</td>
                <td>${languages}</td>
            </tr>
            <tr>
                <td>Neighbours</td>
                <td>${data.borders || 'No neighbouring countries'}</td>
            </tr>
            <tr>
                <td>Timezone</td>
                <td>${data.timezones}</td>
            </tr>
        </tbody>
    `;

    countryTableEl.insertAdjacentHTML('beforeend', html);
};

const showResult = function (country) {
    const countryHeaderEl = document.querySelector('.country__header');
    const countryTableEl = document.querySelector('.country__info-table');
    const mainEl = document.getElementById('main');
    const errorContainerEl = document.querySelector('.error');

    if (countryHeaderEl.innerHTML !== '' && countryTableEl.innerHTML !== '') {
        countryHeaderEl.innerHTML = '';
        countryTableEl.innerHTML = '';
    }

    if (errorContainerEl !== null) {
        mainEl.removeChild(errorContainerEl);
    }

    getCountryData(country);
};
