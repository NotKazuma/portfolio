document.addEventListener("DOMContentLoaded", () => {
  const currencySelector = document.getElementById("currency-selector");
  if (!currencySelector) return;

  const priceElements = document.querySelectorAll(".price-value");
  
  // Base currency is MYR
  let rates = { MYR: 1 };
  
  // Helper to get currency symbol
  function getCurrencySymbol(currencyCode) {
    try {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
      // Extract just the symbol part by formatting 0 and replacing numbers
      const parts = formatter.formatToParts(0);
      const symbolPart = parts.find(part => part.type === 'currency');
      return symbolPart ? symbolPart.value : currencyCode;
    } catch (e) {
      return currencyCode;
    }
  }

  // Fetch live exchange rates using ExchangeRate-API
  async function fetchExchangeRates() {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/MYR");
      const data = await response.json();
      
      if (data.result === "success") {
        rates = data.rates;
        
        // Dynamically populate the select with all currencies
        const sortedCurrencies = Object.keys(rates).sort();
        
        // Clear existing options (keep the default ones if you want, but better to clear)
        currencySelector.innerHTML = "";
        
        sortedCurrencies.forEach(currency => {
          const option = document.createElement("option");
          option.value = currency;
          option.text = `${currency} (${getCurrencySymbol(currency)})`;
          if (currency === "USD") {
            option.selected = true;
          }
          currencySelector.appendChild(option);
        });

        // Trigger initial conversion
        convertPrices(currencySelector.value);
      }
    } catch (error) {
      console.error("Failed to fetch exchange rates:", error);
    }
  }

  // Convert and update prices in DOM
  function convertPrices(targetCurrency) {
    const rate = rates[targetCurrency];
    const symbol = getCurrencySymbol(targetCurrency);

    if (!rate) return; // If API failed, keep default

    priceElements.forEach(el => {
      const basePriceMYR = parseFloat(el.getAttribute("data-myr"));
      
      if (!isNaN(basePriceMYR)) {
        let convertedPrice = basePriceMYR * rate;
        let formattedPrice = Math.round(convertedPrice).toLocaleString();
        
        // Some symbols have spaces, some don't. We'll just separate them with a space for clarity.
        el.innerText = `${symbol} ${formattedPrice}`;
      }
    });
  }

  // Event Listener
  currencySelector.addEventListener("change", (e) => {
    convertPrices(e.target.value);
  });

  // Initialize
  fetchExchangeRates();
});
