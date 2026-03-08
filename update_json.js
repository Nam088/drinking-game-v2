const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'datav2.json');

try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(data);

    let updatedCount = 0;

    // Check if the JSON is an array of cards or an object containing an array
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
                // Random 1 or 2
                const newDuration = Math.floor(Math.random() * 2) + 1;
                // Update content if it contains the old duration (replace 3 vòng/5 vòng to newDuration)
                const oldDuration = card.duration.value;
                if (oldDuration !== newDuration) {
                    card.duration.value = newDuration;
                    
                    // Also replace text in content, like "3 vòng/lượt" to "1 vòng" or "2 vòng"
                    if (card.content) {
                         const regex = new RegExp(`\\b${oldDuration}\\s+(vòng|lượt|turn)\\b`, 'gi');
                         card.content = card.content.replace(regex, `${newDuration} $1`);
                    }
                    updatedCount++;
                }
            }
        }
    }

    const newJson = isWrapped ? { cards } : cards;
    fs.writeFileSync(filePath, JSON.stringify(newJson, null, 2), 'utf-8');
    console.log(`Successfully updated ${updatedCount} cards.`);
} catch (e) {
    console.error("Error updating JSON:", e);
}
