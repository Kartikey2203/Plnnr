import { City, State } from "country-state-city";

const states = State.getStatesOfCountry("IN");
const haryana = states.find(s => s.name.toLowerCase() === "haryana");

if (haryana) {
  const cities = City.getCitiesOfState("IN", haryana.isoCode);
  const gurugram = cities.find(c => c.name.toLowerCase() === "gurugram");
  const gurgaon = cities.find(c => c.name.toLowerCase() === "gurgaon");
  
  console.log("Gurugram exists:", !!gurugram);
  console.log("Gurgaon exists:", !!gurgaon);
} else {
  console.log("Haryana not found");
}
