from decouple import config
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

client = WebClient(token=config('SLACK_OAUTH_ACCESS_TOKEN'))

def send(message, attachment=None):
  try:

    # Call the conversations.list method using the WebClient
    result = client.chat_postMessage(
        channel=config('SLACK_NOTIF_CHANNEL_ID'),
        text=message
    )

    return result['ok'] == True

  except SlackApiError as e:
    print(f"{e}");
    return False
