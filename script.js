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

function fetchCountries() {
    const input = document.getElementById("countrySearch");
    const dropdown = document.getElementById("countryDropdown");
    let countryList = [];

    fetch("https://restcountries.com/v3.1/all")
        .then((res) => res.json())
        .then((data) => {
            countryList = data
                .map((c) => c.name.common)
                .sort((a, b) => a.localeCompare(b));
        });

    input.addEventListener("focus", () => showDropdown(""));

    input.addEventListener("input", (e) => showDropdown(e.target.value));

    function showDropdown(filter) {
        dropdown.innerHTML = "";
        const filtered = countryList.filter((country) =>
            country.toLowerCase().includes(filter.toLowerCase()),
        );

        if (filtered.length === 0) {
            dropdown.classList.remove("show");
            return;
        }

        filtered.forEach((country) => {
            const item = document.createElement("button");
            item.type = "button";
            item.className = "dropdown-item";
            item.textContent = country;
            item.addEventListener("click", () => {
                input.value = country;
                dropdown.classList.remove("show");
            });
            dropdown.appendChild(item);
        });

        dropdown.classList.add("show");
    }

    const container = document.getElementById("countryContainer");

    document.addEventListener("click", (e) => {
        if (!container.contains(e.target)) {
            dropdown.classList.remove("show");
        }
    });
}

function getCountryByIP() {
    fetch("https://get.geojs.io/v1/ip/geo.json")
        .then((response) => response.json())
        .then((data) => {
            const country = data.country;
            const input = document.getElementById("countrySearch");

            input.value = country;

            const event = new Event("input");
            input.dispatchEvent(event);

            getCountryCode(country);
        })
        .catch((error) => {
            console.error("Błąd pobierania danych z serwera GeoJS:", error);
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
    fetchCountries();
    handleShortcuts();
    setupValidation();
    handleVat();
});
