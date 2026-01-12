---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
inputDocuments:
  - "_bmad-output/game-brief.md"
  - "_bmad-output/brainstorming-session-2026-01-10.md"
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 1
  projectDocs: 0
workflowType: 'gdd'
lastStep: 14
project_name: 'Conbini Life'
user_name: 'Big Dogs'
date: '2026-01-11'
game_type: 'simulation'
game_name: 'Conbini Life'
---

# Conbini Life - Game Design Document

**Author:** Big Dogs
**Game Type:** Simulation (Cozy Work Sim)
**Target Platform(s):** Web Browser (HTML5 Canvas, Vanilla JS)

---

## Executive Summary

### Game Name

**Conbini Life**

### Core Concept

Conbini Life is a cozy Japanese convenience store simulation where players find peace in the rhythm of work. You bike to your konbini through the changing seasons of Japan - sunrise rice fields in spring, summer festival lanterns, autumn leaves, winter snow - then spend your shift stocking shelves, serving customers, and building quiet connections with the regulars who become part of your daily life.

The core experience is zen through routine. Shelf-stocking features satisfying audio feedback (rising tones 1-9, ka-ching on completion) that creates a meditative flow state. There are no fail states, no stress timers, no punishment - just the quiet satisfaction of a job done well. As you master your work, you unlock new services, seasonal items, and deeper relationships with your community.

This is the game you reluctantly close. One more shelf to stock, one more regular to greet, one more sunset bike ride home - but you stop yourself, satisfied, knowing your little corner of Japan will be there tomorrow.

### Game Type

**Type:** Simulation (Cozy Work Sim)
**Framework:** This GDD uses the simulation template with type-specific sections for systems design, management mechanics, economic loops, and progression unlocks - all filtered through a zen-first design philosophy where relaxation always trumps optimization pressure.

### Target Audience

**Primary:** Casual gamers aged 18-35, primarily working adults who use games to decompress. They know and love Stardew Valley, Animal Crossing, and similar cozy titles. They play during wind-down hours - after work, before bed, weekend mornings with coffee.

**Demographics:**
- Age 18-35, skewing toward working professionals
- Platform-flexible but appreciate low-friction browser access
- Time-limited but willing to invest in the right game

**Gaming Experience:** Casual-Core - Players familiar with cozy game conventions but not seeking hardcore challenge. They want depth without complexity, progression without pressure.

**Genre Familiarity:** High familiarity with cozy sim tropes (Stardew, Animal Crossing, Unpacking). They'll recognize and appreciate seasonal rhythms, progression unlocks, and relationship-building without needing tutorials.

**Session Length:** 15-45 minutes typical - Long enough to complete a satisfying work shift, short enough to fit into wind-down routines.

**Player Motivations:**
- Decompression from stressful days into low-stakes calm
- Quiet accomplishment - satisfaction of a job done well
- Cozy escapism - a peaceful corner of Japan to visit
- Routine as comfort - the rhythm of work becomes rest

**Secondary Audience:** People curious about Japanese culture who want an authentic, chill window into everyday Japan - without the anime deep-dive

### Unique Selling Points (USPs)

1. **Authentic Japanese Konbini Setting** - Real culture, not fantasy farm. Modern-day Japan through the lens of everyday life.
2. **The Commute as Ritual** - The bike ride is the meditation. Sunrise through rice fields, cherry blossoms, autumn leaves, winter snow.
3. **Work Sim, Not Life Sim** - Be great at your job without managing a whole life. No hunger meters, no relationship drama.
4. **Audio-Driven Satisfaction** - Shelf-stocking with rising pitch feedback (1-9) creates meditative rhythm. The ka-ching is the reward.

**Competitive Positioning:** Stardew Valley meets Japanese convenience store culture - the cozy work sim where the commute is the meditation and the job is the therapy.

---

## Goals and Context

### Project Goals

1. **Create a Rabid Fanbase** - Build something players can't stop talking about. Word-of-mouth is the only marketing strategy.
2. **Have Fun Making It** - AI-assisted game dev experiment. The process should be as enjoyable as the product.
3. **Have Fun Playing It** - We are the first players. If we don't want to keep playing, neither will anyone else.
4. **See How Far We Can Go** - No artificial constraints. Ship when it's good, iterate fast, explore.

### Background and Rationale

**Why This Game:** No authentic Japanese work-sim that's actually chill. The cozy market is proven but dominated by fantasy farms and rural settings. Nobody's made the urban Japan cozy experience.

**Why Now:** AI-assisted development changes the constraints. Small team with Claude punches above its weight. Traditional blockers matter less - we focus on feel and polish.

**Why Us:** Genuine appreciation for konbini culture without the otaku baggage. Slice-of-life authenticity. The prototype already proves the core mechanics feel right.

---

## Core Gameplay

### Game Pillars

1. **Zen / Relaxation** - The game exists to calm, not challenge. No stress, no fail states, no pressure. Every design decision that adds anxiety gets cut - even if it would be satisfying or deepen connections.

2. **Progression / Mastery** - Grow your skills, unlock new services, become great at your job. The satisfaction of competence without the pressure of performance. You get better because you want to, not because you have to.

3. **Satisfying Routine** - Tasks feel good. The rhythm of work is the reward. Shelf-stocking with rising audio feedback, the ka-ching of completion, the door chime of arriving customers. The micro-actions are the meditation.

4. **Connection** - Build relationships with regulars who become familiar faces. Learn their stories over time. Your little corner of Japan has its people, and they matter.

**Pillar Prioritization:** When pillars conflict, prioritize:
**Zen > Progression > Routine > Connection**

If a feature adds stress, it doesn't ship - even if it would be satisfying or deepen connections.

### Core Gameplay Loop

**The Daily Rhythm:**
```
☀️ Bike In (Sunrise)
    ↓
📦 Stock & Tidy (Zen Mode)
    ↓
🚪 Serve Customers (Social Mode)
    ↓
🌙 Bike Home (Sunset)
    ↓
📊 See Progress
    ↓
🔄 Repeat (New Day)
```

**Loop Timing:** One full day cycle takes approximately 15-30 minutes real-time - long enough for flow state, short enough for wind-down sessions.

**Loop Variation:** Each day brings:
- Different customer mix and conversations
- New shipments with varying stock needs
- Seasonal changes affecting visuals and items
- Relationship progressions with regulars
- Unlocked services and capabilities as you grow

**Dual Gameplay Modes Within Loop:**
| Zen Mode | Social Mode |
|----------|-------------|
| Stock shelves, tidy, organize | Serve customers, build relationships |
| Meditative solo flow | Warm human connection |
| Audio/visual feedback satisfaction | Regulars with stories |

### Win/Loss Conditions

#### Victory Conditions

**There is no "win state."** Success is ongoing and self-defined:
- A perfectly stocked shelf
- A regular who remembers your name
- A new service unlocked
- The quiet satisfaction of a shift well done
- One more sunset bike ride through the rice fields

The victory is choosing to come back tomorrow.

#### Failure Conditions

**There are no fail states.** This is a deliberate design choice serving the Zen pillar:
- No angry customers if you're slow
- No penalties for mistakes
- No game over screens
- No timers creating pressure
- No resource depletion forcing restart

#### Failure Recovery

**Nothing to recover from.** If something goes wrong:
- Just fix it, no biggie
- Customers are patient
- The day continues
- Tomorrow is a fresh start

The "failure" is closing the game - and even that's designed to feel like a natural stopping point, not a loss.

---

## Game Mechanics

### Primary Mechanics

#### Stock
Replenish shelves with deeply satisfying audio-visual feedback. One of the key mechanics that creates the zen rhythm.

**How it works:**
- Approach empty/low shelf with inventory
- Press interact to begin stocking
- Each item placed triggers audio feedback: pitch rises progressively (1-9 scale)
- On shelf completion: **ka-ching!** + visual sparkle + shelf brightens
- Labels snap straight, products align perfectly
- Transform chaos into perfect order

**Why it matters:** This is the meditation. The rising tones create anticipation. The completion sound delivers dopamine. The visual transformation provides proof of progress.

#### Serve
Check out customers at the register. The social counterpart to stocking's zen mode.

**How it works:**
- Customer approaches register
- Scan/process their items
- Brief dialogue opportunity (regulars have more to say)
- Transaction complete with register ka-ching
- Customer thanks you, leaves satisfied

**Why it matters:** Human connection in small doses. Regulars become familiar faces. Their stories unfold over time.

#### Bike (The Ritual Bookends)
Commute through seasonal Japan at sunrise and sunset. The meditation that frames each day.

**How it works:**
- Each shift begins with bike ride TO the konbini (sunrise)
- Each shift ends with bike ride HOME (sunset)
- Route passes through seasonal scenery: rice fields, cherry blossoms, autumn leaves, winter snow
- Ambient audio, peaceful pacing
- Potential for small discoveries/encounters on the path

**Why it matters:** The commute IS the meditation. It's the portal to your world. The sunrise builds anticipation; the sunset provides closure.

#### Unlock
Gain new services, seasonal items, and capabilities as you grow.

**How it works:**
- Progress unlocks new shelf types (drinks, bento, desserts, magazines)
- Services unlock over time: hot food counter, takkyubin shipping, bill payments, ticket printing
- Seasonal items rotate with the calendar
- Skills improve through natural play (faster stocking, better recommendations)

**Why it matters:** Progression without pressure. You get better because you're playing, not grinding.

#### Connect
Build relationships with regular customers who become part of your daily life.

**How it works:**
- Regulars visit repeatedly on semi-predictable schedules
- Dialogue evolves over time - they remember you, you learn about them
- Small story beats emerge through accumulated interactions
- 10-15 distinct regulars planned, each with personality and arc

**Why it matters:** These are YOUR people. Your little corner of Japan has its community.

### Controls and Input

**Platform:** Keyboard only (browser game)

**Control Scheme:**
| Input | Action |
|-------|--------|
| **Arrow Keys** | Move around konbini grid |
| **E** | Interact (stock, serve, use equipment) |
| **Space** | Confirm / Advance dialogue |

**Design Philosophy:**
- Minimal inputs for maximum accessibility
- One-hand playable if desired
- No complex combos or timing windows
- Controller support as future enhancement

**Konbini Grid Layout:**
```
+-------------------------------------+
|  [Register]     [Door]     [ATM]    |
|                                     |
|  [Drinks]  [Snacks]  [Bento]        |
|                                     |
|  [Drinks]  [Onigiri] [Desserts]     |
|                                     |
|  [Magazine] [Hot Food] [Backroom->] |
|              (Fryer)                |
+-------------------------------------+
```

**Interaction Zones:** Each station has a clear interaction zone. Approach + E to engage.

---

## Simulation Systems (Game Type Specific)

### Core Simulation Systems

**What's Being Simulated:** A Japanese convenience store (konbini) - the daily rhythms of retail work, customer flow, inventory management, and community relationships.

**Simulation Focus:**
- **Primary:** The konbini itself - shelves, stock levels, customer needs, services
- **Secondary:** Time progression (day/night, seasons), customer patterns, relationship states
- **Tertiary:** Player character growth and skill development

**Simulation Depth:** Abstract/stylized rather than realistic. We simulate the *feeling* of konbini work, not the actual logistics. Stock appears when shipments arrive, customers have needs but aren't demanding, time flows but doesn't pressure.

**System Interconnections:**
- Stock levels affect customer satisfaction (but gently)
- Time of day affects customer types and volume
- Seasons affect available items and events
- Relationships affect dialogue and small story beats
- Unlocks expand what you can do each day

**Emergent Behaviors:** The goal is for regulars to feel like they have lives - arriving at consistent times, having ongoing stories, remembering past interactions.

**Performance Target:** Simulation tick rate optimized for 60fps browser performance. Day/night cycle visible but not distracting.

### Management Mechanics

**Resource Management:**
- **Inventory:** Stock arrives via shipment, you place it on shelves, customers deplete it
- **Time:** Days have natural rhythm but no harsh deadlines
- **Space:** Limited shelf space creates gentle prioritization (what to stock?)
- **No currency management** - you work here, you don't own it (yet?)

**Decision-Making:**
- Which shelves to prioritize stocking
- When to engage with customers vs. stay in zen mode
- Which services to focus on when multiple need attention
- No wrong answers - just different experiences

**Automation vs. Manual:** Everything is manual by design. The satisfaction IS the doing. No automation unlocks that remove gameplay.

**Efficiency Optimization:** Players can develop personal efficiency (muscle memory, optimal routes) but the game never demands it. Being slow is fine.

### Building and Construction

**Minimal for MVP.** This is a work sim, not a tycoon game.

**What's Placeable:**
- Seasonal displays (rotate with calendar)
- Special promotional items
- Potentially: small decorative touches to personalize your konbini

**No Grid Building:** The konbini layout is fixed. You work within it, not redesign it.

**Future Consideration:** If the game expands, konbini customization/upgrades could be a late-game system. But for MVP, the space is your workplace, not your canvas.

### Economic and Resource Loops

**Income Sources:**
- Customer purchases (background - you see the ka-ching, feel the flow)
- Tips from satisfied regulars (small, feel-good moments)
- No direct profit/loss visibility - you're an employee, not the owner

**Expenses:** None visible. This is deliberate - economic stress would violate the Zen pillar.

**Supply Chain:**
- Shipments arrive at start of each day
- Stock variety increases as you unlock new sections
- No supplier management or purchasing decisions

**Economic Balance:** The economy exists to provide gentle progression texture, not as a system to optimize. You can't fail financially.

**Design Philosophy:** Strip away the stress of typical business sims. You show up, you do good work, things get better over time. No spreadsheets, no red ink.

### Progression and Unlocks

**Unlock Conditions:**
- Time-based: Some services unlock after X days worked
- Usage-based: Stock enough shelves, unlock new shelf types
- Relationship-based: Help enough regulars, unlock their backstories
- Seasonal: Certain items only available in certain seasons

**Progression Path:**
1. **Week 1-2:** Basic shelves (drinks, snacks), register, simple customers
2. **Month 1:** Hot food counter (famichiki!), more regulars, first seasonal event
3. **Month 2-3:** Advanced services (takkyubin, bill pay), deeper relationships
4. **Ongoing:** Seasonal rotation, relationship arcs, skill mastery

**New Mechanics Over Time:**
- Additional shelf types and product categories
- New konbini services (ATM assistance, ticket printing, etc.)
- Seasonal events with special tasks
- Deeper dialogue trees with established regulars

**Difficulty Scaling:** None. You just get more to do, more variety, more depth. Never harder, just richer.

**Endgame Content:** There is no "end." The game becomes your cozy routine. Mastery is its own reward. Potentially: narrative conclusion to major character arcs, but the konbini stays open.

### Sandbox vs. Scenario

**Primary Mode: Ongoing Sandbox**
- No strict goals or objectives
- Play indefinitely at your own pace
- Progress happens naturally through play
- The "scenario" is simply: live your konbini life

**No Scenario/Campaign Mode (MVP):** The endless cozy sandbox IS the game.

**Future Consideration:**
- Challenge modes could be added (busy day events, special promotions)
- But these would be opt-in and never stressful
- Example: "Matsuri Festival Week" - busier than usual, special items, but still chill

---

## Progression and Balance

### Player Progression

**Progression Philosophy:** You get better because you're playing, not because you're grinding. Progression is a byproduct of enjoying the game, never the goal that overrides the experience.

**Skill Progression:**
- **Stocking Speed:** Natural improvement through repetition (muscle memory, not stats)
- **Customer Recognition:** Learn regular faces and preferences over time
- **Task Familiarity:** New services feel clunky at first, smooth with practice
- **Store Knowledge:** Know where everything is, anticipate needs

**Content Unlocks:**
| Timeframe | Unlocks |
|-----------|---------|
| Day 1-7 | Basic shelves (drinks, snacks, onigiri), register, 3-5 regulars |
| Week 2-3 | Hot food counter (famichiki!), desserts, more regulars |
| Month 1 | Bento section, first seasonal event, relationship deepening |
| Month 2+ | Advanced services (takkyubin, tickets), magazines, full regular roster |

**Relationship Progression:**
- **Stranger → Acquaintance:** Customer becomes a "regular" (name appears)
- **Acquaintance → Familiar:** Remember their usual order, small talk unlocks
- **Familiar → Friend:** Personal stories emerge, special interactions
- **Friend → Part of Your World:** They feel like YOUR people

**Narrative Progression:**
- Player character backstory revealed through customer dialogue
- "Still saving up, huh?" - hints drop early
- Motivation revealed mid-game through accumulated conversations
- No cutscenes - learn about yourself through playing

### Difficulty Curve

**There is no difficulty curve.** This is a deliberate design choice.

**Complexity Curve (Not Difficulty):**
- More things to do over time (more shelves, more services, more regulars)
- Richer interactions, deeper relationships
- But never HARDER - just MORE
- The game expands horizontally, not vertically

**Pacing:**
- Early game: Simple, focused - learn the core loop
- Mid game: Variety expands, regulars deepen, seasonal events begin
- Late game: Full konbini experience, rich community, mastery of your domain

**Stress Avoidance Mechanisms:**
- No rush mechanics at any point
- Customers never become impatient
- Shipments don't pile up punitively
- Mistakes have no lasting consequences
- You can always walk away and come back

### Economy and Resources

**In-Game Economy:**
- **Visible:** Stock levels on shelves, customer satisfaction expressions
- **Invisible:** Actual money/profit (you're an employee, not an owner)
- **Felt:** The ka-ching of successful transactions, the flow of a busy day

**Resource Types:**
| Resource | Source | Use | Depletion |
|----------|--------|-----|-----------|
| Shelf Stock | Daily shipment | Customer purchases | Sold to customers |
| Time | Day cycle | All activities | Day ends naturally |
| Energy | Infinite | N/A | No energy mechanic |

**No Scarcity Pressure:** Resources exist for texture, not constraint. You can't run out of anything in a way that blocks play.

**Progression Currency (Conceptual):**
- Days worked = experience (unlocks)
- Regulars served = relationship depth
- Tasks completed = personal satisfaction
- None of these are visible numbers - just felt progression

---

## Level Design Framework

### Level Types

**Note:** "Levels" in Conbini Life aren't discrete stages - they're spaces and time periods within the continuous experience.

**Primary Space: The Konbini**
- Fixed layout grid (see Controls section)
- Multiple interaction zones: shelves, register, hot food, backroom
- Each zone has distinct gameplay (stocking, serving, cooking)
- Space feels cozy and knowable, not overwhelming

**Secondary Space: The Commute**
- Bike ride scenes bookend each shift
- Sunrise route TO work, sunset route HOME
- Same general path, different based on:
  - Season (cherry blossoms, summer heat, autumn leaves, winter snow)
  - Time of day (lighting, atmosphere)
  - Random encounters (passing neighbors, wildlife)
- Not interactive gameplay - more of a "portal" transition

**Tertiary Space: The Backroom**
- Where shipments arrive
- Storage for excess stock
- Cleaning supplies, equipment
- Less customer-facing, more zen solo zone

### Level Progression

**Seasonal Cycle (Environmental Progression):**
| Season | Visual Theme | Special Elements |
|--------|--------------|------------------|
| Spring | Cherry blossoms, fresh green | Hanami season items, new beginnings |
| Summer | Bright sun, festival lanterns | Matsuri events, cold drinks, fireworks |
| Autumn | Golden leaves, harvest | Seasonal treats, warm food focus |
| Winter | Snow, warm lights | Holiday items, cozy atmosphere |

**Konbini Evolution:**
- **Day 1:** Basic layout, limited shelves stocked
- **Week 1:** More shelves active, first regulars appearing
- **Month 1:** Hot food counter operational, seasonal displays
- **Month 2+:** Full service konbini, rich regular community

**Commute Route Unlocks:**
- Initial route: Simple path, basic scenery
- Over time: Notice new details, seasonal changes more pronounced
- Potential: Alternate routes, scenic detours (optional discovery)

---

## Art and Audio Direction

### Art Style

**Visual Approach:** AI-generated assets with human curation. Top-down sprite/pixel aesthetic consistent with the prototype.

**Color Palette:**
- Warm, cozy tones as foundation
- Seasonal variations: soft pinks (spring), bright blues (summer), warm oranges (autumn), cool whites (winter)
- Interior lighting: warm fluorescent konbini glow
- Exterior: natural lighting matching time of day

**Character Design:**
- Simple, expressive sprites for player and customers
- Regulars have distinct silhouettes and color schemes
- Readable at small scale (browser game constraints)
- Consistent style across all characters

**Environment Design:**
- Konbini interior: authentic Japanese convenience store details
- Products: recognizable konbini staples (onigiri, bento, drinks, magazines)
- Commute scenes: rice fields, residential streets, seasonal flora
- Weather effects: rain, snow, falling leaves, cherry blossom petals

**UI/UX Visual Style:**
- Minimal, unobtrusive UI
- Cozy aesthetic matching game world
- Clear interaction feedback without cluttering the zen
- No health bars, timers, or stress-inducing elements

**Reference Points:**
- Stardew Valley (sprite scale and readability)
- Japanese convenience store photography (authenticity)
- Lo-fi aesthetic YouTube streams (cozy vibe)

### Audio and Music

**Music Approach:** Procedural/AI-generated lo-fi soundtrack. Calm, unobtrusive, loopable.

**Audio Pillars:**
1. **Audio is gameplay** - Rising pitch shelf-stocking contributes to the zen feel
2. **Ambient immersion** - Sound creates place and mood
3. **Never intrusive** - Audio enhances calm, never disrupts it

**Core Sound Design:**

| Sound | Description | Purpose |
|-------|-------------|---------|
| Shelf stocking | Rising pitch (1-9 scale) | The dopamine loop |
| Completion ka-ching | Satisfying transaction/completion | Reward trigger |
| Door chime | Ding-dong on customer entry | Awareness without urgency |
| Register beep | Item scanning | Transaction feedback |
| Famichiki sizzle | Hot food cooking | Ambient immersion |

**Music System:**
- Lo-fi beats, calm and loopable
- Procedural elements for variety
- Time-of-day variations (morning bright, evening mellow)
- Seasonal themes (spring light, winter cozy)
- Never distracting from the satisfying task sounds

**Ambient Soundscape:**
- Soft customer murmurs (background)
- Street sounds from outside (distant)
- Refrigerator hum (subtle)
- Rain/weather when applicable

**Commute Audio:**
- Bike sounds (gentle pedaling, wheels)
- Nature ambience (birds, wind, water)
- Seasonal audio cues (cicadas summer, crisp winter air)

---

## Technical Specifications

### Performance Requirements

**Target Performance:**
- 60fps on average hardware (mid-range laptop, 3-year-old desktop)
- Smooth animations for all core interactions
- No perceptible input lag on keyboard controls
- Instant audio feedback on actions

**Browser Constraints:**
- Must run in modern browsers (Chrome, Firefox, Safari, Edge)
- No plugins or extensions required
- Mobile browser support: nice-to-have, not required for MVP

**Memory Footprint:**
- Keep total asset size light for web delivery
- Lazy-load non-essential assets
- Efficient sprite atlasing
- Target: Initial load under 5MB, total under 20MB

**Audio Performance:**
- Web Audio API for procedural music
- Low-latency sound effects (important for responsive feedback)
- Audio sprite sheets for common sounds

### Platform-Specific Details

**Primary Platform: Web Browser**
- **Framework:** Vanilla JavaScript + HTML5 Canvas
- **No external dependencies** (except possibly Web Audio API polyfills)
- **Save System:** LocalStorage for game state
- **Hosting:** Static file hosting (GitHub Pages, Netlify, etc.)

**Development Stack:**
- HTML5 Canvas for rendering
- Vanilla JS for game logic
- Web Audio API for sound (already prototyped)
- CSS for UI elements where appropriate

**Browser Compatibility Matrix:**
| Browser | Minimum Version | Priority |
|---------|-----------------|----------|
| Chrome | 90+ | Primary |
| Firefox | 88+ | Primary |
| Safari | 14+ | Secondary |
| Edge | 90+ | Secondary |

**Fallback Strategy:**
- If browser performance hits limits, consider Electron wrapper
- Steam release possible with minimal changes
- Mobile pivot would require touch control redesign

### Asset Requirements

**Sprite Assets:**
| Category | Estimated Count | Notes |
|----------|-----------------|-------|
| Player character | 8-12 sprites | Walk cycle, actions |
| Customers (regulars) | 10-15 characters x 4-6 sprites | Distinct designs |
| Customers (generic) | 5-8 types x 4 sprites | Variety pool |
| Konbini interior | 1 tileset | Grid-based layout |
| Products | 30-50 sprites | Shelf items, food, drinks |
| Seasonal elements | 4 sets x 10-15 elements | Per season |
| Commute scenes | 4 seasonal variants | Background art |

**Audio Assets:**
| Category | Estimated Count | Notes |
|----------|-----------------|-------|
| Sound effects | 20-30 | Core interactions |
| Music loops | 8-12 | Time/season variants |
| Ambient sounds | 10-15 | Environmental audio |

**Production Pipeline:**
- AI-generated base assets (Gemini, etc.)
- Human curation and consistency pass
- Style guide enforcement
- Asset optimization for web delivery

---

## Development Epics

### Epic Structure

**Epic 0: Foundation & Core Mechanics**
- Set up HTML5 Canvas game loop
- Implement basic grid movement
- Build shelf-stocking mechanic with audio feedback
- Validate core mechanics feel right before proceeding
- Deliverable: Playable prototype with satisfying basic interactions

**Epic 1: Core Loop Implementation**
- Implement day/night cycle
- Add basic customer spawning and movement
- Build register checkout flow
- Create shipment arrival system
- Deliverable: One complete day cycle that's playable

**Epic 2: Bike Commute**
- Create sunrise bike-to-work scene
- Create sunset bike-home scene
- Implement seasonal visual variants (start with one season)
- Add ambient audio for commute
- Deliverable: Full day loop with commute bookends

**Epic 3: Customer & Relationship System**
- Create regular customer data structure
- Implement customer memory (visits, preferences)
- Build dialogue system with progressive reveals
- Design 3-5 initial regular characters
- Deliverable: Regulars who feel like real people

**Epic 4: Progression & Unlocks**
- Implement unlock conditions system
- Add new shelf types as unlockables
- Create first seasonal event framework
- Build skill progression (subtle, felt not numbered)
- Deliverable: Sense of growth over multiple play sessions

**Epic 5: Services Expansion**
- Add hot food counter (famichiki!)
- Implement additional konbini services
- Expand product variety
- Add service-specific interactions
- Deliverable: Rich, full-service konbini

**Epic 6: Seasonal Content**
- Complete all four seasonal visual sets
- Implement seasonal item rotation
- Add seasonal events (matsuri, holidays)
- Create seasonal-specific customer behaviors
- Deliverable: Full year cycle playable

**Epic 7: Polish & Launch**
- Audio polish pass
- Visual consistency pass
- Performance optimization
- Bug fixing and playtesting
- Deliverable: Release-ready game

---

## Success Metrics

### Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Frame Rate | 60fps stable | Performance profiling |
| Load Time | Under 3 seconds | First contentful paint |
| Bundle Size | Under 5MB initial | Build analysis |
| Input Latency | Under 16ms | User testing |
| Audio Latency | Under 50ms | Feedback responsiveness |
| Browser Compatibility | 95%+ modern browsers | Cross-browser testing |
| Memory Usage | Under 100MB runtime | Chrome DevTools |
| Save/Load Reliability | 100% LocalStorage success | Automated testing |

### Gameplay Metrics

**Core Experience Validation:**
| Metric | Target | Measurement |
|--------|--------|-------------|
| Session Length | 15-45 min average | Analytics (if implemented) |
| Return Rate | Players want to come back | Qualitative feedback |
| Mechanic Satisfaction | "Stocking feels great" | Playtester quotes |
| Vibe Check | "Chill," "relaxing," "zen" | Player descriptions |
| One More Day Pull | Players reluctant to quit | Session exit behavior |

**Qualitative Success Indicators:**
- Players describe the game as "cozy" or "relaxing" unprompted
- Players mention specific regulars by name
- Players notice and appreciate seasonal changes
- The shelf-stocking audio feedback is mentioned positively
- Players express desire to return "tomorrow"

**Anti-Metrics (What We're NOT Optimizing For):**
- Time-to-completion (there is no completion)
- Score/leaderboard rankings (none exist)
- Monetization conversion (not applicable)
- Viral growth metrics (organic only)
- Engagement tricks (no FOMO, no streaks)

---

## Out of Scope

**Explicitly NOT in This Game (MVP):**

| Feature | Why It's Out |
|---------|--------------|
| Dating sim mechanics | Violates zen pillar - relationship drama adds stress |
| Combat/conflict systems | Wrong genre, wrong vibe |
| Life sim needs (hunger, sleep, hygiene) | Micromanagement undermines relaxation |
| Business ownership/tycoon elements | You're an employee finding zen, not an optimizer |
| Multiplayer | Complexity explosion, solo zen is the focus |
| Mobile/touch controls | MVP is keyboard-only browser |
| Story-driven campaign | Emergent narrative only |
| Leaderboards/achievements | No competition, no FOMO |
| Monetization systems | Not applicable for this project |
| VR/AR support | Platform scope creep |

**Deferred to Post-MVP:**
- Controller support
- Steam/desktop release
- Additional language localization
- Advanced weather systems
- Konbini customization/upgrades
- Cloud save sync
- Accessibility options (audio descriptions, colorblind modes)

**The Scope Filter:** If a feature doesn't serve Zen > Progression > Routine > Connection, it doesn't ship. Even good ideas get cut if they add stress.

---

## Assumptions and Dependencies

### Assumptions

**Technical Assumptions:**
- HTML5 Canvas + vanilla JS is sufficient for scope
- Web Audio API provides adequate low-latency audio
- LocalStorage is reliable enough for save data
- Target browsers maintain current Canvas performance

**Design Assumptions:**
- The stocking mechanic (audio feedback) will feel satisfying when polished
- Players will develop attachment to regular customers
- Seasonal variation provides enough long-term variety
- The bike commute adds value rather than feeling like loading screens

**Production Assumptions:**
- AI-generated assets can achieve consistent visual style
- Procedural/AI audio can match cozy aesthetic
- Small team + AI assistance is sufficient for scope
- Iteration speed will be fast enough for polish

### Dependencies

**Technical Dependencies:**
- Modern browser support for Canvas and Web Audio API
- LocalStorage availability (no incognito/privacy mode blocking)
- Sufficient client-side performance for 60fps

**Asset Dependencies:**
- AI image generation tools (Gemini, etc.) for sprites
- AI/procedural audio tools for music and effects
- Reference material for authentic konbini details

**Knowledge Dependencies:**
- Japanese konbini culture research for authenticity
- Lo-fi music generation techniques
- Browser game optimization best practices

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Browser performance limits | Electron wrapper fallback ready |
| AI asset inconsistency | Style guide + human curation pass |
| Core mechanics don't feel right | Prototype first, validate before building |
| Scope creep | Zen pillar as strict filter |
| Player confusion (no goals) | Clear onboarding, embrace sandbox nature |

---

*This Game Design Document serves as the blueprint for Conbini Life development. All features and systems should be validated against the four pillars (Zen > Progression > Routine > Connection) before implementation.*

*Document created: 2026-01-11*
*Next steps: Architecture planning and Epic 0 implementation*
