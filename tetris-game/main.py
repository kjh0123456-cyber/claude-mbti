import pygame
from constants import SCREEN_WIDTH, SCREEN_HEIGHT, FPS
from game import GameState
from renderer import Renderer


def main() -> None:
    pygame.init()
    pygame.display.set_caption("PyTetris")
    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))

    gs = GameState()
    renderer = Renderer(screen)
    clock = pygame.time.Clock()
    running = True

    while running:
        dt = clock.tick(FPS)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            else:
                gs.handle_event(event)

        gs.update(dt)
        renderer.draw(gs)
        pygame.display.flip()

    pygame.quit()


if __name__ == "__main__":
    main()
