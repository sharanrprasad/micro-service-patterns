
// A small note about constructors.
class Dog {
    constructor(public name:string) {
    }
}

console.log(Dog.constructor ===  new Dog("mojo").constructor); //false
// Here Dog.constructor refers to the Function constructor because Dog is considered a function.
// Function constructors are used to create functions. Example below
const dummy = new Function('a','b','return a + b')
console.log(dummy(2,3))

// The above constructor is what we get when we do Dog.constructor.

// In the object the constructor is equal to the Dog class.
console.log(new Dog('mojo').constructor === Dog); //true;

// Defining the Typescript type for constructor function / class.

// This is how we declare the constructor type which basically equal to the class itself.
type DogClass= new (name:string) => any

// Using this type we can assign a class to a variable.
// @ts-ignore
const DogClassReference: DogClass = Dog;


// Decorators are functions which can modify the original function or class. There are different types. Here we will checkout Class decorators.

// Class decorators - The constructor of a class is passed as the argument to this function.
// It takes the constructor and can either modify it or return a new one.


type AllClass<T> = {new (...args: any[]): T}

// Below is an example of a class decorator which adds a new method to the Cat class.

function GetNameDecorator<T>(constructor: AllClass<T>): void {
    constructor.prototype.getCatType = function () {
        return 'I am the type';
    }
    // Here we can also return a new constructor function altogether. If returned that will replace the original constructor.
    // That's how dependency injection can inject singletons to our constructor.
}

@GetNameDecorator
class Cat {
 constructor(public name:string) {
 }

}

const cat:any = new Cat('hell');
console.log(cat.getCatType())


// Some more play with tsyringe.

// @singleton()
// class Test1 {
//     constructor(public name:string) {
//     }
// }
//
//
// @singleton()
// class Test2 {
//     constructor(public test1:Test1) {
//     }
// }
// container.registerInstance(Test1, new Test1('hello'));
// const test2 = container.resolve<Test2>(Test2);
// console.log(test2.test1.name)



