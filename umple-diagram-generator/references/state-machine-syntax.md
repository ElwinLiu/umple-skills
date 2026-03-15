# Umple State Machine Syntax

## Basic

```umple
class Light {
  sm {
    On  { off -> Off; }
    Off { on  -> On;  }
  }
}
```

First state is initial. Transitions: `event -> Target;` (semicolon required).

## Guards and actions

```umple
e [cond] / { action(); } -> S2;       // guard + action
e -> / { action(); } S2;              // action after arrow (same effect)
```

## Entry, exit, do

```umple
Active {
  entry / { startMotor(); }           // on entering state
  exit  / { stopMotor(); }            // on leaving state
  do { performWork(); }               // long-running, own thread, interrupted on exit
}
```

## Auto-transitions (eventless)

```umple
Processing {
  do { compute(); }
  -> Done;                            // fires after do completes
  [failed] -> Error;                  // guarded
}
```

## Timed transitions

```umple
Idle   { after(5) -> Timeout; }                       // after 5 seconds
Active { afterEvery(1) / { tick(); } -> Active; }     // every 1 second
```

## Event parameters

```umple
Waiting { receive(String msg) [msg.length() > 0] -> Processing; }
```

Same event name → same parameter types everywhere.

## Unspecified (catch-all)

```umple
Running { unspecified -> Error; }
```

## Nested states

```umple
sm {
  Operating {
    Phase1 { next -> Phase2; }
    Phase2 { next -> Phase3; }
    Phase3 { done -> Final; }
    emergency -> Halted;              // handled in any substate
  }
  Halted { reset -> Operating; }
}
```

Substates inherit parent transitions. Substate transitions take precedence.

## Concurrent regions

```umple
Active {
  Motor {
    Running { stop -> Stopped; }
    Stopped { start -> Running; }
    final MotorDone {}
  }
  ||
  Display {
    Showing { hide -> Hidden; }
    Hidden  { show -> Showing; }
    final DisplayDone {}
  }
}
```

Parent completes when ALL regions reach final.

## History states

```umple
Normal {
  Phase1 { done -> Phase2; }
  Phase2 { done -> Phase3; }
  Phase3 {}
  interrupt -> Paused;
}
Paused {
  resume -> Normal.H;                 // last active substate
  deepResume -> Normal.HStar;         // deepest nested substate
}
```

## Final states

```umple
go -> Final;                          // implicit final (capital F, reserved name)
final Done {}                         // named final (multiple allowed)
final Failed {}
```

**`Final` is reserved** — never use it as a custom state name. Use `Done`, `Completed`, etc. instead.

## Queued and pooled

```umple
queued sm { ... }                     // FIFO, events processed in order
pooled sm { ... }                     // may skip to a handleable event
```

## Active objects

```umple
class Worker {
  active { while (true) { doWork(); Thread.sleep(1000); } }
}
```

## Standalone reuse

```umple
statemachine Protocol { S1 { e -> S2; } S2 { f -> S1; } }
class DeviceA { conn as Protocol; }
class DeviceB { conn as Protocol {
  cancel S1 -> S2;                    // extend on reuse
  NewState { g -> S1; }
}; }
```

## Complete example

```umple
class GarageDoor {
  Boolean clear = true;

  queued status {
    Closed {
      entry / { stopMotor(); }
      pressButton -> Opening;
    }
    Opening {
      entry / { runMotorForward(); }
      reachTop -> Open;
      pressButton -> StoppedOpening;
    }
    Open {
      entry / { stopMotor(); }
      pressButton [getClear()] -> Closing;
      after(300) -> Closing;
    }
    Closing {
      entry / { runMotorReverse(); }
      reachBottom -> Closed;
      pressButton -> Opening;
      [!getClear()] -> Opening;
    }
    StoppedOpening {
      entry / { stopMotor(); }
      pressButton -> Closing;
    }
  }
}
```
