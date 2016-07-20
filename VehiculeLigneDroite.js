//variables :
	// 1 m = 10 px
	var WIDTH = 1110;            // OF SCREEN IN PIXELS
	var HEIGHT = 565;            // OF SCREEN IN PIXELS
	var BALLS = 3;               // IN SIMULATION
	var WALL = 5;                // FROM SIDE IN PIXELS
	var Colors = ["Blue","Orange","red","Brown",'Green']
	var radFeu = Math.PI;					// distance feu/mur
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
	var rzero = Math.PI/2;			// angle de départ du véhicule
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

    if (flag == 0 || i[j].speed <= 0){       // pour ne lancer qu'une seule boucle
        flag =1;
		moveCircle();
		}
}//fin start_it()

function moveCircle(){
        if (FRouge == false){ // si le feu est vert
            if(j == 0){ // si le véhicule est le véhicule d'indice 0
					i[j].daa = Math.abs(i[BALLS-1].rad) - Math.abs(i[j].rad) // la distance avant arrêt est la distance entre i[0] et i[BALLS-1]
					console.log("daa j == 0 feu vert: ", i[j].daa)
				}
				else {i[j].daa = Math.abs(i[j-1].rad) - Math.abs(i[j].rad) // la distance avant arrêt est la distance entre i[j] et i[j-1]
				console.log("daa j != 0 feu vert: ", i[j].daa)}
			}
        else{ // si le feu est rouge
			if(Math.sin(i[j].rad) <= 0){ // si le véhicule est dans la moitié inférieure du cercle
				if (j==0 && Math.abs(i[BALLS-1].rad) - Math.abs(i[j].rad) > Math.abs(radFeu) - Math.abs(i[j].rad)){
					i[j].daa = Math.abs(radFeu) - Math.abs(i[j].rad)
					console.log("daa j == 0 feu rouge super efficace: ", i[j].daa)
					} // La distance avant arret est celle du véhicule au feu
				else if (Math.abs(i[j-1].rad) - Math.abs(i[j].rad) > Math.abs(radFeu) - Math.abs(i[j].rad)){
					i[j].daa = Math.abs(radFeu) - Math.abs(i[j].rad)
					console.log("daa j != 0 feu rouge super efficace: ", i[j].daa)
					} // La distance avant arret est celle du véhicule au feu
				else{
					if(j==0){i[j].daa = Math.abs(i[BALLS-1].rad) - Math.abs(i[j].rad)
						console.log("daa j == 0 feu rouge raté: ", i[j].daa)}
					else{i[j].daa = Math.abs(i[j-1].rad) - Math.abs(i[j].rad)
						console.log("daa j != 0 feu rouge raté: ", i[j].daa)}
				}
			}
			else if(j==0){i[j].daa = Math.abs(i[BALLS-1].rad) - Math.abs(i[j].rad)
				console.log("daa j == 0 feu rouge seconde moitié: ", i[j].daa)}
			else{i[j].daa = Math.abs(i[j-1].rad) - Math.abs(i[j].rad)
				console.log("daa j != 0 feu rouge seconde moitié: ", i[j].daa)}
			}

        if (i[j].speed != 0){     // si le demarrage ne se fait pas à vitesse nulle SPEED != 0

            console.log("Vitesse Vehicule",j+1," ", i[j].speed*3.6);

            //if Distance Avant Arret > distance de freinage + Distance de sécurité:
            if (i[j].daa*100 > ((Math.pow(i[j].speed,2))/(2*FRICTION*9.81))+BALL_RADIUS/2 && i[j].dfa == false){ // DAA > Distance Freinage requise et DFA == false
				accelerate();} // Accélérer

            else if (i[j].daa*100 <= ((Math.pow(i[j].speed,2))/(2*FRICTION*9.81))+BALL_RADIUS/2){ // sinon on freine
				decelerate();} // Décélérer

            else{ //si le feu repasse au vert
				accelerate();}
		}
        else{ 
		console.log("balbambaplllalda,da");
		accelerate();}

		if (i[j].speed <= 0){ // si la voiture le feu et est arretée
            i[j].speed = StartSPEED; // Reinitialisation de la vitesse
            i[j].dfa = false;
		}

	draw();
	change_circle();
}// fin de moveCircle

function draw(){
	var stage = new createjs.Stage("mon_canvas");

	i[j].rad -=  i[j].speed/5000;
	createjs.Tween.get(i[j]).to({x: Math.cos(i[j].rad)*262 + WIDTH/2 -50, y: HEIGHT/2 - Math.sin(i[j].rad)*262});
	
	if (flag >0){
		window.requestAnimationFrame(moveCircle);}
		
}// fin de draw()

function change_feu(){
	var stage = new createjs.Stage("mon_canvas");
	
	if (FRouge == false){
		
		feuRouge.graphics.clear().beginFill("red").drawCircle(WIDTH/2- 340,HEIGHT/2-(BALL_RADIUS+39.5), 7.7).endFill();
		feuVert.graphics.clear().beginFill("white").drawCircle(WIDTH/2- 340,HEIGHT/2-(BALL_RADIUS+21), 7.7).endFill();

		FRouge = true;}
    else{
		
		feuRouge.graphics.clear().beginFill("white").drawCircle(WIDTH/2- 340,HEIGHT/2-(BALL_RADIUS+39.5), 7.7).endFill();
		feuVert.graphics.clear().beginFill("#30c375").drawCircle(WIDTH/2- 340,HEIGHT/2-(BALL_RADIUS+21), 7.7).endFill();

		FRouge = false;
		start_it();}
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

function handleEvent(evt){
	var stage = new createjs.Stage("mon_canvas");
	
	if (evt.type == 'mouseover'){
		createjs.Tween.get(texte).to({x: i[evt.target.number].x, y:i[evt.target.number].y+30});
		texte.text = "Véhicule: "+(evt.target.number+1)+"\n"+"Position: ("+(i[evt.target.number].x/10).toFixed(2)+" , "+(i[evt.target.number].y/10).toFixed(2)+ ") m"+"\n"+"Vitesse: "+i[evt.target.number].speed.toFixed(2)+" km/h";
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
		circle.rad = rzero -  (k-1)*(Math.PI/38)
		circle.x = Math.cos(circle.rad)*262 + WIDTH/2 -50
		circle.y = HEIGHT/2 - Math.sin(circle.rad)*262
		circle.speed = StartSPEED;
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
	route.graphics.drawCircle(WIDTH/2 -50, HEIGHT/2, 275)
	route.graphics.endStroke();
	
	route.graphics.setStrokeStyle(3).beginStroke("grey");
	route.graphics.drawCircle(WIDTH/2 -50, HEIGHT/2, 275 - (BALL_RADIUS*2+6))
	route.graphics.endStroke();

		// création feu
	var feu = new createjs.Shape();
	feu.graphics.beginFill('#4f4f4f');
	feu.graphics.drawRoundRect(WIDTH/2- 350,HEIGHT/2-(BALL_RADIUS+50), 20, 40, Math.PI); // Rectangle du feu

	feu.graphics.setStrokeStyle(1).beginStroke('#969696');
	feu.graphics.drawCircle(WIDTH/2- 340,HEIGHT/2-(BALL_RADIUS+39.5), 8) // Cercle feu rouge

	feu.graphics.setStrokeStyle(1).beginStroke('#969696');
	feu.graphics.drawCircle(WIDTH/2- 340,HEIGHT/2-(BALL_RADIUS+21), 8) // Cercle feu vert
	feu.graphics.endStroke();
	
	feuRouge = new createjs.Shape();
	feuRouge.graphics.beginFill("white").drawCircle(WIDTH/2- 340,HEIGHT/2-(BALL_RADIUS+39.5), 7.7); // Intérieur feu rouge
	
	feuVert = new createjs.Shape();
	feuVert.graphics.beginFill("#30c375").drawCircle(WIDTH/2- 340,HEIGHT/2-(BALL_RADIUS+21), 7.7); // Intérieur feu vert
	
	
	stage.addChild(route, feu, feuRouge, feuVert, texte);

	console.log("///////////Init Ok///////////");
	
	createjs.Ticker.setFPS(80);
	createjs.Ticker.addEventListener("tick",stage);

	}// fin de init()