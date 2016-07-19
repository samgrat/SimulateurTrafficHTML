//variables :
	// 1 m = 10 px
	var WIDTH = 1010;            // OF SCREEN IN PIXELS
	var HEIGHT = 400;            // OF SCREEN IN PIXELS
	var BALLS = 3;               // IN SIMULATION
	var WALL = 5;                // FROM SIDE IN PIXELS
	var Colors = ["Blue","Orange","red","Brown",'Green']
	var DFM = 500;					// distance feu/mur
	//var WALL_FORCE = 400;        // ACCELERATION PER MOVE
	//var SPEED_LIMIT = 30;        // FOR ball VELOCITY
	var StartSPEED = 0;           // m  / s : vitesse de départ
	var ACCELERATION = 1.39;     // m / s²
	//var DECELERATION = 0;
	var BALL_RADIUS = 10;        // FOR ballS IN PIXELS
	var SPEED_LIMIT = 40;         // km / h
	//var OFFSET_START = 20;       // FROM WALL IN PIXELS
	//var FRAMES_PER_SEC = 40;     // SCREEN UPDATE RATE
	//var END = new Boolean(false);             // Fin de l'animation ?
	var FRICTION = 0.8;          // Coefficient cinétique de friction
	var MASS = 1500;             // Kg Poids du vehicule
	var flag = 0;                // critère d'arret
	var xzero = 0;                   // position de départ du véhicule
	// var DFA = new Boolean(false);// distance de freinage atteinte ?
	var FRouge = new Boolean(false);
	// var DAA = 0;
	var i = Array.apply(null, Array(BALLS)).map(function (_, i) {return i;}); //
	var j = 0 					// indice de la balle en mouvement

	console.log(i);

///////////////////////////////////////////////////////////////////////////////////////

function accelerate(){
	console.log("Véhicule ",j," acc")
	i[j].dfa = false
    if (i[j].speed + ACCELERATION*0.02 <= SPEED_LIMIT/3.6) {  // si le véhicule ne va pas dépasser la limite de vitesse (km/h vers m/s: /3.6)
		i[j].speed += ACCELERATION*0.02;}						// la boucle s'actualise toute les 20 ms d'où le *0.02
    else if (i[j].speed > SPEED_LIMIT/3.6){            		// si le véhicule a dépassé la vitesse limite il freine
		i[j].speed -= ACCELERATION*0.02;}						// ralentir
}// fin accelerate()

function decelerate(){
	console.log("Véhicule ",j," dec")
	if (i[j].speed >= 0){
		if (i[j].dfa == false){ 		//Pour n'affecter a Decceleration une valeur une seule fois
			i[j].decel = (i[j].speed*i[j].speed)/(2*i[j].daa);     // a = v²/2x
			i[j].dfa = true;
			i[j].speed -= i[j].decel*0.02;}
		else{
			if (i[j].speed > 0.2){
			i[j].speed -= i[j].decel*0.02;}
			else{i[j].speed = 0;}
			}
	}
}// fin decelerate()

function stop_it(){
    // arret de l'animation
	console.log("arrêt")
    flag =0;
}// fin stop_it()

function start_it(){
	var stage = new createjs.Stage("mon_canvas");
    // démarrage de l'animation

	for (k = 1; k <=i.length; k++){
		if (i[BALLS-k].end == true && flag == 0){
			
			createjs.Tween.get(i[BALLS-k]).to({ alpha: 1, x : xzero+k*(BALL_RADIUS*2+BALL_RADIUS/10) }, 1000, createjs.Ease.getPowInOut(2))
			i[BALLS-k].end = false}
	}
    if (flag == 0 || i[j].speed <= 0){       // pour ne lancer qu'une seule boucle
        flag =1;
		moveCircle();
		}
}//fin start_it()

function moveCircle(){
	if (i[j].end == false){
        if (FRouge == true && i[j].x < WIDTH-DFM){ // si le feu est rouge et que le vehicule ne l'a pas dépassé
            if(j != 0){
				if (i[j-1].x <= WIDTH-DFM){
					i[j].daa = (i[j-1].x -i[j].x - BALL_RADIUS*2)/10;
				} // La distance avant arret est celle du véhicule au véhicule de devant
				else {i[j].daa = (WIDTH-DFM - BALL_RADIUS-i[j].x)/10;}
			}
            else{ // si le véhicule est premier
				i[j].daa = (WIDTH-DFM - BALL_RADIUS-i[j].x)/10;
				} // La distance avant arret est celle du véhicule au feu
			}
        else if (j != 0){ //  si le véhicule n'est pas premier
			i[j].daa = (i[j-1].x -i[j].x - BALL_RADIUS*2)/10;} // La distance avant arret est celle du véhicule au véhicule de devant
        else{
			i[j].daa = (WIDTH-BALL_RADIUS-i[j].x)/10;} // La distance avant arret est celle du véhicule au mur

        if (i[j].speed != 0){     // si le demarrage ne se fait pas à vitesse nulle SPEED != 0

            console.log("Vitesse Vehicule",j+1," ", i[j].speed*3.6);

            //if Distance Avant Arret > distance de freinage + Distance de sécurité:
            if (i[j].daa > ((Math.pow(i[j].speed,2))/(2*FRICTION*9.81))+BALL_RADIUS/10 && i[j].dfa == false){ // DAA > Distance Freinage requise et DFA == false
				accelerate();} // Accélérer

            else if (i[j].daa <= ((Math.pow(i[j].speed,2))/(2*FRICTION*9.81))+BALL_RADIUS/10){ // sinon on freine
				decelerate();} // Décélérer

            else{ //si le feu repasse au vert
				accelerate();}
		}
        else{ accelerate();}

		if (i[j].speed <= 0){ // si la voiture a atteint le mur ou le feu et est arretée
            i[j].speed = StartSPEED; // Reinitialisation de la vitesse
            i[j].dfa = false;
            if (i[j].x >= WIDTH-BALL_RADIUS- j*(BALL_RADIUS*2 + BALL_RADIUS/10 ) - 100){ // si la voiture a atteint le mur
                i[j].end = true; //END = true
				console.log("///////////ENDED Véhicule ",j,"///////////");
                if (j == BALLS - 1){ // SI le dernier vehicule a atteint le mur
				stop_it();} // Mettre en pause
			}
		}
	}

	draw();
	change_circle();
}// fin de moveCircle

function draw(){
	var stage = new createjs.Stage("mon_canvas");

	createjs.Tween.get(i[j]).to({x: i[j].x+i[j].speed/5});
	
	if (flag >0){
		window.requestAnimationFrame(moveCircle);}
		
}// fin de draw()

function change_feu(){
	var stage = new createjs.Stage("mon_canvas");
	
	if (FRouge == false){
		
		feuRouge.graphics.clear().beginFill("red").drawCircle(WIDTH/2+ 10,HEIGHT/2-(BALL_RADIUS+39.5), 7.7).endFill();
		feuVert.graphics.clear().beginFill("white").drawCircle(WIDTH/2+ 10,HEIGHT/2-(BALL_RADIUS+21), 7.7).endFill();

		FRouge = true;}
    else{
		
		feuRouge.graphics.clear().beginFill("white").drawCircle(WIDTH/2+ 10,HEIGHT/2-(BALL_RADIUS+39.5), 7.7).endFill();
		feuVert.graphics.clear().beginFill("#30c375").drawCircle(WIDTH/2+ 10,HEIGHT/2-(BALL_RADIUS+21), 7.7).endFill();

		FRouge = false;
		if (i[j].end == false && i[j].x != xzero+j*(BALL_RADIUS*2+BALL_RADIUS/10)){ // si le vehicule n'est pas arreté au mur de fin
		start_it();}
		}
}// fin change_feu()

function change_limit(limit){
	SPEED_LIMIT = limit;
}// fin de change_limit()

function change_acc(acc){
	ACCELERATION = acc;
}// fin de change_acc

function change_circle(){
	if (j == BALLS - 1){ // Si on était en train de faire bouger le dernier véhicule
		j = 0;}   // On retourne au premier
    else{j += 1;} // Sinon on passe au suivant
}

function DoNothing(){
	//ne fait rien
	var Nothing = null;
}

function handleEvent(evt){
	var stage = new createjs.Stage("mon_canvas");
	
	if (evt.type == 'mouseover'){
		createjs.Tween.get(texte).to({x: i[evt.target.number].x, y:i[evt.target.number].y+30});
		texte.text = "Position: "+(i[evt.target.number].x/10).toFixed(2)+" m"+"\n"+"Vitesse: "+i[evt.target.number].speed.toFixed(2)+" km/h";
		}
	
	 if(evt.type == "mouseout"){
		 texte.text = ""
	 }
}

function init(){

	var stage = new createjs.Stage("mon_canvas");
	// Affichage mouseover
	stage.enableMouseOver();
	
	//var canvas = document.getElementById('mon_canvas');
    //var context = canvas.getContext('2d');

		//création des objets véhicules
	for (k = 1; k <=i.length; k++){

		var circle = new createjs.Shape();
		
		circle.graphics.beginFill(Colors[BALLS -k]).drawCircle(0, 0, BALL_RADIUS);
		circle.x = xzero+k*(BALL_RADIUS*2+BALL_RADIUS/10);
		circle.y = HEIGHT/2;
		circle.speed = StartSPEED;
		circle.end = new Boolean(false);
		circle.dfa = new Boolean(false);
		circle.daa = WIDTH-BALL_RADIUS;
		circle.decel = 0;
		
		circle.number = BALLS -k
		circle.on("mouseover", handleEvent);
		circle.on('mouseout', handleEvent);
		
		i[BALLS - k] = circle
		stage.addChild(circle)
		// Véhicule i = (x,y, speed, End: Move: Le véhicule a atteint le mur ?,
		// DFA: Move: Le véhicule a atteint la distance de freinage ?,
		// DAA: Distance avant que le vehicule doive s'arrêter, Vitesse de decelération)
	}
		// texte
	texte = new createjs.Text("", "black")
	
		// création route
	var route = new createjs.Shape();
	route.graphics.setStrokeStyle(3).beginStroke("grey");
	route.graphics.moveTo(0, HEIGHT/2-(BALL_RADIUS+3));		// Ligne du haut
	route.graphics.lineTo(WIDTH,HEIGHT/2-(BALL_RADIUS+3));

	route.graphics.moveTo(0, HEIGHT/2+(BALL_RADIUS+3));		// Ligne du bas
	route.graphics.lineTo(WIDTH,HEIGHT/2+(BALL_RADIUS+3));
	route.graphics.endStroke();

		// création feu
	var feu = new createjs.Shape();
	feu.graphics.beginFill('#4f4f4f');
	feu.graphics.drawRoundRect(WIDTH/2,HEIGHT/2-(BALL_RADIUS+50), 20, 40, Math.PI); // Rectangle du feu

	feu.graphics.setStrokeStyle(1).beginStroke('#969696');
	feu.graphics.drawCircle(WIDTH/2+ 10,HEIGHT/2-(BALL_RADIUS+39.5), 8) // Cercle feu rouge

	feu.graphics.setStrokeStyle(1).beginStroke('#969696');
	feu.graphics.drawCircle(WIDTH/2+ 10,HEIGHT/2-(BALL_RADIUS+21), 8) // Cercle feu vert
	feu.graphics.endStroke();
	
	feuRouge = new createjs.Shape();
	feuRouge.graphics.beginFill("white").drawCircle(WIDTH/2+ 10,HEIGHT/2-(BALL_RADIUS+39.5), 7.7); // Intérieur feu rouge
	
	feuVert = new createjs.Shape();
	feuVert.graphics.beginFill("#30c375").drawCircle(WIDTH/2+ 10,HEIGHT/2-(BALL_RADIUS+21), 7.7); // Intérieur feu vert
	
	
	stage.addChild(route, feu, feuRouge, feuVert, texte);

	console.log("///////////Init Ok///////////");
	
	createjs.Ticker.setFPS(80);
	createjs.Ticker.addEventListener("tick",stage);

	}// fin de init()