# Story 1.2: Grid-Based Player Movement

Status: done

## Story

As a player,
I want to move my character around the konbini using arrow keys,
So that I can navigate to different areas of the store.

## Acceptance Criteria

1. **Given** the player is in the konbini **When** I press an arrow key (up/down/left/right) **Then** the character moves one grid cell in that direction
2. **Given** movement is triggered **When** the character moves **Then** movement uses smooth interpolation (lerp) for visual polish
3. **Given** walls or shelf obstacles exist **When** I try to move into them **Then** the character cannot move through walls or shelf obstacles
4. **Given** konbini boundaries exist **When** I try to move outside **Then** the character cannot move outside the konbini boundaries

## Tasks / Subtasks

- [x] Task 1: Input System Foundation (AC: #1)
  - [x] 1.1 Create `src/systems/input.js` with keyboard event listeners
  - [x] 1.2 Track key states (pressed/released) for arrow keys
  - [x] 1.3 Emit `input:direction` events via Event Bus
  - [x] 1.4 Prevent default browser behavior (arrow scroll)

- [x] Task 2: Player Movement Logic (AC: #1, #2)
  - [x] 2.1 Add `movePlayer(direction)` function to player.js
  - [x] 2.2 Implement movement state: `moving`, `moveProgress`, `moveDirection`
  - [x] 2.3 Calculate target grid position from current + direction
  - [x] 2.4 Set `moving = true` and begin interpolation

- [x] Task 3: Smooth Interpolation (AC: #2)
  - [x] 3.1 Update `renderX`/`renderY` each frame toward `gridX`/`gridY`
  - [x] 3.2 Use lerp with configurable speed (e.g., MOVE_SPEED = 8 tiles/sec)
  - [x] 3.3 Set `moving = false` when renderX/Y reaches gridX/Y
  - [x] 3.4 Block new input while movement is in progress

- [x] Task 4: Collision Detection (AC: #3)
  - [x] 4.1 Create `canMoveTo(gridX, gridY)` function in grid.js
  - [x] 4.2 Check target cell against shop-layout.json walkable tiles
  - [x] 4.3 Shelf cells are NOT walkable (collision)
  - [x] 4.4 Register, door, backroom entrance are walkable

- [x] Task 5: Boundary Checking (AC: #4)
  - [x] 5.1 Validate target position within GRID_SIZE bounds (0 to width-1, 0 to height-1)
  - [x] 5.2 Return false from canMoveTo() if out of bounds
  - [x] 5.3 No movement or visual feedback when blocked

- [x] Task 6: Integration & Wiring (AC: #1, #2, #3, #4)
  - [x] 6.1 Subscribe to `input:direction` in game.js or player.js
  - [x] 6.2 Call movePlayer() with direction from input events
  - [x] 6.3 Update player lerp in game update() loop
  - [x] 6.4 Ensure renderer draws player at renderX/renderY position

- [x] Task 7: Testing & Verification (AC: #1, #2, #3, #4)
  - [x] 7.1 Test all four directions move correctly
  - [x] 7.2 Verify smooth interpolation visually (no teleporting)
  - [x] 7.3 Test collision with shelves - player cannot enter shelf cells
  - [x] 7.4 Test boundaries - player cannot leave grid
  - [x] 7.5 Test rapid key presses - input queuing or blocking works correctly

## Dev Notes

### Technical Stack (MANDATORY)
- **Language:** Vanilla JavaScript (ES6+)
- **Rendering:** HTML5 Canvas 2D Context
- **No external dependencies** - pure browser APIs only
- **Target:** 60fps stable, <16ms input latency

### Architecture Patterns (MUST FOLLOW)

**Input System Pattern:**
```javascript
// src/systems/input.js
const Input = {
  keys: {},

  init() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        if (!this.keys[e.key]) {
          this.keys[e.key] = true;
          Events.emit('input:direction', { direction: this.keyToDirection(e.key) });
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  },

  keyToDirection(key) {
    const map = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right'
    };
    return map[key];
  }
};
```

**Player Movement Pattern:**
```javascript
// In player.js - extend existing player object
const player = {
  type: 'player',
  gridX: 5, gridY: 3,      // Logical position (integers)
  renderX: 5, renderY: 3,  // Visual position (floats, lerps toward grid)
  moving: false,
  moveSpeed: 8,            // Tiles per second
};

function movePlayer(direction) {
  if (player.moving) return; // Block input while moving

  const delta = {
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 },
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 }
  }[direction];

  const targetX = player.gridX + delta.dx;
  const targetY = player.gridY + delta.dy;

  if (canMoveTo(targetX, targetY)) {
    player.gridX = targetX;
    player.gridY = targetY;
    player.moving = true;
    Events.emit('player:move', { x: targetX, y: targetY });
  }
}

function updatePlayerMovement(dt) {
  if (!player.moving) return;

  const speed = player.moveSpeed * (dt / 1000);

  // Lerp renderX toward gridX
  if (player.renderX < player.gridX) {
    player.renderX = Math.min(player.renderX + speed, player.gridX);
  } else if (player.renderX > player.gridX) {
    player.renderX = Math.max(player.renderX - speed, player.gridX);
  }

  // Lerp renderY toward gridY
  if (player.renderY < player.gridY) {
    player.renderY = Math.min(player.renderY + speed, player.gridY);
  } else if (player.renderY > player.gridY) {
    player.renderY = Math.max(player.renderY - speed, player.gridY);
  }

  // Check if arrived
  if (player.renderX === player.gridX && player.renderY === player.gridY) {
    player.moving = false;
  }
}
```

**Collision Detection Pattern:**
```javascript
// In grid.js
function canMoveTo(gridX, gridY) {
  // Boundary check
  if (gridX < 0 || gridX >= CONFIG.GRID_SIZE.width) return false;
  if (gridY < 0 || gridY >= CONFIG.GRID_SIZE.height) return false;

  // Get tile type from shop layout
  const layout = Data.get('shop-layout');
  const tile = layout.tiles[gridY][gridX];

  // Define walkable tiles
  const walkable = ['floor', 'register', 'door', 'backroom-entrance'];
  return walkable.includes(tile.type);
}
```

### Project Structure (FROM STORY 1-1)

```
conbini-life/
├── index.html
├── styles.css
│
├── src/
│   ├── core/
│   │   ├── game.js         # EXISTS - add input init, player update
│   │   ├── events.js       # EXISTS - no changes needed
│   │   ├── config.js       # EXISTS - add MOVE_SPEED constant
│   │   └── log.js          # EXISTS - no changes needed
│   │
│   ├── systems/
│   │   └── input.js        # NEW - keyboard handling
│   │
│   ├── entities/
│   │   └── player.js       # EXISTS - add movement functions
│   │
│   ├── rendering/
│   │   └── renderer.js     # EXISTS - verify uses renderX/renderY
│   │
│   └── data/
│       └── grid.js         # EXISTS - add canMoveTo()
│
└── data/
    └── shop-layout.json    # EXISTS - ensure tile types defined
```

### Files to CREATE
- `src/systems/input.js` - New input handling system

### Files to MODIFY
- `src/core/game.js` - Initialize input, call updatePlayerMovement()
- `src/core/config.js` - Add MOVE_SPEED constant
- `src/entities/player.js` - Add movePlayer(), updatePlayerMovement()
- `src/data/grid.js` - Add canMoveTo() collision function

### Files to VERIFY
- `data/shop-layout.json` - Ensure tile types exist and are correct
- `src/rendering/renderer.js` - Ensure player draws at renderX/renderY

### Config Constants to Add
```javascript
// In config.js
const CONFIG = {
  // ... existing constants
  MOVE_SPEED: 8,  // Tiles per second for player movement
};
```

### Shop Layout Tile Types (from shop-layout.json)
The collision system depends on these tile types:
- `floor` - Walkable empty floor
- `shelf` - NOT walkable (collision)
- `register` - Walkable (for checkout interaction)
- `door` - Walkable (entrance/exit)
- `backroom-entrance` - Walkable (access to backroom)
- `wall` - NOT walkable

### Event Flow
1. User presses Arrow key
2. Input system emits `input:direction` with direction
3. Player module receives event, calls `movePlayer(direction)`
4. `canMoveTo()` validates target position
5. If valid: update gridX/gridY, set moving=true
6. Game loop calls `updatePlayerMovement(dt)` each frame
7. renderX/renderY lerp toward gridX/gridY
8. Renderer draws player at pixel position: renderX * TILE_PX, renderY * TILE_PX
9. When arrived, moving=false, ready for next input

### Naming Conventions (MUST FOLLOW)
- **Files:** kebab-case (`input.js`, `shop-layout.json`)
- **Constants:** UPPER_SNAKE (`MOVE_SPEED`, `GRID_SIZE`)
- **Functions:** camelCase (`movePlayer()`, `canMoveTo()`)
- **Variables:** camelCase (`renderX`, `moveSpeed`)
- **Events:** namespace:action (`input:direction`, `player:move`)

### What NOT To Do
- Do NOT add diagonal movement (not in acceptance criteria)
- Do NOT add running/speed boost (not in this story)
- Do NOT add interaction (E key) - that's Story 1.3
- Do NOT add animation frames - keep sprite static for now
- Do NOT add sound effects for movement - audio is Story 1.4
- Do NOT over-engineer - simple lerp, simple collision

### Performance Considerations
- Input events should fire immediately (no throttling)
- Lerp calculation is lightweight - no optimization needed
- Collision check is O(1) array lookup - no optimization needed

### Previous Story Intelligence (1-1)

From Story 1-1 implementation:
- Game loop runs at 60fps with semi-fixed timestep
- Player entity already has gridX/gridY and renderX/renderY properties
- Event bus is established and working
- Renderer draws entities at pixel positions
- CONFIG constants pattern is established
- Shop layout JSON structure is defined

Key patterns established:
- Event emission: `Events.emit('namespace:action', data)`
- System initialization in game.js init() function
- Update calls receive delta time in milliseconds

### Konbini Grid Reference (12x8)

```
+-------------------------------------+  (12 x 8 grid)
|  [Register]     [Door]     [ATM]    |  Row 0  ← Player CAN walk here (except shelf cells)
|                                     |  Row 1
|  [Drinks]  [Snacks]  [Bento]        |  Row 2  ← Shelf cells are NOT walkable
|                                     |  Row 3
|  [Drinks]  [Onigiri] [Desserts]     |  Row 4  ← Shelf cells are NOT walkable
|                                     |  Row 5
|  [Magazine] [Hot Food] [Backroom->] |  Row 6
|              (Fryer)                |  Row 7
+-------------------------------------+
```

Floor cells between and around shelves ARE walkable.

### References

- [Source: game-architecture.md#Grid System] - Tile-based + smooth interpolation approach
- [Source: game-architecture.md#Entity Structure] - Player gridX/gridY, renderX/renderY pattern
- [Source: game-architecture.md#Event System] - Pub/Sub pattern for input:direction
- [Source: game-architecture.md#Project Structure] - File organization
- [Source: game-architecture.md#Implementation Patterns] - Communication, state patterns
- [Source: epics.md#Story 1.2] - Acceptance criteria
- [Source: gdd.md#Controls and Input] - Arrow key movement requirement

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None

### Completion Notes List

- Created `src/systems/input.js` with keyboard event handling for arrow keys
- Added `MOVE_SPEED: 8` constant to config.js
- Implemented `Player.move(direction)` function with collision checking
- Added smooth interpolation via lerp in `Player.update(dt)`
- Created `Grid.canMoveTo(x, y)` for boundary and collision detection
- Updated `ShopLayout.isWalkable()` to include register and backroom as walkable
- Wired input events to player movement via Events subscription
- Input system initialized in game.js

### File List

**Created:**
- src/systems/input.js

**Modified:**
- src/core/game.js (added Input import and init)
- src/core/config.js (added MOVE_SPEED constant)
- src/entities/player.js (added move(), updated update() with lerp, added input subscription)
- src/data/grid.js (added canMoveTo() function)
- src/data/shop-layout.js (updated isWalkable() to include register/backroom)

## Change Log

- 2026-01-11: Implemented grid-based player movement with arrow keys, smooth interpolation, collision detection, and boundary checking

