from enum import Enum


class NotifTypeEnum(Enum):
	"""Docstring for NotifType."""
	ERROR = "ERROR"
	MESSAGE = "MESSAGE"
	LIKE = "LIKE"
	MATCH = "MATCH"
	PROFILE_SEEN = "PROFILE_SEEN"