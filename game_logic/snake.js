/****************************************************************************
 * snake.js
 *
 * Defines functions used to manipulate the snake data structure.
 *
 * Snakes are defined as a list of coordinate positions.
 *
 * The coorindates are offsets from the head of the snake so:
 *   - Snake head is always   :  { x : 0, y : 0 }
 *   - Adjacent part would be :  { x : 1, y : 0 }
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    //empty object is used to contain other snake functions in a namespace
    babylonProject.snake = {};

    /**
     * babylonProject.snake.turnAllowed ( newDir, currentDir )
     *
     * Returns true if the snake is allowed to turn towards newDir
     * from currentDir.
     *
     * Only perpindicular movement is allowed.
     */
    babylonProject.snake.turnAllowed = function ( newDir, currentDir )
    {
        let config = window.babylonProject.config;

        if ( !config.isValidDirection ( newDir ) )
        {
            throw ( "newDir is not valid direction" );
        }

        if ( !config.isValidDirection ( currentDir ) )
        {
            throw ( "currentDir is not valid direction" );
        }

        let u = config.dirUp;
        let d = config.dirDown;
        let l = config.dirLeft;
        let r = config.dirRight;

        //check perpindicular for up or down
        let vertical =
            ( newDir == u     || newDir == d ) && 
            ( currentDir == l || currentDir == r );
        
        //check perpindicular for left or right
        let horizontal =
            ( newDir == r     || newDir == l ) && 
            ( currentDir == u || currentDir == d );

        return ( vertical || horizontal );
        
    };

    babylonProject.snake.moveSnake = function ( dir, snakeParts, wrapFunc )
    {
        if ( !babylonProject.config.isValidDirection ( dir ) )
        {
            throw ( "dir is not valid direction" );
        }
        
        let newSnake = snakeParts.map ( function ( val, idx, arr )
        {
            let retVal = { x : 0, y : 0 };

            if ( idx != 0 )
            {
                retVal.x = snakeParts [ idx - 1 ].x + dir.x;
                retVal.y = snakeParts [ idx - 1 ].y + dir.y;

                retVal = wrapFunc ( retVal );
            }

            return retVal;
        });

        return newSnake;
    }

    babylonProject.snake.turnSnake = function ( newDir, currentDir )
    {
        if ( babylonProject.snake.turnAllowed ( newDir, currentDir ) )
        {
            return newDir;
        } 
        else
        {
            return currentDir;
        }   
    };
} ( window.babylonProject = window.babylonProject || {} ));
