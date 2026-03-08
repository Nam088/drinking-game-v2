const fs = require('fs');
const path = require('path');

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
    }

    for (const card of cards) {
        if (card.category === 'SECRET_MISSION' || card.category === 'CURSE') {
            if (card.duration && card.duration.type === 'turn') {
                const currentDurationValue = card.duration.value;
                if (card.content) {
                    // Cố gắng tìm bất kỳ mẫu nào như "3 vòng", "4 lượt", "5 turn"
                    const regex = /\b(\d+)\s+(vòng|lượt|turn)\b/gi;
                    let changed = false;
                    card.content = card.content.replace(regex, (match, p1, p2) => {
                        const num = parseInt(p1);
                        if (num !== currentDurationValue) {
                            changed = true;
                            return `${currentDurationValue} ${p2}`;
                        }
                        return match;
                    });
                    
                    if (changed) {
                        updatedCount++;
                    }
                }
            }
        }
    }

    if (updatedCount > 0) {
        const newJson = isWrapped ? { cards } : cards;
        fs.writeFileSync(filePath, JSON.stringify(newJson, null, 2), 'utf-8');
        console.log(`Successfully fixed content for ${updatedCount} cards.`);
    } else {
        console.log("No cards needed fixing.");
    }
} catch (e) {
    console.error("Error fixing JSON:", e);
}
