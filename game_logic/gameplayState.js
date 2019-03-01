/****************************************************************************
 * gameplayState.js
 *
 * Checks if the snake has moved and updates the grid squares if so.
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    babylonProject.GameplayStateData = function ()
    {
        //create snake
        this.snakeParts = babylonProject.snake
            .createSnake ( babylonProject.config.dirLeft, 3);

        //snake move timer and interval

        this.snakeMoveInterval =
            babylonProject.config.snakeMoveInitialInterval;

        this.snakeMoveTimer =
            babylonProject.config.snakeMoveInitialInterval;

        //apple position

        this.applePos = { x : 2, y : 1 };

        //current direction

        this.currentDir = babylonProject.config.dirLeft;

        //turn input controls

        this.turnInputControls = 1;

        //turn button callback
        
        this.turnButtonCallback = function ( buttonDir )
        {
            this.currentDir = 
                babylonProject.snake.turnSnake ( 
                        buttonDir, this.currentDir );
        };
    }

    babylonProject.gameplayState = 
        function ( babylon, gameData, stateData )
    {

        if ( babylon == undefined )
        {
            throw new Error ( "babylon is undefined." );
        }

        if ( gameData == undefined )
        {
            throw new Error ( "gameData is undefined." );
        }

        if ( stateData == undefined )
        {
            stateData = new babylonProject.GameplayStateData ();
        }

        if ( gameData.turnInputControls  == undefined )
        {
            gameData.turnInputControls = 
                new TurnInputControls ( babylon, gameData );
        }

        let config = window.babylonProject.config;

        //enable arrow buttons that are perpindicular to currentDir

        let setButtonEnabled = ( controlName, enabled ) => 
        {
            gameData.turnInputControls [ controlName ].buttonPlane
                .isEnabled ( enabled  );

            gameData.turnInputControls [ controlName ].button
                .isEnabled = enabled;

            gameData.turnInputControls [ controlName ].button
                .isVisible = enabled;

        }

        let vertical = ( gameData.currentDir == config.dirUp ||
                         gameData.currentDir == config.dirDown );

        setButtonEnabled ( "upControl",   !vertical );
        setButtonEnabled ( "downControl", !vertical );
        setButtonEnabled ( "rightControl", vertical );
        setButtonEnabled ( "leftControl",  vertical );

        //check if move timer has elapsed and move if so

        gameData.snakeMoveTimer -= gameData.engine.getDeltaTime ();

        if ( gameData.snakeMoveTimer <= 0 )
        {
            gameData.snakeMoveTimer = gameData.snakeMoveInterval;

            gameData.snakeParts = 
                window.babylonProject.snake.moveSnake (
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

        return () => babylonProject
            .gameplayState ( babylon, gameData, stateData );
    }

    /************************************************************************
     * Input Controls
     ***********************************************************************/

    let TurnInputControls = function ( babylon, gameData )
    {
        let config = window.babylonProject.config; 

        let buttonData = [
            {
                name        : "up",
                text        : "U",
                dir         : config.dirUp,
                pos         : config.upPos,
                controlName : "upControl"
            },

            {
                name        : "down",
                text        : "D",
                dir         : config.dirDown,
                pos         : config.downPos,
                controlName : "downControl"
            },

            {
                name        : "left",
                text        : "L",
                dir         : config.dirLeft,
                pos         : config.leftPos,
                controlName : "leftControl"
            },

            {
                name        : "right",
                text        : "R",
                dir         : config.dirRight,
                pos         : config.rightPos,
                controlName : "rightControl"
            }
        ];

        buttonData.forEach ( function ( data )
        {
            this [ data.controlName ] = 
                window.babylonProject.createButtonPlane (

                    data.name,

                    //plane options
                    {
                        size  : config.turnControlPlaneSize
                    },
                    //button options
                    {
                        buttonText : data.text,
                        buttonCall : () => 
                            turnControlCallback ( data.dir, gameData )
                    },
                    gameData.scene,
                    babylon

            );
            

            this [ data.controlName ].buttonPlane.position = data.pos;

        }, this);
        
    };

    let turnControlCallback = function ( newDir, gameData )
    {
        gameData.currentDir = 
            babylonProject.snake.turnSnake ( newDir, gameData.currentDir );
    };

} ( window.babylonProject = window.babylonProject || {} ));
