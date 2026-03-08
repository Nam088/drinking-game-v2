const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'datav2.json');
const rawData = fs.readFileSync(jsonPath, 'utf8');
const cards = JSON.parse(rawData);

let modifiedCount = 0;

cards.forEach(card => {
    // Only target cards that have a "turn" duration > 2
    if (card.duration && card.duration.type === 'turn' && card.duration.value > 2) {
        const oldTurnCount = card.duration.value;
        // Random 1 or 2 turns
        const newTurnCount = Math.floor(Math.random() * 2) + 1;
        
        card.duration.value = newTurnCount;

        // Try to replace the old number in title and content
        // Example: "3 vòng", "4 lượt", "3 lượt tới"
        const oldNumberStr = String(oldTurnCount);
        const newNumberStr = String(newTurnCount);
        
        if (card.title) {
            // Replace standalone number
            card.title = card.title.replace(new RegExp(`\\b${oldNumberStr}\\b`, 'g'), newNumberStr);
        }
        
        if (card.content) {
             card.content = card.content.replace(new RegExp(`\\b${oldNumberStr}\\b`, 'g'), newNumberStr);
        }

        modifiedCount++;
    }
});

fs.writeFileSync(jsonPath, JSON.stringify(cards, null, 2), 'utf8');

console.log(`Successfully modified ${modifiedCount} cards.`);
