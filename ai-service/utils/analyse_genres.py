# analyse_genres.py
import pandas as pd

DATASET_PATH = "../data/steam_games.csv"

def main():
    print("📊 Loading dataset...")
    df = pd.read_csv(DATASET_PATH)

    # Normalize column names
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

    if "genres" not in df.columns:
        raise ValueError("❌ 'genres' column not found in dataset")

    # -----------------------------
    # PRIMARY GENRE ANALYSIS
    # -----------------------------
    df["genres"] = df["genres"].fillna("Unknown").astype(str)

    df["primary_genre"] = df["genres"].apply(
        lambda x: x.split(",")[0].strip() if x.lower() != "unknown" else "Unknown"
    )

    primary_counts = df["primary_genre"].value_counts().reset_index()
    primary_counts.columns = ["genre", "count"]
    primary_counts["percentage"] = (
        primary_counts["count"] / primary_counts["count"].sum() * 100
    ).round(2)

    print("\n🎮 PRIMARY GENRE DISTRIBUTION")
    print("-----------------------------------")
    print(primary_counts)

    print("\n📌 Primary Genre Summary")
    print("------------------------")
    print(f"Total games: {len(df)}")
    print(f"Total unique primary genres: {primary_counts.shape[0]}")

    primary_counts.to_csv("primary_genre_distribution.csv", index=False)

    # -----------------------------
    # ALL GENRES (MULTI-GENRE) ANALYSIS
    # -----------------------------
    all_genres = (
        df["genres"]
        .str.split(",")
        .explode()
        .str.strip()
        .replace("", "Unknown")
    )

    all_genre_counts = all_genres.value_counts().reset_index()
    all_genre_counts.columns = ["genre", "count"]

    # Percentage relative to total games (not total tags)
    all_genre_counts["percentage_of_games"] = (
        all_genre_counts["count"] / len(df) * 100
    ).round(2)

    print("\n🎮 ALL-GENRE DISTRIBUTION (MULTI-GENRE)")
    print("--------------------------------------")
    print(all_genre_counts)

    print("\n📌 All-Genre Summary")
    print("-------------------")
    print(f"Total genre tags (with repetition): {len(all_genres)}")
    print(f"Total unique genre tags: {all_genre_counts.shape[0]}")

    all_genre_counts.to_csv("all_genre_distribution.csv", index=False)

    # -----------------------------
    # EXTRA INSIGHT (OPTIONAL BUT POWERFUL)
    # -----------------------------
    df["genre_count_per_game"] = df["genres"].apply(
        lambda x: len([g for g in x.split(",") if g.strip()])
    )

    print("\n🎯 GENRE COUNT PER GAME")
    print("----------------------")
    print(df["genre_count_per_game"].describe())

    df["genre_count_per_game"].to_csv("genre_count_per_game.csv", index=False)

    print("\n💾 Files saved:")
    print("- primary_genre_distribution.csv")
    print("- all_genre_distribution.csv")
    print("- genre_count_per_game.csv")

if __name__ == "__main__":
    main()
