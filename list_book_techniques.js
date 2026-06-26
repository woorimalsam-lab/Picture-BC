const fs = require('fs');

try {
    let booksPath = 'C:\\Users\\admin\\.gemini\\antigravity\\brain\\8f2fd8d5-bb03-46b2-a89f-1df6a6251344\\scratch\\new_books.js';
    let booksContent = fs.readFileSync(booksPath, 'utf8');
    booksContent = booksContent.replace('const books =', 'global.books =');
    eval(booksContent + ";");
    const books = global.books || [];
    
    console.log("Registered techniques for each book:");
    books.forEach((b, idx) => {
        console.log(`${idx + 1}. ${b.title} -> Technique: "${b.technique}"`);
    });
} catch (e) {
    console.error(e);
}
