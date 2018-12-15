const renderLoop = require ( "./gameLoop" );

/****************************************************************************
 * MOCK DATA
 ***************************************************************************/
function get_mock_game_state ()
{
    let MockState = jest.fn (
            function ()
            {
                this.update = jest.fn(
                        function ()
                        {
                            return this;
                        });
            });

    return new MockState ();
}
beforeEach ( () =>
{
});

/****************************************************************************
 * TESTS
 ***************************************************************************/

test ( "window.babylonProject.currentGameState is defined", () =>
{
    expect ( window.babylonProject.currentGameState ).toBeDefined ();
});

describe ( "window.babylonProject.gameLoop", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.gameLoop ).toBeDefined ();
    });

    test ( "calls update() on window.babylonProject.currentGameState", () =>
    {
        window.babylonProject.currentGameState = get_mock_game_state ();
        
        window.babylonProject.gameLoop ();

        expect ( window.babylonProject.currentGameState.update )
            .toHaveBeenCalledTimes ( 1 );
    });

    test ( "stores result of babylonProject.currentGameState.update() in "+
           "window.babylonProject.currentGameState", () =>
    {
        window.babylonProject.currentGameState = get_mock_game_state ();

        window.babylonProject.currentGameState.update
           .mockReturnValue(10); 
         
        window.babylonProject.gameLoop ();

        expect ( window.babylonProject.currentGameState ).toBe( 10 );
    });


});
