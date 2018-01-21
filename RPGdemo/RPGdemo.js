/*******************************************************************\
|*                                                                                                              *|
|*                            APPLICATION FROM ALEX F                              *|
|*                                     BY SYMBROSON                                          *|
|*                                                                                                              *|
|*    -  it is not allowed to upload this app on other platforms      *|
|*           without getting a unique permission from Alex               *|
|*        - this should be an example how to make RPG games      *|
|* and you can modify it by yourself but don't upload it without *|
|*                                          my approval !                                            *|
|*                                                                                                              *|
|*                                           cheers,    Alex                                          *|
|*                                                                                                              *|
\*******************************************************************/


var curWorld, text, itv
sizX=1; sizY=1
app.LoadScript( "Special.js" );

function OnStart() {
	app.SetOrientation( "Landscape" );
	app.SetScreenMode( "Game" );
	app.SetDebugEnabled( false );
	
	layMain= app.CreateLayout("Absolute" );
		scr= app.CreateScroller( 1,1 );
			lay= app.CreateLayout( "absolute" );	
				initTexture();
				initWorlds();
				initPlayer();
				initControls();
				initSBubble();
			scr.AddChild( lay );
		layMain.AddChild( scr );
}

function onKeys(ev) {
	player.Dir=this.Action;
	if( ev.action=="Down" && !sb.IsVisible() ) { this.SetBackColor( "#33ffffff" ); itv=setInterval(move,20) }
	if( ev.action=="Up" ) { this.SetBackColor( "#00ffffff" ); if(itv) clearInterval(itv) }
}

function move() {
	if( canMove(player.Dir) ) walk(player.Dir)
	else if(itv) clearInterval(itv)
}

function walk(dir) {
	var n=1, s=1/8, t=2
	for( var i=0; i<8*t; i++ ) {
		switch (dir) {
			case "Up": player.Y-=s/t; break;
			case "Down": player.Y+=s/t; break;
			case "Left": player.X-=s/t; break;
			case "Right": player.X+=s/t; break;
		}
		if(i>t) n=0;
		if(i>3*t) n=2;
		if(i>5*t) n=0;
		drawPlayer(n)
	}
}

function talk(n) {
	text=[];
	switch( n ) {
		case 1: text.push("This is a tree."); break;
		case 2: text.push("Something blocks the way");
			text.push("Looks like you can't move it")
		break;
		default: if( !ranInt(3) ) text.push("A gentle breeze blowing you around the hair...")
	}
	if(text && text.length) { kEnter.SetOnTouchDown(hidesb); Tell() }
}

function ckeckBorders() {
	var arr=curW.out[2];
	
	for( var i in  arr ) if( player.X==arr[i][0] && player.Y==arr[i][1] ) {
		player.X=arr[i][2];
		player.Y=arr[i][3];
		change(curW,curW.out[0],curW.out[1]);
	}
}

function change(oldW,newW,type,option) {
	layControls.SetTouchable( false );
	layMain.ChildToFront( sb );
	layMain.ChildToFront( layControls );
	nameText.SetText( newW.Name );
	nameBar.Animate( "SlideFromLeft",null,2000 );
	curW=newW;

	newW.SetPosition( -1,0 );
	newW.SetVisibility( "Show" );
	var t=5
	
	switch(type) {
		case "Fade":
			newW.Image.SetAlpha( 255 );
			newW.SetPosition(0,0);
			if(oldW) for( var i=0; i<256; i+=t ) oldW.Image.SetAlpha( i );
			drawPlayer();
			scr.ScrollTo( player.X/curW.W+0.5,player.Y/curW.H+0.5 );
			for( var i=255; i>0; i-=t ) newW.Image.SetAlpha( i );
		break;
		
		default:
			newW.SetPosition(0,0);
			newW.SetVisibility( "Show" );
			if(oldW) oldW.SetVisibility( "Hide" );
	}
	setTimeout(hideBar,1500);
	layControls.SetTouchable( true );
}
function hideBar() {
	nameBar.Animate( "SlideToLeft",null,2000 );
}


/******************************************************************\
\******************************************************************/

function canMove(dir) {
	var x=player.X, y=player.Y;
	switch( dir ) {
		case "Up": y--; break;
		case "Down": y++; break;
		case "Left": x--; break;
		case "Right": x++; break;
	}
	x=Math.round(x); y=Math.round(y)
	player.X=Math.round(player.X); player.Y=Math.round(player.Y)
	drawPlayer();
	
	if( x<0 || x>=curW.W || y<0 || y>=curW.H ) {ckeckBorders();return false}
	return (curW.Area[y][x]<=0);
}

function canTalk() {
	kEnter=this;
	var x=player.X, y=player.Y;
	switch( player.Dir ) {
		case "Up": y--; break;
		case "Down": y++; break;
		case "Left": x--; break;
		case "Right": x++; break;
	}
	x=Math.round(x); y=Math.round(y)
	if( x>=0 && x<curW.W && y>=0 && y<curW.H ) talk(curW.Area[y][x])
}

function drawPlayer(n) {
	var px,py,w,h,x,y
	py=["Up","Down","Left","Right"].indexOf(player.Dir)
	n?px=n:px=0;
	
	//w=player.W/3; h=player.H/4
	x=player.X; y=player.Y;
	player.Clear();
	//player.DrawSprite( playerSkin,px*w,py*h,w,h,player.X/curW.W,player.Y/curW.H,1/curW.W,1/curW.H)
	player.DrawImage( player.Image[py+''+px], player.X/curW.W,player.Y/curW.H,1/curW.W, 1/curW.H);
	player.Update();
}

function initTexture() {
	grass= app.CreateImage( "Img/Grass.png" );
	tree= app.CreateImage( "Img/Tree.png" );
//	skinPlayer= app.CreateImage( "Img/Player.png" );
}

function initPlayer() {
//	player= app.CreateGLView( 1, 1, "Fast2d" );
	player= app.CreateImage( null,sizX,sizY );
	player.Image=[];
	player.SetAutoUpdate( false );
	for( i=0; i<3; i++ ) for( j=0; j<4; j++ )
		player.Image[j+''+i] = app.CreateImage( "Img/P"+j+''+i+"-1.png" );
	player.Name= "Steve";
	player.X=11;
	player.Y=5;
//	player.W=97
//	player.H=128
	player.Dir="Down";
//	playerSkin= player.CreateImage( "Img/Player.png", drawPlayer );
  lay.AddChild( player );
}

function initWorlds() {
	world1= newWorld( "Forest U1", null,
	[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1],
	[1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1],
	[1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1]] );
	lay.AddChild( world1 );
	
	world2= newWorld( "Forest U2", null,
	[[1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1],
	[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
	[1,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,1],
	[1,0,0,1,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1,0,0,1],
	[1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]] );
	lay.AddChild( world2 );
	
	world1.out= [world2,"Fade",[[10,10,10,0],
	[11,10,11,0]]]
	world2.out= [world1,"Fade",[[10,0,10,10],
	[11,0,11,10]]]
	
	nameBar= app.CreateLayout( "Linear", "Horizontal" );
	nameBar.SetVisibility( "Hide" );
	nameBar.SetOrientation( "Landscape" );
	nameText= app.CreateText( "",0.7,0.1 );
	nameText.SetTextSize( 25 );
	nameBar.AddChild( nameText );
	nameBar.SetBackGradientRadial(0, 0, 0.7,"blue", "#00000000" );
	lay.AddChild( nameBar );
}

function initSBubble() {
	sb= app.CreateLayout( "Linear","FillXY,VCenter" );
	sb.SetPosition( 0,0.7 );
	sb.SetVisibility( "Hide" );
	sb.txt=app.CreateText( "",1,0.3,"multiline");
	sb.txt.SetTextColor( "black" );
	sb.txt.SetBackColor( "white" );
	sb.txt.SetTextSize( 20 );
	sb.AddChild( sb.txt );
	layMain.AddChild( sb );
}

function initControls() {
	layControls= app.CreateLayout( "linear","FillXY,HCenter" );
	layControls.SetTouchable( false );
	layControls.SetPosition( 0.7,0.4 );
	btnLeft= control("Left");
	btnRight= control("Right");
	btnUp= control("Up");
	btnDown= control("Down");
	btnEnter= control("[fa-dot-circle-o]");
	
	var layH= app.CreateLayout( "Linear", "Horizontal" );
	layH.AddChild( btnLeft );
	layH.AddChild( btnEnter );
	layH.AddChild( btnRight );
	
	layControls.AddChild( btnUp );
	layControls.AddChild( layH );
	layControls.AddChild( btnDown );
	
	layMain.AddChild( layControls );
}

function newWorld(name,img,arr) {
	//make world object
	var world= app.CreateLayout( "Absolute" );
	world.Area=arr;
	world.Name=name;
	world.H= arr.length
	world.W= arr[0].length
	world.Image= app.CreateImage( img, sizX,sizY);
	world.AddChild( world.Image );

	//draw objects with worlds array
	if(!img)
		var w=1/world.W, h=1/world.H;
		for( i in arr ) {
			for( j in arr[i] ) {
				world.Image.DrawImage( grass, j*w, i*h, w, h );
				switch(arr[i][j]) {
					case 1: world.Image.DrawImage( tree, j*w, i*h, w, h ); break;
				}
			}
		}
	world.SetVisibility( "Hide" );
	return world;
}