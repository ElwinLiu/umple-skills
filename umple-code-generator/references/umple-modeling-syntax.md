# Umple Modeling Syntax

## Table of contents

- [Classes](#classes) · [Attributes](#attributes) · [Associations](#associations)
- [Generalization](#generalization) · [Interfaces](#interfaces) · [Traits](#traits)
- [State machines](#state-machines) · [Enumerations](#enumerations) · [Keys](#keys)
- [Methods](#methods) · [Code injection](#code-injection) · [Derived attributes](#derived-attributes)
- [Constraints](#constraints) · [Namespace](#namespace) · [Dependencies](#dependencies)
- [Patterns](#patterns) · [Gotchas](#gotchas)

## Classes

```umple
class Person { String name; Integer age; }
class Shape { abstract; abstract Double area(); }
```

## Attributes

```umple
class Student {
  String name;                    // settable (default): ctor arg + setter
  firstName;                      // type defaults to String if omitted
  Boolean enrolled = false;       // with default
  lazy Date birthDate;            // no ctor arg, init to null/0/false
  immutable String id;            // ctor arg, no setter
  lazy immutable String token;    // no ctor arg, setter works once only
  const Integer MAX = 10;         // static final
  unique String email;            // unique across instances
  autounique uid;                  // auto-assigned int, read-only
  defaulted Integer level = 3;    // resetLevel() + getDefaultLevel()
  internal String cache;          // no getter/setter
  String[] tags;                  // multi-valued list
  Integer[] scores = {1, 2, 3};   // multi-valued with initializer
}
```

## Derived attributes

Computed, read-only — body is a target-language expression:
```umple
class Rectangle {
  Double width; Double height;
  Double area = { width * height }
}
```

Multi-language:
```umple
class Rectangle {
  Double width; Double height;
  Double area = Java { height * width } Python { self._height * self._width }
}
```

Delegation through associations:
```umple
class Flight { String number; }
class Booking {
  * -- 1 Flight;
  flightNumber = { getFlight().getNumber() }
}
```

## Associations

Inline:
```umple
class Student { * -- * Course; }
class Course { }
```

Independent:
```umple
class Student { }
class Course { }
association { * Student -- * Course; }
```

Navigability: `--` both · `->` left→right · `<-` right→left · `><` none

Multiplicity: `1` · `0..1` · `*` · `1..*` · `2..4` · `m..n`

```umple
class Course { }
class Advisor { }
class Publication { }
class Student {
  * -- * Course;                  // many-to-many
  1 -- 0..1 Advisor;             // one-to-optional
  0..1 -> * Publication;         // directed
}
```

Role names:
```umple
class Professor { }
class GraduateStudent { * -- 0..2 Professor supervisor; }
```

Composition:
```umple
class Wheel { }
class Vehicle { 0..1 <@>- 2..4 Wheel; }
```

Reflexive (must use role name or `self`):
```umple
class Employee { * -- 0..1 Employee manager; }
class Person { 0..* self friends; }
```

Sorted (sort key must be String, Integer, Double, Float, Long, or Short):
```umple
class Event { String startDate; }
class Schedule { 1 -- * Event sorted { startDate }; }
```

Association classes:
```umple
class Student { }
class Course { }
associationClass Enrollment {
  String grade;
  * Student;
  * Course;
}
```

External types:
```umple
external ExternalClass {}
class A { 1 -- 0..1 ExternalClass ref; }
```

### One association per class pair — never define from both sides.

## Generalization

```umple
class Person { String name; }
class Student { isA Person; Integer number; }
interface Employee { }
class TA { isA Student, Employee; }
```

Nesting form:
```umple
class Person { String name; class Student { Integer number; } }
```

## Interfaces

```umple
interface Drawable { void draw(); }
class Shape { isA Drawable; void draw() { /* impl */ } }
```

## Traits

```umple
trait Timestamped { Date createdAt; Date updatedAt; }
class Order { isA Timestamped; String orderNumber; }
```

With required methods:
```umple
trait Scorable {
  abstract Integer getScore();
  Boolean isPassing() { return getScore() >= 50; }
}
class Exam { isA Scorable; Integer score; Integer getScore() { return score; } }
```

Template parameters:
```umple
trait Comparable<T> { abstract Boolean compareTo(T other); }
class Student { isA Comparable<T = Student>; Boolean compareTo(Student other) { return true; } }
```

## State machines

Basic:
```umple
class Light { sm { On { off -> Off; } Off { on -> On; } } }
```

Guards, actions, entry/exit/do:
```umple
e [cond] / { action(); } -> S2;
Active {
  entry / { start(); }
  exit  / { stop(); }
  do { work(); }                      // long-running, own thread
}
```

Auto-transitions: `-> Next;` (fires after entry or do)

Timed: `after(5) -> Timeout;` · `afterEvery(1) -> Tick;`

Event params: `receive(String msg) [msg.length() > 0] -> Processing;`

Catch-all: `unspecified -> Error;`

Nested states (substates inherit parent transitions):
```umple
Operating {
  Phase1 { next -> Phase2; }
  Phase2 { next -> Phase3; }
  emergency -> Halted;
}
```

Concurrent regions:
```umple
Active {
  Region1 { S1 { e1 -> S2; } S2 { final R1Done {} } }
  ||
  Region2 { S3 { e2 -> S4; } S4 { final R2Done {} } }
}
```

History: `-> Normal.H;` (shallow) · `-> Normal.HStar;` (deep)

Finals: `-> Final;` (implicit) · `final Done {}` (named, multiple allowed)

Threading: `queued sm { ... }` · `pooled sm { ... }`

Standalone reuse:
```umple
statemachine M { S1 { e -> S2; } S2 {} }
class Device { conn as M; }
```

Active objects: `active { while(true) { work(); } }`

## Enumerations

```umple
enum Color { RED, GREEN, BLUE }
class Car { Color color; }
```

## Keys

```umple
class Student { String id; String name; key { id }; }
```

## Methods

```umple
class Calc {
  public Integer add(Integer a, Integer b) { return a + b; }
}
```

Multi-language:
```umple
void show() Java { System.out.println(name); } Python { print(self._name) }
```

## Code injection

Before/after generated methods:
```umple
class Person {
  name;
  before setName { if (aName == null) { return false; } }
  after constructor { log("Created " + name); }
}
```

Wildcards:
```umple
before set* { validate(); }           // all setters
before get*, !getCache { log(); }     // all getters except getCache
```

Before/after state machine events:
```umple
after startMotor { log("motor started"); }
```

## Constraints

```umple
class Client {
  Integer age;
  [age >= 18]
  [age <= 120]
}
```

Setters return `false` if violated. Constructors throw exception.

## Namespace

```umple
namespace school.admin;
class Faculty { }
```

## Dependencies

```umple
class Report { depend java.util.*; depend java.io.File; }
```

## Patterns

```umple
class Config { singleton; }           // static getInstance()
class Point { immutable; Float x; Float y; }  // no setters, no mutable associations
```

Immutable constraints: superclasses must also be immutable, no state machines, associations only to other immutable classes.

## Gotchas

- One association per class pair — duplicate = compile error
- Reflexive associations need role name or `self` keyword
- `Final` (capital) is reserved — cannot name a state `Final`
- State machine cannot be named `Timer`
- Immutable class cannot associate with mutable class
- Same event name must have same parameter types everywhere
- `queued`/`pooled` event methods are void (they queue, not execute)
- `autounique` takes no type — just `autounique name;`, not `autounique Integer name;`
- Sorted association key must be String, Integer, Double, Float, Long, or Short (not Date)
- Multiple inheritance only works if all but one parent are interfaces or traits
