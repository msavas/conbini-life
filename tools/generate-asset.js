#!/usr/bin/env node
/**
 * Konbini Asset Generator
 * Uses Gemini 3 Pro Image Preview to generate pixel art assets
 */

const fs = require('fs');
const path = require('path');

// Load API key from .env
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-3-pro-image-preview';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const ASSETS_DIR = path.join(__dirname, '..', 'prototype', 'assets');

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

async function generateAsset(prompt, filename) {
    console.log(`\nGenerating: ${filename}`);
    console.log(`Prompt: ${prompt.substring(0, 100)}...`);

    const fullPrompt = `Create a pixel art sprite for a cozy Japanese convenience store (konbini) game.
Style: Cute pixel art, 32x32 or 48x48 pixels, warm cozy colors, clean edges.
Game context: Relaxing simulation game about running a konbini.

Specific request: ${prompt}`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: fullPrompt
                    }]
                }],
                generationConfig: {
                    responseModalities: ["image", "text"]
                }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`API error: ${response.status} - ${error}`);
        }

        const data = await response.json();

        // Extract image from response
        if (data.candidates && data.candidates[0]?.content?.parts) {
            for (const part of data.candidates[0].content.parts) {
                if (part.inlineData) {
                    const imageData = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType;
                    const ext = mimeType.split('/')[1] || 'png';

                    const outputPath = path.join(ASSETS_DIR, `${filename}.${ext}`);
                    fs.writeFileSync(outputPath, Buffer.from(imageData, 'base64'));
                    console.log(`Saved: ${outputPath}`);
                    return outputPath;
                }
            }
        }

        console.log('Response:', JSON.stringify(data, null, 2));
        throw new Error('No image in response');

    } catch (error) {
        console.error(`Error generating ${filename}:`, error.message);
        return null;
    }
}

// Asset definitions for konbini game
const ASSETS = {
    // Shelves
    'shelf-drinks': 'A refrigerated drink cooler shelf, front view, showing colorful bottles and cans of Japanese drinks (green tea, coffee, ramune), glass door with slight glow',
    'shelf-snacks': 'A snack shelf displaying Japanese convenience store snacks - chip bags, pocky, candy, rice crackers, colorful packaging',
    'shelf-bento': 'A refrigerated display case with Japanese bento boxes, onigiri (triangle rice balls), and sandwiches',
    'shelf-hot': 'A hot food display case with nikuman (steamed buns) and karaage (fried chicken), warm orange glow',

    // Characters
    'player': 'A konbini worker character, front-facing, wearing blue apron over white shirt, friendly expression, standing pose',
    'customer-1': 'A casual Japanese customer, front-facing, holding a shopping basket, relaxed pose',
    'customer-2': 'A businessperson customer in suit, front-facing, looking at phone',
    'customer-3': 'An elderly customer with a small shopping bag, friendly smile',

    // Environment
    'floor-tile': 'A single floor tile for a convenience store, clean linoleum pattern, slightly reflective',
    'door-entrance': 'Automatic sliding glass doors, konbini entrance style, with welcome mat',
    'register': 'A convenience store cash register counter with POS system and small displays',
    'stockroom-crate': 'A cardboard shipping box/crate with Japanese text labels, slightly open showing products inside',

    // Items
    'item-onigiri': 'A single Japanese onigiri (triangle rice ball) wrapped in nori seaweed and plastic wrap',
    'item-bento': 'A packaged Japanese bento box with compartments visible through clear lid',
    'item-drink': 'A can of Japanese green tea, with kanji characters on label',
    'item-famichiki': 'Famichiki (Japanese convenience store fried chicken) in a paper sleeve'
};

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Konbini Asset Generator');
        console.log('=======================\n');
        console.log('Usage:');
        console.log('  node generate-asset.js <asset-name>    Generate specific asset');
        console.log('  node generate-asset.js --all           Generate all assets');
        console.log('  node generate-asset.js --list          List available assets');
        console.log('  node generate-asset.js --custom "prompt" filename');
        console.log('\nAvailable assets:');
        Object.keys(ASSETS).forEach(name => {
            console.log(`  - ${name}`);
        });
        return;
    }

    if (args[0] === '--list') {
        console.log('Available assets:\n');
        Object.entries(ASSETS).forEach(([name, prompt]) => {
            console.log(`${name}:`);
            console.log(`  ${prompt}\n`);
        });
        return;
    }

    if (args[0] === '--all') {
        console.log('Generating all assets...\n');
        for (const [name, prompt] of Object.entries(ASSETS)) {
            await generateAsset(prompt, name);
            // Small delay between requests
            await new Promise(r => setTimeout(r, 1000));
        }
        console.log('\nDone!');
        return;
    }

    if (args[0] === '--custom' && args.length >= 3) {
        const prompt = args[1];
        const filename = args[2];
        await generateAsset(prompt, filename);
        return;
    }

    // Generate specific asset
    const assetName = args[0];
    if (ASSETS[assetName]) {
        await generateAsset(ASSETS[assetName], assetName);
    } else {
        console.error(`Unknown asset: ${assetName}`);
        console.log('Use --list to see available assets');
    }
}

main();
