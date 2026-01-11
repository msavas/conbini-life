extends Control

@onready var status_label = $StatusLabel
@onready var title_label = $TitleLabel
@onready var instructions_label = $InstructionsLabel

func _ready():
	# Set up initial UI text
	if title_label:
		title_label.text = "Dunkin' - Konbini Simulator"
	if instructions_label:
		instructions_label.text = "Arrow Keys = Move | E = Checkout/Stock | Space = Grab items from stockroom"

func update_status(text: String):
	if status_label:
		status_label.text = text
