import pandas as pd

DATASET_PATH = "../data/steam_games.csv"


def load_dataset():
    print("📊 Loading dataset...")
    df = pd.read_csv(DATASET_PATH)

    # Normalize column names
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

    if "tags" not in df.columns:
        raise ValueError("❌ 'tags' column not found in dataset")

    df["tags"] = df["tags"].fillna("").astype(str)
    return df


def analyse_all_tags(df):
    # Split tags into list
    df["tag_list"] = df["tags"].apply(
        lambda x: [t.strip() for t in x.split(",") if t.strip()]
    )

    # Explode
    exploded = df.explode("tag_list")

    # Count tags (SAFE)
    tag_dist = (
        exploded["tag_list"]
        .value_counts()
        .reset_index(name="count")   # ✅ SAFE
        .rename(columns={"index": "tag"})
    )

    # Ensure numeric
    tag_dist["count"] = pd.to_numeric(tag_dist["count"])

    tag_dist["percentage_of_games"] = (
        tag_dist["count"] / len(df) * 100
    ).round(2)

    print("\n🏷️ ALL-TAG DISTRIBUTION")
    print("-----------------------------------")
    print(tag_dist.head(500))

    tag_dist.to_csv("all_tag_distribution.csv", index=False)

    print("\n📌 Tag Summary")
    print("-------------------")
    print(f"Total tag assignments: {tag_dist['count'].sum()}")
    print(f"Total unique tags: {len(tag_dist)}")


def analyse_tag_count_per_game(df):
    df["tag_count"] = df["tags"].apply(
        lambda x: len([t for t in x.split(",") if t.strip()])
    )

    print("\n🎯 TAG COUNT PER GAME")
    print("----------------------")
    print(df["tag_count"].describe())

    df[["tag_count"]].to_csv("tag_count_per_game.csv", index=False)


def main():
    df = load_dataset()
    analyse_all_tags(df)
    analyse_tag_count_per_game(df)

    print("\n💾 Files saved:")
    print("- all_tag_distribution.csv")
    print("- tag_count_per_game.csv")


if __name__ == "__main__":
    main()
