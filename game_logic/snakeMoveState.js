/****************************************************************************
 * snakeMoveState.js
 *
 * Checks if the snake has moved and updates the grid squares if so.
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    babylonProject.snakeMoveState = function ( babylon, gameData )
    {
        if ( gameData == undefined )
        {
            throw new Error ( "gameData is undefined." );
        }

        if ( babylon == undefined )
        {
            throw new Error ( "babylon is undefined." );
        }

        if ( gameData.snakeParts == undefined )
        {
            throw new Error ( "gameData.snakeParts is undefined." );
        }

        if ( gameData.snakeMoveInterval == undefined )
        {
            throw new Error ( "gameData.snakeMoveInterval is undefined." );
        }

        if ( gameData.snakeMoveTimer  == undefined )
        {
            throw new Error ( "gameData.snakeMoveTimer is undefined." );
        }

        if ( gameData.turnInputControls  == undefined )
        {
            gameData.turnInputControls = 
                new TurnInputControls ( babylon, gameData.scene );
        }

        //check if move timer has elapsed and move if so

        gameData.snakeMoveTimer -= gameData.engine.getDeltaTime ();

        if ( gameData.snakeMoveTimer <= 0 )
        {
            gameData.snakeMoveTimer = gameData.snakeMoveInterval;

            gameData.snakeParts = 
                window.babylonProject.moveSnake (
                        gameData.currentDir, 
                        gameData.snakeParts, 
                        gameData.wrapTorusCoord );

            gameData.applePos = 
            {
                x : gameData.applePos.x + gameData.currentDir.x,
                y : gameData.applePos.y + gameData.currentDir.y
            };

            gameData.applePos = 
                gameData.wrapTorusCoord ( gameData.applePos );

            window.babylonProject.updateTorusMeshes ( gameData );

        } 

        //render the scene and return next state

        gameData.scene.render ();

        return () => babylonProject.snakeMoveState ( babylon, gameData );
    }

    /**
     * babylonProject.moveSnake 
     *
     * Creates a copy of a snake with its parts moved in the desired
     * direction.
     *
     * Parameters:
     * - dir        : The { x, y } with the desired direction
     * - snakeParts : The list of { x, y } coordinates of the snake's body
     * - wrapFunc   : The function that should be used to wrap the 
     *                coordinates around the torus shape.  Usually expects
     *                the gameData.wrapTorusCoords defined in startState 
     */
    babylonProject.moveSnake = function ( dir, snakeParts, wrapFunc )
    {
        let newSnake = snakeParts.map ( function ( val, idx, arr )
        {
            let retVal = { x : 0, y : 0 };

            //snake head
            if ( idx == 0 )
            {
                return retVal;
            }

            //set tail elements to the sum of the next (reversed) element
            //and the movement direction
            
            else
            {
                retVal.x = arr [ idx - 1 ].x + dir.x;
                retVal.y = arr [ idx - 1 ].y + dir.y;

                return wrapFunc ( retVal );
            }

        });

        return newSnake;
    };

    /************************************************************************
     * PRIVATE DATA
     ***********************************************************************/

    let TurnInputControls = function ( babylon, scene )
    {
        this.upPlane = babylon.Mesh.CreatePlane ();
    };

} ( window.babylonProject = window.babylonProject || {} ));
