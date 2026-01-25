import { City, State } from "country-state-city";

const states = State.getStatesOfCountry("IN");
const karnataka = states.find(s => s.name.toLowerCase() === "karnataka");

if (karnataka) {
  const cities = City.getCitiesOfState("IN", karnataka.isoCode);
  const bengaluru = cities.find(c => c.name.toLowerCase() === "bengaluru");
  console.log("Bengaluru exists:", !!bengaluru);
  
  const bangalore = cities.find(c => c.name.toLowerCase() === "bangalore");
  console.log("Bangalore exists:", !!bangalore);
}
