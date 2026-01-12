# Story 1.1: Project Foundation & Konbini Display

Status: done

## Story

As a player,
I want to see the konbini rendered on screen with my character visible,
So that I can see the game world I'll be working in.

## Acceptance Criteria

1. **Given** the game loads in a browser **When** the page finishes loading **Then** a canvas displays the konbini interior with grid layout
2. **Given** the canvas is displayed **When** rendering occurs **Then** the player character sprite is visible at a starting position
3. **Given** the game is running **When** measuring performance **Then** the game runs at 60fps with semi-fixed timestep loop
4. **Given** the konbini is rendered **When** viewing the scene **Then** basic tile graphics show shelf areas, register, and floor

## Tasks / Subtasks

- [x] Task 1: Project Setup & Entry Point (AC: #1)
  - [x] 1.1 Create project directory structure per architecture spec
  - [x] 1.2 Create `index.html` with canvas element (800x600 or viewport-responsive)
  - [x] 1.3 Create `styles.css` with minimal styling (canvas centered, no scrollbars)
  - [x] 1.4 Set up module loading via ES6 imports or script tags

- [x] Task 2: Core Game Loop Implementation (AC: #3)
  - [x] 2.1 Create `src/core/game.js` with Semi-Fixed Timestep pattern
  - [x] 2.2 Implement 60 updates/sec fixed tick rate (16.67ms)
  - [x] 2.3 Implement variable render with interpolation factor
  - [x] 2.4 Add accumulator pattern to prevent spiral of death
  - [x] 2.5 Wire up requestAnimationFrame for render loop

- [x] Task 3: Core Infrastructure (AC: #1, #3)
  - [x] 3.1 Create `src/core/config.js` with CONFIG constants
  - [x] 3.2 Create `src/core/events.js` with Pub/Sub Event Bus
  - [x] 3.3 Create `src/core/log.js` with tagged logging (DEBUG flag)
  - [x] 3.4 Create `src/rendering/renderer.js` for Canvas 2D context

- [x] Task 4: Grid System Foundation (AC: #1, #4)
  - [x] 4.1 Define GRID_SIZE (12x8) and TILE_PX (48) in config
  - [x] 4.2 Create `src/data/grid.js` with grid utilities
  - [x] 4.3 Implement tile rendering (floor, walls, shelf zones, register zone)
  - [x] 4.4 Create basic tileset or placeholder colored rectangles

- [x] Task 5: Player Entity (AC: #2)
  - [x] 5.1 Create `src/entities/player.js` with player data structure
  - [x] 5.2 Define starting grid position (center-ish of konbini)
  - [x] 5.3 Implement player sprite rendering (placeholder or basic sprite)
  - [x] 5.4 Add gridX/gridY and renderX/renderY properties for future lerp

- [x] Task 6: Konbini Layout Rendering (AC: #4)
  - [x] 6.1 Create `data/shop-layout.json` with grid tile definitions
  - [x] 6.2 Define zones: shelves (drinks, snacks, onigiri), register, door, backroom
  - [x] 6.3 Render konbini layout from data (not hardcoded)
  - [x] 6.4 Visual distinction between floor, shelf areas, register area

- [x] Task 7: Integration & Verification (AC: #1, #2, #3, #4)
  - [x] 7.1 Wire all systems together in game.js init()
  - [x] 7.2 Verify 60fps in browser dev tools
  - [x] 7.3 Verify player sprite visible on konbini background
  - [x] 7.4 Test in Chrome 90+, Firefox 88+ (primary browsers)

## Dev Notes

### Technical Stack (MANDATORY)
- **Language:** Vanilla JavaScript (ES6+)
- **Rendering:** HTML5 Canvas 2D Context
- **No external dependencies** - pure browser APIs only
- **Target:** 60fps stable, <16ms input latency

### Architecture Patterns (MUST FOLLOW)

**Game Loop - Semi-Fixed Timestep:**
```javascript
const TICK_RATE = 1000 / 60; // 16.67ms
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

**Event Bus Pattern:**
```javascript
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

**Entity Structure - Plain Objects:**
```javascript
const player = {
  type: 'player',
  gridX: 5, gridY: 3,      // Logical position
  renderX: 5, renderY: 3,  // Visual position (lerps toward grid)
  moving: false
};
```

**Config Constants:**
```javascript
const CONFIG = {
  TICK_RATE: 60,
  GRID_SIZE: { width: 12, height: 8 },
  TILE_PX: 48,
  SHELF_MAX_STOCK: 9,
  // Add as needed
};
```

### Project Structure (MUST CREATE)

```
conbini-life/
├── index.html              # Entry point with <canvas>
├── styles.css              # Minimal canvas styling
│
├── src/
│   ├── core/
│   │   ├── game.js         # Game loop, initialization
│   │   ├── events.js       # Pub/sub event bus
│   │   ├── config.js       # CONFIG constants
│   │   └── log.js          # Logging utilities
│   │
│   ├── entities/
│   │   └── player.js       # Player state (this story)
│   │
│   ├── rendering/
│   │   └── renderer.js     # Canvas drawing
│   │
│   └── data/
│       └── grid.js         # Grid utilities
│
└── data/
    └── shop-layout.json    # Konbini grid layout
```

### Naming Conventions (MUST FOLLOW)
- **Files:** kebab-case (`game-loop.js`, `shop-layout.json`)
- **Constants:** UPPER_SNAKE (`TICK_RATE`, `GRID_SIZE`)
- **Functions:** camelCase (`movePlayer()`, `emitEvent()`)
- **Variables:** camelCase (`currentScene`, `stockCount`)
- **Modules:** PascalCase (`AudioSystem`, `SceneManager`)
- **Events:** namespace:action (`player:move`, `shelf:stocked`)

### Konbini Grid Layout Reference

```
+-------------------------------------+  (12 x 8 grid)
|  [Register]     [Door]     [ATM]    |  Row 0
|                                     |  Row 1
|  [Drinks]  [Snacks]  [Bento]        |  Row 2
|                                     |  Row 3
|  [Drinks]  [Onigiri] [Desserts]     |  Row 4
|                                     |  Row 5
|  [Magazine] [Hot Food] [Backroom->] |  Row 6
|              (Fryer)                |  Row 7
+-------------------------------------+
```

### Error Handling Pattern
```javascript
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

### Performance Requirements
- 60fps stable on mid-range hardware
- Initial load under 3 seconds
- Memory footprint minimal (this is foundation only)

### What NOT To Do
- Do NOT use any frameworks (React, Vue, Phaser, etc.)
- Do NOT add audio system yet (Epic 1, Story 4)
- Do NOT add input handling yet (Epic 1, Story 2)
- Do NOT add player movement yet (Epic 1, Story 2)
- Do NOT over-engineer - this is foundation only

### References

- [Source: game-architecture.md#Engine & Framework] - Vanilla JS + Canvas decision
- [Source: game-architecture.md#Architectural Decisions] - Game loop, state, entity patterns
- [Source: game-architecture.md#Project Structure] - Directory organization
- [Source: game-architecture.md#Implementation Patterns] - Communication, entity, state patterns
- [Source: gdd.md#Technical Specifications] - Performance requirements
- [Source: gdd.md#Controls and Input] - Konbini grid layout
- [Source: epics.md#Story 1.1] - Acceptance criteria

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- All 36 unit tests passing
- Visual verification via Playwright screenshot confirmed

### Completion Notes List

- **Task 1**: Created project structure (src/core, src/entities, src/rendering, src/data, data, tests), index.html with canvas, styles.css with centered canvas and no scrollbars
- **Task 2**: Implemented semi-fixed timestep game loop with 60fps target (16.67ms tick), accumulator pattern to prevent spiral of death, requestAnimationFrame render loop with interpolation
- **Task 3**: Created CONFIG module with constants, Events pub/sub bus, Log utility with tagged logging, Renderer for Canvas 2D drawing
- **Task 4**: Implemented Grid utilities (gridToPixel, pixelToGrid, isValidPosition), TILE_TYPES definitions, renderTile function with placeholder colors
- **Task 5**: Created Player entity with gridX/gridY logical position, renderX/renderY for interpolation, placeholder sprite with face indicator, event-driven update/render
- **Task 6**: Created shop-layout.json with full konbini grid (12x8), ShopLayout module to load/render layout from JSON, visual distinctions for floor/shelf/register/door/backroom
- **Task 7**: Verified all systems integrated, 36 tests passing, visual confirmation of player on konbini background

### File List

**New Files Created:**
- index.html
- styles.css
- src/core/game.js
- src/core/config.js
- src/core/events.js
- src/core/log.js
- src/rendering/renderer.js
- src/data/grid.js
- src/data/shop-layout.js
- src/entities/player.js
- data/shop-layout.json
- tests/test-runner.js
- tests/test.html
- tests/test-task1.js
- tests/test-task2.js
- tests/test-task3.js
- tests/test-task4.js
- tests/test-task5.js
- tests/test-task6.js
- tests/test-task7.js

