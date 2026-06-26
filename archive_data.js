const worksheets = [
    {
        "title": "[활동지] 가치수직선 토론_밴드 브레멘.pdf",
        "desc": "밴드 브레멘 그림책 속 네 소외 동물들의 가치적 연대와 생태 권리를 수직선 위에서 분석하는 양식입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/가치수직선 토론_밴드 브레멘.pdf"
    },
    {
        "title": "[활동지] PMI 토론_나는 사실대로 말했을뿐이야_그림책.pdf",
        "desc": "나는 사실대로 말했을 뿐이야! 그림책의 정직 딜레마에 대해 긍정(P)-부정(M)-흥미(I) 관점으로 조명해보는 활동지입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/PMI 토론_나는 사실대로 말했을뿐이야_그림책.pdf"
    },
    {
        "title": "[자료] 토론의 요소.pdf",
        "desc": "교차조사 질문 설계, 입증 책임 및 배심원 판정 가이드 등 디베이트의 실전 기본 요소 해설서입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/토론의 요소.pdf"
    },
    {
        "title": "[자료] 토론의 기본 개념.pdf",
        "desc": "의사소통과 배움의 과정으로서 디베이트가 갖는 교육적 의미와 룰을 정리한 입문 매뉴얼입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/토론의 기본 개념.pdf"
    },
    {
        "title": "[자료] 토론을 통한 성장, 미래를 향한 꿈.pdf",
        "desc": "교실 연계형 토론식 수업의 실제 모형과 이를 통한 학생들의 성장 과정을 수록한 연구 자료입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/토론을_통한_성장,_미래를_향한_꿈.pdf"
    },
    {
        "title": "[자료] 토론 생각의 꽃을 피우다 (v2).pdf",
        "desc": "독서 말하기 학습을 융합하여 교실 의사소통 능력을 높이는 토론 교육 모형 연구서입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/토론_생각의_꽃을_피우다_v2.pdf"
    },
    {
        "title": "[자료] 토론 준비하기.pdf",
        "desc": "쟁점 분석, 입론 작성 요령, 정보 검색 전략 등 성공적인 찬반 토론을 설계하기 위한 지침서입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/토론 준비하기.pdf"
    },
    {
        "title": "[수업자료] 토론 연구회 발표-입론.pdf",
        "desc": "내 주장의 논증 뼈대(A-R-E)를 설계하고 정합성 높은 입론서를 조직화하는 발표 교안 자료입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/토론 연구회 발표-입론.pdf"
    },
    {
        "title": "[대본] 토론 대본(퍼블릭 포럼, 사회자,계측자).pdf",
        "desc": "정식 퍼블릭 포럼 디베이트를 진행할 때 사회자와 계측자가 사용할 수 있는 공식 진행 스크립트 대본입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/토론 대본(퍼블릭 포럼, 사회자,계측자).pdf"
    },
    {
        "title": "[대본] 찬반토론 실습(토론자 대본).pdf",
        "desc": "실습 디베이트 시 찬성과 반대 입론 및 반론 단계에서 토론자들이 참고하여 구조를 잡을 수 있는 대본 양식입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/찬반토론 실습(토론자 대본).pdf"
    },
    {
        "title": "[자료] 찬반토론 실습(토론 모형, 퍼블릭 포럼).pdf",
        "desc": "퍼블릭 포럼 토론 모형의 규칙과 교실 수업 실습 가이드를 실어놓은 실무 매뉴얼 자료입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/찬반토론 실습(토론 모형, 퍼블릭 포럼).pdf"
    },
    {
        "title": "[활동지] 신호등토론 활동지.pdf",
        "desc": "가치 쟁점에 대해 삼색 신호등을 활용하여 개인 및 모둠 의견을 수집하고 주장하는 활동지입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/신호등토론 활동지.pdf"
    },
    {
        "title": "[활동지] 신호등 토론_세 강도.pdf",
        "desc": "세 강도 그림책 속 강도들의 선의 딜레마에 대해 지지 여부를 삼색 신호등 기법으로 판단하는 활동지입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/신호등 토론_세 강도.pdf"
    },
    {
        "title": "[활동지] 소크라틱세미나_백만 번 산 고양이.pdf",
        "desc": "100만 번 산 고양이의 삶과 죽음, 그리고 진정한 사랑의 가치를 성찰해보는 소크라틱 세미나 기록지입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/소크라틱세미나_백만 번 산 고양이.pdf"
    },
    {
        "title": "[자료] 소크라테틱 세미나.pdf",
        "desc": "교실 공동체가 정답 없는 텍스트를 두고 서로의 생각을 묻고 들으며 자아를 성찰하는 디렉토리형 매뉴얼입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/소크라테틱 세미나.pdf"
    },
    {
        "title": "[활동지] 브레인라이팅 활동지.pdf",
        "desc": "침묵 속에서 자신의 아이디어를 기록하고 모둠원들과 유기적으로 전개해 나가는 발상 연습용 양식지입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/브레인라이팅 활동지.pdf"
    },
    {
        "title": "[활동지] 브레인 라이팅_미어캣의 스카프.pdf",
        "desc": "미어캣의 스카프 그림책을 통해 본 모방 소비와 사재기 경쟁 현상의 대안을 찾아 기록해보는 브레인라이팅 활동지입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/브레인 라이팅_미어캣의 스카프.pdf"
    },
    {
        "title": "[자료] 반론.pdf",
        "desc": "상대 주장에 대한 교차 조사를 설계하고 논리 구조의 모순점을 잡아내어 비판하는 실전 가이드입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/반론.pdf"
    },
    {
        "title": "[자료] 무드미터.pdf",
        "desc": "나의 현재 감정(에너지 수준과 유쾌함)의 위치를 확인하고 기록하여 정서 지능을 발달시키는 자가 진단지입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/무드미터.pdf"
    },
    {
        "title": "[활동지] 둘가고 둘남기_꽃을 너에게 줄게.pdf",
        "desc": "꽃을 선물할게 그림책의 애벌레-거미 딜레마에 대해 모둠 지식을 타 모둠과 순환 교환하는 협동학습지입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/둘가고 둘남기_꽃을 너에게 줄게.pdf"
    },
    {
        "title": "[활동지] 둘가고 둘남기 활동지.pdf",
        "desc": "두 명은 모둠에 남고 두 명은 다른 모둠을 방문하여 지식을 상호 공유하고 순환해나가는 범용 활동지입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/둘가고 둘남기 활동지.pdf"
    },
    {
        "title": "[활동지] 다중관점 렌즈로 세상 읽기 파노라마 토론 실습(학습지).pdf",
        "desc": "관점을 주변부 인물이나 무생물 렌즈로 전환하여 대립각을 넓히고 갈등의 입체적 해결책을 도출하는 양식입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/다중관점 렌즈로 세상 읽기 파노라마 토론 실습(학습지).pdf"
    },
    {
        "title": "[활동지] 논증게임 학습지.pdf",
        "desc": "그림책을 분석하며 내 주장-이유-근거(A-R-E)의 삼각대 논거를 튼튼하게 직조해보는 수업 학습지입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/논증게임 학습지.pdf"
    },
    {
        "title": "[자료] 논제를 알면 토론이 보인다.pdf",
        "desc": "명확한 쟁점을 구축하고 디베이트 대상을 확립하는 토론 논제 정하기 공식 매뉴얼입니다.",
        "icon": "fa-file-pdf",
        "link": "file:///C:/Users/admin/Desktop/토론/논제를 알면 토론이 보인다.pdf"
    },
    {
        "title": "[수업자료] 논제를 알면 토론이 보인다.pptx",
        "desc": "토론의 첫 단추인 논제를 정의하고 쟁점이 명확한 토론 논제를 정하고 구별하는 교육용 교안입니다.",
        "icon": "fa-file-powerpoint",
        "link": "file:///C:/Users/admin/Desktop/토론/논제를 알면 토론이 보인다.pptx"
    },
    {
        "title": "[활동지] 그림책 '빨간 벽' 토론 활동지 만들기.docx",
        "desc": "빨간 벽 그림책을 바탕으로 찬반 생각의 선을 넘고 나만의 논거를 세우는 워드용 모둠 학습지 양식입니다.",
        "icon": "fa-file-word",
        "link": "file:///C:/Users/admin/Desktop/토론/그림책 '빨간 벽' 토론 활동지 만들기.docx"
    },
    {
        "title": "[수업자료] 파노라마 토론.pptx",
        "desc": "다각적인 시선 렌즈를 투사하여 사건을 입체적으로 바라보는 파노라마 기법 해설 피피티입니다.",
        "icon": "fa-file-powerpoint",
        "link": "file:///C:/Users/admin/Desktop/토론/파노라마 토론.pptx"
    },
    {
        "title": "[수업자료] 파노라마 토론 (꽃을 선물할게).pptx",
        "desc": "꽃을 선물할게 그림책을 활용하여 다각적인 주체 렌즈로 딜레마를 해부해보는 수업 자료입니다.",
        "icon": "fa-file-powerpoint",
        "link": "file:///C:/Users/admin/Desktop/토론/파노라마 토론(꽃을 너에게 줄게).pptx"
    },
    {
        "title": "[수업자료] 토론을 알면 수업이 바뀐다.pptx",
        "desc": "일방적 지식 전달을 극복하고 교실 속 학생 중심 소통과 배움의 질을 높이는 교사용 발표 교안입니다.",
        "icon": "fa-file-powerpoint",
        "link": "file:///C:/Users/admin/Desktop/토론/토론을 알면 수업이 바뀐다.pptx"
    },
    {
        "title": "[수업자료] 토론 연구회 발표-입론.pptx",
        "desc": "탄탄한 논거 직조와 신뢰도 높은 증거 자료 매핑을 다루는 입론서 설계 및 작성 발표 교재입니다.",
        "icon": "fa-file-powerpoint",
        "link": "file:///C:/Users/admin/Desktop/토론/토론 연구회 발표-입론.pptx"
    },
    {
        "title": "[수업자료] 토론 생각의 꽃을 피우다.pptx",
        "desc": "독서와 말하기, 협업 경청 역량을 높여 참된 교실 공동체를 가꾸는 토론 연구회 성과 발표 교안입니다.",
        "icon": "fa-file-powerpoint",
        "link": "file:///C:/Users/admin/Desktop/토론/토론 생각의 꽃을 피우다.pptx"
    },
    {
        "title": "[수업자료] 찬반토론 실습.pptx",
        "desc": "논리적 입론 구조를 익히고 교차 질문을 연습해보는 1단계 디베이트 실전 PPT 자료입니다.",
        "icon": "fa-file-powerpoint",
        "link": "file:///C:/Users/admin/Desktop/토론/찬반토론 실습.pptx"
    },
    {
        "title": "[수업자료] 이유찾기 토론_빨간벽.pptx",
        "desc": "빨간 벽 그림책의 꼬마 쥐의 선택을 두고 그 이면에 숨어있는 인과관계를 추론해보는 실습 PPT입니다.",
        "icon": "fa-file-powerpoint",
        "link": "file:///C:/Users/admin/Desktop/토론/이유찾기 토론_빨간벽.pptx"
    },
    {
        "title": "[수업자료] 소크라테틱 세미나.pptx",
        "desc": "정답 없는 의문에 대해 깊게 탐색하고 서로의 생각을 성찰하는 소크라틱 토론 기법 교육 교재입니다.",
        "icon": "fa-file-powerpoint",
        "link": "file:///C:/Users/admin/Desktop/토론/소크라테틱 세미나.pptx"
    },
    {
        "title": "[수업자료] 반론.pptx",
        "desc": "상대 논거의 논리적 모순점과 오류를 날카롭게 분석해 반박을 조직화하는 반론 기법 교육 자료입니다.",
        "icon": "fa-file-powerpoint",
        "link": "file:///C:/Users/admin/Desktop/토론/반론.pptx"
    }
];
