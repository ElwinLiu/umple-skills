# What Umple Generates

## Attributes

| Modifier     | Ctor arg? | Getter       | Setter       | Other                              |
| ------------ | --------- | ------------ | ------------ | ---------------------------------- |
| (default)    | yes       | `getName()`  | `setName(v)` |                                    |
| `lazy`       | no        | `getName()`  | `setName(v)` | init to null/0/false               |
| `immutable`  | yes       | `getName()`  | —            |                                    |
| `const`      | —         | `getName()`  | —            | static final                       |
| `unique`     | yes       | `getName()`  | `setName(v)` | enforces uniqueness                |
| `autounique` | —         | `getName()`  | —            | auto-incremented int               |
| `defaulted`  | no        | `getName()`  | `setName(v)` | `resetName()` `getDefaultName()`   |
| `internal`   | no        | —            | —            |                                    |
| derived      | —         | `getName()`  | —            | computed from expression           |

`Boolean active` → `isActive()` not `getActive()`.

Multi-valued `String[] tags`:
`getTags()` · `getTag(i)` · `numberOfTags()` · `addTag(v)` · `removeTag(v)` · `hasTags()`

## Associations

For `1 -- * Course` on Person:

Many side (Person → Courses):
`getCourses()` · `getCourse(i)` · `numberOfCourses()` · `hasCourses()` · `addCourse(c)` · `removeCourse(c)` · `isNumberOfCoursesValid()`

One side (Course → Person):
`getPerson()` · `setPerson(p)`

Composition (`<@>-`): `delete()` cascades to children.

Sorted: `addCourse()` auto-sorts by specified attribute.

## State machines

For `sm` with states `Idle`, `Active`:
- `enum Sm { Idle, Active }`
- `getSm()` → current state
- `getSmFullName()` → string
- `boolean eventName()` → triggers transition, returns true if handled
- `boolean eventName(params)` → with parameters

Queued/pooled: `eventName()` enqueues and returns immediately. `delete()` stops thread.

## Constructor

Takes: non-lazy/non-const/non-autounique attributes + mandatory association partners (multiplicity `1` or `1..*`). Validates multiplicity constraints.

## delete()

Every class: breaks association links, cascades for compositions, stops state machine threads.

## Singleton

`class Config { singleton; }` → `static Config getInstance()`

## SQL output

`CREATE TABLE` per class · columns for attributes · `PRIMARY KEY` · `FOREIGN KEY` for associations · join tables for many-to-many · inheritance as FK to parent.

## Multi-file output

Files concatenated with `//%% NEW FILE ClassName BEGINS HERE %%` separators. Split on this marker.
