while true; do
		sleep $(($RANDOM % 3600 + 480 | bc))
		curl -X POST --data-urlencode 'payload={"channel": "@mark", "username": "King Kong", "text": "Can I call you Diddy Kong?", "icon_emoji": ":monkey_face:"}' https://hooks.slack.com/services/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
done