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
        if (card.category === 'SECRET_MISSION') {
            if (card.penalty && card.penalty.value > 2) {
                const oldPenaltyValue = card.penalty.value;
                const newPenaltyValue = Math.floor(Math.random() * 2) + 1;
                
                let changed = false;

                if (oldPenaltyValue !== newPenaltyValue) {
                    card.penalty.value = newPenaltyValue;
                    changed = true;
                }
                
                // Thay thế cả câu chữ trong content, ví dụ "uống 3 ly" -> "uống 2 ly" hoặc "phạt 3 ly" -> "phạt 2 ly"
                if (card.content) {
                    const regex = new RegExp(`\\b${oldPenaltyValue}\\s+(ly|ngụm|chén|cốc)\\b`, 'gi');
                    const oldContent = card.content;
                    
                    card.content = card.content.replace(regex, (match, unit) => {
                        return `${newPenaltyValue} ${unit.toLowerCase()}`;
                    });
                    
                    if (oldContent !== card.content) {
                         changed = true;
                    }
                }

                if (changed) {
                    updatedCount++;
                }
            } else if (card.penalty && card.penalty.value !== undefined) {
                 // Even if penalty <= 2, we can randomize it between 1 and 2 to make it fresh
                 const oldPenaltyValue = card.penalty.value;
                 const newPenaltyValue = Math.floor(Math.random() * 2) + 1;
                 
                 let changed = false;
                 
                 if (oldPenaltyValue !== newPenaltyValue) {
                      card.penalty.value = newPenaltyValue;
                      changed = true;
                 }
                 
                 if (card.content) {
                    const regex = new RegExp(`\\b${oldPenaltyValue}\\s+(ly|ngụm|chén|cốc)\\b`, 'gi');
                    const oldContent = card.content;
                    
                    card.content = card.content.replace(regex, (match, unit) => {
                        return `${newPenaltyValue} ${unit.toLowerCase()}`;
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
    console.log(`Successfully synced and updated penalty values for ${updatedCount} SECRET_MISSION cards.`);
} catch (e) {
    console.error("Error updating JSON:", e);
}
