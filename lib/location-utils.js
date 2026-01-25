import { City, State } from "country-state-city";

export function createLocationSlug(city, state) {
  if (!city && !state) return "";

  const parts = [city, state]
    .filter(Boolean)
    .map((part) =>
      part
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    );

  return parts.join("--");
}

const CITY_ALIASES = {
  bangalore: "Bengaluru",
  // gurgaon: "Gurugram", // Library uses Gurgaon
  // Add more as needed
};

export function parseLocationSlug(slug) {
  if (!slug) return { city: null, state: null, isValid: false };

  // Helper to capitalize words
  const capitalize = (str) =>
    str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Helper to validate city/state combo
  const validateCityState = (cityName, stateName) => {
    // Check aliases
    const normalizedCity = CITY_ALIASES[cityName.toLowerCase()] || cityName;

    // Find state (India specific)
    const states = State.getStatesOfCountry("IN");
    const stateObj = states.find(
      (s) => s.name.toLowerCase() === stateName.toLowerCase()
    );

    if (!stateObj) return false;

    // Validate city
    const cities = City.getCitiesOfState("IN", stateObj.isoCode);
    const cityExists = cities.some(
      (c) => c.name.toLowerCase() === normalizedCity.toLowerCase()
    );

    return cityExists ? normalizedCity : false;
  }

  // Strategy 1: Double Hyphen (Preferred)
  if (slug.includes("--")) {
    const parts = slug.split("--");
    if (parts.length >= 2) {
      const city = capitalize(parts[0]);
      const state = capitalize(parts.slice(1).join(" "));
      const validatedCity = validateCityState(city, state);
      if (validatedCity) {
         return { city: validatedCity, state, isValid: true };
      }
    }
  }

  // Strategy 2: Single Hyphen (Fallback)
  const parts = slug.split("-");
  if (parts.length >= 2) {
    // Try all split positions
    for (let i = 1; i < parts.length; i++) {
        const cityPart = parts.slice(0, i).join("-");
        const statePart = parts.slice(i).join("-");
        
        const city = capitalize(cityPart);
        const state = capitalize(statePart);

        const validatedCity = validateCityState(city, state);
        if (validatedCity) {
            return { city: validatedCity, state, isValid: true };
        }
    }
  }

  return { city: null, state: null, isValid: false };
}
