---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - "_bmad-output/brainstorming-session-2026-01-10.md"
documentCounts:
  brainstorming: 1
  research: 0
  notes: 0
workflowType: "game-brief"
lastStep: 2
project_name: "Conbini Life"
user_name: "Big Dogs"
date: "2026-01-11"
game_name: "Conbini Life"
---

# Game Brief: Conbini Life

**Date:** 2026-01-11
**Author:** Big Dogs
**Status:** Draft for GDD Development

---

## Executive Summary

**Conbini Life** is a cozy konbini sim where you bike through the changing seasons of Japan, find zen in the rhythm of work, and build quiet connections with the regulars who become part of your life.

**Target Audience:** Casual gamers aged 18-35 who play to decompress - the Stardew Valley / Animal Crossing crowd.

**Core Pillars:** Zen > Progression > Routine > Connection

**Key Differentiators:** Authentic Japanese konbini setting, bike commute as ritual, work sim (not life sim), audio-driven core toy.

**Platform:** Web browser (HTML5 Canvas, vanilla JS)

**Success Vision:** The game you reluctantly close - players leave sessions feeling calm, satisfied, and wanting to come back tomorrow.

---

## Game Vision

### Core Concept

A cozy konbini sim where you bike through the changing seasons of Japan, find zen in the rhythm of work, and build quiet connections with the regulars who become part of your life.

### Elevator Pitch

Conbini Life is a cozy Japanese convenience store sim where you find peace in the rhythm of work. Bike to your shop through sunrise rice fields and cherry blossom paths, stock shelves to a satisfying soundtrack of rising tones and ka-chings, and serve regulars who become familiar faces - on the job and on your commute home. As the seasons turn from summer festivals to autumn harvests to winter snow, grow your skills, unlock new services, and watch your little corner of Japan come alive. It's not about stress or survival - it's the zen of a job done well, and the quiet pride of becoming great at it.

### Vision Statement

Conbini Life is the game you reluctantly close. One more shelf to stock, one more regular to greet, one more sunset bike ride through the rice fields - but you stop yourself, satisfied, knowing your little corner of Japan will be there tomorrow. We're building a place where the commute is the meditation, progress feels earned, community feels real, and the simple rhythm of work becomes the rest you didn't know you needed.

---

## Target Market

### Primary Audience

Casual gamers aged 18-35, primarily working adults who use games to decompress. They know and love Stardew Valley, Animal Crossing, and similar cozy titles. They play during wind-down hours - after work, before bed, weekend mornings with coffee.

**Demographics:**
- Age 18-35, skewing toward working professionals
- Platform-flexible (Switch, PC, mobile, browser)
- Time-limited but willing to invest in the right game

**Gaming Preferences:**
- Low-stress, no-fail-state gameplay
- Satisfying progression without pressure
- Routine and rhythm over challenge

**Motivations:**
- Decompression after stressful days
- Sense of accomplishment without stakes
- Cozy escapism

### Secondary Audience

People curious about Japanese culture who want an authentic, chill window into everyday Japan - without the anime deep-dive. They're drawn to the aesthetic and vibe, not the otaku rabbit hole.

### Market Context

The cozy game market is proven and growing (Stardew, Unpacking, A Little to the Left, Coffee Talk). The gap: an authentic Japanese work-sim that's genuinely relaxing - not stressful like Overcooked or bureaucratic like Papers Please. Conbini Life fills that niche.

**Similar Successful Games:**
Stardew Valley, Animal Crossing, Unpacking, Coffee Talk, A Short Hike

**Market Opportunity:**
Browser-based entry point lowers friction. Potential expansion to Steam/mobile. Japan-curious audience is underserved with non-anime cozy content.

---

## Game Fundamentals

### Core Gameplay Pillars

1. **Zen / Relaxation** - No stress, no fail states, no pressure. The game exists to calm, not challenge.
2. **Progression / Mastery** - Grow your skills, unlock new services, become great at your job - but never at the cost of chill.
3. **Satisfying Routine** - Tasks feel good. The rhythm of work is the reward.
4. **Connection** - Build relationships with regulars who become familiar faces in your little corner of Japan.

**Pillar Priority:** When pillars conflict, prioritize:
Zen > Progression > Routine > Connection

If a feature adds stress, it doesn't ship - even if it would be satisfying or deepen connections.

### Primary Mechanics

- **Stock** - Replenish shelves with satisfying audio feedback (pitch rises 1-9, ka-ching on complete)
- **Serve** - Check out customers at the register
- **Bike** - Commute through seasonal Japan at sunrise and sunset (the ritual bookends)
- **Unlock** - Gain new services, seasonal items, and capabilities as you grow
- **Connect** - Greet regulars, learn their stories over time

**Core Loop:**
Bike in (sunrise) → Stock & Tidy → Serve Customers → Bike home (sunset) → See Progress → Repeat

### Player Experience Goals

- **Relaxation / Flow** - The zen of repetitive tasks done well
- **Quiet Satisfaction** - "I did a good job today"
- **Belonging** - This is my corner, these are my people
- **Gentle Progress** - I'm getting better, but there's no rush

**Emotional Journey:**
Arrive (anticipation) → Work (flow state) → Connect (warmth) → Leave (satisfied, reluctant to go)

**After a session:** "That was exactly what I needed. I want to go back tomorrow."

---

## Scope and Constraints

### Target Platforms

**Primary:** Web browser (HTML5 Canvas, vanilla JS)
**Secondary:** TBD - pivot if browser hits limits (Steam/Electron wrapper possible)

### Budget Considerations

- ~$100 for AI asset generation tools
- No external contractors - AI handles asset creation
- Zero marketing budget (organic/word of mouth)

### Team Resources

- Small team + Claude (AI-assisted development)
- Art: AI-generated (Gemini, etc.)
- Audio: AI-generated / procedural
- Code: Human + AI pair programming

**Skill Gaps:** None critical - AI fills traditional gaps

### Technical Constraints

- **Framework:** Vanilla JS + HTML5 Canvas (current prototype stack)
- **Performance:** Target 60fps on average hardware
- **File size:** Keep light for web delivery
- **Audio:** Web Audio API (procedural music already prototyped)
- **Saves:** LocalStorage for now, cloud saves if needed later
- **Approach:** Push browser until we hit limits, then pivot

### Scope Realities

This is an AI-assisted game dev experiment. Traditional constraints (time, budget, team size) are less relevant. Ship when it's good, iterate fast, let AI handle the heavy lifting.

---

## Reference Framework

### Inspiration Games

**Stardew Valley** (Primary)
- Taking: Progression loop, seasonal rhythm, unlockables, "one more day" pull, relationship with regulars
- Not Taking: Farming/combat/mining complexity, dating sim mechanics, system overwhelm

**The Sims**
- Taking: Life sim energy, character in a world
- Not Taking: Micromanagement, complexity, needs meters

**Work Simulator Genre** (Car Mechanic Simulator, etc.)
- Taking: Satisfying "do a job well" loop, procedural tasks
- Not Taking: Realism for realism's sake, technical complexity

### Competitive Analysis

**Direct Competitors:**
- Stardew Valley, Animal Crossing, Coffee Talk, Unpacking
- Various cozy sims on Steam

**Competitor Strengths:**
- Proven audiences, polished loops, established communities

**Competitor Weaknesses:**
- No authentic Japanese work-sim that's actually chill
- Most are fantasy/rural settings, not urban Japan
- None have the bike commute ritual

### Key Differentiators

1. **Authentic Japanese konbini setting** - Real culture, not fantasy farm
2. **The commute as ritual** - Bike through seasonal Japan as the "portal" to your world
3. **Work sim, not life sim** - Be great at your job without managing a whole life
4. **Audio-driven core toy** - Rising pitch shelf-stocking creates the zen satisfaction

**Unique Value Proposition:**
Stardew Valley meets Japanese convenience store culture - the cozy work sim where the commute is the meditation and the job is the therapy.

---

## Content Framework

### World and Setting

Modern-day Japan - a small town with your konbini at its heart. The world exists through your daily commute (rice fields, city streets, seasonal landscapes) and the customers who walk through your door. Authentic Japanese slice-of-life, not fantasy.

### Narrative Approach

**Emergent character discovery** - you don't know who you are at the start. Your story unfolds through customer interactions and small dialogue moments.

- Hints drop early ("Still saving up, huh?")
- Motivation revealed mid-game through conversations
- No cutscenes, no exposition dumps
- Learn about yourself and your world through playing

**Story Delivery:** Environmental and emergent - dialogue with regulars, seasonal events, small moments that accumulate into meaning.

### Content Volume

- 4 seasons with distinct visuals and events
- ~10-15 regular customers with personalities and arcs
- Multiple shelf types and services to unlock
- Bike commute scenes (morning/evening, seasonal variants)

---

## Art and Audio Direction

### Visual Style

- AI-generated assets (Gemini, etc.)
- Top-down sprite/pixel aesthetic (per prototype)
- Warm, cozy color palette
- Seasonal variations: cherry blossoms, summer festivals, autumn leaves, winter snow

**References:** Stardew Valley aesthetic, Japanese convenience store photography

### Audio Style

- Procedural/AI-generated lo-fi music
- Core toy: rising pitch feedback on shelf-stocking (1-9), ka-ching on complete
- Ambient sounds: door chime, register, customer murmurs
- Seasonal audio cues

### Production Approach

- AI-generated assets, human-curated
- Establish style guide early, iterate for consistency
- Procedural audio reduces asset burden

---

## Risk Assessment

### Key Risks

1. **Scope creep** - High likelihood, high impact
2. **Browser performance limits** - Medium likelihood, high impact
3. **Core loop gets stale** - Medium likelihood, high impact
4. **AI asset inconsistency** - Medium likelihood, medium impact
5. **Discoverability** - High likelihood, medium impact

### Mitigation Strategies

- **Scope creep:** Zen pillar is the filter - if it adds stress, cut it
- **Browser limits:** Pivot to Electron/Steam wrapper if needed
- **Core loop:** Nail the audio feedback toy - it's the hook
- **Asset quality:** Establish style guide, curate ruthlessly
- **Discoverability:** Unique hook (konbini + bike commute) differentiates

---

## Success Criteria

### MVP Definition

**Minimum Playable Version includes:**
- Bike commute in/out (simple sunrise/sunset transition)
- Shelf stocking with progressive audio feedback (the core toy)
- Basic customer checkout flow
- 3-5 regular customers with simple dialogue
- Progression: unlock 1-2 new shelf types or services
- Single "season" or day/night cycle only

**Not in MVP:**
- Full 4-season cycle with all visual variants
- All 10-15 planned regulars
- Narrative reveals / character backstory
- All services and unlocks
- Seasonal events

### Success Metrics

- **Engagement:** Players complete sessions and express desire to return
- **Core loop validation:** Shelf-stocking audio feedback feels satisfying
- **Vibe check:** Players describe experience as "chill," "relaxing," or "zen"
- **Technical:** Smooth 60fps in browser, no major bugs

### Launch Goals

This is an AI-assisted game development experiment. Success is measured by:
- Proving the core loop works
- Validating AI-assisted development workflow
- Creating something players genuinely enjoy

---

## Next Steps

### Immediate Actions

1. **Proceed to GDD** - Detail mechanics, systems, progression, and content
2. **Iterate on prototype** - Nail the shelf-stocking audio feedback
3. **Establish art style guide** - Test AI asset generation for visual consistency

### Research Needs

- Japanese konbini culture details for authenticity
- Lo-fi procedural music generation approaches
- Browser performance optimization techniques

### Open Questions

- What is the player character saving for? (narrative hook - TBD in GDD)
- How long is a "day" in real-time?
- How does progression pacing work across seasons?

---

## Appendices

### A. Input Documents

- Brainstorming session: `_bmad-output/brainstorming-session-2026-01-10.md`
- Prototype: `prototype/shelf-stocking.html`

### B. References

- Stardew Valley (progression, seasons, regulars)
- The Sims (life sim energy without complexity)
- Work Simulator genre (satisfying job loop)

---

_This Game Brief serves as the foundational input for Game Design Document (GDD) creation._

_Next workflow: `/bmad:bmgd:workflows:gdd` to create detailed game design documentation._
