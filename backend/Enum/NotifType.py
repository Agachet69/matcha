from enum import Enum


class NotifType(Enum):
	"""Docstring for NotifType."""
	ERROR = "ERROR"
	MESSAGE = "MESSAGE"
	LIKE = "LIKE"
	MATCH = "MATCH"
	PROFILE_SEEN = "PROFILE_SEEN"