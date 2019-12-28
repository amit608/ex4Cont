Description: Send note-no and note-off events according to user interactions.
API:

Output
note-on : send when a note is played
channel-name: midi
message-params: type: ‘note-on’, pitch: int[0, …, 127], velocity: int[0, …, 127]
Output
note-off : send when a note is played
channel-name: midi
message-params: type: ‘note-off’, pitch: int[0, …, 127], velocity: int[0, …, 127]
