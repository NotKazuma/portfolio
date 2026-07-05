document.addEventListener("DOMContentLoaded", () => {
  const currencySelector = document.getElementById("currency-selector");
  if (!currencySelector) return;

  const priceElements = document.querySelectorAll(".price-value");
  if (priceElements.length === 0) return;

  // Base currency is MYR
  let rates = { MYR: 1 };

  // Helper to get currency symbol robustly
  function getCurrencySymbol(currencyCode) {
    try {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
      const parts = formatter.formatToParts(0);
      const symbolPart = parts.find(part => part.type === 'currency');
      return symbolPart ? symbolPart.value : currencyCode;
    } catch (e) {
      console.warn(`Could not get symbol for currency: ${currencyCode}`);
      return currencyCode;
    }
  }

  // Fetch live exchange rates from a reliable API
  async function fetchExchangeRates() {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/MYR");
      if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

      const data = await response.json();
      if (data.result !== "success") throw new Error("API returned an error.");

      rates = data.rates;

      // Dynamically populate the select menu with sorted currencies
      const sortedCurrencies = Object.keys(rates).sort();
      currencySelector.innerHTML = ""; // Clear existing options

      sortedCurrencies.forEach(currency => {
        const option = document.createElement("option");
        option.value = currency;
        option.textContent = `${currency} (${getCurrencySymbol(currency)})`;
        currencySelector.appendChild(option);
      });

      // Set default selection to USD or a fallback
      currencySelector.value = rates.USD ? 'USD' : 'MYR';

      // Trigger initial conversion
      convertPrices(currencySelector.value);

    } catch (error) {
      console.error("Failed to fetch exchange rates:", error);
      // Optionally, hide the selector if rates can't be fetched
      currencySelector.style.display = 'none';
    }
  }

  // Convert and update prices in the DOM
  function convertPrices(targetCurrency) {
    const rate = rates[targetCurrency];
    if (!rate) return; // Exit if the rate for the target currency isn't available

    const symbol = getCurrencySymbol(targetCurrency);

    priceElements.forEach(el => {
      const basePriceMYR = parseFloat(el.getAttribute("data-myr"));
      if (isNaN(basePriceMYR)) return;

      const convertedPrice = basePriceMYR * rate;
      const formattedPrice = Math.round(convertedPrice).toLocaleString();

      el.textContent = `${symbol} ${formattedPrice}`;
    });
  }

  // Event Listener for currency changes
  currencySelector.addEventListener("change", (e) => {
    if (e.target) convertPrices(e.target.value);
  });

  // Initialize
  fetchExchangeRates();
});
