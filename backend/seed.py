"""Root CLI script to seed the database."""
from app.db.seed import seed_all

if __name__ == "__main__":
    print("Starting Duolingo Clone Database Seeding...")
    results = seed_all()
    print("\n--- Seed Results Summary ---")
    for entity, count in results.items():
        print(f"  {entity.capitalize()}: {count}")
    print("\nDatabase seeded successfully!")
