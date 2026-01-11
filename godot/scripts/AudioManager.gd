extends Node

# Simple audio manager using AudioStreamGenerator for beeps
# Note: Full procedural music would require more complex implementation

func _ready():
	pass

func play_tone(freq: float, duration: float = 0.1):
	# Create a simple beep using an AudioStreamPlayer
	# For a full port, you'd use AudioStreamGenerator
	var player = AudioStreamPlayer.new()
	add_child(player)

	var generator = AudioStreamGenerator.new()
	generator.mix_rate = 44100
	generator.buffer_length = duration + 0.1
	player.stream = generator
	player.play()

	var playback = player.get_stream_playback()
	var sample_rate = generator.mix_rate
	var samples = int(duration * sample_rate)

	for i in samples:
		var t = float(i) / sample_rate
		var sample = sin(t * freq * TAU) * 0.15 * (1.0 - t / duration)
		playback.push_frame(Vector2(sample, sample))

	# Clean up after playing
	await get_tree().create_timer(duration + 0.2).timeout
	player.queue_free()

func play_shelf_tone(count: int):
	var freq = 220 + count * 50
	play_tone(freq, 0.12)

func play_complete():
	play_tone(523, 0.1)
	await get_tree().create_timer(0.08).timeout
	play_tone(659, 0.1)
	await get_tree().create_timer(0.08).timeout
	play_tone(784, 0.15)
	await get_tree().create_timer(0.08).timeout
	play_tone(1047, 0.3)

func play_pickup():
	play_tone(330, 0.08)

func play_cash_register():
	play_tone(800, 0.05)
	await get_tree().create_timer(0.05).timeout
	play_tone(1000, 0.05)
	await get_tree().create_timer(0.05).timeout
	play_tone(1200, 0.1)
	await get_tree().create_timer(0.05).timeout
	play_tone(1600, 0.15)

func play_grab():
	play_tone(440, 0.06)

func play_door():
	play_tone(659, 0.15)
	await get_tree().create_timer(0.15).timeout
	play_tone(523, 0.2)
