let clickCount = 0;

const countryInput = document.getElementById("country");
const myForm = document.getElementById("form");
const modal = document.getElementById("form-feedback-modal");
const clicksInfo = document.getElementById("click-count");

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

function getCountryCode(countryName) {
    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
        .then((res) => res.json())
        .then((data) => {
            const code = data[0].idd.root + data[0].idd.suffixes[0];
            document.getElementById("countryCode").value = code;
        })
        .catch(console.error);
}

let allCountries = [];

function fillCountryList(selectedCountry = null) {
    fetch("https://restcountries.com/v3.1/all")
        .then((res) => res.json())
        .then((data) => {
            allCountries = data
                .map((c) => c.name.common)
                .sort((a, b) => a.localeCompare(b));

            if (selectedCountry) {
                document.getElementById("countrySearch").value = selectedCountry;
                document.getElementById("selectedCountry").value = selectedCountry;
            }

            renderDropdown(allCountries);
        });
}

function renderDropdown(filteredCountries) {
    const dropdown = document.getElementById("countriesDropdown");
    dropdown.innerHTML = "";

    if (filteredCountries.length === 0) {
        dropdown.classList.remove("show");
        return;
    }

    filteredCountries.forEach((name) => {
        const item = document.createElement("li");
        item.className = "dropdown-item";
        item.textContent = name;
        item.style.cursor = "pointer";
        item.addEventListener("click", () => {
            document.getElementById("countrySearch").value = name;
            document.getElementById("selectedCountry").value = name;
            dropdown.innerHTML = "";
            dropdown.classList.remove("show");
        });
        dropdown.appendChild(item);
    });

    dropdown.classList.add("show");
}

function getCountryByIP() {
    fetch("https://get.geojs.io/v1/ip/geo.json")
        .then((response) => response.json())
        .then((data) => {
            const country = data.country;
            fillCountryList(country);
        })
        .catch((error) => {
            console.error("Błąd pobierania danych z serwera GeoJS:", error);
            fillCountryList();
        });
}

function handleShortcuts() {
    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            document.getElementById("form").requestSubmit();
        }
        // Dodaj inne skróty np. Alt+S do wysyłania
        if (e.altKey && e.key.toLowerCase() === "s") {
            e.preventDefault();
            document.getElementById("form").requestSubmit();
        }
    });
}

function setupValidation() {
    const form = document.getElementById("form");
    form.addEventListener(
        "submit",
        (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add("was-validated");
        },
        false,
    );
}

function handleVat() {
    const vatCheckbox = document.getElementById("vatUE");
    const vatFields = document.getElementById("vat-fields");

    vatCheckbox.addEventListener("change", () => {
        vatFields.style.display = vatCheckbox.checked ? "block" : "none";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", handleClick);
    getCountryByIP();
    handleShortcuts();
    setupValidation();
    handleVat();

    document.getElementById("countrySearch").addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allCountries.filter((name) =>
            name.toLowerCase().includes(query),
        );
        renderDropdown(filtered);
    });

    document.addEventListener("click", (e) => {
        const dropdown = document.getElementById("countriesDropdown");
        if (!document.getElementById("countrySearch").contains(e.target)) {
            dropdown.innerHTML = "";
        }
    });
});
