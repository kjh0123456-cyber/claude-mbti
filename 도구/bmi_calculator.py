def calculate_bmi(weight_kg, height_cm):
    height_m = height_cm / 100
    return weight_kg / (height_m ** 2)

def get_bmi_category(bmi):
    if bmi < 18.5:
        return "저체중", "🔵"
    elif bmi < 23.0:
        return "정상", "🟢"
    elif bmi < 25.0:
        return "과체중", "🟡"
    elif bmi < 30.0:
        return "비만 1단계", "🟠"
    else:
        return "비만 2단계", "🔴"

def main():
    print("=" * 40)
    print("       BMI 체질량지수 계산기")
    print("=" * 40)

    while True:
        try:
            weight = float(input("\n몸무게를 입력하세요 (kg): "))
            if weight <= 0:
                print("올바른 몸무게를 입력해주세요.")
                continue
            break
        except ValueError:
            print("숫자를 입력해주세요.")

    while True:
        try:
            height = float(input("키를 입력하세요 (cm): "))
            if height <= 0:
                print("올바른 키를 입력해주세요.")
                continue
            break
        except ValueError:
            print("숫자를 입력해주세요.")

    bmi = calculate_bmi(weight, height)
    category, icon = get_bmi_category(bmi)

    print("\n" + "=" * 40)
    print(f"  BMI 지수: {bmi:.1f}")
    print(f"  판정:     {icon} {category}")
    print("=" * 40)
    print("\n[ BMI 기준표 ]")
    print("  18.5 미만    → 저체중")
    print("  18.5 ~ 22.9 → 정상")
    print("  23.0 ~ 24.9 → 과체중")
    print("  25.0 ~ 29.9 → 비만 1단계")
    print("  30.0 이상    → 비만 2단계")
    print()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n오류 발생: {e}")
    finally:
        input("Enter를 누르면 종료됩니다...")
