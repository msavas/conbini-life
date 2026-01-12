# Story 1.3: Shelf Entities & Interaction Zones

Status: review

## Story

As a player,
I want to see shelves with stock levels and approach them for interaction,
So that I can identify which shelves need stocking.

## Acceptance Criteria

1. **Given** the konbini has shelf entities placed on the grid **When** I look at a shelf **Then** I can see its current stock level visually (empty/partial/full)
2. **Given** shelves exist **When** I view them **Then** shelves have distinct categories visible (drinks, snacks, onigiri, etc.)
3. **Given** I am standing adjacent to a shelf **When** I am in the interaction zone **Then** a visual indicator shows the shelf is interactable
4. **Given** an interaction indicator is shown **When** I press E key **Then** that shelf is targeted for interaction

## Tasks / Subtasks

- [ ] Task 1: Shelf Entity Data Structure (AC: #1, #2)
  - [ ] 1.1 Create `src/entities/shelf.js` with shelf entity factory function
  - [ ] 1.2 Define shelf properties: gridX, gridY, category, stockLevel (0-9), maxStock (9)
  - [ ] 1.3 Create shelf instances from shop-layout.json `shelfContents` data
  - [ ] 1.4 Store shelf entities in a collection accessible to renderer and systems

- [ ] Task 2: Shelf Stock Visual Rendering (AC: #1)
  - [ ] 2.1 Render empty shelves with depleted visual (darker/empty appearance)
  - [ ] 2.2 Render partial shelves with item indicators (1-8 stock)
  - [ ] 2.3 Render full shelves with complete visual (9/9 bright appearance)
  - [ ] 2.4 Use placeholder colored rectangles to represent stock items on shelf

- [ ] Task 3: Shelf Category Visuals (AC: #2)
  - [ ] 3.1 Define distinct colors for each category (drinks=blue, snacks=yellow, etc.)
  - [ ] 3.2 Render category indicator on shelf tiles (colored accent or label)
  - [ ] 3.3 Ensure visual distinction between empty/full states per category

- [ ] Task 4: Interaction Zone Detection (AC: #3)
  - [ ] 4.1 Create `getAdjacentShelves(playerGridX, playerGridY)` function
  - [ ] 4.2 Check all 4 cardinal directions for shelf tiles
  - [ ] 4.3 Return array of shelf entities player can interact with
  - [ ] 4.4 Update detection each frame when player position changes

- [ ] Task 5: Interaction Indicator Rendering (AC: #3)
  - [ ] 5.1 When player is adjacent to shelf, render highlight/glow on shelf
  - [ ] 5.2 Indicator should pulse or stand out clearly
  - [ ] 5.3 If multiple adjacent shelves, highlight the "facing" shelf based on player direction
  - [ ] 5.4 Show "Press E" text prompt near interactable shelf

- [ ] Task 6: E Key Input & Targeting (AC: #4)
  - [ ] 6.1 Add 'KeyE' to input system (extend from Story 1.2)
  - [ ] 6.2 Emit `input:interact` event when E is pressed
  - [ ] 6.3 Determine target shelf from player position + direction
  - [ ] 6.4 Emit `player:interact` event with target shelf data
  - [ ] 6.5 Log interaction for debugging (actual stocking is Story 1.4)

- [ ] Task 7: Integration & Testing (AC: #1, #2, #3, #4)
  - [ ] 7.1 Initialize shelf entities in game.js from layout data
  - [ ] 7.2 Verify shelves render with correct stock levels
  - [ ] 7.3 Test interaction zone detection as player moves
  - [ ] 7.4 Verify E key targets correct shelf
  - [ ] 7.5 Test edge cases: corners, multiple adjacent shelves

## Dev Notes

### Technical Stack (MANDATORY)
- **Language:** Vanilla JavaScript (ES6+)
- **Rendering:** HTML5 Canvas 2D Context
- **No external dependencies** - pure browser APIs only
- **Target:** 60fps stable, <16ms input latency

### Architecture Patterns (MUST FOLLOW)

**Shelf Entity Factory Pattern:**
```javascript
// src/entities/shelf.js
function createShelf(gridX, gridY, category) {
  return {
    type: 'shelf',
    gridX,
    gridY,
    category,           // 'drinks', 'snacks', 'onigiri', etc.
    stockLevel: 0,      // 0-9 items
    maxStock: 9,        // Max capacity per shelf

    isEmpty() { return this.stockLevel === 0; },
    isFull() { return this.stockLevel >= this.maxStock; },
    getStockPercent() { return this.stockLevel / this.maxStock; }
  };
}
```

**Shelf Collection Pattern:**
```javascript
// Shelf manager/collection
const Shelves = {
  entities: [],

  init(layoutData) {
    this.entities = [];
    const contents = layoutData.shelfContents;
    for (const [key, category] of Object.entries(contents)) {
      const [x, y] = key.split(',').map(Number);
      this.entities.push(createShelf(x, y, category));
    }
  },

  getAt(gridX, gridY) {
    return this.entities.find(s => s.gridX === gridX && s.gridY === gridY);
  },

  getAdjacent(gridX, gridY) {
    const directions = [
      { dx: 0, dy: -1 },  // up
      { dx: 0, dy: 1 },   // down
      { dx: -1, dy: 0 },  // left
      { dx: 1, dy: 0 }    // right
    ];
    return directions
      .map(d => this.getAt(gridX + d.dx, gridY + d.dy))
      .filter(Boolean);
  }
};
```

**Stock Level Visual Rendering:**
```javascript
function renderShelf(shelf) {
  const { gridX, gridY, category, stockLevel, maxStock } = shelf;
  const pixel = Grid.gridToPixel(gridX, gridY);

  // Base shelf color by category
  const baseColor = CATEGORY_COLORS[category] || '#8B4513';
  Renderer.drawTile(gridX, gridY, baseColor);

  // Stock level indicator (small rectangles representing items)
  const itemWidth = CONFIG.TILE_PX / 3;
  const itemHeight = CONFIG.TILE_PX / 4;

  for (let i = 0; i < stockLevel; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const itemX = pixel.x + col * itemWidth + 2;
    const itemY = pixel.y + row * itemHeight + 2;
    Renderer.drawRect(itemX, itemY, itemWidth - 4, itemHeight - 4, '#fff');
  }

  // Empty shelf overlay (darker) if no stock
  if (stockLevel === 0) {
    Renderer.drawRect(pixel.x, pixel.y, CONFIG.TILE_PX, CONFIG.TILE_PX, 'rgba(0,0,0,0.3)');
  }
}
```

**Interaction Zone Detection:**
```javascript
function getInteractionTarget(player) {
  // Get shelf in the direction player is facing
  const dirDeltas = {
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 },
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 }
  };

  const delta = dirDeltas[player.direction];
  const targetX = player.gridX + delta.dx;
  const targetY = player.gridY + delta.dy;

  return Shelves.getAt(targetX, targetY);
}

function hasAdjacentShelf(player) {
  return Shelves.getAdjacent(player.gridX, player.gridY).length > 0;
}
```

**Interaction Indicator Rendering:**
```javascript
function renderInteractionIndicator(shelf) {
  if (!shelf) return;

  const pixel = Grid.gridToPixel(shelf.gridX, shelf.gridY);
  const ctx = Renderer.getContext();

  // Pulsing highlight effect
  const pulse = Math.sin(Date.now() / 200) * 0.2 + 0.4;
  ctx.strokeStyle = `rgba(255, 255, 255, ${pulse})`;
  ctx.lineWidth = 3;
  ctx.strokeRect(pixel.x + 2, pixel.y + 2, CONFIG.TILE_PX - 4, CONFIG.TILE_PX - 4);

  // "Press E" prompt
  ctx.fillStyle = '#fff';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('[E]', pixel.x + CONFIG.TILE_PX / 2, pixel.y - 5);
}
```

**E Key Input Extension:**
```javascript
// In input.js - add to existing key handling
init() {
  window.addEventListener('keydown', (e) => {
    // Existing arrow key handling...

    if (e.key === 'e' || e.key === 'E') {
      e.preventDefault();
      Events.emit('input:interact', {});
    }
  });
}
```

### Category Colors (MUST USE)
```javascript
const CATEGORY_COLORS = {
  drinks: '#4a90d9',      // Blue
  snacks: '#d9a84a',      // Yellow/gold
  onigiri: '#7dd94a',     // Green
  bento: '#d94a4a',       // Red
  desserts: '#d94ad9',    // Pink/magenta
  magazines: '#9b9b9b',   // Gray
  icecream: '#4ad9d9',    // Cyan
  hotfood: '#d96a4a',     // Orange
  instant: '#d9d94a',     // Light yellow
  household: '#8b6b4a'    // Brown
};
```

### Project Structure

**Files to CREATE:**
- `src/entities/shelf.js` - Shelf entity factory and collection

**Files to MODIFY:**
- `src/systems/input.js` - Add E key handling
- `src/core/game.js` - Initialize shelves, update interaction detection
- `src/rendering/renderer.js` - Add interaction indicator rendering (if needed)

**Files to READ (no changes):**
- `data/shop-layout.json` - Shelf positions and categories
- `src/data/grid.js` - Grid utilities
- `src/entities/player.js` - Player position and direction

### Shop Layout Reference

From `data/shop-layout.json` shelfContents:
```
Row 2: drinks(0,2), drinks(1,2), snacks(3,4), snacks(4,2), bento(6,2), bento(7,2), magazines(9,2), magazines(10,2)
Row 4: drinks(0,4), drinks(1,4), onigiri(3,4), onigiri(4,4), desserts(6,4), desserts(7,4), icecream(9,4), icecream(10,4)
Row 6: hotfood(0,6), hotfood(1,6), instant(3,6), instant(4,6), household(6,6), household(7,6)
```

### Event Flow

1. Game initializes → Load shop-layout.json → Create shelf entities from shelfContents
2. Player moves → Check if adjacent to any shelves
3. If adjacent → Determine target shelf (direction-based)
4. Render loop → Draw shelves with stock levels → Draw interaction indicator on target
5. Player presses E → Emit `input:interact`
6. System receives event → Get target shelf → Emit `player:interact` with shelf data
7. (Story 1.4 will handle actual stocking)

### Naming Conventions (MUST FOLLOW)
- **Files:** kebab-case (`shelf.js`, `shop-layout.json`)
- **Constants:** UPPER_SNAKE (`CATEGORY_COLORS`, `MAX_STOCK`)
- **Functions:** camelCase (`createShelf()`, `getAdjacentShelves()`)
- **Variables:** camelCase (`stockLevel`, `targetShelf`)
- **Events:** namespace:action (`input:interact`, `player:interact`)

### What NOT To Do
- Do NOT implement actual stocking logic (that's Story 1.4)
- Do NOT add audio feedback (that's Story 1.4)
- Do NOT add inventory system (that's Epic 2)
- Do NOT animate stock level changes yet (keep simple)
- Do NOT handle Space key (that's for dialogue, Epic 4)
- Do NOT over-engineer shelf rendering - placeholders are fine

### Previous Story Intelligence

**From Story 1-1 (Project Foundation):**
- Game loop established at 60fps semi-fixed timestep
- Event bus pattern: `Events.emit('namespace:action', data)`
- Renderer module with `drawRect()`, `drawTile()`, `getContext()`
- Grid utilities: `gridToPixel()`, `isValidPosition()`
- Shop layout loaded from JSON at startup
- Player entity has `gridX`, `gridY`, `direction` properties

**From Story 1-2 (Player Movement):**
- Input system exists at `src/systems/input.js`
- Player has `direction` property tracking facing
- Movement blocks new input while `moving = true`
- Player subscribes to events via `Events.on()`

**Key Files to Review:**
- `src/core/game.js` - See how player is initialized and updated
- `src/systems/input.js` - Pattern for adding new key handlers
- `src/data/grid.js` - Grid utilities to reuse
- `data/shop-layout.json` - shelfContents defines all shelf positions

### Stock Level Display Reference

```
Empty (0/9):     Partial (5/9):    Full (9/9):
+----------+     +----------+      +----------+
|  (dark)  |     |[x][x][x] |      |[x][x][x] |
|          |     |[x][x]    |      |[x][x][x] |
|          |     |          |      |[x][x][x] |
+----------+     +----------+      +----------+
```

Items render as small rectangles in a 3x3 grid pattern on the shelf tile.

### Initial Stock Levels

For this story, initialize all shelves with **stock level 0 (empty)**. This sets up the need for stocking in Story 1.4.

Alternative: Initialize with random stock levels (0-9) for visual testing during development.

### Interaction Zone Grid Reference

```
     [  ]     ← Shelf at (3,2)
[  ][PP][  ]  ← Player at (3,3), can interact with shelf above
     [  ]

Adjacent positions checked: up, down, left, right
Target shelf = shelf in player.direction
```

### Performance Considerations
- Shelf collection is small (~20 entities) - no optimization needed
- Interaction detection is O(1) - direct lookup by coordinates
- Pulse animation uses `Date.now()` - negligible performance impact

### Testing Checklist
- [ ] All shelf categories render with distinct colors
- [ ] Empty shelves visually distinct from stocked shelves
- [ ] Full shelves visually distinct from partial shelves
- [ ] Interaction indicator appears when adjacent to shelf
- [ ] Indicator targets shelf in player's facing direction
- [ ] E key press logs target shelf (for Story 1.4 integration)
- [ ] No errors when pressing E with no adjacent shelf

### References

- [Source: epics.md#Story 1.3] - Acceptance criteria
- [Source: game-architecture.md#Entity Structure] - Plain object pattern
- [Source: game-architecture.md#Event System] - Pub/Sub for interactions
- [Source: gdd.md#Core Mechanics] - Shelf stocking mechanic
- [Source: gdd.md#Controls and Input] - E key for interaction
- [Source: data/shop-layout.json] - Shelf positions and categories

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

