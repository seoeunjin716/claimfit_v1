# 카드 내부 여백 조정 전략 문서

## 📋 개요

카드 내부 콘텐츠의 상단 여백을 조정하여 텍스트가 위로 몰려 보이는 문제를 해결하고, 시각적 균형을 개선하는 전략입니다.

---

## 🎯 목적

1. **시각적 균형**: 카드 내부 콘텐츠가 위로 몰려 보이는 문제 해결
2. **가독성 향상**: 적절한 여백으로 텍스트 가독성 개선
3. **일관성 유지**: 모든 카드에 동일한 여백 규칙 적용
4. **반응형 대응**: 다양한 화면 크기에서 적절한 여백 유지

---

## 📝 여백 조정 방법

### 1. **Flexbox 정렬 방식 변경**

#### 변경 전 (중앙 정렬)
```tsx
<CardContent className="p-6 min-h-[140px] flex flex-col justify-center">
  {/* 콘텐츠가 수직 중앙에 위치 */}
</CardContent>
```

#### 변경 후 (상단 정렬 + 여백)
```tsx
<CardContent className="p-6 min-h-[140px] flex flex-col justify-start pt-6">
  {/* 콘텐츠가 상단에서 시작하며 pt-6 (24px) 여백 추가 */}
</CardContent>
```

### 2. **주요 변경 사항**

- `justify-center` → `justify-start`: 수직 중앙 정렬에서 상단 정렬로 변경
- `pt-6` 추가: 상단 패딩 24px 추가 (Tailwind CSS 기준)

---

## 🎨 여백 크기 옵션

### Tailwind CSS 패딩 단위

| 클래스 | 픽셀 값 | 용도 |
|--------|---------|------|
| `pt-4` | 16px | 최소 여백 (좁은 카드) |
| `pt-5` | 20px | 작은 여백 |
| `pt-6` | 24px | **권장 여백** (표준) |
| `pt-7` | 28px | 중간 여백 |
| `pt-8` | 32px | 넓은 여백 |
| `pt-10` | 40px | 매우 넓은 여백 (큰 카드) |

### 선택 기준

- **`pt-6` (24px)**: 대부분의 카드에 적합한 표준 여백
- **`pt-5` (20px)**: 콘텐츠가 많은 경우 또는 작은 카드
- **`pt-7` (28px)**: 여유 공간이 충분한 큰 카드
- **`pt-8` (32px)**: 프리미엄 느낌이 필요한 특별한 카드

---

## 📐 적용 패턴

### 패턴 1: 기본 카드 (권장)
```tsx
<CardContent className="p-6 min-h-[140px] flex flex-col justify-start pt-6">
  {/* 콘텐츠 */}
</CardContent>
```

**특징:**
- 상단 패딩: `pt-6` (24px)
- 정렬: `justify-start` (상단 정렬)
- 최소 높이: `min-h-[140px]`
- 전체 패딩: `p-6` (24px)

### 패턴 2: 작은 카드
```tsx
<CardContent className="p-5 min-h-[120px] flex flex-col justify-start pt-5">
  {/* 콘텐츠 */}
</CardContent>
```

**특징:**
- 상단 패딩: `pt-5` (20px)
- 최소 높이: `min-h-[120px]`
- 전체 패딩: `p-5` (20px)

### 패턴 3: 큰 카드
```tsx
<CardContent className="p-7 min-h-[180px] flex flex-col justify-start pt-7">
  {/* 콘텐츠 */}
</CardContent>
```

**특징:**
- 상단 패딩: `pt-7` (28px)
- 최소 높이: `min-h-[180px]`
- 전체 패딩: `p-7` (28px)

---

## 🔄 단계별 적용 방법

### Step 1: 기존 코드 확인
```tsx
// 변경 전
<CardContent className="p-6 min-h-[140px] flex flex-col justify-center">
```

### Step 2: 정렬 방식 변경
```tsx
// justify-center → justify-start
<CardContent className="p-6 min-h-[140px] flex flex-col justify-start">
```

### Step 3: 상단 여백 추가
```tsx
// pt-6 추가 (24px)
<CardContent className="p-6 min-h-[140px] flex flex-col justify-start pt-6">
```

### Step 4: 테스트 및 조정
- 화면에서 확인
- 필요시 `pt-5`, `pt-7`, `pt-8` 등으로 조정

---

## ⚠️ 주의사항

### 1. **일관성 유지**
- 같은 유형의 카드는 동일한 여백 사용
- 예: 모든 요청 카드는 `pt-6` 사용

### 2. **전체 패딩과의 조화**
- `p-6` (전체 패딩)과 `pt-6` (상단 패딩)을 함께 사용할 때
- 상단 패딩이 전체 패딩보다 크면 안 됨 (시각적 불일치)
- 권장: `p-6` + `pt-6` 또는 `p-7` + `pt-6`

### 3. **최소 높이 고려**
- `min-h-[140px]`와 상단 여백의 균형
- 여백이 너무 크면 콘텐츠가 아래로 밀려날 수 있음
- 최소 높이를 여백에 맞게 조정 필요할 수 있음

### 4. **반응형 디자인**
- 모바일에서는 여백을 줄일 수 있음
- 예: `pt-6 md:pt-8` (모바일 24px, 데스크톱 32px)

---

## 🎨 UI/UX 권장사항

### 1. **카드 유형별 여백**

#### 정보 카드 (알림, 안내)
```tsx
pt-6  // 표준 여백
```

#### 액션 카드 (버튼이 있는 카드)
```tsx
pt-6  // 표준 여백
```

#### 큰 콘텐츠 카드 (긴 텍스트, 여러 요소)
```tsx
pt-7 또는 pt-8  // 넓은 여백
```

### 2. **시각적 계층 구조**

```
카드 상단 여백 (pt-6)
  ↓
아이콘 + 제목
  ↓
설명 텍스트
  ↓
버튼/액션
  ↓
카드 하단 여백 (자동)
```

### 3. **여백 비율**

- **상단 여백**: 전체 패딩의 100% (pt-6 = p-6의 상단)
- **좌우 여백**: 전체 패딩 유지 (p-6)
- **하단 여백**: 콘텐츠에 따라 자동 조정

---

## 📊 적용 예시

### 예시 1: 자료 요청 카드
```tsx
<Card className="mx-4 my-6 border-success/20 bg-success/5">
  <CardContent className="p-6 min-h-[140px] flex flex-col justify-start pt-6">
    <div className="flex items-start gap-3">
      <FileText className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="font-semibold text-foreground mb-3">자료 요청</h4>
        <p className="text-sm text-muted-foreground mb-5">
          손해사정사가 추가 자료를 요청했습니다.
        </p>
        <Button size="sm" onClick={handleFileUpload} className="w-full">
          자료 업로드하기
        </Button>
      </div>
    </div>
  </CardContent>
</Card>
```

### 예시 2: 보험증권 요청 카드
```tsx
<Card className="mx-4 my-4 border-primary-500/20 bg-primary-50">
  <CardContent className="p-6 min-h-[150px] flex flex-col justify-start pt-6">
    <div className="flex items-start gap-3">
      <FileText className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="font-semibold text-foreground mb-3">보험증권 요청</h4>
        <p className="text-sm text-muted-foreground mb-5">
          보험증권을 제출하시면 더 정확한 상담이 가능합니다.
        </p>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleFileUpload} className="flex-1">
            보험증권 업로드
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            의뢰 페이지로
          </Button>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## 🔍 검증 체크리스트

변경 후 다음 항목을 확인하세요:

- [ ] 카드 내부 텍스트가 상단에서 적절한 여백을 가지고 시작하는가?
- [ ] 모든 카드의 여백이 일관성 있게 적용되었는가?
- [ ] 모바일 화면에서도 여백이 적절한가?
- [ ] 카드 높이가 콘텐츠를 충분히 수용하는가?
- [ ] 버튼이나 액션 요소가 하단에 적절히 배치되는가?
- [ ] 시각적 균형이 개선되었는가?

---

## 💡 고급 기법

### 1. **조건부 여백**
```tsx
<CardContent className={`p-6 min-h-[140px] flex flex-col justify-start ${
  isLargeCard ? 'pt-8' : 'pt-6'
}`}>
```

### 2. **반응형 여백**
```tsx
<CardContent className="p-6 min-h-[140px] flex flex-col justify-start pt-5 md:pt-6 lg:pt-7">
```

### 3. **동적 여백 계산**
```tsx
const topPadding = cardHeight > 200 ? 'pt-8' : 'pt-6'
<CardContent className={`p-6 min-h-[140px] flex flex-col justify-start ${topPadding}`}>
```

---

## 📌 적용 대상 파일

다음 파일들에 동일한 패턴 적용:

- `www/app/consult/page.tsx` ✅ (적용 완료)
- `www/app/requests/[id]/page.tsx` (요청 상세 카드)
- `www/app/cases/page.tsx` (판례 카드)
- `www/app/page.tsx` (홈 화면 카드)
- 기타 카드 컴포넌트

---

## 📅 예상 소요 시간

- **단일 카드**: 1-2분
- **파일당 (3-5개 카드)**: 5-10분
- **전체 프로젝트**: 30-45분

---

## 🔄 롤백 방법

만약 변경사항을 되돌리고 싶다면:

```tsx
// 원래대로 복구
<CardContent className="p-6 min-h-[140px] flex flex-col justify-center">
```

---

**작성일**: 2024년
**최종 수정일**: 2024년
**담당자**: 개발팀
