/*
 * -------------------------------------------
 * Simple snake game.
 * 
 * 2019 (c) http://github.com/pfs5
 * 
 * -------------------------------------------
 */ 

// Globals
var screen_width = 25;
var screen_height = 25;
var game_over_period = 0.05;

var screen_buffer = "";
var screen_matrix = null;
var game_period = 0.2;  // updates per sec
var snake_len = 3;

var max_score_per_diff = [
    1,
    2,
    5,
    8,
    10,
    13,
    15,
    20,
    30
]

var speed_per_diff = [
    0.2,
    0.1,
    0.05
]

// Refs
var game_body_div = null;
var game_score_div = null;
var game_over_div = null;

// Locals
var game_playing = true;

var pos_x = 15;
var pos_y = 10;
var snake_positions = [];

var fruit_valid = false;
var fruit_x = 0;
var fruit_y = 0;

var score = 0;
var diff_level = 0;

var game_over = false;
var game_over_pos = 5;

// up down left right
var move_dir = "up"

function random_from_range(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function key_down(event)
{
    if (game_over)
    {
        restart_game();
        return;
    }

    var head_x = pos_x;
    var head_y = pos_y;
    var neck_x = snake_positions[1][0];
    var neck_y = snake_positions[1][1];

    // Move left
    if (event.key == "ArrowLeft" || event.key == "a")
    {
        if (head_x - 1 != neck_x)
        {
            move_dir = "left";
        }
    }

    // Move right
    if (event.key == "ArrowRight" || event.key == "d")
    {
        if (head_x + 1 != neck_x)
        {
            move_dir = "right";
        }
    }

    // Move up
    if (event.key == "ArrowUp" || event.key == "w")
    {
        if (head_y - 1 != neck_y)
        {
            move_dir = "up";
        }
    }

    // Move down
    if (event.key == "ArrowDown" || event.key == "s")
    {
        if (head_y + 1 != neck_y)
        {
            move_dir = "down"
        }
    }

    refresh_screen();
}

function restart_game()
{
    score = 0;
    diff_level = 0;
    move_dir = "up";
    game_over = false;
    game_over_pos = 5;
    game_playing = true;

    game_over_div.style.visibility = 'hidden';

    init_screen();
    init_snake();
    spawn_fruit();
    refresh_screen();
    update_score();
}

function init_screen()
{
    screen_matrix = [];
    var x, y;
    for (y = 0; y < screen_height; y++)
    {
        var line = [];
        for (x = 0; x < screen_width; x++)
        {
            line.push('.');
        }
        screen_matrix.push(line);
    }   
}

function init_snake()
{
    var i;
    snake_positions = [];
    for (i = 0; i < snake_len; i++)
    {
        snake_positions.push([pos_x, pos_y + i]);
    }
}

function clear_screen()
{
    var x, y;
    for (y = 0; y < screen_height; y++)
    {
        for (x = 0; x < screen_width; x++)
        {
            if (y == 0 || y == screen_height - 1 ||
                x == 0 || x == screen_width - 1)
            {
                screen_matrix[y][x] = 'x';
            }
            else
            {
                screen_matrix[y][x] = '.';
            }
        }
    }   
}

function flush_screen_buffer()
{
    var x, y;
    screen_buffer = "";
    for (y = 0; y < screen_height; y++)
    {
        var line = "";
        for (x = 0; x < screen_width; x++)
        {
            line += screen_matrix[y][x] + " ";
        }
        line += "<br>";
        screen_buffer += line;
    }    
    
    game_body_div.innerHTML = screen_buffer;
}

function draw_snake()
{
    for (var i = 0; i < snake_positions.length; i++)
    {
        screen_matrix[snake_positions[i][1]][snake_positions[i][0]] = 'o';
    }
}

function draw_fruit()
{
    if (fruit_valid)
    {
        screen_matrix[fruit_y][fruit_x] = 'Q';
    }
}

function refresh_screen()
{
    clear_screen();
    draw_snake();
    draw_fruit();
    flush_screen_buffer();
}

function game_loop()
{
    if (!game_playing)
    {
        return;
    }

    move_snake();
    check_collision();
    check_fruit_collected();
    refresh_screen();

    if (game_over)
    {
        on_game_over();
    }
}

function game_over_loop()
{
    if (!game_over)
    {
        return;
    }

    game_over_pos = (game_over_pos + 2) % 85 + 5;

    game_over_div.style.marginLeft = game_over_pos + "%";
}

function move_snake()
{
    // Move head
    switch(move_dir)
    {
        case "up":
        {
            pos_y = Math.max(0, pos_y - 1);
            break;
        }
        case "down":
        {
            pos_y = Math.min(screen_height - 1, pos_y + 1);
            break;
        }
        case "left":
        {
            pos_x = Math.max(0, pos_x - 1);
            break;
        }
        case "right":
        {
            pos_x = Math.min(screen_width - 1, pos_x + 1);
            break;
        }
    }

    // Wrap snake around edges
    if (pos_x <= 0)
    {
        pos_x = screen_width - 2;
    }
    if (pos_x >= screen_width - 1)
    {
        pos_x = 1;
    }
    if (pos_y <= 0)
    {
        pos_y = screen_height - 2;
    }
    if (pos_y >= screen_height - 1)
    {
        pos_y = 1;
    }

    // Move body
    for (var i = snake_positions.length - 1; i > 0 ; i--)
    {
        snake_positions[i][0] = snake_positions[i - 1][0];
        snake_positions[i][1] = snake_positions[i - 1][1];
    }
    snake_positions[0][0] = pos_x;
    snake_positions[0][1] = pos_y;
}

function update_score()
{
    game_score_div.innerHTML = "Score: " + score + "<br>" + 
        "Level: " + (diff_level + 1) + "<br>" +
        "Debug: " + game_over;
}

function spawn_fruit()
{
    var fruit_spawned = false;
    while (!fruit_spawned)
    {
        fruit_x = random_from_range(1, screen_width - 2);
        fruit_y = random_from_range(1, screen_height - 2);

        fruit_spawned = true;
        for (var i = 0; i < snake_positions.length; i++)
        {
            if (snake_positions[0] == fruit_x && snake_positions[1] == fruit_y)
            {
                fruit_spawned = false;
                break;
            }
        }
    }

    fruit_valid = true;
}

function check_fruit_collected()
{
    if (!fruit_valid)
    {
        return;
    }

    if (fruit_x == pos_x && fruit_y == pos_y)
    {
        score++;
        if (diff_level < max_score_per_diff.length)
        {
            if (score >= max_score_per_diff[diff_level])
            {
                diff_level++;
                add_snake_segment();
            }
        }

        update_score();
        spawn_fruit();
    }
}

function check_collision()
{
    for (var i = 0; i < snake_positions.length; i++)
    {
        for (var j = i + 1; j < snake_positions.length; j++)
        {
            segment_x_1 = snake_positions[i][0];
            segment_y_1 = snake_positions[i][1];
            segment_x_2 = snake_positions[j][0];
            segment_y_2 = snake_positions[j][1];
        
            if (segment_x_1 == segment_x_2 &&
                segment_y_1 == segment_y_2)
            {
                game_over = true;
                update_score();
                break;
            }
        }
    }
}

function add_snake_segment()
{
    var seg_x = snake_positions[snake_positions.length - 1][0];
    var seg_y = snake_positions[snake_positions.length - 1][1];
    
    snake_positions.push([seg_x, seg_y]);
}

function on_game_over()
{
    game_playing = false;

    // Print game over
    game_over_div.style.visibility = 'visible';
    game_over_div.innerHTML = "Game Over";
}

function game()
{
    game_body_div = document.getElementById("game");
    game_score_div = document.getElementById("score");
    game_over_div = document.getElementById("game-over");

    restart_game();

    setInterval(game_loop, game_period * 1000);
    setInterval(game_over_loop, game_over_period * 1000);
}

window.onload = game;
document.addEventListener('keydown', key_down);