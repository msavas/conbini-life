extends Node2D

const TILE_SIZE = 48

@export var shelf_type: String = "drinks"
@export var items: int = 8
@export var max_items: int = 10
@export var price: int = 2
@export var color: Color = Color(0.31, 0.80, 0.77)

var grid_pos: Vector2i
var shelf_texture: Texture2D

func _ready():
	grid_pos = Vector2i(int(position.x / TILE_SIZE), int(position.y / TILE_SIZE))
	add_to_group("shelves")

	# Load shelf texture based on type
	match shelf_type:
		"drinks":
			shelf_texture = load("res://assets/shelf-drinks.jpeg")
		"snacks":
			shelf_texture = load("res://assets/shelf-snacks.jpeg")
		"bento":
			shelf_texture = load("res://assets/shelf-bento.jpeg")

func _process(_delta):
	# Redraw for animation (low stock warning glow)
	if items <= 3:
		queue_redraw()

func _draw():
	var fill_ratio = float(items) / float(max_items)

	# Draw shelf texture or fallback
	if shelf_texture:
		var size = TILE_SIZE * 2
		var alpha = 0.3 + fill_ratio * 0.7

		# Warning glow if low stock
		if items <= 3:
			var glow_intensity = 0.5 + sin(Time.get_ticks_msec() / 200.0) * 0.3
			draw_rect(Rect2(-TILE_SIZE/2 - 8, -TILE_SIZE/2 - 8, size + 16, size + 16), Color(1, 0.27, 0.27, glow_intensity * 0.4))

		draw_set_transform(Vector2(-TILE_SIZE/2, -TILE_SIZE/2))
		draw_texture_rect(shelf_texture, Rect2(0, 0, size, size), false, Color(1, 1, 1, alpha))
		draw_set_transform(Vector2.ZERO)
	else:
		# Fallback colored rectangle
		var brightness = 0.3 + fill_ratio * 0.7
		var shelf_color = color.lightened(1.0 - brightness)
		draw_rect(Rect2(-TILE_SIZE/2 + 4, -TILE_SIZE/2 + 4, TILE_SIZE - 8, TILE_SIZE - 8), shelf_color)

		if items <= 3:
			var glow_intensity = 0.5 + sin(Time.get_ticks_msec() / 200.0) * 0.3
			draw_rect(Rect2(-TILE_SIZE/2, -TILE_SIZE/2, TILE_SIZE, TILE_SIZE), Color(1, 0.27, 0.27, glow_intensity * 0.3))

	# Stock count label
	var bg_color = Color(1, 0.27, 0.27) if items <= 3 else Color(0, 0, 0, 0.8)
	draw_rect(Rect2(-18, TILE_SIZE/2 - 8, 36, 16), bg_color)

	# Price label at top
	draw_rect(Rect2(-15, -TILE_SIZE/2 - 16, 30, 14), Color(0.17, 0.67, 0.17, 0.9))
