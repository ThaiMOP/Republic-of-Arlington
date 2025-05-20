import pygame import random import sys

Initialize Pygame

pygame.init()

Constants

WIDTH, HEIGHT = 640, 480 CELL_SIZE = 20 GRID_WIDTH = WIDTH // CELL_SIZE GRID_HEIGHT = HEIGHT // CELL_SIZE FPS = 10 FONT = pygame.font.SysFont('Courier', 24)

Colors

BLACK = (0, 0, 0) WHITE = (255, 255, 255) GREEN = (0, 255, 0) RED = (255, 0, 0) BLUE = (0, 0, 255) YELLOW = (255, 255, 0)

Setup screen

screen = pygame.display.set_mode((WIDTH, HEIGHT)) pygame.display.set_caption("Retro Snake") clock = pygame.time.Clock()

Snake class

class Snake: def init(self): self.positions = [(5, 5)] self.direction = (1, 0) self.grow = False

def move(self):
    head_x, head_y = self.positions[0]
    dir_x, dir_y = self.direction
    new_head = ((head_x + dir_x) % GRID_WIDTH, (head_y + dir_y) % GRID_HEIGHT)

    if new_head in self.positions:
        return False  # Collided with itself

    self.positions.insert(0, new_head)
    if not self.grow:
        self.positions.pop()
    else:
        self.grow = False

    return True

def change_direction(self, new_dir):
    opposite = (-self.direction[0], -self.direction[1])
    if new_dir != opposite:
        self.direction = new_dir

def draw(self):
    for pos in self.positions:
        pygame.draw.rect(screen, GREEN, (pos[0]*CELL_SIZE, pos[1]*CELL_SIZE, CELL_SIZE, CELL_SIZE))

Food and Power-up

class Item: def init(self, color): self.position = self.random_position() self.color = color

def random_position(self):
    return (random.randint(0, GRID_WIDTH-1), random.randint(0, GRID_HEIGHT-1))

def draw(self):
    pygame.draw.rect(screen, self.color, (self.position[0]*CELL_SIZE, self.position[1]*CELL_SIZE, CELL_SIZE, CELL_SIZE))

Main game function

def game(): snake = Snake() food = Item(RED) power_up = None score = 0 speed = FPS power_up_timer = 0

running = True
while running:
    clock.tick(speed)

    # Event handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Controls
    keys = pygame.key.get_pressed()
    if keys[pygame.K_UP]: snake.change_direction((0, -1))
    if keys[pygame.K_DOWN]: snake.change_direction((0, 1))
    if keys[pygame.K_LEFT]: snake.change_direction((-1, 0))
    if keys[pygame.K_RIGHT]: snake.change_direction((1, 0))

    if not snake.move():
        break  # Game over

    # Eat food
    if snake.positions[0] == food.position:
        score += 10
        snake.grow = True
        food = Item(RED)
        if score % 50 == 0:
            power_up = Item(YELLOW)
        speed = min(speed + 1, 25)

    # Collect power-up
    if power_up and snake.positions[0] == power_up.position:
        score += 30
        snake.grow = True
        power_up = None

    # Draw
    screen.fill(BLACK)
    draw_grid()
    snake.draw()
    food.draw()
    if power_up:
        power_up.draw()
    draw_text(f"Score: {score}", 10, 10)
    pygame.display.flip()

game_over(score)

Draw grid

def draw_grid(): for x in range(0, WIDTH, CELL_SIZE): pygame.draw.line(screen, BLUE, (x, 0), (x, HEIGHT)) for y in range(0, HEIGHT, CELL_SIZE): pygame.draw.line(screen, BLUE, (0, y), (WIDTH, y))

Draw text

def draw_text(text, x, y): surface = FONT.render(text, True, WHITE) screen.blit(surface, (x, y))

Game over screen

def game_over(score): screen.fill(BLACK) draw_text("GAME OVER", WIDTH // 2 - 80, HEIGHT // 2 - 30) draw_text(f"Final Score: {score}", WIDTH // 2 - 100, HEIGHT // 2) draw_text("Press any key to quit", WIDTH // 2 - 130, HEIGHT // 2 + 30) pygame.display.flip()

waiting = True
while waiting:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        if event.type == pygame.KEYDOWN:
            waiting = False
pygame.quit()
sys.exit()

Run the game

game()

