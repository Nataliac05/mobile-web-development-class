// Week 7 coding exercise: a Person object created with the new operator.

function Person(name, age, pets) {
    this.name = name;
    this.age = age;
    this.pets = pets || [];

    this.doYouHavePets = function () {
        return this.pets.length > 0;
    };
}

const petLover = new Person("Katniss", 17, ["Buttercup the cat"]);
const petFree = new Person("Tris", 16);

console.log(`${petLover.name} has pets: ${petLover.doYouHavePets()}`); // true
console.log(`${petFree.name} has pets: ${petFree.doYouHavePets()}`);   // false
