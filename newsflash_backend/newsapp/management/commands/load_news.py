import json
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from newsapp.models import NewsItem


def excel_date_to_datetime(excel_float):
    """Convert Excel float date to Python datetime"""
    return datetime(1899, 12, 30) + timedelta(days=excel_float)


class Command(BaseCommand):
    help = "Load first 200 news items from JSON file into the database"

    def add_arguments(self, parser):
        parser.add_argument(
            '--file', type=str, help='Path to the JSON file', required=True
        )

    def handle(self, *args, **options):
        file_path = options['file']

        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        articles = data.get("Sheet1", [])[:200]

        created_count = 0
        for item in articles:
            try:
                # Remove 'extracted_at' key if it exists
                item.pop('extracted_at', None)

                NewsItem.objects.update_or_create(
                    id=item['id'],
                    defaults={
                        'category': item.get('category', ''),
                        'url': item.get('url', ''),
                        'source': item.get('source', ''),
                        'title': item.get('title', ''),
                        'author': item.get('author', ''),
                        'published_date': excel_date_to_datetime(item['published_date']),
                        'content': item.get('content', ''),
                        # 'extracted_at' is removed, so don't set it here anymore
                    }
                )
                created_count += 1
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to insert: {item['id']} - {e}"))

        self.stdout.write(self.style.SUCCESS(f"Successfully loaded {created_count} articles."))
