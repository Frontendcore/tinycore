// Don't catch errors.
TinyCore.debugMode = true;

// This can be handy.
var oDummyModule = {
		onStart : function() {},
		onStop : function () {}
	},
	fpDummyCreator = function ()
	{
		return oDummyModule;
	};

/**
 * ------- CORE TESTS -------
 */

describe( 'TinyCore', function ()
{
	it( 'should have an interface with the following properties/methods : debugMode, Module, Toolbox, Error, Utils', function ()
	{
		expect( TinyCore.debugMode ).toBeTruthy();
		expect( TinyCore.Module ).toBeObject();
		expect( TinyCore.Toolbox ).toBeObject();
		expect( TinyCore.Error ).toBeObject();
		expect( TinyCore.Utils ).toBeObject();
	} );
} );

/**
 * ------- MODULE TESTS -------
 */

describe( 'TinyCore.Module', function ()
{
	it( 'should have an interface with the following properties/methods : define, start, stop, instanciate, getModules and getInstance', function ()
	{
		expect( TinyCore.Module.define ).toBeFunction();
		expect( TinyCore.Module.start ).toBeFunction();
		expect( TinyCore.Module.stop ).toBeFunction();
		expect( TinyCore.Module.instanciate ).toBeFunction();
		expect( TinyCore.Module.getModules ).toBeFunction();
		expect( TinyCore.Module.getInstance ).toBeFunction();
	} );
} );

describe( 'TinyCore.Module.define', function ()
{
	it( 'should return true when defining a module that was not previously defined', function ()
	{
		expect( TinyCore.Module.define( 'afterburner', [], fpDummyCreator ) ).toBe( true );
	} );
	it( 'should return false when trying to define a module that was previously defined', function ()
	{
		expect( TinyCore.Module.define( 'afterburner', [], fpDummyCreator ) ).toBe( false );
	} );
	it( 'should return false when trying to define a module without passing a creator function', function ()
	{
		expect( TinyCore.Module.define( 'nothing', [] ) ).toBe( false );
	} );
} );

describe( 'TinyCore.Module.instanciate', function ()
{
	it( 'should throw an error when trying to instanciate a module that is not defined', function ()
	{
		expect( function ()
		{
			TinyCore.Module.instanciate( '!' );
		} ).toThrow();
	} );

	it( 'should instanciate properly a previously-defined module', function ()
	{
		var oModule = {
			sCypherKey : 'kvbs6E2NSw72sdb903bnjK',
			onStart : function ( oStartData ) {},
			onStop : function () {}
		},
		oTestedModule;

		TinyCore.Module.define( 'com-3MHz', [], function ()
		{
			return oModule;
		} );

		oTestedModule = TinyCore.Module.instanciate( 'com-3MHz' );

		expect( oModule ).toEqual( oTestedModule );
	} );

	it( 'should properly pass the tools registered as arguments to the creator function', function ()
	{
		var oTeleport = { locations : ['ES', 'BE', 'PT', 'FR', 'UK', 'DE'], moveTo : function() {} },
			oScanner = { on : false, toggle : function () { this.on = !this.on; } },
			oToolsFactory = {
				'scanner' : function ( nToolID ) { return oScanner; },
				'teleport' : function ( nToolID ) { return oTeleport; }
			},
			oPassedTools = {};

		expect( TinyCore.Toolbox.register( 'scanner', oToolsFactory['scanner'] ) ).toBe( true );
		expect( TinyCore.Toolbox.register( 'teleport', oToolsFactory['teleport'] ) ).toBe( true );

		TinyCore.Module.define( 'space-vehicle', ['teleport','scanner'], function ( oPassedTeleport, oPassedScanner )
		{
			oPassedTools.teleport = oPassedTeleport;
			oPassedTools.scanner = oPassedScanner;

			return {
				onStart : function ( oStartData )
				{
					oPassedScanner.toggle();
				}
			};
		} );

		TinyCore.Module.instanciate( 'space-vehicle' );

		expect( oPassedTools.teleport ).toEqual( oTeleport );
		expect( oPassedTools.scanner ).toEqual( oScanner );
	} );

	it( 'should pass the names of unregistered tools as arguments to the creator function', function ()
	{
		var oScanner = { on : false, toggle : function () { this.on = !this.on; } },
			oToolsFactory = {
				'waves-scanner' : function ( nToolID ) { return oScanner; }
			},
			oPassedTools = {};

		expect( TinyCore.Toolbox.register( 'waves-scanner', oToolsFactory['waves-scanner'] ) ).toBe( true );

		TinyCore.Module.define( 'space-surf', ['waves-teleport','waves-scanner'], function ( sPassedTeleport, oPassedScanner )
		{
			oPassedTools.teleport = sPassedTeleport;
			oPassedTools.scanner = oPassedScanner;

			return {
				onStart : function ( oStartData )
				{
					oPassedScanner.toggle();
				}
			};
		} );

		TinyCore.Module.instanciate( 'space-surf' );

		expect( oPassedTools.teleport ).toEqual( 'waves-teleport' );
		expect( oPassedTools.scanner ).toEqual( oScanner );
	} );
} );

describe( 'TinyCore.Module.getModules', function ()
{
	it( 'should return an object', function ()
	{
		expect( TinyCore.Module.getModules() ).toBeObject();
	} );
} );

describe( 'TinyCore.Module.getInstance', function ()
{
	TinyCore.Module.define( 'clone', [], function ()
	{
		return {
			sName : 'generic',
			onStart : function ( oStartData )
			{
				if ( oStartData && oStartData.name )
				{
					this.sName = oStartData.name;
				}
			}
		};
	} );

	it( 'should throw an error when the module has not been defined', function ()
	{
		expect( function ()
		{
			TinyCore.Module.getInstance( '!', '?' );
		} ).toThrow();
	} );

	it( 'should return undefined if no instance has been started', function ()
	{
		expect( TinyCore.Module.getInstance( 'clone', 'clone' ) ).toBeUndefined();
	} );

	it( 'should return a proper object if a a module instance has been previously started', function ()
	{
		var oInstanceData = null;

		TinyCore.Module.start( 'clone' );

		oInstanceData = TinyCore.Module.getInstance( 'clone', 'clone' );
		expect( oInstanceData ).toBeObject();
		expect( oInstanceData.oInstance ).toBeObject();
		expect( oInstanceData.oInstance.sName ).toEqual( 'generic' );
	} );
} );

describe( 'TinyCore.Module.start', function ()
{
	it( 'should throw an error when trying to start a module that is not defined', function ()
	{
		expect( function ()
		{
			TinyCore.Module.start( '!' );
		} ).toThrow();
	} );

	it( 'should instanciate a module', function ()
	{
		TinyCore.Module.define( 'e-tank', [], fpDummyCreator );

		spyOn( TinyCore.Module, 'instanciate' ).andReturn( oDummyModule );

		TinyCore.Module.start( 'e-tank' );

		expect( TinyCore.Module.instanciate ).toHaveBeenCalledWith( 'e-tank' );
	} );

	it( 'should start a module properly', function ()
	{
		var oStartData = {
			nCount : 8
		},
		oModule = {
			nCount : 0,
			onStart : function ( oStartData )
			{
				this.nCount = oStartData.nCount;
			}
		};

		TinyCore.Module.define( 'engines', [], function ()
		{
			return oModule;
		} );

		TinyCore.Module.start( 'engines', oStartData );

		expect( oModule.nCount ).toEqual( 8 );
	} );

	it( 'should not start a module that has already been started', function ()
	{
		var oModule = {
				nCount : 3,
				onStart : function ()
				{
					this.nCount *= 2;
				}
			};

		TinyCore.Module.define( 'antenna', [], function ()
		{
			return oModule;
		} );

		TinyCore.Module.start( 'antenna' );
		TinyCore.Module.start( 'antenna' );

		expect( oModule.nCount ).toEqual( 6 );
	} );
} );

describe( 'TinyCore.Module.stop', function ()
{
	it( 'should throw an error when trying to stop a module that is not defined', function ()
	{
		expect( function ()
		{
			TinyCore.Module.stop( 'restroom' );
		} ).toThrow();
	} );

	it( 'should stop a module properly', function ()
	{
		var oModule = {
			bContainsO2 : true,
			onStart : function () {},
			onStop : function () {
				this.bContainsO2 = false;
			}
		};

		TinyCore.Module.define( 'atmosphere', [], function ()
		{
			return oModule;
		} );

		TinyCore.Module.start( 'atmosphere' );

		TinyCore.Module.stop( 'atmosphere' );

		expect( oModule.bContainsO2 ).toBeFalsy();
	} );

	it( 'should not stop a module that has already been stopped', function ()
	{
		var oModule = {
			nTemp : 21,
			onStart : function () {},
			onStop : function () {
				this.nTemp -= 5;
			}
		};

		TinyCore.Module.define( 'heat', [], function ()
		{
			return oModule;
		} );

		TinyCore.Module.start( 'heat' );
		TinyCore.Module.stop( 'heat' );
		TinyCore.Module.stop( 'heat' );

		expect( oModule.nTemp ).toEqual( 16 );
	} );

	it( 'should still allow a module to be restarted', function ()
	{
		var oModule = {
			nPower : 0,
			onStart : function ()
			{
				this.nPower++;
			},
			onStop : function ()
			{
				this.nPower++;
			}
		};

		TinyCore.Module.define( 'shield', [], function ()
		{
			return oModule;
		} );

		TinyCore.Module.start( 'shield' );
		TinyCore.Module.stop( 'shield' );
		TinyCore.Module.start( 'shield' );

		expect( oModule.nPower ).toEqual( 3 );
	} );

	it( 'should allow the complete destruction of a module', function ()
	{
		var oModule = {
			onStart : function () {},
			onStop : function () {},
			onDestroy : function () {}
		};

		TinyCore.Module.define( 'oblivion', [], function ()
		{
			return oModule;
		} );

		spyOn( oModule, 'onStop' );
		spyOn( oModule, 'onDestroy' );

		TinyCore.Module.start( 'oblivion' );
		TinyCore.Module.stop( 'oblivion', true );

		expect( oModule.onStop ).toHaveBeenCalled();
		expect( oModule.onDestroy ).toHaveBeenCalled();
		expect( TinyCore.Module.getModules()['oblivion'] ).toBeUndefined();
	} );
} );

/**
 * ------- TOOLBOX TESTS -------
 */

describe( 'TinyCore.Toolbox', function ()
{
	it( 'should have an interface with the following properties/methods : request and register', function ()
	{
		expect( TinyCore.Toolbox.request ).toBeFunction();
		expect( TinyCore.Toolbox.register ).toBeFunction();
	} );
} );

describe( 'TinyCore.Toolbox.register', function ()
{
	it( 'should return true when registering a new tool successfully', function ()
	{
		expect( TinyCore.Toolbox.register( 'bionic-hand', function () { return {}; } ) ).toBe( true );
	} );

	it( 'should return false when trying to register an already registered tool', function ()
	{
		expect( TinyCore.Toolbox.register( 'bionic-hand', function () { return {}; } ) ).toBe( false );
	} );

	it( 'should return false when trying to register a tool without passing a factory function', function ()
	{
		expect( TinyCore.Toolbox.register( 'bionic-hand' ) ).toBe( false );
	} );
} );

describe( 'TinyCore.Toolbox.request', function ()
{
	it( 'should return the tool requested if it has been previously registered', function ()
	{
		var oRegisteredEye = {},
			oRequestedEye;

		expect( TinyCore.Toolbox.register( 'telescopic-eye', function () { return oRegisteredEye; } ) ).toBe( true );

		oRequestedEye = TinyCore.Toolbox.request( 'telescopic-eye' );

		expect( oRequestedEye ).toBe( oRegisteredEye );
	} );

	it( 'should return null if the tool requested was not previously registered', function ()
	{
		var oMagicStick = TinyCore.Toolbox.request( 'magic-stick' );

		expect( oMagicStick ).toBeNull();
	} );
} );

/**
 * ------- ERROR HANDLER TESTS -------
 */

describe( 'TinyCore.Error', function ()
{
	it( 'should have an interface with the following properties/methods : log', function ()
	{
		expect( TinyCore.Error.log ).toBeFunction();
	} );
} );
