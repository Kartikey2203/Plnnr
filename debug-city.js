const { State, City } = require("country-state-city");
const fs = require("fs");

const indianStates = State.getStatesOfCountry("IN");
const goaState = indianStates.find(s => s.name === "Goa");
const goaCities = City.getCitiesOfState("IN", goaState?.isoCode || "");

const allCities = City.getAllCities();
const goaInCities = allCities.filter(c => c.name.toLowerCase().includes("goa") && c.countryCode === "IN");

const output = {
  goaState,
  goaCities: goaCities.slice(0, 10),
  goaInCities
};

fs.writeFileSync("city-debug.json", JSON.stringify(output, null, 2));
