extends Node2D

# ============================================
# DUNKIN' KONBINI SIMULATOR - Godot Port
# ============================================

const TILE_SIZE = 48
const GRID_W = 13
const GRID_H = 10

# Scene references
@onready var player = $Player
@onready var ui = $CanvasLayer/UI
@onready var audio_manager = $AudioManager

# Game state
var total_sales: int = 0
var customers_served: int = 0
var shelves: Array = []
var customers: Array = []
var sparkles: Array = []

# Customer spawning
var last_customer_time: float = 0.0
const CUSTOMER_INTERVAL: float = 6.0
const MAX_CUSTOMERS: int = 3

# Preload scenes
var CustomerScene = preload("res://scenes/Customer.tscn")

# Register position
var register_pos = Vector2i(11, 4)

func _ready():
	# Initialize shelves
	for shelf in get_tree().get_nodes_in_group("shelves"):
		shelves.append(shelf)

	update_status()
	print("Dunkin Konbini Simulator loaded!")

func _process(delta):
	# Customer spawning
	last_customer_time += delta
	if last_customer_time >= CUSTOMER_INTERVAL and customers.size() < MAX_CUSTOMERS:
		spawn_customer()
		last_customer_time = 0.0

	# Update sparkles
	update_sparkles(delta)

func spawn_customer():
	var customer = CustomerScene.instantiate()
	customer.position = Vector2(6 * TILE_SIZE + TILE_SIZE/2, TILE_SIZE/2)
	customer.game = self
	add_child(customer)
	customers.append(customer)
	audio_manager.play_door()

func remove_customer(customer):
	customers.erase(customer)
	customer.queue_free()

func get_shelf_by_type(type: String):
	for shelf in shelves:
		if shelf.shelf_type == type:
			return shelf
	return null

func checkout_customer() -> bool:
	var player_grid = Vector2i(int(player.position.x / TILE_SIZE), int(player.position.y / TILE_SIZE))

	for customer in customers:
		if customer.state == "waiting":
			var cust_grid = Vector2i(int(customer.position.x / TILE_SIZE), int(customer.position.y / TILE_SIZE))
			if abs(cust_grid.x - player_grid.x) <= 1 and abs(cust_grid.y - player_grid.y) <= 1:
				if customer.cart.size() > 0:
					# Calculate total
					var total = 0
					for item in customer.cart:
						total += item.price
					total_sales += total
					customers_served += 1

					audio_manager.play_cash_register()

					# Spawn sparkles
					spawn_sparkles(customer.position, Color(1.0, 0.85, 0.24), 8)

					customer.state = "leaving"
					update_status()
					return true
	return false

func spawn_sparkles(pos: Vector2, color: Color, count: int):
	for i in count:
		sparkles.append({
			"pos": pos,
			"vel": Vector2(randf_range(-3, 3), randf_range(-3, 3)),
			"life": 1.0,
			"color": color
		})

func update_sparkles(delta):
	for i in range(sparkles.size() - 1, -1, -1):
		var s = sparkles[i]
		s.pos += s.vel
		s.life -= delta * 2
		if s.life <= 0:
			sparkles.remove_at(i)
	queue_redraw()

func update_status():
	var waiting = 0
	for c in customers:
		if c.state == "waiting":
			waiting += 1

	var low_stock = 0
	for s in shelves:
		if s.items <= 3:
			low_stock += 1

	var status = "Sales: $%d | Served: %d" % [total_sales, customers_served]
	if waiting > 0:
		status += " | Waiting: %d" % waiting
	if low_stock > 0:
		status += " | Low stock: %d" % low_stock
	if player.holding > 0:
		status += " | Carrying: %d" % player.holding

	ui.update_status(status)

func _draw():
	# Draw floor tiles
	for y in GRID_H:
		for x in GRID_W:
			var color = Color(0.94, 0.88, 0.80) if (x + y) % 2 == 0 else Color(0.96, 0.90, 0.83)
			draw_rect(Rect2(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE), color)

	# Draw grid lines
	for x in GRID_W + 1:
		draw_line(Vector2(x * TILE_SIZE, 0), Vector2(x * TILE_SIZE, GRID_H * TILE_SIZE), Color(0.83, 0.77, 0.69), 1)
	for y in GRID_H + 1:
		draw_line(Vector2(0, y * TILE_SIZE), Vector2(GRID_W * TILE_SIZE, y * TILE_SIZE), Color(0.83, 0.77, 0.69), 1)

	# Draw entrance
	draw_rect(Rect2(5 * TILE_SIZE, 0, 3 * TILE_SIZE, TILE_SIZE - 4), Color(0.53, 0.81, 0.92))
	draw_rect(Rect2(5 * TILE_SIZE, 0, 3 * TILE_SIZE, 8), Color(0.29, 0.56, 0.64))

	# Draw stockroom
	draw_rect(Rect2(0, 8 * TILE_SIZE, GRID_W * TILE_SIZE, 2 * TILE_SIZE), Color(0.77, 0.72, 0.66))
	draw_rect(Rect2(10, 8 * TILE_SIZE + 10, 80, 60), Color(0.63, 0.50, 0.38))
	draw_rect(Rect2(GRID_W * TILE_SIZE - 90, 8 * TILE_SIZE + 10, 80, 60), Color(0.63, 0.50, 0.38))

	# Draw register
	var reg_x = register_pos.x * TILE_SIZE
	var reg_y = register_pos.y * TILE_SIZE
	draw_rect(Rect2(reg_x + 4, reg_y + 4, TILE_SIZE - 8, TILE_SIZE - 8), Color(0.55, 0.27, 0.07))
	draw_rect(Rect2(reg_x + 8, reg_y + 8, TILE_SIZE - 16, TILE_SIZE - 20), Color(0.82, 0.41, 0.12))

	# Draw sparkles
	for s in sparkles:
		var c = s.color
		c.a = s.life
		draw_circle(s.pos, 4 * s.life, c)
