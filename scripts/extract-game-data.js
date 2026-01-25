/**
 * Game Data Extractor for Sandcastle Builder
 *
 * Parses boosts.js, badges.js, and tools.js to extract static game data
 * into JSON format for use in the modern implementation.
 *
 * Usage: node scripts/extract-game-data.js
 */

const fs = require('fs').promises;
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'src', 'data');

/**
 * Parse a price value that may be a number or string like "1.5M"
 */
function parsePrice(value) {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return 0;

    // Handle scientific notation strings
    const multipliers = {
        'K': 1e3, 'M': 1e6, 'G': 1e9, 'T': 1e12,
        'P': 1e15, 'E': 1e18, 'Z': 1e21, 'Y': 1e24,
        'W': 1e42, 'Q': 1e210
    };

    const match = value.match(/^([0-9.]+)\s*([KMGTPEZYWQ]*)$/i);
    if (match) {
        const num = parseFloat(match[1]);
        const suffix = match[2].toUpperCase();
        const mult = multipliers[suffix] || 1;
        return num * mult;
    }

    return parseFloat(value) || 0;
}

/**
 * Extract boost definitions from boosts.js
 */
async function extractBoosts() {
    const content = await fs.readFile(path.join(ROOT_DIR, 'boosts.js'), 'utf-8');

    const boosts = [];
    const boostsByAlias = {};

    // Match new Molpy.Boost({ ... }) patterns
    // This regex finds the content between the opening { and closing });
    const boostPattern = /new\s+Molpy\.Boost\s*\(\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}\s*\)/g;

    let match;
    let id = 0;

    while ((match = boostPattern.exec(content)) !== null) {
        const boostContent = match[1];

        // Extract properties
        const boost = {
            id: id++,
            name: extractStringProperty(boostContent, 'name'),
            alias: extractStringProperty(boostContent, 'alias'),
            icon: extractStringProperty(boostContent, 'icon'),
            group: extractStringProperty(boostContent, 'group') || 'boosts',
            description: '',
            stats: undefined,
            price: {},
            className: extractStringProperty(boostContent, 'className'),
            startPower: extractNumberProperty(boostContent, 'startPower'),
            startCountdown: extractNumberProperty(boostContent, 'startCountdown'),
            department: extractBoolProperty(boostContent, 'department'),
            logic: extractBoolProperty(boostContent, 'logic'),
            tier: extractNumberProperty(boostContent, 'tier'),
            prizes: extractNumberProperty(boostContent, 'prizes'),
            countdownCMS: extractBoolProperty(boostContent, 'countdownCMS'),
            isToggle: boostContent.includes("className: 'toggle'") || boostContent.includes('className: "toggle"'),
            isStuff: boostContent.includes('defStuff'),
            hasDynamicDescription: boostContent.includes('desc: function'),
            hasDynamicStats: boostContent.includes('stats: function'),
            hasDynamicPrice: boostContent.includes('priceFunction'),
            hasBuyFunction: boostContent.includes('buyFunction'),
            hasLockFunction: boostContent.includes('lockFunction'),
            hasUnlockFunction: boostContent.includes('unlockFunction'),
            hasCountdownFunction: boostContent.includes('countdownFunction'),
            hasLoadFunction: boostContent.includes('loadFunction'),
        };

        // Use name as alias if not specified
        if (!boost.alias) boost.alias = boost.name;

        // Extract static description if not a function
        if (!boost.hasDynamicDescription) {
            boost.description = extractStringProperty(boostContent, 'desc') || '';
        }

        // Extract static stats if not a function
        if (!boost.hasDynamicStats) {
            boost.stats = extractStringProperty(boostContent, 'stats');
        }

        // Extract price object
        const priceMatch = boostContent.match(/price\s*:\s*\{([^}]+)\}/);
        if (priceMatch) {
            const priceContent = priceMatch[1];
            const priceProps = priceContent.matchAll(/(\w+)\s*:\s*(['"]?[\d.KMGTPEZYWQe+]+['"]?)/g);
            for (const prop of priceProps) {
                const key = prop[1];
                let value = prop[2].replace(/['"]/g, '');
                boost.price[key] = value;
            }
        }

        if (boost.name) {
            boosts.push(boost);
            boostsByAlias[boost.alias] = boost;
        }
    }

    console.log(`Extracted ${boosts.length} boosts`);
    return { boosts, boostsByAlias };
}

/**
 * Extract badge definitions from badges.js
 */
async function extractBadges() {
    const content = await fs.readFile(path.join(ROOT_DIR, 'badges.js'), 'utf-8');

    const badges = [];
    const badgesByName = {};

    // Match new Molpy.Badge({ ... }) patterns
    const badgePattern = /new\s+Molpy\.Badge\s*\(\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}\s*\)/g;

    let match;
    let id = 0;

    while ((match = badgePattern.exec(content)) !== null) {
        const badgeContent = match[1];

        const badge = {
            id: id++,
            name: extractStringProperty(badgeContent, 'name'),
            group: extractStringProperty(badgeContent, 'group') || 'badges',
            description: '',
            stats: extractStringProperty(badgeContent, 'stats'),
            visibility: extractNumberProperty(badgeContent, 'vis') || 0,
            hasDynamicDescription: badgeContent.includes('desc: function'),
        };

        if (!badge.hasDynamicDescription) {
            badge.description = extractStringProperty(badgeContent, 'desc') || '';
        }

        if (badge.name) {
            badges.push(badge);
            badgesByName[badge.name] = badge;
        }
    }

    console.log(`Extracted ${badges.length} badges`);
    return { badges, badgesByName };
}

/**
 * Extract tool definitions from tools.js
 */
async function extractTools() {
    const content = await fs.readFile(path.join(ROOT_DIR, 'tools.js'), 'utf-8');

    const sandTools = [];
    const castleTools = [];

    // Find all SandTool definitions by finding "new Molpy.SandTool({" and matching to closing "})"
    const sandToolStarts = [...content.matchAll(/new\s+Molpy\.SandTool\s*\(\s*\{/g)];

    for (let i = 0; i < sandToolStarts.length; i++) {
        const startIdx = sandToolStarts[i].index + sandToolStarts[i][0].length;
        const toolContent = extractBalancedContent(content, startIdx - 1); // -1 to include opening {

        const tool = {
            id: i,
            name: extractStringProperty(toolContent, 'name'),
            commonName: extractStringProperty(toolContent, 'commonName') || '',
            icon: extractStringProperty(toolContent, 'icon'),
            description: extractStringProperty(toolContent, 'desc') || '',
            type: 'sand',
            basePrice: extractNumberProperty(toolContent, 'price') || 0,
            nextThreshold: extractNumberProperty(toolContent, 'nextThreshold') || 1,
            hasDynamicRate: toolContent.includes('spmNP: function'),
        };

        if (tool.name) {
            sandTools.push(tool);
        }
    }

    // Find all CastleTool definitions
    const castleToolStarts = [...content.matchAll(/new\s+Molpy\.CastleTool\s*\(\s*\{/g)];

    for (let i = 0; i < castleToolStarts.length; i++) {
        const startIdx = castleToolStarts[i].index + castleToolStarts[i][0].length;
        const toolContent = extractBalancedContent(content, startIdx - 1);

        const tool = {
            id: i,
            name: extractStringProperty(toolContent, 'name'),
            commonName: extractStringProperty(toolContent, 'commonName') || '',
            icon: extractStringProperty(toolContent, 'icon'),
            description: extractStringProperty(toolContent, 'desc') || '',
            type: 'castle',
            basePrice: extractNumberProperty(toolContent, 'price0') || 0, // Castle tools use price0
            nextThreshold: extractNumberProperty(toolContent, 'nextThreshold') || 1,
            hasDynamicRate: true, // Castle tools always have complex logic
        };

        if (tool.name) {
            castleTools.push(tool);
        }
    }

    console.log(`Extracted ${sandTools.length} sand tools, ${castleTools.length} castle tools`);
    return { sandTools, castleTools };
}

/**
 * Extract content between balanced braces starting at given position
 */
function extractBalancedContent(content, startIdx) {
    let depth = 0;
    let inString = false;
    let stringChar = null;
    let result = '';

    for (let i = startIdx; i < content.length; i++) {
        const char = content[i];
        const prevChar = i > 0 ? content[i - 1] : '';

        // Track string state
        if ((char === '"' || char === "'") && prevChar !== '\\') {
            if (!inString) {
                inString = true;
                stringChar = char;
            } else if (char === stringChar) {
                inString = false;
                stringChar = null;
            }
        }

        // Track brace depth (only outside strings)
        if (!inString) {
            if (char === '{') depth++;
            if (char === '}') depth--;
        }

        result += char;

        // Stop when we close the opening brace
        if (depth === 0 && result.length > 1) {
            break;
        }
    }

    return result;
}

/**
 * Extract group definitions from boosts.js
 */
async function extractGroups() {
    const content = await fs.readFile(path.join(ROOT_DIR, 'boosts.js'), 'utf-8');

    const groups = {};

    // Match Molpy.groupNames object
    const groupMatch = content.match(/Molpy\.groupNames\s*=\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/);
    if (groupMatch) {
        const groupContent = groupMatch[1];

        // Match each group definition
        const groupPattern = /(\w+)\s*:\s*\[([^\]]+)\]/g;
        let match;

        while ((match = groupPattern.exec(groupContent)) !== null) {
            const groupId = match[1];
            const values = match[2].split(',').map(s => s.trim().replace(/['"]/g, ''));

            groups[groupId] = {
                singular: values[0] || groupId,
                plural: values[1] || groupId,
                icon: values[2] || groupId,
                title: values[3],
                prefix: values[4],
                suffix: values[5],
            };
        }
    }

    console.log(`Extracted ${Object.keys(groups).length} groups`);
    return groups;
}

/**
 * Extract version from data.js
 */
async function extractVersion() {
    const content = await fs.readFile(path.join(ROOT_DIR, 'data.js'), 'utf-8');

    const versionMatch = content.match(/Molpy\.version\s*=\s*([\d.]+)/);
    return versionMatch ? parseFloat(versionMatch[1]) : 0;
}

/**
 * Helper: Extract a string property from object literal content
 */
function extractStringProperty(content, propName) {
    // Match property: 'value' or property: "value"
    const pattern = new RegExp(`${propName}\\s*:\\s*['"]([^'"]*?)['"]`);
    const match = content.match(pattern);
    return match ? match[1] : null;
}

/**
 * Helper: Extract a number property
 */
function extractNumberProperty(content, propName) {
    const pattern = new RegExp(`${propName}\\s*:\\s*([\\d.eE+\\-]+)`);
    const match = content.match(pattern);
    return match ? parseFloat(match[1]) : undefined;
}

/**
 * Helper: Extract a boolean property (checks for presence of value 1 or true)
 */
function extractBoolProperty(content, propName) {
    const pattern = new RegExp(`${propName}\\s*:\\s*(1|true|0|false)`);
    const match = content.match(pattern);
    if (!match) return undefined;
    return match[1] === '1' || match[1] === 'true';
}

/**
 * Main extraction function
 */
async function main() {
    console.log('Sandcastle Builder Game Data Extractor\n');

    try {
        // Extract all data
        const version = await extractVersion();
        const { boosts, boostsByAlias } = await extractBoosts();
        const { badges, badgesByName } = await extractBadges();
        const { sandTools, castleTools } = await extractTools();
        const groups = await extractGroups();

        // Build complete game data object
        const gameData = {
            version: '1.0.0',
            sourceVersion: version,
            extractedAt: new Date().toISOString(),
            boosts: boostsByAlias,
            boostsById: boosts,
            badges: badgesByName,
            badgesById: badges,
            sandTools,
            castleTools,
            groups,
        };

        // Ensure output directory exists
        await fs.mkdir(OUTPUT_DIR, { recursive: true });

        // Write full game data
        const outputPath = path.join(OUTPUT_DIR, 'game-data.json');
        await fs.writeFile(outputPath, JSON.stringify(gameData, null, 2));
        console.log(`\nWrote complete game data to ${outputPath}`);

        // Write summary stats
        console.log('\nSummary:');
        console.log(`  Source version: ${version}`);
        console.log(`  Boosts: ${boosts.length}`);
        console.log(`  Badges: ${badges.length}`);
        console.log(`  Sand Tools: ${sandTools.length}`);
        console.log(`  Castle Tools: ${castleTools.length}`);
        console.log(`  Groups: ${Object.keys(groups).length}`);

        // Count dynamic vs static
        const dynamicBoosts = boosts.filter(b => b.hasDynamicDescription || b.hasDynamicStats || b.hasDynamicPrice);
        console.log(`\n  Boosts with dynamic content: ${dynamicBoosts.length} (${Math.round(dynamicBoosts.length / boosts.length * 100)}%)`);

        const dynamicBadges = badges.filter(b => b.hasDynamicDescription);
        console.log(`  Badges with dynamic content: ${dynamicBadges.length} (${Math.round(dynamicBadges.length / badges.length * 100)}%)`);

    } catch (err) {
        console.error('Error extracting game data:', err);
        process.exit(1);
    }
}

main();
