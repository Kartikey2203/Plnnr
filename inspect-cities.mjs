import { City, State } from "country-state-city";

const states = State.getStatesOfCountry("IN");
const karnataka = states.find(s => s.name.toLowerCase() === "karnataka");

if (karnataka) {
  console.log("Karnataka ISO:", karnataka.isoCode);
  const cities = City.getCitiesOfState("IN", karnataka.isoCode);
  console.log("Cities in Karnataka:", cities.map(c => c.name).filter(n => n.startsWith("B")));
} else {
  console.log("Karnataka not found");
}
