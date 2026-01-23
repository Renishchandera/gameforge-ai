import pandas as pd

DATA_PATH = "../data/steam_games.csv"

def load_data():
    print("📊 Loading dataset...")
    df = pd.read_csv(DATA_PATH)
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]
    return df

def analyse_primary_category(df):
    if "categories" not in df.columns:
        raise ValueError("❌ 'categories' column not found")

    df["categories"] = df["categories"].fillna("Unknown").astype(str)

    df["primary_category"] = df["categories"].apply(
        lambda x: x.split(",")[0].strip() if x else "Unknown"
    )

    primary_dist = (
        df["primary_category"]
        .value_counts()
        .reset_index(name="count")   # ✅ correct way
        .rename(columns={"index": "category"})
    )

    primary_dist["percentage"] = (
        primary_dist["count"] / len(df) * 100
    ).round(2)

    print("\n🎮 PRIMARY CATEGORY DISTRIBUTION")
    print("-----------------------------------")
    print(primary_dist)

    primary_dist.to_csv("primary_category_distribution.csv", index=False)
    return primary_dist

def analyse_all_categories(df):
    all_categories = []

    for cats in df["categories"]:
        if isinstance(cats, str):
            all_categories.extend(
                [c.strip() for c in cats.split(",") if c.strip()]
            )

    all_cat_df = pd.DataFrame(all_categories, columns=["category"])

    all_dist = (
        all_cat_df["category"]
        .value_counts()
        .reset_index(name="count")   # ✅ correct
        .rename(columns={"index": "category"})
    )

    all_dist["percentage_of_games"] = (
        all_dist["count"] / len(df) * 100
    ).round(2)

    print("\n🎮 ALL-CATEGORY DISTRIBUTION (MULTI-CATEGORY)")
    print("--------------------------------------------")
    print(all_dist)

    all_dist.to_csv("all_category_distribution.csv", index=False)

    print("\n📌 Category Summary")
    print("-------------------")
    print(f"Total category tags (with repetition): {len(all_categories)}")
    print(f"Total unique categories: {all_dist.shape[0]}")

    return all_dist

def analyse_category_count_per_game(df):
    df["category_count"] = df["categories"].apply(
        lambda x: len(x.split(",")) if isinstance(x, str) else 0
    )

    stats = df["category_count"].describe()

    print("\n🎯 CATEGORY COUNT PER GAME")
    print("-------------------------")
    print(stats)

    df[["category_count"]].to_csv("category_count_per_game.csv", index=False)

def main():
    df = load_data()
    analyse_primary_category(df)
    analyse_all_categories(df)
    analyse_category_count_per_game(df)

    print("\n💾 Files saved:")
    print("- primary_category_distribution.csv")
    print("- all_category_distribution.csv")
    print("- category_count_per_game.csv")

if __name__ == "__main__":
    main()
