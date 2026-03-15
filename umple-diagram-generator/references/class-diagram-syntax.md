# Umple Class Diagram Syntax

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
  Boolean enrolled = false;       // with default value
  lazy Date birthDate;            // no ctor arg, init to null/0/false
  immutable String id;            // ctor arg, no setter
  const Integer MAX = 10;         // static final constant
  unique String email;            // unique across instances
  autounique uid;                  // auto-assigned sequential int, read-only
  defaulted Integer level = 3;    // resetLevel() + getDefaultLevel()
  internal String cache;          // no getter/setter
  String[] tags;                  // multi-valued list
  Integer[] scores = {1, 2, 3};   // multi-valued with initializer
  // Double area = { width * height }  // derived: computed, read-only
}
```

## Associations

Inline (inside class):
```umple
class Student { * -- * Course; }
class Course { }
```

Independent (outside any class):
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
  0..1 -> * Publication;         // directed (one-way)
}
```

Role names (required for multiple links between same classes):
```umple
class Professor { }
class GraduateStudent { * -- 0..2 Professor supervisor; }
```

Composition — parent owns children, delete cascades:
```umple
class Wheel { }
class Vehicle { 0..1 <@>- 2..4 Wheel; }
```

Reflexive — must use role name or `self`:
```umple
class Employee { * -- 0..1 Employee manager; }
class Person { 0..* self friends; }
```

Sorted — maintained in order:
```umple
class Event { String startDate; }
class Schedule { 1 -- * Event sorted { startDate }; }
```

Association classes — data on a many-to-many link:
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

### One association per class pair

Never define the same relationship from both sides — Umple error.

```umple
// WRONG
class A { * -- 0..1 B; }
class B { 1 -- 1 A; }

// CORRECT
class A { * -- 0..1 B; }
class B { }
```

## Generalization

```umple
class Person { String name; }
class Student { isA Person; Integer number; }
interface Employee { }
class TA { isA Student, Employee; }
```

Nesting form (same effect as `isA`):
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

With template parameters:
```umple
trait Comparable<T> { abstract Boolean compareTo(T other); }
class Student { isA Comparable<T = Student>; Boolean compareTo(Student other) { return true; } }
```

## Enumerations

```umple
enum Color { RED, GREEN, BLUE }
class Car { Color color; }
```

## Keys

```umple
class Student { String id; String name; key { id }; }
```

## Namespace

```umple
namespace school.admin;
class Faculty { }
```

## Patterns

```umple
class Config { singleton; }
class Point { immutable; Float x; Float y; }
```
