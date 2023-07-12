function filterObjectsByKeywords(objectArray, filterKeywords) {
  return objectArray.filter((object) => {
    for (let keyword of filterKeywords) {
      if (
        !Object.values(object).some((value) => String(value).includes(keyword))
      ) {
        return false;
      }
    }
    return true;
  });
}

// Example object array
const objects = [
  { id: 1, name: "John", age: 25, city: "New York" },
  { id: 2, name: "Jane", age: 30, city: "London" },
  { id: 3, name: "Bob", age: 22, city: "Paris" },
  { id: 4, name: "Alice", age: 27, city: "Tokyo" },
];

// Example filter keyword array
const keywords = ["", "", "", ""];

// Filter objects based on keywords
const filteredObjects = filterObjectsByKeywords(objects, keywords);

// Output the filtered objects
console.log(filteredObjects);
