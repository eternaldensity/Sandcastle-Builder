/**
 * Wiki Scraper for Sandcastle Builder documentation
 * Extracts content from xkcd-time.fandom.com and converts to Obsidian-style markdown
 *
 * Usage: node scripts/scrape-wiki.js
 *
 * Dependencies: npm install node-fetch cheerio
 */

const fs = require('fs').promises;
const path = require('path');

// Fandom wiki base URL
const WIKI_BASE = 'https://xkcd-time.fandom.com/wiki';

// Pages to scrape with their output paths
const PAGES_TO_SCRAPE = [
    // Core pages
    { url: 'Sandcastle_Builder', output: 'index.md', title: 'Sandcastle Builder' },
    { url: 'Sandcastle_Builder_Strategy_Guide', output: 'strategy-guide.md', title: 'Strategy Guide' },
    { url: 'Glossary', output: 'glossary.md', title: 'Glossary' },

    // Game elements
    { url: 'Boosts', output: 'boosts/_index.md', title: 'Boosts' },
    { url: 'Badges', output: 'badges/_index.md', title: 'Badges' },
    { url: 'Discoveries', output: 'badges/discoveries.md', title: 'Discoveries' },

    // Tools
    { url: 'Sand_Tools', output: 'tools/sand-tools.md', title: 'Sand Tools' },
    { url: 'Castle_Tools', output: 'tools/castle-tools.md', title: 'Castle Tools' },

    // Mechanics
    { url: 'Glass', output: 'mechanics/glass.md', title: 'Glass' },
    { url: 'Ninja', output: 'mechanics/ninja.md', title: 'Ninja' },
    { url: 'ONG', output: 'mechanics/ong.md', title: 'ONG' },
    { url: 'Newpix', output: 'mechanics/newpix.md', title: 'Newpix' },
    { url: 'Judgement_Dip', output: 'mechanics/judgement-dip.md', title: 'Judgement Dip' },

    // Systems
    { url: 'Redundakitties', output: 'systems/redundakitties.md', title: 'Redundakitties' },
    { url: 'Dragons', output: 'systems/dragons.md', title: 'Dragons' },
    // Note: Logicats and Time_Travel pages don't exist (404) - info is in boosts page

    // Tools (individual)
    { url: 'Newpixbot', output: 'tools/newpixbot.md', title: 'NewPixBot' },
    { url: 'Trebuchet', output: 'tools/trebuchet.md', title: 'Trebuchet' },

    // Community/Reference
    { url: 'OTC', output: 'reference/otc.md', title: 'OTC' },
    { url: 'Abbreviations', output: 'reference/abbreviations.md', title: 'Abbreviations' },
];

// Output directory
const OUTPUT_DIR = path.join(__dirname, '..', 'docs', 'wiki');

// Known boost names for cross-linking (extracted from boosts.js)
const KNOWN_BOOSTS = new Set();
const KNOWN_BADGES = new Set();

/**
 * Fetch a wiki page and return HTML
 */
async function fetchPage(pageUrl) {
    const fetch = (await import('node-fetch')).default;
    const url = `${WIKI_BASE}/${pageUrl}`;
    console.log(`Fetching: ${url}`);

    const response = await fetch(url, {
        headers: {
            'User-Agent': 'SandcastleBuilder-WikiScraper/1.0 (Documentation extraction)'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    return response.text();
}

/**
 * Parse HTML and extract main content
 */
async function parseWikiPage(html) {
    const cheerio = await import('cheerio');
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('.mw-editsection').remove();  // Edit links
    $('.reference').remove();        // Reference markers
    $('.navbox').remove();           // Navigation boxes
    $('.toc').remove();              // Table of contents (we'll generate our own)

    // Get main content
    const content = $('.mw-parser-output');

    return { $, content };
}

/**
 * Convert HTML content to Markdown with wikilinks
 */
function htmlToMarkdown($, element) {
    let markdown = '';

    element.children().each((_, child) => {
        const $child = $(child);
        const tagName = child.tagName?.toLowerCase();

        switch (tagName) {
            case 'h1':
                markdown += `# ${$child.text().trim()}\n\n`;
                break;
            case 'h2':
                markdown += `## ${$child.text().trim()}\n\n`;
                break;
            case 'h3':
                markdown += `### ${$child.text().trim()}\n\n`;
                break;
            case 'h4':
                markdown += `#### ${$child.text().trim()}\n\n`;
                break;
            case 'p':
                markdown += processInlineElements($, $child) + '\n\n';
                break;
            case 'ul':
                $child.find('> li').each((_, li) => {
                    markdown += `- ${processInlineElements($, $(li))}\n`;
                });
                markdown += '\n';
                break;
            case 'ol':
                $child.find('> li').each((i, li) => {
                    markdown += `${i + 1}. ${processInlineElements($, $(li))}\n`;
                });
                markdown += '\n';
                break;
            case 'table':
                markdown += convertTable($, $child) + '\n';
                break;
            case 'dl':
                // Definition lists (often used in glossaries)
                $child.find('dt').each((_, dt) => {
                    const $dt = $(dt);
                    const $dd = $dt.next('dd');
                    markdown += `**${$dt.text().trim()}**\n`;
                    if ($dd.length) {
                        markdown += `: ${processInlineElements($, $dd)}\n\n`;
                    }
                });
                break;
            case 'blockquote':
                const lines = processInlineElements($, $child).split('\n');
                markdown += lines.map(l => `> ${l}`).join('\n') + '\n\n';
                break;
            default:
                // For other elements, just get text content
                const text = $child.text().trim();
                if (text) {
                    markdown += text + '\n\n';
                }
        }
    });

    return markdown.trim();
}

/**
 * Process inline elements (links, bold, italic, etc.)
 */
function processInlineElements($, element) {
    let text = '';

    element.contents().each((_, node) => {
        if (node.type === 'text') {
            text += node.data;
        } else if (node.type === 'tag') {
            const $node = $(node);
            const tagName = node.tagName?.toLowerCase();

            switch (tagName) {
                case 'a':
                    const href = $node.attr('href') || '';
                    const linkText = $node.text().trim();

                    // Convert internal wiki links to wikilinks
                    if (href.startsWith('/wiki/')) {
                        const pageName = decodeURIComponent(href.replace('/wiki/', ''));
                        text += `[[${pageName}|${linkText}]]`;
                    } else if (href.startsWith('#')) {
                        // Anchor link
                        text += `[${linkText}](${href})`;
                    } else {
                        // External link
                        text += `[${linkText}](${href})`;
                    }
                    break;
                case 'b':
                case 'strong':
                    text += `**${$node.text().trim()}**`;
                    break;
                case 'i':
                case 'em':
                    text += `*${$node.text().trim()}*`;
                    break;
                case 'code':
                    text += `\`${$node.text().trim()}\``;
                    break;
                case 'br':
                    text += '\n';
                    break;
                case 'span':
                    text += processInlineElements($, $node);
                    break;
                default:
                    text += $node.text();
            }
        }
    });

    return text.trim();
}

/**
 * Convert HTML table to Markdown table
 */
function convertTable($, $table) {
    const rows = [];

    // Get headers
    const headers = [];
    $table.find('tr:first-child th, tr:first-child td').each((_, cell) => {
        headers.push($(cell).text().trim().replace(/\n/g, ' '));
    });

    if (headers.length === 0) return '';

    rows.push('| ' + headers.join(' | ') + ' |');
    rows.push('| ' + headers.map(() => '---').join(' | ') + ' |');

    // Get body rows
    $table.find('tr').slice(1).each((_, row) => {
        const cells = [];
        $(row).find('td, th').each((_, cell) => {
            cells.push($(cell).text().trim().replace(/\n/g, ' ').replace(/\|/g, '\\|'));
        });
        if (cells.length > 0) {
            rows.push('| ' + cells.join(' | ') + ' |');
        }
    });

    return rows.join('\n') + '\n';
}

/**
 * Extract boost names from boosts.js for cross-referencing
 */
async function extractBoostNames() {
    try {
        const boostsPath = path.join(__dirname, '..', 'boosts.js');
        const content = await fs.readFile(boostsPath, 'utf-8');

        // Match boost definitions: name:'Boost Name' or name: 'Boost Name'
        const nameMatches = content.matchAll(/name:\s*['"]([^'"]+)['"]/g);
        for (const match of nameMatches) {
            KNOWN_BOOSTS.add(match[1]);
        }
        console.log(`Found ${KNOWN_BOOSTS.size} boost names in boosts.js`);
    } catch (err) {
        console.warn('Could not read boosts.js for cross-referencing:', err.message);
    }
}

/**
 * Extract badge names from badges.js
 */
async function extractBadgeNames() {
    try {
        const badgesPath = path.join(__dirname, '..', 'badges.js');
        const content = await fs.readFile(badgesPath, 'utf-8');

        // Match badge definitions
        const nameMatches = content.matchAll(/name:\s*['"]([^'"]+)['"]/g);
        for (const match of nameMatches) {
            KNOWN_BADGES.add(match[1]);
        }
        console.log(`Found ${KNOWN_BADGES.size} badge names in badges.js`);
    } catch (err) {
        console.warn('Could not read badges.js for cross-referencing:', err.message);
    }
}

/**
 * Post-process markdown to add wikilinks for known game elements
 */
function addWikilinks(markdown) {
    let result = markdown;

    // Add wikilinks for known boosts (avoid already linked text)
    for (const boost of KNOWN_BOOSTS) {
        // Only link if not already in a wikilink and is a standalone word
        const regex = new RegExp(`(?<!\\[\\[)\\b(${escapeRegex(boost)})\\b(?![^\\[]*\\]\\])`, 'g');
        result = result.replace(regex, '[[boosts/$1|$1]]');
    }

    return result;
}

/**
 * Escape special regex characters
 */
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Ensure directory exists
 */
async function ensureDir(filePath) {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
}

/**
 * Scrape a single page and save as markdown
 */
async function scrapePage(pageConfig) {
    try {
        const html = await fetchPage(pageConfig.url);
        const { $, content } = await parseWikiPage(html);

        let markdown = `# ${pageConfig.title}\n\n`;
        markdown += `> Source: [${pageConfig.url}](${WIKI_BASE}/${pageConfig.url})\n\n`;
        markdown += htmlToMarkdown($, content);

        // Add wikilinks for known game elements
        markdown = addWikilinks(markdown);

        const outputPath = path.join(OUTPUT_DIR, pageConfig.output);
        await ensureDir(outputPath);
        await fs.writeFile(outputPath, markdown, 'utf-8');

        console.log(`  Saved: ${pageConfig.output}`);
        return true;
    } catch (err) {
        console.error(`  Error scraping ${pageConfig.url}:`, err.message);
        return false;
    }
}

/**
 * Main scraping function
 */
async function main() {
    console.log('Sandcastle Builder Wiki Scraper\n');

    // Extract known game elements for cross-referencing
    await extractBoostNames();
    await extractBadgeNames();

    console.log('\nScraping wiki pages...\n');

    // Ensure output directories exist
    await ensureDir(path.join(OUTPUT_DIR, 'boosts', '_'));
    await ensureDir(path.join(OUTPUT_DIR, 'badges', '_'));
    await ensureDir(path.join(OUTPUT_DIR, 'mechanics', '_'));
    await ensureDir(path.join(OUTPUT_DIR, 'systems', '_'));

    // Scrape each page with a delay to be respectful
    let success = 0;
    let failed = 0;

    for (const page of PAGES_TO_SCRAPE) {
        const result = await scrapePage(page);
        if (result) {
            success++;
        } else {
            failed++;
        }
        // Be respectful to the wiki server
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\nComplete! Scraped ${success} pages, ${failed} failed.`);
    console.log(`Output directory: ${OUTPUT_DIR}`);
}

// Run if called directly
main().catch(console.error);
