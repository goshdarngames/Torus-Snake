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

describe ( "window.babylonProject.GameLoop", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.GameLoop ).toBeDefined ();
    });

    test ( "stores function in constructor as gameLoop.currentGameState", () =>
    {
        testFunc = jest.fn ();

        gameLoop = new window.babylonProject.GameLoop ( testFunc );

        expect ( gameLoop.currentGameState ).toBe ( testFunc  );
    });

    test ( "stores return of current state as new state", () =>
    {
        testFunc = jest.fn ();

        gameLoop = new window.babylonProject.GameLoop ( testFunc );

        testNewState = jest.fn ();

        testFunc.mockReturnValueOnce ( testNewState );
    
        gameLoop.update ();

        expect ( gameLoop.currentGameState ).toBe ( testNewState );
    });


});
