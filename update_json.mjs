import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'datav2.json');

try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(data);

    let updatedCount = 0;

    let cards = [];
    let isWrapped = false;
    
    if (Array.isArray(json)) {
        cards = json;
    } else if (json && Array.isArray(json.cards)) {
        cards = json.cards;
        isWrapped = true;
    } else {
        console.error("Unknown JSON structure");
        process.exit(1);
    }

    for (const card of cards) {
        if (card.category === 'SECRET_MISSION' || card.category === 'CURSE') {
            if (card.duration && card.duration.type === 'turn') {
                // Ensure duration value is either 1 or 2 realistically. If not, randomize it.
                // We'll just force a new random 1 or 2 for a clean slate.
                let newDuration = card.duration.value;
                if (newDuration > 2 || newDuration < 1) {
                    newDuration = Math.floor(Math.random() * 2) + 1;
                }
                
                let changed = false;

                if (card.duration.value !== newDuration) {
                    card.duration.value = newDuration;
                    changed = true;
                }
                
                // Replace text in content, e.g. "3 vòng", "4 lượt", "5 turn" -> "newDuration vòng"
                // This regex captures ANY number followed by vòng/lượt/turn/vong
                if (card.content) {
                    const regex = /\b(\d+)\s+(vòng|lượt|turn|vong)\b/gi;
                    const oldContent = card.content;
                    
                    card.content = card.content.replace(regex, (match, p1, p2) => {
                        // Return the standardized text with the correct duration and keeping the original word
                        return `${newDuration} ${p2.toLowerCase()}`;
                    });
                    
                    if (oldContent !== card.content) {
                         changed = true;
                    }
                }

                if (changed) {
                    updatedCount++;
                }
            }
        }
    }

    const newJson = isWrapped ? { cards } : cards;
    fs.writeFileSync(filePath, JSON.stringify(newJson, null, 2), 'utf-8');
    console.log(`Successfully synced and updated ${updatedCount} cards.`);
} catch (e) {
    console.error("Error updating JSON:", e);
}
