extends CharacterBody2D

const TILE_SIZE = 48
const MOVE_DELAY = 0.35
const GRAB_DELAY = 0.8

var game: Node2D
var customer_texture: Texture2D
@onready var sprite = $Sprite2D

# Customer states: entering, shopping, grabbing, to_register, waiting, leaving
var state: String = "entering"
var shopping_list: Array = []
var cart: Array = []
var current_shop_index: int = 0
var target_pos: Vector2i = Vector2i(6, 1)

var move_timer: float = 0.0
var grab_timer: float = 0.0
var wait_time: float = 0.0

var grid_pos: Vector2i = Vector2i(6, 0)
var customer_color: Color

const CUSTOMER_COLORS = [
	Color(0.91, 0.71, 0.72),
	Color(0.71, 0.83, 0.91),
	Color(0.83, 0.91, 0.71),
	Color(0.91, 0.83, 0.71)
]

const SHELF_TYPES = ["drinks", "snacks", "bento"]

func _ready():
	customer_color = CUSTOMER_COLORS[randi() % CUSTOMER_COLORS.size()]
	position = Vector2(grid_pos.x * TILE_SIZE + TILE_SIZE/2, grid_pos.y * TILE_SIZE + TILE_SIZE/2)

	# Load customer sprite
	customer_texture = load("res://assets/customer-1.jpeg")
	if sprite and customer_texture:
		sprite.texture = customer_texture
		sprite.scale = Vector2(TILE_SIZE / customer_texture.get_width(), (TILE_SIZE + 8) / customer_texture.get_height())

	# Generate shopping list (1-3 items)
	var items_to_buy = 1 + randi() % 3
	for i in items_to_buy:
		shopping_list.append(SHELF_TYPES[randi() % SHELF_TYPES.size()])

func _process(delta):
	move_timer += delta

	if move_timer < MOVE_DELAY:
		queue_redraw()
		return

	move_timer = 0.0

	match state:
		"entering":
			if grid_pos.y < 3:
				grid_pos.y += 1
				update_position()
			else:
				state = "shopping"
				set_next_shopping_target()

		"shopping":
			if move_to_target(target_pos):
				state = "grabbing"
				grab_timer = 0.0

		"grabbing":
			grab_timer += MOVE_DELAY
			if grab_timer >= GRAB_DELAY:
				var want_type = shopping_list[current_shop_index]
				var shelf = game.get_shelf_by_type(want_type)

				if shelf and shelf.items > 0:
					shelf.items -= 1
					cart.append({"type": want_type, "price": shelf.price})
					game.audio_manager.play_grab()
					shelf.queue_redraw()

				current_shop_index += 1

				if current_shop_index < shopping_list.size():
					state = "shopping"
					set_next_shopping_target()
				else:
					state = "to_register"
					target_pos = Vector2i(game.register_pos.x - 1, game.register_pos.y)

		"to_register":
			if move_to_target(target_pos):
				state = "waiting"
				wait_time = 0.0

		"waiting":
			wait_time += MOVE_DELAY

		"leaving":
			if grid_pos.y > 0:
				grid_pos.y -= 1
				update_position()
			elif grid_pos.x != 6:
				grid_pos.x += 1 if grid_pos.x < 6 else -1
				update_position()
			else:
				game.remove_customer(self)

	queue_redraw()

func set_next_shopping_target():
	var want_type = shopping_list[current_shop_index]
	var shelf = game.get_shelf_by_type(want_type)
	if shelf:
		var shelf_grid = Vector2i(int(shelf.position.x / TILE_SIZE), int(shelf.position.y / TILE_SIZE))
		target_pos = Vector2i(shelf_grid.x, shelf_grid.y + 1)

func move_to_target(target: Vector2i) -> bool:
	if grid_pos.x < target.x:
		grid_pos.x += 1
	elif grid_pos.x > target.x:
		grid_pos.x -= 1
	elif grid_pos.y < target.y:
		grid_pos.y += 1
	elif grid_pos.y > target.y:
		grid_pos.y -= 1
	else:
		return true

	update_position()
	return false

func update_position():
	position = Vector2(grid_pos.x * TILE_SIZE + TILE_SIZE/2, grid_pos.y * TILE_SIZE + TILE_SIZE/2)

func _draw():
	# Draw customer circle (fallback if no sprite)
	if not customer_texture:
		draw_circle(Vector2.ZERO, TILE_SIZE / 4, customer_color)
		draw_arc(Vector2.ZERO, TILE_SIZE / 4, 0, TAU, 32, Color.WHITE, 2)

	# Draw shopping basket
	if cart.size() > 0 or state == "shopping" or state == "grabbing":
		draw_rect(Rect2(-12, 20, 24, 14), Color(0.55, 0.27, 0.07))
		draw_rect(Rect2(-12, 20, 24, 14), Color(0.36, 0.23, 0.10), false, 1.0)

		if cart.size() > 0:
			draw_circle(Vector2(8, 18), 8, Color(1.0, 0.85, 0.24))

	# Draw thought bubble when shopping
	if state == "shopping" or state == "grabbing":
		# Bubble
		draw_circle(Vector2(24, -30), 16, Color.WHITE)
		draw_arc(Vector2(24, -30), 16, 0, TAU, 32, Color(0.2, 0.2, 0.2), 2)
		# Connecting dots
		draw_circle(Vector2(12, -16), 4, Color.WHITE)
		draw_circle(Vector2(16, -22), 3, Color.WHITE)

	# Draw waiting indicator
	if state == "waiting":
		draw_circle(Vector2(24, -30), 16, Color.WHITE)
		var outline_color = Color.RED if wait_time > 5.0 else Color(0.2, 0.2, 0.2)
		draw_arc(Vector2(24, -30), 16, 0, TAU, 32, outline_color, 2)

	# Draw happy face when leaving
	if state == "leaving":
		draw_circle(Vector2(0, -30), 12, Color(1.0, 0.9, 0.2))
		# Eyes
		draw_circle(Vector2(-4, -33), 2, Color.BLACK)
		draw_circle(Vector2(4, -33), 2, Color.BLACK)
		# Smile
		draw_arc(Vector2(0, -28), 5, 0.2, PI - 0.2, 16, Color.BLACK, 2)
