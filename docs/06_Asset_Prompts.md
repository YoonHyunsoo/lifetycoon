# 🎨 AI Image Generation Prompts (Mudspoon Tycoon)

이미지 생성 AI (Gemini, Midjourney, DALL-E 3)를 위한 프롬프트 가이드입니다.
각 프롬프트는 "Pixel Art" 스타일을 강조하여 게임의 레트로 감성을 유지하도록 작성되었습니다.

---

## 1. 🌃 메인 배경 (Night City)
* **파일명**: `bg_city_night.png`
* **추천 비율**: 16:9 (가로형)
* **추천 사이즈**: 1280 x 720 px

### 📋 프롬프트 (Prompt)
```text
pixel art of a generic modern city skyline at night, view from a distance, skyscraper silhouettes, neon lights, dark blue and purple night sky, stars, lo-fi aesthetic, 16-bit retro game style, no text, clean composition
```

---

## 2. 🏫 학교 교실 (Classroom)
* **파일명**: `bg_classroom.png` (학생 단계 배경)
* **추천 비율**: 16:9 (가로형)
* **추천 사이즈**: 1280 x 720 px

### 📋 프롬프트 (Prompt)
```text
pixel art of an empty high school classroom interior, daytime, sunlight streaming through windows, wooden desks and chairs arranged in rows, green chalkboard at the front, cozy atmosphere, anime style background, 16-bit retro game style, wide angle view
```

---

## 3. 🏠 자취방 (Studio Apartment)
* **파일명**: `bg_studio_room.png` (성인/취준생 단계 배경 - *코드에서 `bg_city.png` 대신 이걸 사용하는걸 추천*)
* **추천 비율**: 16:9 (가로형)
* **추천 사이즈**: 1280 x 720 px

### 📋 프롬프트 (Prompt)
```text
pixel art of a small messy one-room studio apartment interior at night, computer desk with glowing monitor, cup of instant noodles, large window with city night view, single bed, cozy and lived-in vibe, isometric view or wide view, 16-bit retro game style
```

---

## 4. 🧍 캐릭터 (Main Character)
* **파일명**: `char_idle.png`
* **추천 비율**: 1:1 (정사각형)
* **추천 사이즈**: 512 x 512 px (생성 후 배경 제거 필요)
* **Tip**: 생성 후 [remove.bg](https://www.remove.bg) 같은 사이트에서 흰색 배경을 투명하게 만드세요.

### 📋 프롬프트 (Prompt)
```text
pixel art character sprite of a young casual man, full body shot, facing forward, wearing a hoodie and jeans, neutral expression, idle pose, simple flat design, solid white background, 8-bit or 16-bit retro game style, cute proportions
```

---

## 🚀 적용 방법
1. 위 프롬프트로 이미지를 생성합니다.
2. 다운로드한 이미지의 이름을 위 **파일명**과 똑같이 변경합니다.
3. 프로젝트의 `public/assets/` 폴더 안에 넣어주세요.
   (폴더가 없다면 `public` 안에 `assets` 폴더를 새로 만드세요)
4. 배포하면 자동으로 적용됩니다!
