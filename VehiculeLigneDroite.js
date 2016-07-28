//variables :
	// 1 m = 10 px
	var WIDTH = 1010;            // OF SCREEN IN PIXELS
	var HEIGHT = 400;            // OF SCREEN IN PIXELS
	var BALLS = 3;               // IN SIMULATION
	var WALL = 5;                // FROM SIDE IN PIXELS
	var Colors = ["Blue","Orange","red","Brown",'Green']
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
	var xzero = 0;                   // position de départ du véhicule en x
	var yzero = 0;                   // position de départ du véhicule en y
	// var DFA = new Boolean(false);// distance de freinage atteinte ?
	// var DAA = 0;
	var test = 0;
	var i = new Array(4);
	for (var k = 0; k < 4; k++) {
		i[k] = new Array(1);}
	console.log('ok')
	var ind = [0,0,0,0]

	var FRouge = Array.apply(new Boolean(false), Array(3)).map(function (_, i) {return i;}); //
	var DFM = Array.apply(null, Array(4)).map(function (_, i) {return i;}); 	// distance feu/mur

	FRouge[1] = true;
	FRouge[3] = true;
	DFM[0] = WIDTH/2 -(2*BALL_RADIUS+6)
	DFM[1] = HEIGHT/2 -(2*BALL_RADIUS+5.8)
	DFM[2] = WIDTH/2 +(2*BALL_RADIUS+6)
	DFM[3] = HEIGHT/2 +(2*BALL_RADIUS+5.8)
	var j = 0 					// indice de la balle en mouvement
	var s = 0					// indice de la route de la balle en mouvement
	var time = 0
	var indice = 0

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
    if (flag == 0){       // pour ne lancer qu'une seule boucle
        flag = 1;
		console.log("spectaculaire")
		moveCircle();
		}
}//fin start_it()

function moveCircle(){
	
		console.log(i);
		console.log(i[s][j].y);
		
		if (i[s][j].end == false){  
			if(s == 0){MoveLeftToRight();}
			if(s == 1){MoveUpToDown();}
			if(s == 2){MoveRightToLeft();}
			if(s == 3){MoveDownToUp();}	}
		draw();
		newRandCircle();
		change_circle();
	
	// catch(err) {console.log("Véhicule[",s,"][",j,"] n'existe pas encore");
				// change_circle();
				// moveCircle();}

}// fin de moveCircle

function MoveLeftToRight(){
	if (FRouge[s] == true && i[s][j].x < DFM[s]){ // si le feu est rouge et que le vehicule ne l'a pas dépassé
		if(j != 0){
			if (i[s][j-1].x <= DFM[s]){
				i[s][j].daa = (i[s][j-1].x -i[s][j].x - BALL_RADIUS*2)/10;
			} // La distance avant arret est celle du véhicule au véhicule de devant
			else {i[s][j].daa = (DFM[s] - (BALL_RADIUS+i[s][j].x))/10;}
			}
		else{ // si le véhicule est premier
			i[s][j].daa = (DFM[s] - (BALL_RADIUS+i[s][j].x))/10;
		} // La distance avant arret est celle du véhicule au feu
	}
	else if (j != 0){ //  si le véhicule n'est pas premier
		i[s][j].daa = (i[s][j-1].x -i[s][j].x - BALL_RADIUS*2)/10;} // La distance avant arret est celle du véhicule au véhicule de devant
	else{
		i[s][j].daa = (WIDTH-BALL_RADIUS -i[s][j].x)/10;} // La distance avant arret est celle du véhicule au mur
	if (i[s][j].speed != 0){     // si le demarrage ne se fait pas à vitesse nulle SPEED != 0

		console.log("Vitesse Vehicule",j+1," ", i[s][j].speed*3.6);

		//if Distance Avant Arret > distance de freinage + Distance de sécurité:
		if (i[s][j].daa > ((Math.pow(i[s][j].speed,2))/(2*FRICTION*9.81))+BALL_RADIUS/10 && i[s][j].dfa == false){ // DAA > Distance Freinage requise et DFA == false
			accelerate();} // Accélérer

		else if (i[s][j].daa <= ((Math.pow(i[s][j].speed,2))/(2*FRICTION*9.81))+BALL_RADIUS/10){ // sinon on freine
			decelerate();} // Décélérer

		else{ //si le feu repasse au vert
			accelerate();}
	}
	else{ accelerate();}

	if (i[s][j].speed <= 0){ // si la voiture a atteint le mur ou le feu et est arretée
		i[s][j].speed = StartSPEED; // Reinitialisation de la vitesse
		i[s][j].dfa = false;
		if (i[s][j].x >= WIDTH-BALL_RADIUS- j*(BALL_RADIUS*2 + BALL_RADIUS/10 ) - 100){ // si la voiture a atteint le mur
			i[s][j].end = true; //END = true
			console.log("///////////ENDED Véhicule[",s,"][",j,"]///////////");
		}
	}
} // fin de MoveLeftToRight()

function MoveUpToDown(){
	if (FRouge[s] == true && i[s][j].y < DFM[s]){ // si le feu est rouge et que le vehicule ne l'a pas dépassé
		if(j != 0){
			if (i[s][j-1].y < DFM[s]){
				i[s][j].daa = (i[s][j-1].y - i[s][j].y -BALL_RADIUS*2)/10;
			} // La distance avant arret est celle du véhicule au véhicule de devant
			else {i[s][j].daa = DFM[s] -(BALL_RADIUS+i[s][j].y)/10;}
			}
		else{ // si le véhicule est premier
			i[s][j].daa = DFM[s] -(BALL_RADIUS+i[s][j].y)/10;
		} // La distance avant arret est celle du véhicule au feu
	}
	else if (j != 0){ //  si le véhicule n'est pas premier
		i[s][j].daa = (i[s][j-1].y - i[s][j].y  -BALL_RADIUS*2)/10;} // La distance avant arret est celle du véhicule au véhicule de devant
	else{
		i[s][j].daa = (HEIGHT - BALL_RADIUS - i[s][j].x)/10;} // La distance avant arret est celle du véhicule au mur
	if (i[s][j].speed != 0){     // si le demarrage ne se fait pas à vitesse nulle SPEED != 0

		console.log("Vitesse Vehicule[",s,"] ",j+1," ", i[s][j].speed*3.6);

		//if Distance Avant Arret > distance de freinage + Distance de sécurité:
		if (i[s][j].daa > ((Math.pow(i[s][j].speed,2))/(2*FRICTION*9.81))+BALL_RADIUS/10 && i[s][j].dfa == false){ // DAA > Distance Freinage requise et DFA == false
			accelerate();} // Accélérer

		else if (i[s][j].daa <= ((Math.pow(i[s][j].speed,2))/(2*FRICTION*9.81))+BALL_RADIUS/10){ // sinon on freine
			decelerate();} // Décélérer

		else{ //si le feu repasse au vert
			accelerate();}
	}
	else{ accelerate();}

	if (i[s][j].speed <= 0){ // si la voiture est arretée
		i[s][j].speed = StartSPEED; // Reinitialisation de la vitesse
		i[s][j].dfa = false;
		if (i[s][j].y >= HEIGHT - BALL_RADIUS - j*(BALL_RADIUS*2 + BALL_RADIUS/10 ) - 100){ // si la voiture a atteint le mur
			i[s][j].end = true; //END = true
			console.log("///////////ENDED Véhicule[",s,"][",j,"]///////////");
		}
	}
	
} // fin de MoveUpToDown()

function MoveRightToLeft(){
	if (FRouge[s] == true && i[s][j].x > DFM[s]){ // si le feu est rouge et que le vehicule ne l'a pas dépassé
		if(j != 0){
			if (i[s][j-1].x > DFM[s]){
				i[s][j].daa = (i[s][j].x - i[s][j-1].x - BALL_RADIUS*2)/10;
			} // La distance avant arret est celle du véhicule au véhicule de devant
			else {i[s][j].daa = (BALL_RADIUS+i[s][j].x)/10 - DFM[s];}
			}
		else{ // si le véhicule est premier
			i[s][j].daa = (BALL_RADIUS+i[s][j].x)/10 -DFM[s];
		} // La distance avant arret est celle du véhicule au feu
	}
	else if (j != 0){ //  si le véhicule n'est pas premier
		i[s][j].daa = (i[s][j].x- i[s][j-1].x  -BALL_RADIUS*2)/10;} // La distance avant arret est celle du véhicule au véhicule de devant
	else{
		i[s][j].daa = (BALL_RADIUS +i[s][j].x)/10;} // La distance avant arret est celle du véhicule au mur
	if (i[s][j].speed != 0){     // si le demarrage ne se fait pas à vitesse nulle SPEED != 0

		console.log("Vitesse Vehicule",j+1," ", i[s][j].speed*3.6);

		//if Distance Avant Arret > distance de freinage + Distance de sécurité:
		if (i[s][j].daa > ((Math.pow(i[s][j].speed,2))/(2*FRICTION*9.81))+BALL_RADIUS/10 && i[s][j].dfa == false){ // DAA > Distance Freinage requise et DFA == false
			accelerate();} // Accélérer

		else if (i[s][j].daa <= ((Math.pow(i[s][j].speed,2))/(2*FRICTION*9.81))+BALL_RADIUS/10){ // sinon on freine
			decelerate();} // Décélérer

		else{ //si le feu repasse au vert
			accelerate();}
	}
	else{ accelerate();}

	if (i[s][j].speed <= 0){ // si la voiture est arretée
		i[s][j].speed = StartSPEED; // Reinitialisation de la vitesse
		i[s][j].dfa = false;
		if (i[s][j].x <= BALL_RADIUS+ j*(BALL_RADIUS*2 + BALL_RADIUS/10 ) + 100){ // si la voiture a atteint le mur
			i[s][j].end = true; //END = true
			console.log("///////////ENDED Véhicule[",s,"][",j,"]///////////");
		}
	}
}// fin de MoveRightToLeft()

function MoveDownToUp(){
	if (FRouge[s] == true && i[s][j].y > DFM[s]){ // si le feu est rouge et que le vehicule ne l'a pas dépassé
		if(j != 0){
			if (i[s][j-1].y > DFM[s]){
				i[s][j].daa = (i[s][j].y - i[s][j-1].y -BALL_RADIUS*2)/10;
			} // La distance avant arret est celle du véhicule au véhicule de devant
			else {i[s][j].daa = (BALL_RADIUS+i[s][j].y)/10 - DFM[s];}
			}
		else{ // si le véhicule est premier
			i[s][j].daa = (BALL_RADIUS+i[s][j].y)/10 - DFM[s];
		} // La distance avant arret est celle du véhicule au feu
	}
	else if (j != 0){ //  si le véhicule n'est pas premier
		i[s][j].daa = (i[s][j].y - i[s][j-1].y -BALL_RADIUS*2)/10;} // La distance avant arret est celle du véhicule au véhicule de devant
	else{
		i[s][j].daa = (BALL_RADIUS + i[s][j].x)/10;} // La distance avant arret est celle du véhicule au mur
	if (i[s][j].speed != 0){     // si le demarrage ne se fait pas à vitesse nulle SPEED != 0

		console.log("Vitesse Vehicule[",s,"] ",j+1," ", i[s][j].speed*3.6);

		//if Distance Avant Arret > distance de freinage + Distance de sécurité:
		if (i[s][j].daa > ((Math.pow(i[s][j].speed,2))/(2*FRICTION*9.81))+BALL_RADIUS/10 && i[s][j].dfa == false){ // DAA > Distance Freinage requise et DFA == false
			accelerate();} // Accélérer

		else if (i[s][j].daa <= ((Math.pow(i[s][j].speed,2))/(2*FRICTION*9.81))+BALL_RADIUS/10){ // sinon on freine
			decelerate();} // Décélérer

		else{ //si le feu repasse au vert
			accelerate();}
	}
	else{ accelerate();}

	if (i[s][j].speed <= 0){ // si la voiture est arretée
		i[s][j].speed = StartSPEED; // Reinitialisation de la vitesse
		i[s][j].dfa = false;
		if (i[s][j].y <= BALL_RADIUS + j*(BALL_RADIUS*2 + BALL_RADIUS/10 ) + 100){ // si la voiture a atteint le mur
			i[s][j].end = true; //END = true
			console.log("///////////ENDED Véhicule[",s,"][",j,"]///////////");
		}
	}
} // fin de MoveDownToUp()

function draw(){
	var stage = new createjs.Stage("mon_canvas");

	if(s == 0){createjs.Tween.get(i[s][j]).to({x: i[s][j].x+i[s][j].speed/5});}
	if(s == 1){createjs.Tween.get(i[s][j]).to({y: i[s][j].y+i[s][j].speed/5});}
	if(s == 2){createjs.Tween.get(i[s][j]).to({x: i[s][j].x-i[s][j].speed/5});}
	if(s == 3){createjs.Tween.get(i[s][j]).to({y: i[s][j].y-i[s][j].speed/5});}	
	
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
	if (j == i[s].length - 1){ // Si on était en train de faire bouger le dernier véhicule de la route s
		j = 0;	 // On retourne au premier vehicule
		if (s == i.length - 1){ // Si on était à la derniere route 
			s = 0;}   // On retourne à la premiere route
		else{s++;} // Sinon on passe à la route suivante
	}
    else{j++;} // Sinon on passe au véhicule suivant
} // fin de change_circle()

function DoNothing(){
	//ne fait rien
	var Nothing = null;
}

function handleEvent(evt){
	var stage = new createjs.Stage("mon_canvas");
	
	if (evt.type == 'mouseover'){
		createjs.Tween.get(texte).to({x: i[evt.target.number].x, y:i[evt.target.number].y+30});
		texte.text = "Véhicule: "+(evt.target.number+1)+"\n"+"Position: ("+(i[evt.target.number].x/10).toFixed(2)+", "+(i[evt.target.number].y/10).toFixed(2)+") m"+"\n"+"Vitesse: "+i[evt.target.number].speed.toFixed(2)+" km/h";
		}
	
	 if(evt.type == "mouseout"){
		 texte.text = ""
	 }
}// fin de handleEvent()

function alerte(){
	var person = prompt("Entrer le nombre de véhicules souhaité: ", "3");
if (person > 0 && person < 6) {
    BALLS = person;
	init();
} else{
	alert("Veuillez rentrer un chiffre entre 1 et 5")
	alerte()}
} // fin de alerte()

function newRandCircle(){
	
	spot = Math.floor(Math.random() * 4); // on decide au hasard ou le prochain véhicule va apparaitre
	console.log("let me think...")
	if (time/100 === Math.trunc(time/100)){
		circle = new createjs.Shape();
		console.log('spot= ',spot)
		indice ++
		
		circle.graphics.beginFill(Colors[Math.floor(Math.random() * Colors.length)]).drawCircle(0, 0, BALL_RADIUS);
		circle.speed = StartSPEED;
		circle.end = new Boolean(false);
		circle.dfa = new Boolean(false);
		circle.decel = 0;
		
		circle.number = indice
		circle.spot = spot;
		circle.on("mouseover", handleEvent);
		circle.on('mouseout', handleEvent);
		
		if (spot == 0){ // gauche
			circle.x = xzero;
			circle.y = HEIGHT/2 +(BALL_RADIUS+3);
			circle.daa = WIDTH+BALL_RADIUS;
			
		}
		if (spot == 1){ // haut
			circle.x = WIDTH/2 -(BALL_RADIUS+3);
			circle.y = yzero;
			circle.daa = HEIGHT+BALL_RADIUS;
			
		}
		if (spot == 2){ // droite
			circle.x = WIDTH;
			circle.y = HEIGHT/2 -(BALL_RADIUS+3);
			circle.daa = WIDTH+BALL_RADIUS;
		}
		if (spot == 3){ // bas
			circle.x = WIDTH/2 +(BALL_RADIUS+3);
			circle.y = HEIGHT;
			circle.daa = WIDTH+BALL_RADIUS;
		}
		circle.ind = ind[spot];
		i[spot][circle.ind] = circle;
		stage.addChild(circle);
		ind[spot]++
		
		if (test == 0){s = spot}
		
		console.log(i[s][j]);
		console.log(i[s][j].y);
		
	}
	console.log(i[s][j]);
	time ++
} // fin de newRandCircle()

function init(){

	stage = new createjs.Stage("mon_canvas");
	// Affichage mouseover
	stage.enableMouseOver();
	
		// texte
	texte = new createjs.Text("", "black")
	
		// création route 
	var route = new createjs.Shape();
	var intersec = new createjs.Shape();
	
	route.graphics.setStrokeStyle(3).beginStroke("#4b4a4a");
	route.graphics.moveTo(0, HEIGHT/2-(2*BALL_RADIUS+6));		// Ligne du haut
	route.graphics.lineTo(WIDTH/2 -(2*BALL_RADIUS+6),HEIGHT/2-(2*BALL_RADIUS+7));
	route.graphics.endStroke();
	intersec.graphics.setStrokeDash([6]);
	intersec.graphics.setStrokeStyle(3).beginStroke("#a9a9a9");
	intersec.graphics.moveTo(WIDTH/2 -(2*BALL_RADIUS+6), HEIGHT/2-(2*BALL_RADIUS+6));		// Ligne du haut
	intersec.graphics.lineTo(WIDTH/2 +(2*BALL_RADIUS+6),HEIGHT/2-(2*BALL_RADIUS+7));
	intersec.graphics.endStroke();
	route.graphics.setStrokeStyle(3).beginStroke("#4b4a4a");
	route.graphics.moveTo(WIDTH/2 +(2*BALL_RADIUS+6), HEIGHT/2-(2*BALL_RADIUS+7));		// Ligne du haut
	route.graphics.lineTo(WIDTH,HEIGHT/2-(2*BALL_RADIUS+6));
	route.graphics.endStroke();
	
	route.graphics.setStrokeStyle(1).beginStroke("grey");
	route.graphics.moveTo(0, HEIGHT/2);		// Ligne du milieu
	route.graphics.lineTo(WIDTH,HEIGHT/2);
	route.graphics.endStroke();
	
	route.graphics.setStrokeStyle(3).beginStroke("#4b4a4a");
	route.graphics.moveTo(0, HEIGHT/2+(2*BALL_RADIUS+6));		// Ligne du bas
	route.graphics.lineTo(WIDTH/2 -(2*BALL_RADIUS+6),HEIGHT/2+(2*BALL_RADIUS+7));
	route.graphics.endStroke();
	intersec.graphics.setStrokeStyle(3).beginStroke("#a9a9a9");
	intersec.graphics.moveTo(WIDTH/2 -(2*BALL_RADIUS+6), HEIGHT/2+(2*BALL_RADIUS+6));		// Ligne du haut
	intersec.graphics.lineTo(WIDTH/2 +(2*BALL_RADIUS+6),HEIGHT/2+(2*BALL_RADIUS+7));
	intersec.graphics.endStroke();
	route.graphics.setStrokeStyle(3).beginStroke("#4b4a4a");
	route.graphics.moveTo(WIDTH/2 +(2*BALL_RADIUS+6), HEIGHT/2+(2*BALL_RADIUS+7));		// Ligne du bas
	route.graphics.lineTo(WIDTH,HEIGHT/2+(2*BALL_RADIUS+6));
	route.graphics.endStroke();
	

	route.graphics.setStrokeStyle(3).beginStroke("#4b4a4a");
	route.graphics.moveTo(WIDTH/2 -(2*BALL_RADIUS+6), 0);		// Ligne de gauche
	route.graphics.lineTo(WIDTH/2 -(2*BALL_RADIUS+6),HEIGHT/2 -(2*BALL_RADIUS+5.8));
	route.graphics.endStroke();
	intersec.graphics.setStrokeStyle(3).beginStroke("#a9a9a9");
	intersec.graphics.moveTo(WIDTH/2 -(2*BALL_RADIUS+6),HEIGHT/2 -(2*BALL_RADIUS+5.8));		// Ligne du haut
	intersec.graphics.lineTo(WIDTH/2 -(2*BALL_RADIUS+6),HEIGHT/2 +(2*BALL_RADIUS+5.8));
	intersec.graphics.endStroke();
	route.graphics.setStrokeStyle(3).beginStroke("#4b4a4a");
	route.graphics.moveTo(WIDTH/2 -(2*BALL_RADIUS+6),HEIGHT/2 +(2*BALL_RADIUS+5.8));		// Ligne de gauche
	route.graphics.lineTo(WIDTH/2 -(2*BALL_RADIUS+6),HEIGHT);
	route.graphics.endStroke();

	route.graphics.setStrokeStyle(1).beginStroke("grey");
	route.graphics.moveTo(WIDTH/2, 0);		// Ligne du milieu
	route.graphics.lineTo(WIDTH/2,HEIGHT);
	route.graphics.endStroke();
	
	route.graphics.setStrokeStyle(3).beginStroke("#4b4a4a");
	route.graphics.moveTo(WIDTH/2 +(2*BALL_RADIUS+6), 0);		// Ligne de droite
	route.graphics.lineTo(WIDTH/2 +(2*BALL_RADIUS+6),HEIGHT/2 -(2*BALL_RADIUS+5.8));
	route.graphics.endStroke();
	intersec.graphics.setStrokeStyle(3).beginStroke("#a9a9a9");
	intersec.graphics.moveTo(WIDTH/2 +(2*BALL_RADIUS+6),HEIGHT/2 -(2*BALL_RADIUS+5.8));		// Ligne du haut
	intersec.graphics.lineTo(WIDTH/2 +(2*BALL_RADIUS+6),HEIGHT/2 +(2*BALL_RADIUS+5.8));
	intersec.graphics.endStroke();
	route.graphics.setStrokeStyle(3).beginStroke("#4b4a4a");
	route.graphics.moveTo(WIDTH/2 +(2*BALL_RADIUS+6),HEIGHT/2 +(2*BALL_RADIUS+5.8));		// Ligne de droite
	route.graphics.lineTo(WIDTH/2 +(2*BALL_RADIUS+6),HEIGHT);
	route.graphics.endStroke();	

		// création feu1
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
	
	
	stage.addChild(route, intersec, feu, feuRouge, feuVert, texte);

	console.log("///////////Init Ok///////////");
	
	if(test ==0){
	newRandCircle();}
	test = 1
	
	console.log(i)
	
	createjs.Ticker.setFPS(100);
	createjs.Ticker.addEventListener("tick",stage);
	
	document.cookie = 'object =i';
	}// fin de init()