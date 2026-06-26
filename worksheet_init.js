function setupWorksheetGenerator() {
    const btn = document.getElementById("btn-generate-worksheet");
    const bookSelect = document.getElementById("worksheet-book-select");
    const typeSelect = document.getElementById("worksheet-type-select");
    const output = document.getElementById("worksheet-preview-content");
    
    // Populate book select
    if (bookSelect && typeof books !== 'undefined') {
        books.forEach((book, idx) => {
            const option = document.createElement("option");
            option.value = idx;
            option.innerText = book.title;
            bookSelect.appendChild(option);
        });
    }

    if(btn && bookSelect && typeSelect && output) {
        btn.addEventListener("click", () => {
            const bookIdx = bookSelect.value;
            const type = typeSelect.value;
            const book = books[bookIdx];
            let worksheetHTML = "";
            
            // --- INJECT NEW_WORKSHEETS.JS LOGIC HERE ---
            worksheetHTML += `
                <div class="worksheet-print-header no-print" style="text-align: right; margin-bottom: 20px;">
                    <button onclick="window.print()" class="btn btn-secondary"><i class="fa-solid fa-print"></i> 활동지 인쇄하기</button>
                </div>
                <div class="worksheet-paper">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h3 style="font-size: 1.8rem; color: #111; margin-bottom: 10px;">${book.title} - 토론 학습지</h3>
                        <p style="font-size: 1rem; color: #555;">학년: ______ 반: ______ 이름: ____________</p>
                    </div>
            `;
            
            // We will concatenate the raw new_worksheets.js code later using PowerShell.
            
        });
    }
}
