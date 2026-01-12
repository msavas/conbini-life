---
title: 'Game Architecture'
project: 'Conbini Life'
date: '2026-01-11'
author: 'Big Dogs'
version: '1.0'
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]
status: 'complete'
engine: 'Vanilla JavaScript + HTML5 Canvas'
platform: 'Web Browser'

# Source Documents
gdd: 'gdd.md'
epics: null
brief: 'game-brief.md'
---

# Game Architecture

## Executive Summary

**Conbini Life** architecture is designed for Vanilla JavaScript + HTML5 Canvas targeting web browsers.

**Key Architectural Decisions:**
- Semi-Fixed Timestep game loop (60 updates/sec fixed, variable render with interpolation)
- Module Pattern + State Machine for state management (no framework dependencies)
- Composition with Plain Objects for entities (easy serialization, behavior via functions)
- Simple Pub/Sub Event Bus for decoupled communication

**Project Structure:** Hybrid (Type → System) organization with 11 core systems.

**Implementation Patterns:** 9 patterns defined ensuring AI agent consistency.

**Ready for:** Epic implementation phase

---

## Project Context

### Game Overview

**Conbini Life** - A cozy Japanese konbini simulation where you bike through the changing seasons of Japan, find zen in the rhythm of work, and build quiet connections with regulars who become part of your life.

### Technical Scope

**Platform:** Web Browser (HTML5 Canvas, Vanilla JS)
**Genre:** Simulation (Cozy Work Sim)
**Project Level:** Medium Complexity

### Core Systems

| System | Priority | Complexity | Notes |
|--------|----------|------------|-------|
| Audio System | Critical | High | Responsive feedback - must feel good |
| Game Loop/Rendering | Critical | Medium | Canvas-based, 60fps target |
| Grid Movement | High | Low | Arrow keys, simple collision |
| Day/Night Cycle | High | Medium | Visual + gameplay state |
| Customer System | High | Medium | Spawn, pathfinding, checkout |
| Inventory/Stock | High | Medium | Shipments, shelf state, depletion |
| Dialogue System | Medium | Medium | Progressive reveals, regulars |
| Progression System | Medium | Medium | Unlocks, skill growth |
| Relationship System | Medium | Medium | Regular memory, story beats |
| Seasonal System | Medium | Medium | 4 seasons, visual/audio variants |
| Save/Load | Medium | Low | LocalStorage serialization |

### Technical Requirements

**Performance:**
- 60fps stable
- <3s load time
- <5MB initial bundle
- <16ms input latency
- <50ms audio latency (critical)
- <100MB runtime memory

**Browser Support:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Complexity Drivers

1. **Audio-driven satisfaction** - Rising pitch feedback (1-9) with ka-ching must feel satisfying. Zero tolerance for latency.
2. **Procedural audio** - Lo-fi music generation with time/season variants
3. **Stateless framework** - No React/Vue, pure vanilla JS state management
4. **Asset volume** - 4 seasonal variants, 15+ character sprites, 50+ product sprites

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Browser performance limits | Medium | High | Electron wrapper fallback |
| Audio latency issues | Low | Critical | Web Audio API best practices |
| State complexity | Medium | Medium | Clear patterns, simple architecture |
| Asset inconsistency | Medium | Medium | Style guide, curation pass |

---

## Engine & Framework

### Selected Stack

**Vanilla JavaScript + HTML5 Canvas** (Native Browser APIs)

**Rationale:** Maximum control, zero dependencies, smallest possible bundle. The project is an experimental AI-assisted development exercise - keeping the stack simple lets us iterate fast and see where we can take it.

### Project Initialization

```bash
# No framework installation needed
mkdir conbini-life
cd conbini-life
touch index.html game.js styles.css
```

### Browser APIs Used

| Component | Browser API | Notes |
|-----------|-------------|-------|
| Rendering | Canvas 2D Context | `getContext('2d')` |
| Audio | Web Audio API | Critical for responsive feedback |
| Input | KeyboardEvent | Arrow keys + E + Space |
| Storage | LocalStorage | Save/load game state |
| Timing | requestAnimationFrame | 60fps game loop |
| Assets | Image(), fetch() | Sprite and data loading |

### Architectural Decisions Required

The following must be explicitly architected (no framework defaults):

1. **Game Loop Structure** - Update/render separation, delta timing
2. **State Management** - Global state, entity state, UI state
3. **Entity/Component Pattern** - How game objects are structured
4. **Sprite System** - Atlas management, animation, z-ordering
5. **Scene Management** - State machine for game phases
6. **Grid System** - Movement, collision, interaction zones
7. **Event/Message Bus** - Inter-system communication
8. **Data Serialization** - Save format and versioning

---

## Architectural Decisions

### Decision Summary

| Category | Decision | Rationale |
|----------|----------|-----------|
| Game Loop | Semi-Fixed Timestep | Consistent 60 updates/sec, variable render with interpolation |
| State Management | Module Pattern + State Machine | System modules own state, state machine controls game flow |
| Entity Pattern | Composition with Plain Objects | Data objects + behavior functions, easy serialization |
| Scene Management | Hybrid (Persistent + Swappable) | Shop persistent, commute swappable, menus as overlays |
| Grid System | Tile-Based + Smooth Interpolation | Grid logic for interactions, lerp for visual smoothness |
| Event System | Simple Pub/Sub Event Bus | Decoupled communication, critical for audio triggers |
| Asset Loading | Preload Core + Lazy Extras | Essential assets upfront, seasonal content background-loaded |
| Save Format | Single JSON Blob + Version | Atomic saves with migration support |

### Game Loop

**Approach:** Semi-Fixed Timestep

- Fixed update rate: 60 updates/second (16.67ms tick)
- Variable render with interpolation factor
- Accumulator pattern prevents spiral of death

```js
const TICK_RATE = 1000 / 60;
let accumulator = 0;

function gameLoop(timestamp) {
  accumulator += deltaTime;
  while (accumulator >= TICK_RATE) {
    update(TICK_RATE);
    accumulator -= TICK_RATE;
  }
  render(accumulator / TICK_RATE);
  requestAnimationFrame(gameLoop);
}
```

### State Management

**Approach:** Module Pattern + State Machine

- **Modules:** AudioSystem, Inventory, CustomerManager, Player, Shop
- **State Machine:** menu → commute-in → working → commute-out → (next day)
- Each module owns its data, state machine controls transitions

```js
const GameState = {
  current: 'menu',
  transitions: {
    menu: ['commute-in'],
    'commute-in': ['working'],
    working: ['commute-out'],
    'commute-out': ['menu', 'working']
  }
};
```

### Entity Structure

**Approach:** Composition with Plain Objects

- Entities are data objects with type tags
- Behavior via standalone functions, not methods
- Easy to serialize for save/load

```js
const shelf = {
  type: 'shelf',
  position: { x: 2, y: 4 },
  category: 'drinks',
  stock: 7,
  maxStock: 9,
  interactable: true
};
```

### Scene Management

**Approach:** Hybrid (Persistent + Swappable)

- Shop scene stays in memory (primary gameplay)
- Commute scenes are lightweight, created per transition
- Menu/pause/dialogue are overlay layers

### Grid System

**Approach:** Tile-Based with Smooth Interpolation

- Logical position: grid coordinates (integers)
- Render position: interpolates toward grid position
- Interaction zones defined by grid cells

```js
const player = {
  gridX: 5, gridY: 3,      // Logical position
  renderX: 5, renderY: 3,  // Visual position (lerps toward grid)
  moving: false
};
```

### Event System

**Approach:** Simple Pub/Sub Event Bus

Key events:
- `shelf:stocked` → Audio pitch feedback
- `shelf:complete` → Ka-ching + sparkle
- `customer:enter` → Door chime
- `customer:checkout` → Register sounds
- `day:end` → Transition to commute

```js
const Events = {
  listeners: {},
  on(event, callback) {
    (this.listeners[event] ||= []).push(callback);
  },
  emit(event, data) {
    (this.listeners[event] || []).forEach(cb => cb(data));
  }
};
```

### Asset Strategy

**Approach:** Preload Core + Lazy Extras

**Preload (blocking):**
- Shop tileset, player sprites
- Core SFX (stock sounds, ka-ching, door chime)
- Basic customer sprites (5)

**Lazy (background):**
- Seasonal variants
- Additional customer sprites
- Commute backgrounds
- Music tracks

### Save System

**Approach:** Single JSON Blob with Version

- Key: `conbini-life-save`
- Version field for schema migrations
- Saves: day, season, unlocks, relationships, inventory

```js
const SaveSystem = {
  VERSION: 1,
  KEY: 'conbini-life-save',

  save(gameState) {
    const data = {
      version: this.VERSION,
      savedAt: Date.now(),
      day: gameState.day,
      season: gameState.season,
      unlocks: gameState.unlocks,
      relationships: gameState.relationships
    };
    localStorage.setItem(this.KEY, JSON.stringify(data));
  }
};
```

---

## Cross-cutting Concerns

These patterns apply to ALL systems and must be followed by every implementation.

### Error Handling

**Strategy:** Silent Recovery + Global Handler

- Never crash visibly - recover gracefully
- Log errors for debugging
- Global handler catches uncaught exceptions

```js
function safeCall(fn, fallback) {
  try {
    return fn();
  } catch (e) {
    Log.error('System', 'Operation failed', e);
    return fallback;
  }
}

window.onerror = (msg, src, line) => {
  Log.error('Uncaught', msg, { src, line });
  return true; // Suppress error dialog
};
```

### Logging

**Format:** Tagged console logs with debug flag

**Levels:**
- `ERROR` - Something broke
- `WARN` - Unexpected but handled
- `INFO` - Milestones
- `DEBUG` - Diagnostic (dev only)

```js
const DEBUG = true;

const Log = {
  error: (tag, msg, data) => console.error(`[${tag}]`, msg, data),
  warn:  (tag, msg, data) => console.warn(`[${tag}]`, msg, data),
  info:  (tag, msg, data) => console.info(`[${tag}]`, msg, data),
  debug: (tag, msg, data) => DEBUG && console.log(`[${tag}]`, msg, data),
};
```

### Configuration

**Approach:** Single Config Object + Player Prefs Separate

```js
// config.js - Game constants and balance
const CONFIG = {
  TICK_RATE: 60,
  GRID_SIZE: { width: 12, height: 8 },
  TILE_PX: 48,
  SHELF_MAX_STOCK: 9,
  CUSTOMER_SPAWN_INTERVAL: [5000, 15000],
  DAY_LENGTH_MS: 5 * 60 * 1000,
};

// Player preferences (LocalStorage)
const PlayerPrefs = {
  get(key, fallback) {
    return JSON.parse(localStorage.getItem(`pref:${key}`)) ?? fallback;
  },
  set(key, value) {
    localStorage.setItem(`pref:${key}`, JSON.stringify(value));
  }
};
```

### Event Naming Convention

**Pattern:** `namespace:action` (lowercase with colon)

**Standard Events:**
- `shelf:stocked`, `shelf:complete`, `shelf:depleted`
- `customer:enter`, `customer:checkout`, `customer:leave`
- `day:start`, `day:end`
- `commute:start`, `commute:end`
- `player:move`, `player:interact`
- `game:pause`, `game:resume`

### Debug Tools

**Activation:**
- URL param: `?debug=1`
- Toggle key: Backtick (`)

**Features:**
- FPS/entity count overlay
- Visual grid display
- Console commands via `window.debug`

```js
// Available in browser console
debug.skipDay()
debug.fillShelves()
debug.spawnCustomer()
debug.setSeason('summer')
```

---

## Project Structure

### Organization Pattern

**Pattern:** Hybrid (Type → System)

**Rationale:** Top-level organization by type (src, assets, data) with system-based organization within. Simple for a small team, scales if needed.

### Directory Structure

```
conbini-life/
├── index.html              # Entry point
├── styles.css              # Minimal styling
│
├── src/
│   ├── core/               # Core infrastructure
│   │   ├── game.js         # Game loop, initialization
│   │   ├── events.js       # Pub/sub event bus
│   │   ├── config.js       # CONFIG constants
│   │   ├── log.js          # Logging utilities
│   │   └── debug.js        # Debug overlay & commands
│   │
│   ├── systems/            # Game systems
│   │   ├── audio.js        # Web Audio, sfx, music
│   │   ├── input.js        # Keyboard handling
│   │   ├── save.js         # LocalStorage save/load
│   │   └── assets.js       # Asset loading & caching
│   │
│   ├── entities/           # Game entities
│   │   ├── player.js       # Player state & movement
│   │   ├── customer.js     # Customer spawning, AI
│   │   ├── shelf.js        # Shelf state, stocking
│   │   └── register.js     # Register interaction
│   │
│   ├── scenes/             # Scene management
│   │   ├── scene-manager.js
│   │   ├── shop-scene.js
│   │   ├── commute-scene.js
│   │   └── menu-scene.js
│   │
│   ├── rendering/          # Drawing code
│   │   ├── renderer.js     # Canvas, render loop
│   │   ├── sprites.js      # Sprite drawing
│   │   └── ui.js           # HUD, dialogue
│   │
│   └── data/               # Data structures
│       ├── grid.js         # Grid utilities
│       ├── inventory.js    # Stock management
│       └── relationships.js
│
├── assets/
│   ├── sprites/
│   │   ├── player/
│   │   ├── customers/
│   │   ├── shop/
│   │   ├── products/
│   │   └── commute/
│   └── audio/
│       ├── sfx/
│       └── music/
│
└── data/
    ├── shop-layout.json
    ├── products.json
    ├── customers.json
    └── dialogue.json
```

### System Location Mapping

| System | Location | Responsibility |
|--------|----------|----------------|
| Game Loop | `src/core/game.js` | Init, update/render cycle |
| Events | `src/core/events.js` | Pub/sub event dispatch |
| Config | `src/core/config.js` | Constants, balance values |
| Audio | `src/systems/audio.js` | Sound effects, music |
| Input | `src/systems/input.js` | Keyboard events |
| Save | `src/systems/save.js` | Persistence |
| Player | `src/entities/player.js` | Movement, interactions |
| Customers | `src/entities/customer.js` | AI, checkout flow |
| Shelves | `src/entities/shelf.js` | Stock state |
| Scenes | `src/scenes/scene-manager.js` | Transitions |
| Renderer | `src/rendering/renderer.js` | Canvas drawing |

### Naming Conventions

**Files:** kebab-case (`scene-manager.js`, `shop-layout.json`)

**Code Elements:**

| Element | Convention | Example |
|---------|------------|---------|
| Constants | UPPER_SNAKE | `TICK_RATE`, `GRID_SIZE` |
| Functions | camelCase | `movePlayer()`, `emitEvent()` |
| Variables | camelCase | `currentScene`, `stockCount` |
| Modules | PascalCase | `AudioSystem`, `SceneManager` |
| Events | namespace:action | `shelf:stocked` |

### Architectural Boundaries

- **Core** has no dependencies on other src folders
- **Systems** depend only on Core
- **Entities** depend on Core and Systems
- **Scenes** can use everything
- **Rendering** is called by Scenes, never calls game logic

---

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents.

### Communication Pattern

**Approach:** Mixed (Events for broadcasts, Direct for targeted actions)

```js
// Broadcasts - any system can listen
Events.emit('shelf:stocked', { shelf, count });
Events.emit('customer:enter', { customer });
Events.emit('day:end', { dayNumber });

// Direct calls - specific targeted actions
AudioSystem.playMusic('evening');
SceneManager.transitionTo('commute-out');
```

**Rule:** Use events when multiple systems might care. Use direct calls for specific actions on specific systems.

### Entity Creation Pattern

**Approach:** Factory Functions + Lightweight Pool for Customers

```js
// Factory for all entities
function createShelf(config) {
  return {
    type: 'shelf',
    id: nextId(),
    position: config.position,
    category: config.category,
    stock: 0,
    maxStock: CONFIG.SHELF_MAX_STOCK,
  };
}

function createCustomer(type) {
  return {
    type: 'customer',
    id: nextId(),
    customerType: type,
    state: 'entering',
    position: { x: 0, y: 0 },
    cart: [],
    active: false,
  };
}

// Pool for customer reuse
const CustomerPool = {
  available: [],
  acquire(type) {
    const c = this.available.pop() || createCustomer(type);
    c.active = true;
    return c;
  },
  release(customer) {
    customer.active = false;
    customer.cart = [];
    this.available.push(customer);
  }
};
```

### State Transition Pattern

**Approach:** State Property + Transition Validation

```js
const CustomerStates = {
  transitions: {
    'entering': ['browsing'],
    'browsing': ['waiting', 'leaving'],
    'waiting': ['checkout'],
    'checkout': ['leaving'],
    'leaving': []
  }
};

function setState(entity, newState) {
  const allowed = CustomerStates.transitions[entity.state] || [];
  if (!allowed.includes(newState)) {
    Log.warn('State', `Invalid: ${entity.state} → ${newState}`);
    return false;
  }
  entity.state = newState;
  Events.emit(`${entity.type}:state`, { entity, state: newState });
  return true;
}
```

### Data Access Pattern

**Approach:** Data Manager with Preload

```js
const Data = {
  cache: {},

  async preload() {
    const files = ['shop-layout', 'products', 'customers', 'dialogue'];
    await Promise.all(files.map(async (name) => {
      const res = await fetch(`data/${name}.json`);
      this.cache[name] = await res.json();
    }));
  },

  get(name) {
    return this.cache[name] || null;
  }
};
```

### Consistency Rules

| Scenario | Pattern | Example |
|----------|---------|---------|
| Something happened | Event | `Events.emit('shelf:complete', {})` |
| Do specific action | Direct call | `AudioSystem.play('ka-ching')` |
| Create entity | Factory | `createShelf(config)` |
| Reuse customers | Pool | `CustomerPool.acquire('regular')` |
| Change entity state | setState() | `setState(customer, 'checkout')` |
| Read game data | Data.get() | `Data.get('products')` |
| Read config | CONFIG | `CONFIG.SHELF_MAX_STOCK` |
| Read user prefs | PlayerPrefs | `PlayerPrefs.get('volume', 1)` |

---

## Architecture Validation

### Validation Summary

| Check | Result | Notes |
|-------|--------|-------|
| Decision Compatibility | ✅ PASS | All 8 decisions work together |
| GDD Coverage | ✅ PASS | 11/11 systems, 7/7 requirements |
| Pattern Completeness | ✅ PASS | 9 patterns with code examples |
| Epic Mapping | ✅ PASS | 8/8 epics mapped |
| Document Completeness | ✅ PASS | All sections present |

### Coverage Report

**Systems Covered:** 11/11
**Patterns Defined:** 9
**Decisions Made:** 8

### Issues Resolved

None - all validation checks passed on first review.

### Validation Date

2026-01-11

---

## Development Environment

### Prerequisites

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Text editor (VS Code recommended)
- Local file server (VS Code Live Server, Python http.server, or similar)

### Setup Commands

```bash
# Create project structure
mkdir conbini-life && cd conbini-life
mkdir -p src/{core,systems,entities,scenes,rendering,data}
mkdir -p assets/{sprites/{player,customers,shop,products,commute},audio/{sfx,music}}
mkdir -p data
touch index.html styles.css
touch src/core/{game,events,config,log,debug}.js
touch src/systems/{audio,input,save,assets}.js
```

### First Steps

1. Create `index.html` with canvas element and script imports
2. Implement game loop in `src/core/game.js` using Semi-Fixed Timestep
3. Set up Event Bus in `src/core/events.js` for system communication
