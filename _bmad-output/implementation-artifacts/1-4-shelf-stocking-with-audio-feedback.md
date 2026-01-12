# Story 1.4: Shelf Stocking with Audio Feedback

Status: ready-for-dev

## Story

As a player,
I want to stock shelves with deeply satisfying audio-visual feedback,
So that I experience the meditative joy of organizing items.

## Acceptance Criteria

1. **Given** I am adjacent to a shelf that is not fully stocked **When** I press E to interact **Then** I begin stocking the shelf one item at a time
2. **Given** I am stocking a shelf **When** each item is placed (1 through 9) **Then** an audio tone plays at progressively rising pitch
3. **Given** I am stocking **When** each tone plays **Then** the pitch corresponds to the stock count (1=low, 9=high) with audio latency under 50ms
4. **Given** the shelf reaches full stock (9 items) **When** the last item is placed **Then** a satisfying "ka-ching!" completion sound plays
5. **Given** a shelf is completed **When** the ka-ching plays **Then** a visual sparkle effect appears on the shelf and the shelf visually brightens
6. **Given** a shelf is already full (9/9) **When** I try to stock it **Then** nothing happens (no wasted action)

## Tasks / Subtasks

- [ ] Task 1: Audio System Foundation (AC: #2, #3)
  - [ ] 1.1 Create `src/systems/audio.js` with Web Audio API initialization
  - [ ] 1.2 Create AudioContext on first user interaction (browser requirement)
  - [ ] 1.3 Implement `AudioSystem.init()` called from game.js
  - [ ] 1.4 Add volume control via CONFIG constant
  - [ ] 1.5 Test AudioContext creation across browsers (Chrome, Firefox, Safari)

- [ ] Task 2: Stocking Tone Generation (AC: #2, #3)
  - [ ] 2.1 Implement `AudioSystem.playStockTone(stockLevel)` using OscillatorNode
  - [ ] 2.2 Create pentatonic scale mapping: stock levels 1-9 → musical pitches
  - [ ] 2.3 Use frequencies: C4(262Hz) → D4 → E4 → G4 → A4 → C5 → D5 → E5 → G5(784Hz)
  - [ ] 2.4 Set tone duration to ~150ms with smooth envelope (attack/decay)
  - [ ] 2.5 Add GainNode for volume control and fade-out
  - [ ] 2.6 Verify latency under 50ms from trigger to audible sound

- [ ] Task 3: Ka-ching Completion Sound (AC: #4)
  - [ ] 3.1 Implement `AudioSystem.playKaChing()` for shelf completion
  - [ ] 3.2 Create layered sound: bell tone + register click + sparkle shimmer
  - [ ] 3.3 Use multiple oscillators with different frequencies for richness
  - [ ] 3.4 Add high-frequency shimmer (2000-4000Hz) for sparkle effect
  - [ ] 3.5 Duration ~400ms with satisfying decay

- [ ] Task 4: Stocking Mechanic Logic (AC: #1, #6)
  - [ ] 4.1 Add `stockShelf(shelf)` function to handle stocking interaction
  - [ ] 4.2 On E key press (from Story 1-3), check if target shelf is not full
  - [ ] 4.3 If shelf.stockLevel < 9, increment stockLevel by 1
  - [ ] 4.4 Emit `shelf:stocked` event with { shelf, stockLevel }
  - [ ] 4.5 If shelf.stockLevel === 9, emit `shelf:complete` event
  - [ ] 4.6 If shelf is already full, do nothing (no sound, no event)

- [ ] Task 5: Audio Event Wiring (AC: #2, #3, #4)
  - [ ] 5.1 Subscribe to `shelf:stocked` event in AudioSystem
  - [ ] 5.2 On `shelf:stocked`, call `playStockTone(stockLevel)`
  - [ ] 5.3 Subscribe to `shelf:complete` event in AudioSystem
  - [ ] 5.4 On `shelf:complete`, call `playKaChing()`

- [ ] Task 6: Visual Sparkle Effect (AC: #5)
  - [ ] 6.1 Create `renderSparkle(shelf)` function in renderer
  - [ ] 6.2 Generate 5-8 particle positions around shelf center
  - [ ] 6.3 Animate particles outward with fade-over 500ms
  - [ ] 6.4 Use white/yellow colors for sparkle effect
  - [ ] 6.5 Track active sparkles in a simple particle array

- [ ] Task 7: Shelf Brightness on Completion (AC: #5)
  - [ ] 7.1 Add `completed` boolean property to shelf entity
  - [ ] 7.2 When shelf reaches 9/9, set `shelf.completed = true`
  - [ ] 7.3 In shelf rendering, apply brightness overlay for completed shelves
  - [ ] 7.4 Use subtle glow effect (lighter background color or overlay)

- [ ] Task 8: Stocking Animation (AC: #1)
  - [ ] 8.1 Add brief stocking animation state when E is pressed
  - [ ] 8.2 Optional: player "reaches toward" shelf during stock action
  - [ ] 8.3 Each stock action takes ~200ms before next can occur
  - [ ] 8.4 Prevent rapid-fire stocking (debounce input during animation)

- [ ] Task 9: Integration & Testing (AC: #1-6)
  - [ ] 9.1 Wire all systems together in game.js
  - [ ] 9.2 Test stocking flow: approach shelf → E key → tone plays → stock increases
  - [ ] 9.3 Test completion: stock to 9 → ka-ching plays → sparkle appears
  - [ ] 9.4 Test full shelf: try to stock 9/9 shelf → nothing happens
  - [ ] 9.5 Test audio latency with performance.now() measurements
  - [ ] 9.6 Test across browsers (Chrome, Firefox, Safari)

## Dev Notes

### Technical Stack (MANDATORY)
- **Language:** Vanilla JavaScript (ES6+)
- **Audio:** Web Audio API (OscillatorNode, GainNode, AudioContext)
- **Rendering:** HTML5 Canvas 2D Context
- **No external dependencies** - pure browser APIs only
- **Target:** 60fps stable, <50ms audio latency (CRITICAL)

### Architecture Patterns (MUST FOLLOW)

**Audio System Pattern:**
```javascript
// src/systems/audio.js
const AudioSystem = {
  ctx: null,
  masterGain: null,
  initialized: false,

  init() {
    // AudioContext must be created after user interaction
    if (this.initialized) return;

    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = CONFIG.MASTER_VOLUME;
    this.masterGain.connect(this.ctx.destination);
    this.initialized = true;

    Log.info('Audio', 'AudioSystem initialized');
  },

  // Ensure context is running (browser autoplay policy)
  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
};
```

**Stocking Tone Pattern (Pentatonic Scale):**
```javascript
// Pentatonic scale frequencies for pleasant sound
const STOCK_FREQUENCIES = [
  262,  // C4  - stock level 1
  294,  // D4  - stock level 2
  330,  // E4  - stock level 3
  392,  // G4  - stock level 4
  440,  // A4  - stock level 5
  523,  // C5  - stock level 6
  587,  // D5  - stock level 7
  659,  // E5  - stock level 8
  784   // G5  - stock level 9
];

function playStockTone(stockLevel) {
  if (!AudioSystem.initialized) return;

  const freq = STOCK_FREQUENCIES[stockLevel - 1];
  const osc = AudioSystem.ctx.createOscillator();
  const gain = AudioSystem.ctx.createGain();

  osc.type = 'sine';
  osc.frequency.value = freq;

  // Smooth envelope: quick attack, gentle decay
  const now = AudioSystem.ctx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.3, now + 0.01);  // 10ms attack
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);  // 140ms decay

  osc.connect(gain);
  gain.connect(AudioSystem.masterGain);

  osc.start(now);
  osc.stop(now + 0.15);
}
```

**Ka-ching Pattern (Layered Synthesis):**
```javascript
function playKaChing() {
  if (!AudioSystem.initialized) return;

  const now = AudioSystem.ctx.currentTime;

  // Layer 1: Bell tone (fundamental)
  playTone(880, 'sine', 0.3, 0.4, now);      // A5
  playTone(1108, 'sine', 0.2, 0.35, now);    // C#6

  // Layer 2: High shimmer
  playTone(2637, 'sine', 0.1, 0.3, now + 0.05);   // E7
  playTone(3520, 'sine', 0.08, 0.25, now + 0.08); // A7

  // Layer 3: Click transient
  const noise = createNoiseBuffer(0.02);
  playBuffer(noise, 0.15, now);
}

function playTone(freq, type, volume, duration, startTime) {
  const osc = AudioSystem.ctx.createOscillator();
  const gain = AudioSystem.ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

  osc.connect(gain);
  gain.connect(AudioSystem.masterGain);

  osc.start(startTime);
  osc.stop(startTime + duration);
}
```

**Shelf Stocking Logic:**
```javascript
// In shelf.js or a stocking system
function stockShelf(shelf) {
  if (!shelf) return false;
  if (shelf.isFull()) return false;  // Already full, do nothing

  shelf.stockLevel++;
  Events.emit('shelf:stocked', { shelf, stockLevel: shelf.stockLevel });

  if (shelf.stockLevel >= shelf.maxStock) {
    shelf.completed = true;
    Events.emit('shelf:complete', { shelf });
  }

  return true;
}

// Wire to E key interaction from Story 1-3
Events.on('player:interact', (data) => {
  const { targetShelf } = data;
  if (targetShelf) {
    stockShelf(targetShelf);
  }
});
```

**Sparkle Effect Pattern:**
```javascript
// Simple particle system for sparkles
const Particles = {
  active: [],

  spawnSparkle(x, y) {
    const count = 6 + Math.floor(Math.random() * 3);  // 6-8 particles
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      this.active.push({
        x, y,
        vx: Math.cos(angle) * 80,
        vy: Math.sin(angle) * 80,
        life: 1.0,  // 1.0 → 0.0 over time
        size: 3 + Math.random() * 2
      });
    }
  },

  update(dt) {
    const decay = dt / 500;  // 500ms total lifetime
    this.active = this.active.filter(p => {
      p.x += p.vx * (dt / 1000);
      p.y += p.vy * (dt / 1000);
      p.life -= decay;
      return p.life > 0;
    });
  },

  render(ctx) {
    this.active.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = '#FFD700';  // Gold
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
};
```

**Shelf Completion Brightness:**
```javascript
function renderShelf(shelf) {
  // ... existing shelf rendering from Story 1-3 ...

  // Add brightness overlay for completed shelves
  if (shelf.completed) {
    const pixel = Grid.gridToPixel(shelf.gridX, shelf.gridY);
    ctx.fillStyle = 'rgba(255, 255, 200, 0.15)';  // Warm glow
    ctx.fillRect(pixel.x, pixel.y, CONFIG.TILE_PX, CONFIG.TILE_PX);
  }
}
```

### Web Audio API Critical Notes

**Browser Autoplay Policy:**
- AudioContext starts in 'suspended' state
- MUST resume on user interaction (click, keypress)
- Add `AudioSystem.resume()` call on first E key press
- Check `ctx.state === 'running'` before playing

```javascript
// In input.js or game.js
window.addEventListener('keydown', (e) => {
  AudioSystem.resume();  // Ensure audio context is running
  // ... rest of input handling
}, { once: true });  // Only needed once
```

**Latency Optimization:**
- Create AudioContext early (init on page load)
- Resume on first interaction
- Pre-warm oscillators if needed (play silent tone)
- Use `ctx.currentTime` for precise scheduling
- Avoid creating new AudioContext per sound

**Safari Compatibility:**
- Use `webkitAudioContext` fallback
- Safari may require user gesture for audio
- Test volume levels (Safari tends to be louder)

### Config Constants to Add
```javascript
// In config.js
const CONFIG = {
  // ... existing constants ...

  // Audio
  MASTER_VOLUME: 0.5,
  STOCK_TONE_DURATION: 0.15,  // seconds
  KACHING_DURATION: 0.4,      // seconds

  // Stocking
  STOCK_COOLDOWN_MS: 200,     // Debounce between stocks
};
```

### Project Structure

**Files to CREATE:**
- `src/systems/audio.js` - Web Audio API wrapper and sound generation

**Files to MODIFY:**
- `src/core/game.js` - Initialize AudioSystem, update particles
- `src/core/config.js` - Add audio constants
- `src/entities/shelf.js` - Add stockShelf(), completed property
- `src/rendering/renderer.js` - Add sparkle rendering, brightness overlay
- `src/systems/input.js` - Add AudioSystem.resume() on first input

**Files to READ (no changes):**
- `src/core/events.js` - Event patterns to follow
- Story 1-3 files - Shelf entity, interaction patterns

### Event Flow

```
1. Player presses E near shelf (Story 1-3)
   ↓
2. AudioSystem.resume() ensures audio context running
   ↓
3. player:interact event with targetShelf
   ↓
4. stockShelf(shelf) called
   ↓
5. If not full: shelf.stockLevel++
   ↓
6. shelf:stocked event emitted
   ↓
7. AudioSystem.playStockTone(stockLevel)
   ↓
8. If stockLevel === 9:
   - shelf.completed = true
   - shelf:complete event emitted
   - AudioSystem.playKaChing()
   - Particles.spawnSparkle(shelfCenter)
   ↓
9. Renderer shows updated stock, sparkles, brightness
```

### Previous Story Intelligence

**From Story 1-1 (Project Foundation):**
- Game loop at 60fps with semi-fixed timestep
- Event bus: `Events.emit('namespace:action', data)`
- CONFIG pattern established
- Renderer with `drawRect()`, Canvas context access

**From Story 1-2 (Player Movement):**
- Input system at `src/systems/input.js`
- Pattern for system initialization in game.js
- Event subscription with `Events.on()`

**From Story 1-3 (Shelf Entities):**
- Shelf entity with `stockLevel`, `maxStock`, `category`
- `Shelves.getAt()` for finding shelves by position
- `getInteractionTarget(player)` returns facing shelf
- E key emits `input:interact` event
- Interaction indicator rendering pattern

**Key Integration Points:**
- Modify `input:interact` handler to call `stockShelf()`
- Add `completed` property to shelf factory
- Integrate particle update/render into game loop

### Naming Conventions (MUST FOLLOW)
- **Files:** kebab-case (`audio.js`)
- **Constants:** UPPER_SNAKE (`MASTER_VOLUME`, `STOCK_FREQUENCIES`)
- **Functions:** camelCase (`playStockTone()`, `stockShelf()`)
- **Variables:** camelCase (`stockLevel`, `masterGain`)
- **Events:** namespace:action (`shelf:stocked`, `shelf:complete`)

### What NOT To Do
- Do NOT use external audio libraries (Howler.js, etc.)
- Do NOT load audio files (use synthesis only for MVP)
- Do NOT add background music yet (that's a later story)
- Do NOT add inventory system (that's Epic 2)
- Do NOT implement "holding E to continuously stock" - single press = single item
- Do NOT over-engineer the particle system - simple is fine
- Do NOT add player carrying items visual - just the interaction

### Audio Latency Testing

```javascript
// Debug helper to measure audio latency
function measureLatency() {
  const start = performance.now();
  playStockTone(5);  // Middle pitch
  // Note: This only measures JS execution, not actual audio output
  const jsTime = performance.now() - start;
  Log.debug('Audio', `JS execution time: ${jsTime.toFixed(2)}ms`);
}
```

For true latency testing:
- Use browser DevTools Performance tab
- Listen for actual audio output timing
- Target: user presses E → sound audible in <50ms

### Testing Checklist
- [ ] AudioContext initializes on first user interaction
- [ ] Stock tones play with rising pitch (1-9)
- [ ] Each tone is distinct and pleasant (pentatonic scale)
- [ ] Ka-ching plays on shelf completion
- [ ] Ka-ching sounds satisfying and "complete"
- [ ] Sparkle particles appear on completion
- [ ] Sparkles fade out smoothly over ~500ms
- [ ] Completed shelf has visible brightness/glow
- [ ] Full shelf (9/9) cannot be stocked further
- [ ] No sound plays when trying to stock full shelf
- [ ] Audio works in Chrome, Firefox, Safari
- [ ] Audio latency feels instant (<50ms perceived)
- [ ] No audio glitches or pops
- [ ] Volume is comfortable (not too loud)

### Audio Reference (Frequencies)

**Pentatonic Scale (C Major):**
```
Stock 1: C4  = 261.63 Hz (round to 262)
Stock 2: D4  = 293.66 Hz (round to 294)
Stock 3: E4  = 329.63 Hz (round to 330)
Stock 4: G4  = 392.00 Hz
Stock 5: A4  = 440.00 Hz
Stock 6: C5  = 523.25 Hz (round to 523)
Stock 7: D5  = 587.33 Hz (round to 587)
Stock 8: E5  = 659.25 Hz (round to 659)
Stock 9: G5  = 783.99 Hz (round to 784)
```

This creates a pleasing upward progression that feels musical and satisfying.

### Visual Reference

**Stocking Progression:**
```
Stock 1/9:   Stock 5/9:   Stock 9/9:
[🔲][  ][  ] [🔲][🔲][🔲] [🔲][🔲][🔲]  + ✨ SPARKLE ✨
[  ][  ][  ] [🔲][🔲][  ] [🔲][🔲][🔲]  + 🌟 GLOW 🌟
[  ][  ][  ] [  ][  ][  ] [🔲][🔲][🔲]

Tone: Low    Tone: Mid    Ka-ching!
```

### Performance Considerations
- OscillatorNode is lightweight - OK to create per sound
- GainNode connections are cheap
- Particle count limited (6-8 per sparkle)
- Sparkle array filtered each frame - efficient at low counts
- No performance optimization needed at this scale

### References

- [Source: epics.md#Story 1.4] - Acceptance criteria
- [Source: gdd.md#Core Gameplay - Stock] - Stocking mechanic design
- [Source: gdd.md#Audio and Music] - Audio design pillars
- [Source: game-architecture.md#Audio System] - Web Audio API decision
- [Source: game-architecture.md#Event System] - shelf:stocked, shelf:complete events
- [Source: game-architecture.md#Performance Requirements] - <50ms audio latency
- [MDN Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - Reference

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

