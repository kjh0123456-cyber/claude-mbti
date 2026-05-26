import asyncio
import os

async def ocr_image(image_path, engine):
    try:
        import winrt.windows.storage as storage
        import winrt.windows.graphics.imaging as imaging

        file = await storage.StorageFile.get_file_from_path_async(image_path)
        stream = await file.open_async(storage.FileAccessMode.READ)
        decoder = await imaging.BitmapDecoder.create_async(stream)
        bitmap = await decoder.get_software_bitmap_async()
        result = await engine.recognize_async(bitmap)
        return result.text
    except Exception as e:
        return ""

async def main():
    import winrt.windows.media.ocr as ocr
    import winrt.windows.globalization as glob

    # 한국어 언어로 OCR 엔진 생성 시도
    ko_lang = glob.Language("ko")
    engine = ocr.OcrEngine.try_create_from_language(ko_lang)

    if engine is None:
        print("한국어 OCR 엔진 없음, 기본 엔진 사용")
        engine = ocr.OcrEngine.try_create_from_user_profile_languages()

    if engine is None:
        print("OCR 엔진 초기화 실패")
        return

    print(f"OCR 엔진 준비 완료")

    screenshots_dir = r"C:\Users\김종해\Pictures\Screenshots"
    keywords = ["사업자", "등록증", "법인", "개인사업자", "국세청"]

    files = sorted([f for f in os.listdir(screenshots_dir) if f.lower().endswith(".png")])
    total = len(files)
    print(f"총 {total}개 파일 검색 중...\n")

    found = []
    for i, fname in enumerate(files, 1):
        fpath = os.path.join(screenshots_dir, fname)
        print(f"\r[{i}/{total}] 처리중...", end="", flush=True)
        text = await ocr_image(fpath, engine)
        if text:
            for kw in keywords:
                if kw in text:
                    found.append((fname, kw, text[:200]))
                    print(f"\n발견! [{kw}] {fname}")
                    break

    print(f"\n\n=== 검색 완료 ===")
    if found:
        print(f"\n{len(found)}개 발견:")
        for fname, kw, preview in found:
            print(f"\n  파일: {os.path.join(screenshots_dir, fname)}")
            print(f"  키워드: {kw}")
    else:
        print("찾지 못했습니다.")
        print("\n[참고] OCR이 한국어를 인식 못 할 수 있습니다.")
        print("마지막으로 인식된 텍스트 샘플 (최근 5개):")
        # 마지막 5개 파일 텍스트 출력
        sample_engine = ocr.OcrEngine.try_create_from_user_profile_languages()
        for fname in files[-5:]:
            fpath = os.path.join(screenshots_dir, fname)
            text = await ocr_image(fpath, sample_engine or engine)
            print(f"\n  [{fname}]")
            print(f"  {repr(text[:150])}")

if __name__ == "__main__":
    asyncio.run(main())
