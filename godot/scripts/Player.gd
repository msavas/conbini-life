extends CharacterBody2D

const TILE_SIZE = 48
const GRID_W = 13
const GRID_H = 10
const MOVE_DELAY = 0.165
const ACTION_DELAY = 0.15

@onready var game = get_parent()
@onready var sprite = $Sprite2D

var player_texture: Texture2D

var holding: int = 0
var max_hold: int = 6

var move_timer: float = 0.0
var action_timer: float = 0.0

var grid_pos: Vector2i = Vector2i(11, 5)

func _ready():
	position = Vector2(grid_pos.x * TILE_SIZE + TILE_SIZE/2, grid_pos.y * TILE_SIZE + TILE_SIZE/2)

	# Load player sprite
	player_texture = load("res://assets/player.jpeg")
	if sprite and player_texture:
		sprite.texture = player_texture
		sprite.scale = Vector2(TILE_SIZE / player_texture.get_width(), (TILE_SIZE + 8) / player_texture.get_height())

func _process(delta):
	move_timer += delta
	action_timer += delta

	handle_movement()
	handle_actions()
	queue_redraw()

func handle_movement():
	if move_timer < MOVE_DELAY:
		return

	var new_pos = grid_pos

	if Input.is_action_pressed("move_up"):
		new_pos.y -= 1
	elif Input.is_action_pressed("move_down"):
		new_pos.y += 1
	elif Input.is_action_pressed("move_left"):
		new_pos.x -= 1
	elif Input.is_action_pressed("move_right"):
		new_pos.x += 1
	else:
		return

	# Check bounds
	if new_pos.x < 0 or new_pos.x >= GRID_W or new_pos.y < 0 or new_pos.y >= GRID_H:
		return

	# Check collisions with shelves
	for shelf in game.shelves:
		var shelf_grid = Vector2i(int(shelf.position.x / TILE_SIZE), int(shelf.position.y / TILE_SIZE))
		if new_pos == shelf_grid:
			return

	# Check collision with register
	if new_pos == game.register_pos:
		return

	grid_pos = new_pos
	position = Vector2(grid_pos.x * TILE_SIZE + TILE_SIZE/2, grid_pos.y * TILE_SIZE + TILE_SIZE/2)
	move_timer = 0.0
	game.update_status()

func handle_actions():
	if action_timer < ACTION_DELAY:
		return

	if Input.is_action_pressed("interact"):
		interact()
		action_timer = 0.0
	elif Input.is_action_pressed("pickup"):
		pickup_from_stockroom()
		action_timer = 0.0

func interact():
	# Priority 1: Checkout customer
	if game.checkout_customer():
		return

	# Priority 2: Stock a shelf
	for shelf in game.shelves:
		var shelf_grid = Vector2i(int(shelf.position.x / TILE_SIZE), int(shelf.position.y / TILE_SIZE))
		var dist = abs(shelf_grid.x - grid_pos.x) + abs(shelf_grid.y - grid_pos.y)
		if dist == 1 and holding > 0:
			if shelf.items < shelf.max_items:
				shelf.items += 1
				holding -= 1
				game.audio_manager.play_shelf_tone(shelf.items)

				if shelf.items >= shelf.max_items:
					game.audio_manager.play_complete()
					game.spawn_sparkles(shelf.position, shelf.color, 10)

				shelf.queue_redraw()
				game.update_status()
				return

func pickup_from_stockroom():
	if grid_pos.y >= 8 and holding < max_hold:
		holding += 1
		game.audio_manager.play_pickup()
		game.update_status()

func _draw():
	# Draw player circle (fallback if no sprite loaded)
	if not player_texture:
		draw_circle(Vector2.ZERO, TILE_SIZE / 3, Color(1.0, 0.42, 0.42))

	# Draw held items above player
	if holding > 0:
		for i in holding:
			draw_rect(Rect2(-8, -32 - i * 6, 16, 5), Color(0.55, 0.27, 0.07))
			draw_rect(Rect2(-8, -32 - i * 6, 16, 5), Color(0.36, 0.23, 0.10), false, 1.0)

		# Item count badge
		draw_circle(Vector2(12, -28), 10, Color(1.0, 0.85, 0.24))
		draw_circle(Vector2(12, -28), 10, Color(0, 0, 0), false, 1.0)
