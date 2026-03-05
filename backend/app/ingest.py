import pandas as pd
from sqlalchemy import create_engine

engine = create_engine("sqlite:///./portfolio.db")


def import_assets():
    df = pd.read_csv("data/assets.csv")
    df.to_sql("assets", engine, if_exists="append", index=False)


def import_prices():
    df = pd.read_csv("data/prices_daily.csv")
    df.to_sql("prices_daily", engine, if_exists="append", index=False)


def import_news():
    df = pd.read_csv("data/news.csv")
    df.to_sql("news", engine, if_exists="append", index=False)


if __name__ == "__main__":
    import_assets()
    import_prices()
    import_news()