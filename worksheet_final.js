function setupWorksheetGenerator() {
    const btn = document.getElementById("btn-generate-worksheet");
    const bookSelect = document.getElementById("worksheet-book-select");
    const typeSelect = document.getElementById("worksheet-type-select");
    const output = document.getElementById("worksheet-paper");
    const printBtn = document.getElementById("btn-print-worksheet");
    
    if (printBtn) {
        printBtn.addEventListener("click", () => {
            window.print();
        });
    }

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
    if (type === "basic") {
        worksheetHTML += `
            <div class="ws-section">
                <h4>1. [독서 전 활동] 책 표지 탐험하기</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 8px;">책의 제목과 표지 디자인을 관찰하고 어떤 이야기가 펼쳐질지 상상하여 적어 보세요.</p>
                <textarea class="ws-textarea-box" placeholder="표지에서 인상 깊은 단서나 느낌을 자유롭게 서술하세요..."></textarea>
            </div>
            <div class="ws-section">
                <h4>2. [독서 중 활동] 마음에 닿은 순간 포착</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 8px;">책을 읽는 동안 가장 기억에 남는 장면(혹은 등장인물의 대사)과 그 이유를 적어 보세요.</p>
                <textarea class="ws-textarea-box" placeholder="인상 깊은 장면과 그렇게 느낀 까닭을 구체적으로 서술하세요..."></textarea>
            </div>
            <div class="ws-section">
                <h4>3. [독서 후 활동] 나의 질문과 주장</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 8px;">책을 다 읽은 후 해결해보고 싶은 철학적/사회적 핵심 질문과 그에 대한 나의 주장을 근거와 함께 쓰세요.</p>
                <div class="ws-recommend-topics-box no-print" style="margin-bottom:12px; padding:10px; background-color:#fef8f5; border-radius:8px; border:1px solid rgba(224,122,95,0.15); font-size:0.85rem;">
                    <strong>💡 이 책의 추천 토론 논제 (클릭 시 자동 입력):</strong>
                    <div style="display:flex; flex-direction:column; gap:6px; margin-top:6px;">
                        ${book.debatePropositions ? book.debatePropositions.map(t => `<button type="button" class="recommend-topic-btn" onclick="this.closest('.ws-section').querySelector('textarea').value = this.innerText.substring(2); return false;" style="background:none; border:none; text-align:left; color:var(--accent-coral); cursor:pointer; font-weight:600; padding:0; font-family:inherit;">🔹 ${t}</button>`).join("") : '<span>추천 논제 정보가 없습니다.</span>'}
                    </div>
                </div>
                <textarea class="ws-textarea-box" placeholder="나의 주장(결론)과 타당한 근거 및 설명 순으로 논리 정연하게 작성하세요..."></textarea>
            </div>
        `;
    } else if (type === "brainwriting") {
        worksheetHTML += `
            <div class="ws-section">
                <h4>💡 릴레이 과제: 주인공의 문제를 해결할 수 있는 창의적 조언 아이디어</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 12px;">(연계 토론 기법: 브레인라이팅)</p>
                <div style="background-color: #fcf8f2; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid var(--accent-coral);">
                    <p style="font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; color: var(--accent-coral);">📚 권장 토론 논제:</p>
                    <ul style="padding-left: 20px; font-size: 0.85rem; line-height: 1.6; color: #333333; margin: 0;">
                        ${book.debatePropositions ? book.debatePropositions.map(t => `<li>${t}</li>`).join("") : '<li>추천 논제 정보가 없습니다.</li>'}
                    </ul>
                </div>
                <table class="ws-table">
                    <tr>
                        <th>📝 [작성 1 - 나] 최초 해결 아이디어 (3가지)</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea style="height: 90px;" placeholder="내가 생각한 첫 번째 기발하고 참신한 조언 아이디어를 적어 주세요..."></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th style="background-color: #fcf8f2;">➕ [작성 2 - 친구 A] A의 생각을 보완하고 확장하는 구체적 아이디어</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea style="height: 90px;" placeholder="앞에 작성된 내용을 읽고, 실행 방법이나 추가 디테일을 살 붙여 보완하세요..."></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th style="background-color: #f2f6fc;">➕ [작성 3 - 친구 B] B의 생각 위에 한 층 더 새로운 대안 가미</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea style="height: 90px;" placeholder="앞선 2개의 결론을 종합하여, 예외 상황에 대처할 팁이나 최종 업그레이드 내용을 얹어주세요..."></textarea>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="ws-section">
                <h4>🌟 릴레이 융합으로 빚어낸 최고의 최종 모둠 추천안</h4>
                <textarea class="ws-textarea-box" placeholder="모두의 협동 지혜로 최종 정교화되어 돌아온 아이디어 중 가장 빛나는 추천 솔루션을 예쁘게 다듬어 적으세요..."></textarea>
            </div>
        `;
    } else if (type === "procon") {
        worksheetHTML += `
            <div class="ws-section">
                <h4>💡 토론 논제: 《${book.title}》 인물의 선택에 대한 찬반 역발상 분석</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 12px;">(연계 토론 기법: 프로콘 토론)</p>
                <div style="background-color: #fcf8f2; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid var(--accent-coral);">
                    <p style="font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; color: var(--accent-coral);">📚 권장 토론 논제:</p>
                    <ul style="padding-left: 20px; font-size: 0.85rem; line-height: 1.6; color: #333333; margin: 0;">
                        ${book.debatePropositions ? book.debatePropositions.map(t => `<li>${t}</li>`).join("") : '<li>추천 논제 정보가 없습니다.</li>'}
                    </ul>
                </div>
                <table class="ws-table">
                    <tr>
                        <th style="width: 50%;">🟢 1단계: Pro (찬성 입장에서 세운 정당성)</th>
                        <th style="width: 50%;">🔴 2단계: Con (역할 교대 후 반대 입장에서 세운 논리)</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea style="min-height: 220px;" placeholder="내가 원래 이 입장이 아니라 할지라도, 찬성의 렌즈로 인물의 입장을 대변해 가장 타당한 주장과 객관적 근거를 2가지 이상 적으세요..."></textarea>
                        </td>
                        <td>
                            <textarea style="min-height: 220px;" placeholder="신호에 맞춰 역할을 바꾼 뒤, 내 주장의 빈틈을 스스로 공격하며 반대편 입장에서 정당화될 수 있는 최선의 반대 논거를 적으세요..."></textarea>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="ws-section">
                <h4>⚖️ 3단계: 통합 성찰 (두 입장을 스스로 모두 옹호해 본 후 나의 중립적 성찰)</h4>
                <textarea class="ws-textarea-box" placeholder="양측의 강력한 가치를 다 대변해 보면서 깨달은, 흑백논리를 초월한 자신만의 융합적 해안과 소감을 기록하세요..."></textarea>
            </div>
        `;
    } else if (type === "hotseating") {
        worksheetHTML += `
            <div class="ws-section">
                <h4>🪑 핫시팅 캐릭터 심층 조사 보고서</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 12px;">뜨거운 의자에 앉은 주인공의 가면 뒤 속마음을 인터뷰합니다.</p>
                <div style="background-color: #f2f6fc; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid var(--accent-sage);">
                    <p style="font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; color: var(--accent-sage);">📚 권장 토론 논제:</p>
                    <ul style="padding-left: 20px; font-size: 0.85rem; line-height: 1.6; color: #333333; margin: 0;">
                        ${book.debatePropositions ? book.debatePropositions.map(t => `<li>${t}</li>`).join("") : '<li>추천 논제 정보가 없습니다.</li>'}
                    </ul>
                </div>
                <table class="ws-table">
                    <tr>
                        <th style="width: 50%;">🔎 내가 캐릭터(주인공)에게 던질 예리한 질문 3가지</th>
                        <th style="width: 50%;">💬 핫시트의 주인공이 답변한 고백 요약</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea style="min-height: 200px;" placeholder="질문 1:\n질문 2:\n질문 3:..."></textarea>
                        </td>
                        <td>
                            <textarea style="min-height: 200px;" placeholder="주인공이 변명이 아닌, 행동 이면에 겪었던 내적 억압이나 슬픔, 속사정을 고백한 답변들을 받아 정리하세요..."></textarea>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="ws-section">
                <h4>✉️ 주인공에게 마음의 안정을 주는 위로와 격려의 조언 편지</h4>
                <textarea class="ws-textarea-box" placeholder="역지사지로 주인공의 외로움과 갈등을 온전히 공감한 후, 인물이 더 건강한 결단을 내릴 수 있도록 돕는 따뜻한 메시지를 적어주세요..."></textarea>
            </div>
        `;
    } else if (type === "carousel") {
        worksheetHTML += `
            <div class="ws-section">
                <h4>🎠 회전목마 토론 파트너별 의견 누적 기록지</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 12px;">(회전목마처럼 자리를 바꾸어가며 만난 친구들의 독창적인 생각을 수렴합니다.)</p>
                <div style="background-color: #fcf8f2; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid var(--accent-coral);">
                    <p style="font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; color: var(--accent-coral);">📚 권장 토론 논제:</p>
                    <ul style="padding-left: 20px; font-size: 0.85rem; line-height: 1.6; color: #333333; margin: 0;">
                        ${book.debatePropositions ? book.debatePropositions.map(t => `<li>${t}</li>`).join("") : '<li>추천 논제 정보가 없습니다.</li>'}
                    </ul>
                </div>
                <table class="ws-table">
                    <tr>
                        <th style="width: 25%;">1차 파트너 의견</th>
                        <th style="width: 25%;">2차 파트너 의견</th>
                        <th style="width: 25%;">3차 파트너 의견</th>
                        <th style="width: 25%;">4차 파트너 의견</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea style="min-height: 180px;" placeholder="친구 이름:\n그가 제기한 기발한 찬/반 근거는?..."></textarea>
                        </td>
                        <td>
                            <textarea style="min-height: 180px;" placeholder="친구 이름:\n그가 제기한 기발한 찬/반 근거는?..."></textarea>
                        </td>
                        <td>
                            <textarea style="min-height: 180px;" placeholder="친구 이름:\n그가 제기한 기발한 찬/반 근거는?..."></textarea>
                        </td>
                        <td>
                            <textarea style="min-height: 180px;" placeholder="친구 이름:\n그가 제기한 기발한 찬/반 근거는?..."></textarea>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="ws-section">
                <h4>🌟 다양한 의견의 폭을 수렴하여 한 단계 보완된 나의 최종 생각</h4>
                <textarea class="ws-textarea-box" placeholder="많은 친구들과의 1:1 디베이트를 거치면서 내 주장의 논증 틈새가 어떻게 채워지고 풍성해졌는지 최종 요약을 작성하세요..."></textarea>
            </div>
        `;
    } else if (type === "socratic") {
        worksheetHTML += `
            <div class="ws-section">
                <h4>📖 소크라틱 세미나 독서 본질 성찰 대화록</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 12px;">정답을 쫓는 논쟁을 넘어, 텍스트가 지닌 궁극적인 가치에 대해 대화합니다.</p>
                
                <div class="ws-section-subtitle" style="font-weight: 700; margin-bottom: 6px;">1. 세미나 질문과 나의 핵심 해석 근거 구절</div>
                <div class="ws-recommend-topics-box no-print" style="margin-bottom:8px; padding:10px; background-color:#fef8f5; border-radius:8px; border:1px solid rgba(224,122,95,0.15); font-size:0.85rem;">
                    <strong>💡 추천 세미나 논제 (클릭 시 자동 입력):</strong>
                    <div style="display:flex; flex-direction:column; gap:6px; margin-top:6px;">
                        ${book.debatePropositions ? book.debatePropositions.map(t => `<button type="button" class="recommend-topic-btn" onclick="this.closest('.ws-section').querySelector('textarea').value = this.innerText.substring(2); return false;" style="background:none; border:none; text-align:left; color:var(--accent-coral); cursor:pointer; font-weight:600; padding:0; font-family:inherit;">🔹 ${t}</button>`).join("") : '<span>추천 논제 정보가 없습니다.</span>'}
                    </div>
                </div>
                <textarea style="width: 100%; min-height: 80px; padding: 10px; border:1px solid #ccc; border-radius:6px; margin-bottom: 16px;" placeholder="세미나의 대주제 질문과, 이에 대한 내 생각을 지탱하는 책 속의 구체적인 문장(페이지 포함)을 스크랩하여 적으세요..."></textarea>
                
                <table class="ws-table">
                    <tr>
                        <th style="width: 50%;">💬 세미나 중 큰 영감을 주었던 동료들의 해석</th>
                        <th style="width: 50%;">⚖️ 동료들의 의견을 들으며 바뀐 나의 새로운 가치 정립</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea style="min-height: 160px;" placeholder="친구가 제시한 생각 중 내 머리를 멈추게 한 철학적 고찰은 무엇이었나요?..."></textarea>
                        </td>
                        <td>
                            <textarea style="min-height: 160px;" placeholder="토론 전에는 보지 못했으나, 세미나를 통해 새롭게 알게 된 텍스트 본연의 가치 변화를 쓰세요..."></textarea>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="ws-section">
                <h4>📝 세미나 종합 성찰 에세이</h4>
                <textarea class="ws-textarea-box" placeholder="오늘 대화를 바탕으로 '더불어 살아가는 가치' 또는 '주체적 삶의 가치'에 대한 나만의 완성형 에세이를 한 편 기술해 주세요..."></textarea>
            </div>
        `;
    } else if (type === "worldcafe") {
        worksheetHTML += `
            <div class="ws-section">
                <h4>☕ 월드카페 아이디어 브레인스토밍 기록판</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 12px;">카페처럼 열린 분위기에서 자유로운 낙서와 마인드맵으로 아이디어를 융합합니다.</p>
                <div style="background-color: #f2f6fc; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid var(--accent-sage);">
                    <p style="font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; color: var(--accent-sage);">📚 권장 토론 논제:</p>
                    <ul style="padding-left: 20px; font-size: 0.85rem; line-height: 1.6; color: #333333; margin: 0;">
                        ${book.debatePropositions ? book.debatePropositions.map(t => `<li>${t}</li>`).join("") : '<li>추천 논제 정보가 없습니다.</li>'}
                    </ul>
                </div>
                <table class="ws-table">
                    <tr>
                        <th style="width: 50%;">🛋️ 우리 테이블의 원래 세부 논제와 1차 브레인스토밍</th>
                        <th style="width: 50%;">🧳 우리 방을 스쳐 지나간 다른 모둠 여행자들의 생각 덧붙임</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea style="min-height: 180px;" placeholder="원래 모둠원들과 함께 전지에 자유롭게 마인드맵으로 끄적여 모았던 최초 주장들..."></textarea>
                        </td>
                        <td>
                            <textarea style="min-height: 180px;" placeholder="테이블 호스트의 설명을 듣고 다른 팀원들이 누적하여 전지에 남겨주고 간 꿀팁 정보 요약..."></textarea>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="ws-section">
                <h4>☕ 원래의 홈 테이블로 복귀하여 수렴한 모둠의 최종 프로젝트 솔루션</h4>
                <textarea class="ws-textarea-box" placeholder="유랑을 다녀온 여행자들이 모아온 타 팀의 통찰들을 호스트와 조율해 완성한 최고의 종합 결론을 마킹하세요..."></textarea>
            </div>
        `;
    } else if (type === "argument") {
        worksheetHTML += `
            <div class="ws-section">
                <h4>🎲 논증 게임 주장-이유-근거 매칭 활동지</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 12px;">게임판 위에서 동료들의 타당성 검증을 거쳐 득점한 최고의 3요소 논증 세트를 글로 기록합니다.</p>
                <div style="background-color: #f2f6fc; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid var(--accent-sage);">
                    <p style="font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; color: var(--accent-sage);">📚 권장 토론 논제:</p>
                    <ul style="padding-left: 20px; font-size: 0.85rem; line-height: 1.6; color: #333333; margin: 0;">
                        ${book.debatePropositions ? book.debatePropositions.map(t => `<li>${t}</li>`).join("") : '<li>추천 논제 정보가 없습니다.</li>'}
                    </ul>
                </div>
                <table class="ws-table">
                    <tr>
                        <th style="width: 30%;">🟢 주장 (Claim)</th>
                        <th style="width: 35%;">🟡 이유 (Reason)</th>
                        <th style="width: 35%;">🔴 근거 (Evidence)</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea style="min-height: 150px;" placeholder="~라고 생각합니다. (인물의 갈등에 대해 명확한 나의 입장 선언)"></textarea>
                        </td>
                        <td>
                            <textarea style="min-height: 150px;" placeholder="왜냐하면 ~이기 때문입니다. (주장의 보편적 원인 제공)"></textarea>
                        </td>
                        <td>
                            <textarea style="min-height: 150px;" placeholder="예를 들어 그림책의 ○○페이지 문장/그림 묘사를 보면 ~라고 나옵니다. (명확한 텍스트 힌트 매칭)"></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <textarea style="min-height: 150px;" placeholder="두 번째 주장..."></textarea>
                        </td>
                        <td>
                            <textarea style="min-height: 150px;" placeholder="두 번째 이유..."></textarea>
                        </td>
                        <td>
                            <textarea style="min-height: 150px;" placeholder="두 번째 근거..."></textarea>
                        </td>
                    </tr>
                </table>
            </div>
        `;
    } else if (type === "panel") {
        worksheetHTML += `
            <div class="ws-section">
                <h4>⚖️ 찬반패널토론 청중 배심원 판정 의견서</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 12px;">대표 패널단의 토론을 공정하게 경청하고 평가하여 최종 배심 판결을 기록합니다.</p>
                <div style="background-color: #f2f6fc; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid var(--accent-sage);">
                    <p style="font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; color: var(--accent-sage);">📚 권장 토론 논제:</p>
                    <ul style="padding-left: 20px; font-size: 0.85rem; line-height: 1.6; color: #333333; margin: 0;">
                        ${book.debatePropositions ? book.debatePropositions.map(t => `<li>${t}</li>`).join("") : '<li>추천 논제 정보가 없습니다.</li>'}
                    </ul>
                </div>
                <table class="ws-table">
                    <tr>
                        <th style="width: 50%;">🟢 찬성 측 패널 주장의 핵심과 배심원 평가</th>
                        <th style="width: 50%;">🔴 반대 측 패널 주장의 핵심과 배심원 평가</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea style="min-height: 160px;" placeholder="찬성 측이 제시한 근거 중 가장 타당했던 점과 논리적 허점을 기록하세요..."></textarea>
                        </td>
                        <td>
                            <textarea style="min-height: 160px;" placeholder="반대 측이 제시한 근거 중 가장 타당했던 점과 논리적 허점을 기록하세요..."></textarea>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="ws-section">
                <h4>🗳️ 청중으로서 내가 패널들에게 직접 던진 예리한 검증 질문</h4>
                <textarea style="width:100%; min-height:60px; padding:10px; border:1px solid #ccc; border-radius:6px; margin-bottom:16px;" placeholder="패널 토의 도중 논증 설명이 부족해 의문이 생겼던 핵심 질문과 그들의 대답 요약..."></textarea>
                
                <h4>🏛️ 배심원단의 최종 판정문 (다수결 표결 의견 및 조화로운 공존 대안)</h4>
                <textarea class="ws-textarea-box" placeholder="배심원 투표 결과 및 소수 의견을 배려하여 우리 학급이 최종 도출한 조화로운 해결 규정문을 낭독하듯 서술해 주세요..."></textarea>
            </div>
        `;
    } else if (type === "openspace") {
        worksheetHTML += `
            <div class="ws-section">
                <h4>🌍 오픈 스페이스 자율 의제 토의 보고서</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 12px;">참여자들이 스스로 발제한 안건 방을 선택하여 자율적으로 대화를 나누고 이동한 기록장입니다.</p>
                <div class="ws-recommend-topics-box no-print" style="margin-bottom:12px; padding:10px; background-color:#fef8f5; border-radius:8px; border:1px solid rgba(224,122,95,0.15); font-size:0.85rem;">
                    <strong>💡 추천 토의 의제 (클릭 시 자동 입력):</strong>
                    <div style="display:flex; flex-direction:column; gap:6px; margin-top:6px;">
                        ${book.debatePropositions ? book.debatePropositions.map(t => `<button type="button" class="recommend-topic-btn" onclick="document.querySelector('input[placeholder=\\'예: 환경 보존과 개발 이익의 충돌\\']').value = this.innerText.substring(2); return false;" style="background:none; border:none; text-align:left; color:var(--accent-coral); cursor:pointer; font-weight:600; padding:0; font-family:inherit;">🔹 ${t}</button>`).join("") : '<span>추천 논제 정보가 없습니다.</span>'}
                    </div>
                </div>
                <table class="ws-table">
                    <tr>
                        <td class="ws-meta-label" style="width: 15%;">내가 선택한 의제</td>
                        <td class="ws-meta-value" style="width: 35%;"><input type="text" placeholder="예: 환경 보존과 개발 이익의 충돌"></td>
                        <td class="ws-meta-label" style="width: 15%;">최초 안건 발제자</td>
                        <td class="ws-meta-value" style="width: 35%;"><input type="text" placeholder="안건 제안자 이름"></td>
                    </tr>
                </table>
                
                <div style="margin-top: 16px;">
                    <h4>💬 자율 모둠 토의 내용 요약 (이동하며 배운 다각도의 관점 정리)</h4>
                    <p style="font-size: 0.85rem; color: #555555; margin-bottom: 8px;">'두 다리의 규칙'을 사용해 다른 의제 방을 돌며 누적해서 듣고 기록한 다양한 학생들의 통찰들을 요약하세요.</p>
                    <textarea class="ws-textarea-box" style="min-height: 180px;" placeholder="우리가 만난 생각 1:\n우리가 만난 생각 2:\n대안 해결 아이디어들:..."></textarea>
                </div>
            </div>
            <div class="ws-section">
                <h4>🌱 토론 후 우리 삶의 변화를 가져올 공동 실천 다짐 약속</h4>
                <textarea class="ws-textarea-box" placeholder="논의에 머무르지 않고, 교실과 가정, 지구를 지키기 위해 당장 행동에 옮길 3가지 약속을 기술하세요..."></textarea>
            </div>
        `;
    } else if (type === "leadership") {
        worksheetHTML += `
            <div class="ws-section">
                <h4>👑 주도권 토론 교차조사 및 질의 전략 작성지</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 12px;">나에게 배정된 시간 동안 상대방의 논증 요지를 꼼꼼히 질문하여 주도해 나가는 논증 전술 시트입니다.</p>
                <div style="background-color: #fcf8f2; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid var(--accent-coral);">
                    <p style="font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; color: var(--accent-coral);">📚 권장 토론 논제:</p>
                    <ul style="padding-left: 20px; font-size: 0.85rem; line-height: 1.6; color: #333333; margin: 0;">
                        ${book.debatePropositions ? book.debatePropositions.map(t => `<li>${t}</li>`).join("") : '<li>추천 논제 정보가 없습니다.</li>'}
                    </ul>
                </div>
                <table class="ws-table">
                    <tr>
                        <th style="width: 50%;">🎯 1단계: 내 주도권 시간 동안 전개할 연속 질문 설계</th>
                        <th style="width: 50%;">🛡️ 2단계: 상대방 주도권 폭격 시 내 답변 방어 계획</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea style="min-height: 180px;" placeholder="상대 입론서의 모순이나 생태적 오류를 짚기 위한 단답 유도형 질문 리스트...\n- 질문 1:\n- 질문 2:..."></textarea>
                        </td>
                        <td>
                            <textarea style="min-height: 180px;" placeholder="상대가 나를 공격적으로 유도 심문해 올 때, 논점이 흐려지지 않게 내 핵심 근거를 짧고 굵게 방어할 답변 핵심 문장들..."></textarea>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="ws-section">
                <h4>⚙️ 3단계: 자가 전략 평가 및 성찰 복기</h4>
                <textarea class="ws-textarea-box" placeholder="오늘 질문 전개 시간 동안 어떤 질문이 상대의 틈을 잘 찔렀는지, 장황한 답변을 적절히 제어하여 주도권을 쥐었는지 스스로 분석해 피드백을 적으세요..."></textarea>
            </div>
        `;
    } else if (type === "traffic") {
        worksheetHTML += `
            <div class="ws-section">
                <h4>🚦 토론 논제: 《${book.title}》 속 인물의 결정에 동의하는가?</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 12px;">(연계 토론 기법: 신호등 토론)</p>
                <div style="background-color: #f2f6fc; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid var(--accent-sage);">
                    <p style="font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; color: var(--accent-sage);">📚 권장 토론 논제:</p>
                    <ul style="padding-left: 20px; font-size: 0.85rem; line-height: 1.6; color: #333333; margin: 0;">
                        ${book.debatePropositions ? book.debatePropositions.map(t => `<li>${t}</li>`).join("") : '<li>추천 논제 정보가 없습니다.</li>'}
                    </ul>
                </div>
                <table class="ws-table">
                    <tr>
                        <th style="width: 33%;">🟢 토론 전 나의 신호 (찬성)</th>
                        <th style="width: 33%;">🔴 토론 전 나의 신호 (반대)</th>
                        <th style="width: 33%;">🟡 토론 전 나의 신호 (보류/중립)</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea placeholder="동의하는 이유를 적어 보세요..."></textarea>
                        </td>
                        <td>
                            <textarea placeholder="반대하는 이유를 적어 보세요..."></textarea>
                        </td>
                        <td>
                            <textarea placeholder="판단을 유보하거나 다른 고민이 되는 지점을 적어 보세요..."></textarea>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="ws-section">
                <h4>💬 토론 중 귀담아 들은 친구들의 다양한 생각</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 8px;">나와 다른 의견을 가졌던 친구들의 타당한 생각들을 요약해 보세요.</p>
                <textarea class="ws-textarea-box" style="min-height: 100px;" placeholder="친구의 이름과 친구가 든 근거를 정리해 적어 보세요..."></textarea>
            </div>
            <div class="ws-section">
                <h4>🚦 토론 후 최종 결정 및 나의 신호 변화</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 8px;">토론 전과 비교하여 내 신호등 색깔은 어떻게 바뀌었나요? 내 생각이 바뀐 까닭이나 더 깊어진 결론을 서술하세요.</p>
                <textarea class="ws-textarea-box" placeholder="내 생각의 변화와 토론 후 최종 결정한 생각을 정리해 적어 주세요..."></textarea>
            </div>
        `;
    } else if (type === "pmi") {
        worksheetHTML += `
            <div class="ws-section">
                <h4>💡 토론 의제: 책 속 주인공의 제안이나 결정 분석하기</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 12px;">(연계 토론 기법: PMI 분석 토론)</p>
                <div style="background-color: #fcf8f2; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid var(--accent-coral);">
                    <p style="font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; color: var(--accent-coral);">📚 권장 토론 논제:</p>
                    <ul style="padding-left: 20px; font-size: 0.85rem; line-height: 1.6; color: #333333; margin: 0;">
                        ${book.debatePropositions ? book.debatePropositions.map(t => `<li>${t}</li>`).join("") : '<li>추천 논제 정보가 없습니다.</li>'}
                    </ul>
                </div>
                <table class="ws-table">
                    <tr>
                        <th style="width: 33%;">➕ Plus (긍정적인 면 / 장점)</th>
                        <th style="width: 33%;">➖ Minus (부정적인 면 / 단점)</th>
                        <th style="width: 33%;">💡 Interesting (흥미로운 지점 / 시사점)</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea placeholder="이 결정이 가져다줄 좋은 결과와 이점들을 다각도로 적어 보세요..."></textarea>
                        </td>
                        <td>
                            <textarea placeholder="이 결정이 가져올 문제점, 우려 사항, 손실을 다각도로 적어 보세요..."></textarea>
                        </td>
                        <td>
                            <textarea placeholder="이 결정을 통해 새롭게 보게 된 관점이나 아이디어, 신선한 점들을 적어 보세요..."></textarea>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="ws-section">
                <h4>🔍 PMI 분석을 통해 내린 나의 최종 결론 및 대안</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 8px;">장단점 및 흥미로운 점을 분석한 결과를 토대로, 나라면 어떤 선택을 내렸을지 혹은 단점을 극복할 대안을 적으세요.</p>
                <textarea class="ws-textarea-box" placeholder="균형 있는 시각을 바탕으로 완성한 나의 대안적 주장을 서술해 주세요..."></textarea>
            </div>
        `;
    } else if (type === "twostray") {
        worksheetHTML += `
            <div class="ws-section">
                <h4>🧭 둘 가고 둘 남기 지식 교류 활동지</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 12px;">모둠 내 토론을 거친 뒤 다른 모둠을 여행하며 배움을 순환합니다.</p>
                <div style="background-color: #f2f6fc; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid var(--accent-sage);">
                    <p style="font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; color: var(--accent-sage);">📚 권장 토론 논제:</p>
                    <ul style="padding-left: 20px; font-size: 0.85rem; line-height: 1.6; color: #333333; margin: 0;">
                        ${book.debatePropositions ? book.debatePropositions.map(t => `<li>${t}</li>`).join("") : '<li>추천 논제 정보가 없습니다.</li>'}
                    </ul>
                </div>
                <table class="ws-table">
                    <tr>
                        <th style="width: 50%;">🏠 [우리의 잔류 생각] 모둠방 가이드가 방문객에게 설명한 의견</th>
                        <th style="width: 50%;">🧭 [우리의 여행 배움] 배움 여행자가 타 모둠에서 수집한 생각</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea style="min-height: 180px;" placeholder="우리 팀이 모둠 내에서 세운 《${book.title}》에 대한 요약 논리..."></textarea>
                        </td>
                        <td>
                            <textarea style="min-height: 180px;" placeholder="다른 모둠방들을 돌면서 발견한 우리 팀 주장의 맹점을 채워줄 타인들의 아이디어..."></textarea>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="ws-section">
                <h4>🌟 여행 수확 지식을 융합하여 한 단계 업그레이드한 우리 모둠 최종 보고</h4>
                <textarea class="ws-textarea-box" placeholder="잔류 가이드와 여행 다녀온 멤버가 합심하여 완성한 우리 모둠의 최종 해결 전지 요약문..."></textarea>
            </div>
        `;
    } else if (type === "panorama") {
        worksheetHTML += `
            <div class="ws-section">
                <h4>🖼️ 파노라마 다중 관점 렌즈 활동지</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 8px;">이야기 속 조연이나 스쳐 지나가는 사물의 눈(렌즈)을 통해 사건을 입체적으로 바라봅니다.</p>
                <p style="font-size: 0.9rem; font-weight:700; color:#111111;">내가 대입받은 다중 시점 배역 렌즈: <input type="text" style="width:200px; padding:2px 6px; border:1px solid #ccc; display:inline;" placeholder="예: 마트 지배인 / 비둘기"></p>
                <div style="background-color: #f2f6fc; padding: 12px; border-radius: 8px; margin-top: 12px; margin-bottom: 16px; border-left: 4px solid var(--accent-sage);">
                    <p style="font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; color: var(--accent-sage);">📚 권장 토론 논제:</p>
                    <ul style="padding-left: 20px; font-size: 0.85rem; line-height: 1.6; color: #333333; margin: 0;">
                        ${book.debatePropositions ? book.debatePropositions.map(t => `<li>${t}</li>`).join("") : '<li>추천 논제 정보가 없습니다.</li>'}
                    </ul>
                </div>
                <table class="ws-table" style="margin-top: 16px;">
                    <tr>
                        <th style="width: 50%;">1. [나의 역할 빙의] 당시 상황을 겪은 이 조연의 억울함과 속마음</th>
                        <th style="width: 50%;">2. [타 조연과의 대화] 다른 렌즈를 가진 동료 패널들과 나눈 딜레마</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea style="min-height: 180px;" placeholder="내가 대입받은 역할(인물 또는 사물)의 눈으로 바라볼 때, 당시의 갈등 상황이나 내 입장이 어떠했는지 본래 캐릭터의 속마음을 담아 서술하세요..."></textarea>
                        </td>
                        <td>
                            <textarea style="min-height: 180px;" placeholder="다른 인물들과 소통하며 밝혀진, 모두가 처했던 현실적 상황의 상충 지점들을 기록하세요..."></textarea>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="ws-section">
                <h4>🤝 3. 다원적 딜레마를 고루 배려한 제3의 아름다운 타결 대안안</h4>
                <textarea class="ws-textarea-box" placeholder="한 명의 주인공만을 위한 이기적 판단이 아니라, 주변인들 모두가 공존하고 상생할 수 있도록 작성한 타결 서약서를 작성하세요..."></textarea>
            </div>
        `;
    } else if (type === "fan") {
        worksheetHTML += `
            <div class="ws-section">
                <h4>🌀 선풍기 토론 경청 누적 릴레이 활동지</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 12px;">선풍기 날개가 돌듯 이전 친구의 주장을 경청 요약한 뒤에만 생각을 얹을 수 있습니다.</p>
                <div style="background-color: #f2f6fc; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid var(--accent-sage);">
                    <p style="font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; color: var(--accent-sage);">📚 권장 토론 논제:</p>
                    <ul style="padding-left: 20px; font-size: 0.85rem; line-height: 1.6; color: #333333; margin: 0;">
                        ${book.debatePropositions ? book.debatePropositions.map(t => `<li>${t}</li>`).join("") : '<li>추천 논제 정보가 없습니다.</li>'}
                    </ul>
                </div>
                <table class="ws-table">
                    <tr>
                        <th>🌀 1회차 회전: 나의 최초 아이디어 발언</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea style="height: 80px;" placeholder="내가 《${book.title}》의 주요 갈등 사건에 대해 고안한 첫 생각을 짧게 쓰세요..."></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th style="background-color: #fcf8f2;">🌀 2회차 회전: 앞 친구 생각 요약 + 내 생각 누적 얹기</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea style="height: 90px;" placeholder="'앞 사람 ○○가 ~라고 말한 것을 집중 경청했다. 여기에 내 생각을 보태어 ~' 포맷을 지키며 적으세요..."></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th style="background-color: #f2f6fc;">🌀 3회차 회전: 3바퀴 돌아 겹깁이 쌓인 최종 융합 안건 정리</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea style="height: 100px;" placeholder="모든 조원들의 필터와 경청을 거쳐 눈덩이처럼 융합 완성된 최종 생각 포인트를 쓰세요..."></textarea>
                        </td>
                    </tr>
                </table>
            </div>
        `;
    } else if (type === "reason") {
        worksheetHTML += `
            <div class="ws-section">
                <h4>💡 이유찾기 탐구: 왜 인물은 이러한 갈등 행동을 결정했을까?</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 12px;">(연계 토론 기법: 이유찾기 토론)</p>
                <div style="background-color: #f2f6fc; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid var(--accent-sage);">
                    <p style="font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; color: var(--accent-sage);">📚 권장 토론 논제:</p>
                    <ul style="padding-left: 20px; font-size: 0.85rem; line-height: 1.6; color: #333333; margin: 0;">
                        ${book.debatePropositions ? book.debatePropositions.map(t => `<li>${t}</li>`).join("") : '<li>추천 논제 정보가 없습니다.</li>'}
                    </ul>
                </div>
                <table class="ws-table">
                    <tr>
                        <th style="width: 50%;">인물의 행동 및 선택 분석</th>
                        <th style="width: 50%;">그렇게 행동한 숨겨진 이유 추측</th>
                    </tr>
                    <tr>
                        <td>
                            <textarea placeholder="그림책 속에서 가장 이해하기 어렵거나 독특했던 인물의 행동을 구체적으로 정의해 적어 보세요..."></textarea>
                        </td>
                        <td>
                            <textarea placeholder="인물이 겪은 내적/외적 갈등 상황과 왜 그런 결정을 내릴 수밖에 없었는지 숨겨진 감정이나 심리를 유추해 적어 보세요..."></textarea>
                        </td>
                    </tr>
                </table>
            </div>
            
            <div class="ws-section">
                <h4>🔎 내 추측을 지지해 주는 책 속의 결정적 단서 찾기</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 8px;">내가 생각한 인물의 행동 이유를 뒷받침하는 그림책 속 '글의 문장'이나 '그림(색감, 표정, 배경 소품 등)의 단서'를 찾아 기록하세요.</p>
                <textarea class="ws-textarea-box" placeholder="예: '페이지 ○○의 주인공의 표정이 어두운 것으로 보아 ~라고 생각한다' 형식으로 구체적인 증거를 대입하세요..."></textarea>
            </div>
        `;
    } else if (type === "valueline") {
        worksheetHTML += `
            <div class="ws-section">
                <h4>💡 토론 논제: 가치 판단과 나의 위치 정하기</h4>
                <p style="font-size: 0.85rem; color: #555555; margin-bottom: 8px;">(연계 토론 기법: 가치수직선 토론)</p>
                <div style="background-color: #fcf8f2; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid var(--accent-coral);">
                    <p style="font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; color: var(--accent-coral);">📚 권장 가치 토론 논제:</p>
                    <ul style="padding-left: 20px; font-size: 0.85rem; line-height: 1.6; color: #333333; margin: 0;">
                        ${book.debatePropositions ? book.debatePropositions.map(t => `<li>${t}</li>`).join("") : '<li>추천 논제 정보가 없습니다.</li>'}
                    </ul>
                </div>
                
                <div class="ws-valueline-container">
                    <div class="ws-valueline-labels">
                        <span>🔴 0 (전혀 동의하지 않음)</span>
                        <span>🟡 5 (보류 / 중립)</span>
                        <span>🟢 10 (매우 동의함)</span>
                    </div>
                    <div class="ws-valueline-axis">
                        <div class="ws-valueline-ticks">
                            ${Array.from({ length: 11 }, (_, i) => `
                                <div class="ws-valueline-tick">
                                    <div class="ws-valueline-dot" onclick="this.style.backgroundColor='#e07a5f'; alert('${i}점을 선택하셨습니다. 아래 칸에 이유를 상세히 적어 주세요.');"></div>
                                    <span class="ws-valueline-num">${i}</span>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </div>
            </div>
            
            <table class="ws-table" style="margin-top: 40px;">
                <tr>
                    <th style="width: 50%;">1. [토론 전] 내가 저 눈금 지점에 서게 된 이유</th>
                    <th style="width: 50%;">2. [토론 후] 내 생각의 변화 및 수정된 위치(점수)</th>
                </tr>
                <tr>
                    <td>
                        <textarea placeholder="내가 가치선 위 특정 위치를 선택한 까닭과 도덕적/현실적 근거를 정리해 적어 보세요..."></textarea>
                    </td>
                    <td>
                        <textarea placeholder="친구들의 다른 가치관적 설명을 들은 후, 내 입장을 움직였나요? 이동 여부와 최종 결론을 적어 보세요..."></textarea>
                    </td>
                </tr>
            </table>
        `;
    }

            const typeToTechId = {
                "basic": null,
                "brainwriting": "brainwriting",
                "procon": "procon",
                "hotseating": "hotseating",
                "carousel": "carousel",
                "socratic": "socratic",
                "worldcafe": "worldcafe",
                "argument": "argumentgame",
                "doublepyramid": "doublepyramid",
                "angeldevil": "angeldevil",
                "hexadebate": "hexadebate",
                "traffic": "trafficlight",
                "pmi": "pmi",
                "twostray": "2stay2stray",
                "panorama": "panorama",
                "fan": "fan",
                "reason": "reasoning",
                "valueline": "valuebar"
            };

            const techId = typeToTechId[type];
            const tech = (typeof techniques !== 'undefined' && techId) ? techniques.find(t => t.id === techId) : null;

            if (tech) {
                // Get dynamic scenario for the selected book and technique
                const dynScenario = getDynamicScenario(book, tech);

                worksheetHTML += `
                    </div> <!-- Close 1st Page .worksheet-paper -->
                    
                    <div class="worksheet-paper worksheet-page-2" style="page-break-before: always; break-before: page; margin-top: 40px; padding-top: 40px; border-top: 2px dashed var(--accent-sage);">
                        <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid var(--accent-coral); padding-bottom: 12px;">
                            <h3 style="font-size: 1.6rem; color: #111; margin-bottom: 6px;"><i class="fa-solid fa-chalkboard-user"></i> ${tech.name} - 토론 가상 시나리오 및 가이드</h3>
                            <p style="font-size: 0.9rem; color: #555; margin: 0;">그림책 《${book.title}》을 활용한 수업 가이드라인입니다.</p>
                        </div>
                        
                        <div style="display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 20px;">
                            <!-- Left Section: Script & Dialog -->
                            <div style="flex: 1.2; min-width: 320px; background: #fafbfc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
                                <h4 style="font-size: 1.1rem; color: #1e293b; margin-top: 0; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                                    <i class="fa-solid fa-comments" style="color: var(--accent-coral);"></i> 수업 가상 시나리오
                                </h4>
                                <div style="font-size: 0.85rem; line-height: 1.6; color: #334155; display: flex; flex-direction: column; gap: 14px;">
                                    <div style="background-color: #fef8f5; border-left: 4px solid var(--accent-coral); padding: 10px 14px; border-radius: 4px;">
                                        <strong style="color: #c05638; font-size: 0.9rem; display: block; margin-bottom: 4px;">👨‍🏫 교사 도입 발문:</strong>
                                        <span>${dynScenario.intro}</span>
                                    </div>
                                    
                                    <div style="margin-top: 5px;">
                                        <strong style="color: #475569; display: block; margin-bottom: 8px;"><i class="fa-solid fa-users-viewfinder"></i> 모둠 가상 대화 시나리오:</strong>
                                        <div style="display: flex; flex-direction: column; gap: 8px; max-height: 320px; overflow-y: auto; padding-right: 5px;">
                                            ${dynScenario.dialog && dynScenario.dialog.length > 0 ? dynScenario.dialog.map(d => `
                                                <div style="background: #ffffff; border-radius: 8px; padding: 10px 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                                                    <span style="font-weight: 700; color: #475569; display: block; margin-bottom: 3px;">👤 ${d.role}</span>
                                                    <span style="color: #1e293b; font-style: italic;">"${d.text}"</span>
                                                </div>
                                            `).join("") : '<div style="color: #94a3b8;">가상 대화 내용이 없습니다.</div>'}
                                        </div>
                                    </div>
                                    
                                    <div style="background-color: #f4f8f5; border-left: 4px solid var(--accent-sage); padding: 10px 14px; border-radius: 4px;">
                                        <strong style="color: #2e6f40; font-size: 0.9rem; display: block; margin-bottom: 4px;">👨‍🏫 교사 성찰 및 정리 발문:</strong>
                                        <span>${dynScenario.wrapUp}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Right Section: Seating & Tips -->
                            <div style="flex: 0.8; min-width: 260px; display: flex; flex-direction: column; gap: 20px;">
                                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; display: flex; flex-direction: column; justify-content: space-between; min-height: 260px;">
                                    <div>
                                        <h4 style="font-size: 1.1rem; color: #1e293b; margin-top: 0; margin-bottom: 8px; text-align: left; display: flex; align-items: center; gap: 8px;">
                                            <i class="fa-solid fa-chair" style="color: var(--accent-sage);"></i> 자리 배치 권장 구성도
                                        </h4>
                                        <p style="font-size: 0.78rem; color: #64748b; line-height: 1.4; text-align: left; margin-bottom: 15px;">${tech.concept}</p>
                                    </div>
                                    
                                    <div style="display: flex; justify-content: center; align-items: center; flex-grow: 1; padding: 10px 0;">
                                        ${renderSeatingLayout(tech.id)}
                                    </div>
                                    
                                    <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 8px;">
                                        ※ 인쇄 시 이 페이지도 함께 인쇄하여 참고하실 수 있습니다.
                                    </div>
                                </div>
                                
                                <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                                    <strong style="color: #b45309; font-size: 0.85rem; display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                                        <i class="fa-solid fa-circle-info"></i> 교사용 지도 꿀팁 (Tips)
                                    </strong>
                                    <ul style="padding-left: 18px; margin: 0; font-size: 0.78rem; color: #78350f; line-height: 1.5; display: flex; flex-direction: column; gap: 4px;">
                                        ${tech.tips ? tech.tips.map(tip => `<li>${tip}</li>`).join("") : '<li>학습지의 질문들을 클릭하시면 1페이지의 질문 상자에 자동으로 입력됩니다.</li>'}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                worksheetHTML += `</div>`;
            }
            // --- 2ND PAGE INJECTION END ---

            output.innerHTML = worksheetHTML;
            output.classList.remove("hidden");
        });
    }
}

// Seat layout rendering function based on techId
function renderSeatingLayout(techId) {
    if (["socratic", "angeldevil", "valuebar", "valueline"].includes(techId)) {
        return `
            <div style="position: relative; width: 220px; height: 130px; border: 2px dashed #cbd5e1; border-radius: 50% / 50% 50% 10% 10%; display: flex; justify-content: center; align-items: center; background: #fff;">
                <div style="position: absolute; top: -12px; background: #e0f2fe; border: 1px solid #0284c7; border-radius: 4px; padding: 2px 8px; font-size: 0.65rem; font-weight: 700; color: #0369a1; white-space: nowrap;">교사 (퍼실리테이터)</div>
                <div style="font-size: 0.7rem; color: #475569; font-weight: 700; text-align: center; line-height: 1.3;">둥근 U자형 대형<br><span style="font-size: 0.6rem; font-weight: normal; color: #64748b;">(전원 대면식)</span></div>
                <div style="position: absolute; left: 8px; top: 35px; width: 10px; height: 10px; background: #94a3b8; border-radius: 50%;"></div>
                <div style="position: absolute; left: 15px; top: 65px; width: 10px; height: 10px; background: #94a3b8; border-radius: 50%;"></div>
                <div style="position: absolute; left: 35px; top: 95px; width: 10px; height: 10px; background: #94a3b8; border-radius: 50%;"></div>
                <div style="position: absolute; right: 8px; top: 35px; width: 10px; height: 10px; background: #94a3b8; border-radius: 50%;"></div>
                <div style="position: absolute; right: 15px; top: 65px; width: 10px; height: 10px; background: #94a3b8; border-radius: 50%;"></div>
                <div style="position: absolute; right: 35px; top: 95px; width: 10px; height: 10px; background: #94a3b8; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 8px; width: 10px; height: 10px; background: #94a3b8; border-radius: 50%;"></div>
            </div>
        `;
    } else if (["brainwriting", "worldcafe", "2stay2stray", "fan", "hexadebate"].includes(techId)) {
        return `
            <div style="display: flex; flex-wrap: wrap; justify-content: space-around; width: 100%; max-width: 220px; gap: 10px;">
                ${Array.from({ length: 4 }).map((_, idx) => `
                    <div style="border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 8px; width: 90px; padding: 6px; text-align: center; position: relative;">
                        <div style="font-weight: 700; font-size: 0.7rem; color: #334155;">모둠 ${idx + 1}</div>
                        <div style="font-size: 0.6rem; color: #64748b; margin-top: 2px;">4~6인 테이블</div>
                        <div style="position: absolute; top:-4px; left:40px; width:8px; height:8px; background:#94a3b8; border-radius:50%;"></div>
                        <div style="position: absolute; bottom:-4px; left:40px; width:8px; height:8px; background:#94a3b8; border-radius:50%;"></div>
                        <div style="position: absolute; left:-4px; top:14px; width:8px; height:8px; background:#94a3b8; border-radius:50%;"></div>
                        <div style="position: absolute; right:-4px; top:14px; width:8px; height:8px; background:#94a3b8; border-radius:50%;"></div>
                    </div>
                `).join("")}
            </div>
        `;
    } else if (["procon", "doublepyramid", "trafficlight", "pmi", "reasoning"].includes(techId)) {
        return `
            <div style="display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 220px; gap: 8px;">
                <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; padding: 3px 8px; font-size: 0.65rem; font-weight: 700; text-align: center; color: #475569;">
                    🎤 사회자 및 판정대
                </div>
                <div style="display: flex; justify-content: space-between; width: 100%; gap: 8px;">
                    <div style="background: #f0fdf4; border: 1.5px solid #22c55e; border-radius: 6px; padding: 6px; flex: 1; text-align: center;">
                        <strong style="color: #15803d; font-size: 0.7rem; display: block; margin-bottom: 2px;">🟢 찬성 (Pro)</strong>
                        <div style="font-size: 0.6rem; color: #64748b;">토론자 배석<br>(2~4인)</div>
                    </div>
                    <div style="background: #fef2f2; border: 1.5px solid #ef4444; border-radius: 6px; padding: 6px; flex: 1; text-align: center;">
                        <strong style="color: #b91c1c; font-size: 0.7rem; display: block; margin-bottom: 2px;">🔴 반대 (Con)</strong>
                        <div style="font-size: 0.6rem; color: #64748b;">토론자 배석<br>(2~4인)</div>
                    </div>
                </div>
            </div>
        `;
    } else if (techId === "hotseating") {
        return `
            <div style="position: relative; width: 220px; height: 130px; display: flex; justify-content: center; align-items: center;">
                <div style="width: 190px; height: 110px; border: 2px dashed #93c5fd; border-radius: 50% / 50% 50% 10% 10%; display: flex; justify-content: center; align-items: flex-end; padding-bottom: 6px; position: relative; background: #fff;">
                    <div style="font-size: 0.65rem; color: #2563eb; font-weight: 700; margin-bottom: 2px;">청중 질문단 (U자)</div>
                    <div style="position: absolute; top: 25px; left: 75px; background: #fee2e2; border: 1.5px solid #f87171; border-radius: 50%; width: 36px; height: 36px; display: flex; flex-direction: column; justify-content: center; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
                        <strong style="color: #991b1b; font-size: 0.65rem;">🔥</strong>
                        <span style="font-size: 0.55rem; font-weight: 700; color: #991b1b; white-space: nowrap;">핫시트</span>
                    </div>
                    <div style="position: absolute; left: 10px; top: 22px; width: 8px; height: 8px; background: #94a3b8; border-radius: 50%;"></div>
                    <div style="position: absolute; left: 18px; top: 50px; width: 8px; height: 8px; background: #94a3b8; border-radius: 50%;"></div>
                    <div style="position: absolute; left: 42px; top: 78px; width: 8px; height: 8px; background: #94a3b8; border-radius: 50%;"></div>
                    <div style="position: absolute; right: 10px; top: 22px; width: 8px; height: 8px; background: #94a3b8; border-radius: 50%;"></div>
                    <div style="position: absolute; right: 18px; top: 50px; width: 8px; height: 8px; background: #94a3b8; border-radius: 50%;"></div>
                    <div style="position: absolute; right: 42px; top: 78px; width: 8px; height: 8px; background: #94a3b8; border-radius: 50%;"></div>
                </div>
            </div>
        `;
    } else if (techId === "carousel" || techId === "carousel-debate") {
        return `
            <div style="position: relative; width: 140px; height: 120px; display: flex; justify-content: center; align-items: center; background: #fff; border-radius: 8px;">
                <div style="position: absolute; width: 100px; height: 100px; border: 2px dashed #c084fc; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                    <div style="width: 54px; height: 54px; border: 2px dashed #a855f7; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                        <div style="font-size: 0.55rem; font-weight: 700; color: #7e22ce; text-align: center; line-height: 1.2;">안쪽 원<br>↔ 바깥 원</div>
                    </div>
                    <div style="position: absolute; width: 8px; height: 8px; background: #7e22ce; border-radius: 50%; top: 22px;"></div>
                    <div style="position: absolute; width: 8px; height: 8px; background: #7e22ce; border-radius: 50%; bottom: 22px;"></div>
                    <div style="position: absolute; width: 8px; height: 8px; background: #7e22ce; border-radius: 50%; left: 22px;"></div>
                    <div style="position: absolute; width: 8px; height: 8px; background: #7e22ce; border-radius: 50%; right: 22px;"></div>
                </div>
                <div style="position: absolute; width: 8px; height: 8px; background: #c084fc; border-radius: 50%; top: 2px;"></div>
                <div style="position: absolute; width: 8px; height: 8px; background: #c084fc; border-radius: 50%; bottom: 2px;"></div>
                <div style="position: absolute; width: 8px; height: 8px; background: #c084fc; border-radius: 50%; left: 2px;"></div>
                <div style="position: absolute; width: 8px; height: 8px; background: #c084fc; border-radius: 50%; right: 2px;"></div>
            </div>
        `;
    } else {
        return `
            <div style="display: flex; flex-wrap: wrap; justify-content: center; width: 100%; max-width: 220px; gap: 6px;">
                ${Array.from({ length: 6 }).map((_, idx) => `
                    <div style="border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 4px; width: 64px; padding: 4px; text-align: center; font-size: 0.55rem; white-space: nowrap; color: #64748b;">
                        👥 짝 모둠 ${idx + 1}
                    </div>
                `).join("")}
            </div>
        `;
    }
}

// Function to generate dynamic scenario based on the selected book and technique metadata
function getDynamicScenario(book, tech) {
    if (!tech) return { intro: "", wrapUp: "", dialog: [] };

    // If the book matches the default script book, return the default scenario
    if (tech.script && tech.script.book === book.title) {
        return {
            intro: tech.teacherScenario ? tech.teacherScenario.intro : "",
            wrapUp: tech.teacherScenario ? tech.teacherScenario.wrapUp : "",
            dialog: tech.script.dialog || []
        };
    }

    // Otherwise, generate a customized scenario dynamically based on book properties
    const props = book.debatePropositions || [];
    const mainTopic = props[0] || `${book.title}의 갈등 해결 방식은 정당한가`;
    const subTopic = props[1] || `${book.title} 속 인물들의 선택은 옳은가`;

    const introTemplates = {
        "panorama": `여러분, 그림책 《${book.title}》의 주요 갈등 상황에 대해 주인공뿐만 아니라 조연, 주변 동물, 혹은 관련 사물의 시선 렌즈를 가지고 사건을 입체적으로 바라볼 거예요. 우리가 뽑은 역할의 눈으로 이 사건을 바라보면 어떨까요?`,
        "valuebar": `그림책 《${book.title}》의 핵심 논제인 "${mainTopic}"에 대해 자신의 동의 정도를 수직선 위에 표현해 봅시다. 0점(절대 동의하지 않음)부터 10점(매우 동의함)까지 어느 위치에 서고 싶나요?`,
        "brainwriting": `《${book.title}》 속 인물이 처한 난처한 상황을 해결하기 위해, 우리는 브레인라이팅 기법으로 서로의 지혜를 모아 릴레이 아이디어를 발전시켜 조언을 완성해 보겠습니다.`,
        "procon": `《${book.title}》의 핵심 논제 "${mainTopic}"에 대해 Pro(찬성)와 Con(반대)의 입장을 번갈아 맡아보며, 자신의 생각과 반대되는 논리도 세워보는 역발상 토론을 진행하겠습니다.`,
        "hotseating": `《${book.title}》의 주인공을 교실 중앙의 뜨거운 의자(Hot seat)에 초대했습니다. 주인공의 속마음과 감춰진 갈등의 원인을 질문하고, 주인공의 대답을 통해 인물을 깊이 이해해 봅시다.`,
        "carousel": `안쪽 원과 바깥쪽 원으로 마주 보고 앉아 《${book.title}》에 대한 1:1 찬반 토론을 진행합니다. 시간이 종료되면 자리를 한 칸씩 이동하여 새로운 파트너와 생각을 누적해 나눠봅시다.`,
        "socratic": `우리는 《${book.title}》 속 텍스트의 본질적인 가치를 탐구하는 소크라틱 세미나를 시작합니다. 정답을 경쟁하여 이기는 대신, 텍스트 뒤에 숨은 의미를 함께 성찰해 봅시다.`,
        "worldcafe": `《${book.title}》에 관련된 세부 의제를 각 테이블에 배치하고, 카페처럼 편안한 분위기에서 아이디어를 나누며 호스트를 제외한 멤버들이 테이블을 이동하며 통찰을 융합하겠습니다.`,
        "argumentgame": `《${book.title}》에서 도출한 주장들에 대해, 합당한 이유와 명확한 텍스트적 근거를 매칭하는 논증 게임 활동을 통해 논리 구조를 튼튼하게 다듬어 봅시다.`,
        "doublepyramid": `여러분, 그림책 《${book.title}》의 논제 "${mainTopic}"에 관하여 찬성과 반대 진영이 각각 피라미드처럼 한 단계씩 주장을 수렴해 나가고, 최종적으로 양측의 최정점 의견을 모아 상생 대안을 도출해 봅시다.`,
        "angeldevil": `그림책 《${book.title}》 속 주인공이 겪는 갈등에 대해, 의사결정자를 돕는 천사의 따뜻한 조언과 현실을 충고하는 악마의 날카로운 귓속말 대화 토론을 진행하겠습니다.`,
        "hexadebate": `이번 시간에는 그림책 《${book.title}》 속 다양한 개념들을 육각형 헥사 카드들로 연결해 가며, 사건들의 원인과 화합의 네트워크를 시각적으로 논증해 보겠습니다.`,
        "trafficlight": `《${book.title}》 속 인물의 결정에 대해 찬성(초록), 반대(빨강), 중립(노랑) 신호등 마커를 들고 토론을 펼칩니다. 토론을 진행하며 친구의 설득을 통해 신호가 바뀌었는지 성찰합시다.`,
        "pmi": `《${book.title}》에서 내린 결정에 대해 Plus(긍정적 면), Minus(부정적 면), Interesting(흥미로운 시사점)을 다각도로 분석하여 더 완성도 높은 대안을 제시해 봅시다.`,
        "2stay2stray": `《${book.title}》에 대한 모둠 의견을 수립한 뒤, 2명은 잔류하여 가이드 역할을 하고, 2명은 다른 모둠으로 여행을 떠나 서로의 배움을 적극적으로 순환시키고 융합해 보겠습니다.`,
        "fan": `선풍기 날개가 회전하듯 앞 조원의 의견을 귀담아듣고 요약해 준 뒤에만 내 의견을 덧붙일 수 있는 경청 릴레이 토론을 통해 《${book.title}》의 해결책을 겹겹이 쌓아 봅시다.`,
        "reasoning": `《${book.title}》 속 주인공이 왜 그런 특이한 행동이나 선택을 내렸는지 숨겨진 감정과 속사정을 유추하고, 이를 뒷받침할 책 속의 텍스트/그림 단서를 찾아 증명해 봅시다.`,
        "havruta": `짝을 지어 《${book.title}》에 대해 끊임없이 질문하고 반박하는 하브루타 토론을 진행합니다. 서로 얼굴을 마주 보며 배움의 질문을 생성하고 앎의 깊이를 넓혀 봅시다.`
    };

    const wrapUpTemplates = {
        "panorama": `다각도의 조연과 사물의 렌즈로 사건을 바라보니, 주인공 한 명의 시선으로만 보았을 때 놓쳤던 소중한 존재들의 권리와 슬픔이 보였을 것입니다. 우리 주변에서도 늘 약자의 렌즈로 조망하는 힘을 기릅시다.`,
        "valuebar": `모두의 가치가 극단에만 치우쳐 있지 않고 넓은 가치 스펙트럼 상에 고르게 분포되어 있음을 알게 되었습니다. 서로 조율하며 움직이는 과정이야말로 민주적 합의의 출발점입니다.`,
        "brainwriting": `협동 릴레이 아이디어 융합을 통해 혼자서는 도저히 생각할 수 없었던 창의적인 솔루션이 탄생했습니다. 공동체의 지혜가 지닌 위대한 힘을 배운 시간이었습니다.`,
        "procon": `찬성과 반대 입장을 모두 직접 옹호해 보면서, 흑백논리를 넘어서 상대의 입장도 타당할 수 있음을 깨달았습니다. 다원적 딜레마를 포용하는 융합적 해안을 기를 수 있었습니다.`,
        "hotseating": `주인공이 가면 뒤에 숨겨두었던 외로움과 갈등을 깊이 공감해 보았습니다. 인물의 아픔을 딛고 우리가 실생활에서 어떻게 건강한 결단을 도울지 다 함께 따뜻한 대안을 새깁시다.`,
        "carousel": `여러 친구들과 자리를 돌아가며 연속적으로 소통하는 과정에서 내 주장의 빈틈이 메워지고 다채로운 근거들이 누적되었습니다. 경청하며 보완된 생각을 다듬어 성찰해 주시기 바랍니다.`,
        "socratic": `소크라틱 세미나를 통해 텍스트 본연의 궁극적인 가치와 더불어 살아가는 삶의 태도를 성찰할 수 있었습니다. 경쟁하지 않는 대화가 주는 지적 깊이를 생활 속에서도 실천해 갑시다.`,
        "worldcafe": `모두가 여행자가 되어 모둠을 오가며 아이디어를 흩뿌리고 결합한 결과, 입체적인 종합 기획안을 도출할 수 있었습니다. 열린 대화가 혁신적인 결과를 만듭니다.`,
        "argumentgame": `주장에 합당한 이유와 명확한 텍스트 근거를 일대일로 짝지어 봄으로써 단단한 논증의 3요소를 체득했습니다. 앞으로 글을 쓰거나 주장할 때 이 논리 체계를 활용하세요.`,
        "doublepyramid": `양 진영에서 각각 수렴한 최선의 정점 안건들을 조율해 봄으로써, 갈등 대립을 넘어서 양측의 가치를 모두 만족시키는 제3의 융합 대안을 멋지게 완성했습니다.`,
        "angeldevil": `천사와 악마의 속삭임을 균형 있게 들어봄으로써 내면 갈등의 복잡성을 이해하고, 스스로 책임지는 주체적인 판단을 내리는 성숙한 의사결정 과정을 훈련했습니다.`,
        "hexadebate": `헥사 카드들이 유기적인 벌집 모양을 이루어 시각화된 것을 확인했습니다. 이를 통해 문제의 단면이 아니라, 전체적인 인과관계 구조를 이해하는 거시적인 안목을 키웠습니다.`,
        "trafficlight": `신호등 토론을 통해 친구의 설득력 있는 논리를 경청하여 나의 신호등 색깔을 유연하게 바꾸는 오픈 마인드를 경험했습니다. 편견에 갇히지 않는 유연함이 큰 배움입니다.`,
        "pmi": `PMI 분석을 통해 장단점 및 흥미로운 시사점까지 고루 관찰하여 균형 있는 시각을 세웠습니다. 단점을 극복하고 조화를 이끌어낼 나만의 대안을 지속적으로 다듬어 가세요.`,
        "2stay2stray": `우리 모둠의 결과물을 손님에게 설명하고 다른 모둠의 아이디어를 수집하는 배움 순환 과정을 통해, 지식이 한곳에 고이지 않고 융합하여 진화하는 멋진 경험을 했습니다.`,
        "fan": `이전 사람의 주장을 정확히 요약해주어야만 내 의견을 얹을 수 있는 룰을 통해 진정한 '경청'의 자세를 몸에 익혔습니다. 경청을 바탕으로 누적된 집단지성은 언제나 강력합니다.`,
        "reasoning": `인물의 갈등에 대해 텍스트 구절과 삽화의 색감, 표정 단서들을 치밀하게 찾아 증명해 냈습니다. 텍스트를 깊이 읽는 독서의 힘이 토론의 품격을 높여주었습니다.`,
        "havruta": `질문하고 논박하는 역동적인 하브루타 토론으로 서로의 눈을 보며 지적으로 깊어졌습니다. 배움은 정답 암기가 아니라 질문을 생성하고 확장하는 데 있음을 기억하세요.`
    };

    const dialogTemplates = {
        "panorama": [
            { "role": `조연 A (빙의 렌즈)`, "text": `나는 《${book.title}》 속 주인공의 선택을 옆에서 꼼꼼히 보았습니다. 주인공이 "${mainTopic}"에 관해 일방적인 결정을 내렸을 때, 주변인으로서 겪었던 현실적인 걱정과 고충은 아무도 알아주지 않아 억울했습니다.` },
            { "role": `사물/자연 렌즈`, "text": `나는 이야기 속에 말없이 묘사된 사물(혹은 자연)입니다. 인간 중심의 시선에 가려져 보이지 않았던 내 존재의 상처와 이 사건이 생태적으로 미친 파장을 대변하고자 합니다.` }
        ],
        "valuebar": [
            { "role": `학생 A (가치 2점 배정)`, "text": `나는 "${mainTopic}"에 대해 2점을 줍니다. 왜냐하면 현실적인 규칙과 질서의 가치도 무시할 수 없기 때문입니다. 무리한 주장은 공동체의 붕괴를 가져올 수 있습니다.` },
            { "role": `학생 B (가치 9점 배정)`, "text": `나는 다르게 생각합니다. 인물 고유의 존엄성이나 가치를 위해 9점의 지지표를 줍니다. 위험을 무릅쓰고라도 신념을 지키는 것이 궁극적으로 옳은 결정입니다.` }
        ],
        "brainwriting": [
            { "role": `아이디어 제안자 A`, "text": `《${book.title}》 주인공의 갈등을 해결하기 위해 첫 번째 솔루션을 냅니다. 책의 결말과 달리 인물이 용기를 내어 조화로운 대화를 요청하는 자리를 먼저 만드는 것이 좋겠습니다.` },
            { "role": `아이디어 보완자 B`, "text": `A의 생각 위에 디테일을 얹겠습니다. 단순히 대화만 요청하기보다, 각자의 개성을 보여주는 작은 창작물이나 편지를 전달하여 거부감을 낮추는 융합 팁을 추천합니다.` }
        ],
        "procon": [
            { "role": `Pro (찬성 옹호)`, "text": `인물의 입장을 대변하자면, "${mainTopic}"의 결단은 본인의 가치를 지키기 위한 최선의 정당한 행위였습니다. 다수의 억압에 순응하는 것은 영혼을 잃는 일입니다.` },
            { "role": `Con (역할 교대 반대)`, "text": `하지만 반대 입장의 렌즈로 보면, 주위 구성원들과 충분한 상의 없이 혼자 이탈한 것은 공동체의 결속에 실망을 주고 오해를 키울 수 있는 행동이었습니다.` }
        ],
        "hotseating": [
            { "role": `예리한 청중`, "text": `주인공님, 책 속에서 그런 어려운 결단을 내렸던 결정적 순간에 마음속에서 일었던 가장 큰 두려움이나 갈등은 구체적으로 무엇이었습니까?` },
            { "role": `주인공 (핫시트의 답변)`, "text": `사실 주변의 거대한 평판과 억압의 눈총 때문에 제 진짜 본성을 포기해야 하나 엄청나게 외롭고 고통스러웠습니다. 하지만 한순간에 스스로 무너지기보다 가치 있는 모험을 택했습니다.` }
        ],
        "carousel": [
            { "role": `토론 파트너 A`, "text": `나는 "${mainTopic}"에 대해 인물이 행한 신념의 가치를 절대적으로 지지합니다. 용기 있는 자의 첫걸음이 세상을 바꾸기 때문입니다.` },
            { "role": `토론 파트너 B`, "text": `흥미로운 의견이네요. 하지만 저는 현실적인 유지 비용도 고려해야 한다고 봐요. 기존 규칙 속에서 서서히 타협점을 찾아가는 것이 더 성숙한 대안일 수 있습니다.` }
        ],
        "socratic": [
            { "role": `대화 참여자 A`, "text": `《${book.title}》의 문장을 읽고 인간 소외 문제에 직면했습니다. 주인공이 처했던 외로움은 우리 교실의 은근한 분리 장벽과도 닿아있지 않을까요?` },
            { "role": `대화 참여자 B`, "text": `맞습니다. 우리는 단순히 이야기를 넘어, 우리 삶 속에 투영된 조건부 배려와 다름에 대한 인정의 본질적 가치로 대화를 확장해야 합니다.` }
        ],
        "worldcafe": [
            { "role": `테이블 호스트`, "text": `어서 오세요. 우리 2번 테이블의 의제는 "${subTopic}"입니다. 앞선 조에서 낸 마인드맵 위에 새로운 브레인스토밍 낙서와 보완을 얹어주세요.` },
            { "role": `방문 여행자 A`, "text": `앞 모둠의 '소외 문제 극복 방안' 낙서에 덧붙여, 우리 모둠에서 나눈 '다각적 멘토링 연대' 아이디어를 얹겠습니다. 이렇게 유기적으로 엮으니 실천력이 올라가네요.` }
        ],
        "argumentgame": [
            { "role": `검증단 A`, "text": `당신의 주장 "${mainTopic}"은 흥미롭지만, 이를 뒷받침할 명확한 텍스트의 사실(이유 및 근거)이 누락되어 있습니다. 구체적인 페이지나 삽화 단서를 매칭해 주세요.` },
            { "role": `논증 제안자 B`, "text": `이에 대해 이유와 근거를 매치합니다. 왜냐하면 인물이 용기를 내어 가치를 증명한 행동이 책 45페이지의 화합 결말 묘사로 명확히 증명되기 때문입니다.` }
        ],
        "doublepyramid": [
            { "role": `찬성 측 피라미드 (합의안)`, "text": `우리는 "${mainTopic}"에 관하여 공동체의 조화로운 유지를 위해 텍스트 14페이지의 규칙 준수가 필수적이라는 결론으로 의견을 하나로 수렴했습니다.` },
            { "role": `반대 측 피라미드 (합의안)`, "text": `반대 측 역시 주장을 보강했습니다. 억압적인 질서에 그대로 따르기보다는, 구성원 간의 합의를 바탕으로 개성을 존중받는 대안 룰을 만들어야 한다는 정점 안건이 채택되었습니다.` }
        ],
        "angeldevil": [
            { "role": `선한 천사의 속삭임`, "text": `인물의 결단을 옹호하세요! 친구들의 시선에 갇혀 네 존재를 잃어버리지 말고, 스스로 좋아하는 것을 당당하게 지켜 나가는 용기가 진정으로 가치 있습니다.` },
            { "role": `현실 악마의 속삭임`, "text": `아닙니다. 당장 닥쳐올 사회적 비난과 외톨이가 되는 리스크를 감수해야 합니다. 일단은 사람들과 조화롭게 타협하는 현실적인 노선을 택하는 게 우선입니다.` }
        ],
        "hexadebate": [
            { "role": `모둠원 A`, "text": `저는 《${book.title}》의 주요 단어인 '상실' 헥사 카드 옆에 '연대' 카드를 붙이겠습니다. 상실의 고통을 겪은 이들이 서로 마음을 열고 연대하기 시작하면서 갈등 해결의 실마리가 풀리기 때문입니다.` },
            { "role": `모둠원 B`, "text": `저는 '연대' 옆에 '해결' 블록을 잇겠습니다. 고통을 나누는 연대가 결국 이 이야기의 따뜻하고 행복한 해결 결말을 이루는 필연적 징검다리이기 때문입니다.` }
        ],
        "trafficlight": [
            { "role": `초록 신호 (찬성)`, "text": `나는 인물의 가치 있는 결단에 초록불을 켭니다. 다름을 포용하고 나다운 삶을 회복하기 위한 숭고한 용기였기 때문입니다.` },
            { "role": `빨간 신호 (반대)`, "text": `나는 빨간불입니다. 무리한 신념의 투쟁이 주변 사람들의 평화나 생계를 위험에 빠뜨렸던 부분을 엄격하게 분석해야 합니다.` }
        ],
        "pmi": [
            { "role": `Plus 분석가`, "text": `주인공 선택의 Plus(장점)는 오랜 편견과 분리 질서의 모순을 수면 위로 올려, 다 함께 고민할 기회를 제공한 점입니다.` },
            { "role": `Minus 분석가`, "text": `하지만 Minus(단점)로는 오랜 관계가 틀어지고 많은 현실적 손실과 불안을 겪게 만들었다는 점을 배제할 수 없습니다.` }
        ],
        "2stay2stray": [
            { "role": `잔류 가이드 A`, "text": `환영합니다. 우리 모둠은 《${book.title}》의 결말이 주는 생명 연대 가치를 중심으로 대안을 설계했습니다. 핵심 요지를 먼저 설명해 드리겠습니다.` },
            { "role": `배움 여행자 B`, "text": `아주 훌륭한 시각이군요! 저는 다른 모둠에서 보고 온 '생태적 보편성 가미 팁'을 공유해 드릴 테니, 우리 양측의 아이디어를 융합해 봅시다.` }
        ],
        "fan": [
            { "role": `릴레이 참여자 A`, "text": `앞 친구가 '나다움의 회복은 주위의 눈치를 이겨내는 데서 출발한다'고 말한 것을 귀담아들었습니다. 이에 누적하여, 나다움을 유지하려면 혼자 싸우기보다 신뢰할 수 있는 소중한 동료들과의 연대가 필수적이라는 통찰을 얹고 싶습니다.` }
        ],
        "reasoning": [
            { "role": `추측가 A`, "text": `주인공이 그런 황당한 선택을 내린 숨은 이유는 겉으로는 완벽해 보이지만 속으로는 스펙 강요로 인한 심리적 억압을 겪었기 때문으로 유추됩니다.` },
            { "role": `단서 증명자 B`, "text": `그 추측은 타당합니다. 왜냐하면 그림책 속 주인공의 표정이나 상징적 묘사(붉은 벽, 경주 강박 등)가 심리적 부담을 대변하기 때문입니다.` }
        ],
        "havruta": [
            { "role": `질문자 A`, "text": `주인공의 결단은 단순한 고집일까요, 아니면 용기일까요? 진짜 용기라면 왜 주변을 다치게 만들었을까요?` },
            { "role": `답변자 B`, "text": `진정한 용기는 때로 충돌을 수반합니다. 주변이 다치는 것은 갈등의 자연스러운 성장통이며, 이를 조화롭게 이겨낼 연대의 책임을 함께 논해야 합니다.` }
        ]
    };

    return {
        intro: introTemplates[tech.id] || (tech.teacherScenario ? tech.teacherScenario.intro : ""),
        wrapUp: wrapUpTemplates[tech.id] || (tech.teacherScenario ? tech.teacherScenario.wrapUp : ""),
        dialog: dialogTemplates[tech.id] || (tech.script ? tech.script.dialog : []) || []
    };
}