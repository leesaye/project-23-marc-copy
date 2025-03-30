# feed/cron.py
from .models import UserStats
import requests

BASE_URL = 'http://127.0.0.1:8000/'
UPDATE_STREAK_URL = BASE_URL + "feed/user-stats/reset_and_update_streaks/"


def reset_and_update_streaks_cron():
    # Just call and unauthenticated request so that we know this was fired
    requests.post(UPDATE_STREAK_URL, json={}, headers={})
    for user_stats in UserStats.objects.all():
        user_stats.check_and_update_streak()

def keep_server_alive():
    # Just call and unauthenticated request so that we know this was fired
    requests.get(UPDATE_STREAK_URL)