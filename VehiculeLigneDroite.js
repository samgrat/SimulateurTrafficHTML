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
	var x = 0;                   // position de départ du véhicule
	// var DFA = new Boolean(false);// distance de freinage atteinte ?
	var FRouge = new Boolean(false);
	// var DAA = 0;
	var i = Array.apply(null, Array(BALLS)).map(function (_, i) {return i;}); //
	var j = 0 					// indice de la balle en mouvement

	console.log(i);

///////////////////////////////////////////////////////////////////////////////////////

function accelerate(){
	console.log("Véhicule ",j," acc")
	i[j][4] = false
    if (i[j][2] + ACCELERATION*0.02 <= SPEED_LIMIT/3.6) {  // si le véhicule ne va pas dépasser la limite de vitesse (km/h vers m/s: /3.6)
		i[j][2] += ACCELERATION*0.02;}						// la boucle s'actualise toute les 20 ms d'où le *0.02
    else if (i[j][2] > SPEED_LIMIT/3.6){            		// si le véhicule a dépassé la vitesse limite il freine
		i[j][2] -= ACCELERATION*0.02;}						// ralentir
}// fin accelerate()

function decelerate(){
	console.log("Véhicule ",j," dec")
	if (i[j][2] >= 0){
		if (i[j][4] == false){ 		//Pour n'affecter a Decceleration une valeur une seule fois
			i[j][6] = (i[j][2]*i[j][2])/(2*i[j][5]);     // a = v²/2x
			i[j][4] = true;
			i[j][2] -= i[j][6]*0.02;}
		else{
			i[j][2] -= i[j][6]*0.02;}
	}
}// fin decelerate()

function stop_it(){
    // arret de l'animation
	console.log("arrêt")
    flag =0;
}// fin stop_it()

function start_it(){
	var canvas = document.getElementById('mon_canvas');
    var context = canvas.getContext('2d');
    // démarrage de l'animation
	
	for (k = 1; k <=i.length; k++){
		if (i[BALLS-k][3] == true && flag == 0){
			context.rect(i[BALLS-k][0]-BALL_RADIUS,i[BALLS-k][1]-BALL_RADIUS,25,20);
			context.fillStyle = "white";
			context.fill();

			i[BALLS-k][0] = x+k*(BALL_RADIUS*2+BALL_RADIUS/10);
			i[BALLS-k][3] = false}
	}
    if (flag == 0 || i[j][2] <= 0){       // pour ne lancer qu'une seule boucle
        flag =1;
		moveCircle();
		}
}//fin start_it()

function moveCircle(){
	if (i[j][3] == false){
        if (FRouge == true && i[j][0] < WIDTH-DFM){ // si le feu est rouge et que le vehicule ne l'a pas dépassé
            if(j != 0){	
				if (i[j-1][0] <= WIDTH-DFM){
					i[j][5] = (i[j-1][0] -i[j][0] - BALL_RADIUS*2)/10;
				} // La distance avant arret est celle du véhicule au véhicule de devant
				else {i[j][5] = (WIDTH-DFM - BALL_RADIUS-i[j][0])/10;}
			}
            else{ // si le véhicule est premier
				i[j][5] = (WIDTH-DFM - BALL_RADIUS-i[j][0])/10;
				} // La distance avant arret est celle du véhicule au feu
			}
        else if (j != 0){ //  si le véhicule n'est pas premier
			i[j][5] = (i[j-1][0] -i[j][0] - BALL_RADIUS*2)/10;} // La distance avant arret est celle du véhicule au véhicule de devant
        else{
			i[j][5] = (WIDTH-BALL_RADIUS-i[j][0])/10;} // La distance avant arret est celle du véhicule au mur

        if (i[j][2] != 0){     // si le demarrage ne se fait pas à vitesse nulle SPEED != 0

            console.log("Vitesse Vehicule",j+1," ", i[j][2]*3.6);

            //if Distance Avant Arret > distance de freinage + Distance de sécurité:
            if (i[j][5] > ((Math.pow(i[j][2],2))/(2*FRICTION*9.81))+BALL_RADIUS/10 && i[j][4] == false){ // DAA > Distance Freinage requise et DFA == false
				accelerate();} // Accélérer

            else if (i[j][5] <= ((Math.pow(i[j][2],2))/(2*FRICTION*9.81))+BALL_RADIUS/10){ // sinon on freine
				decelerate();} // Décélérer

            else{ //si le feu repasse au vert
				accelerate();}
		}
        else{ accelerate();}
			
			// i[j][0]+=i[j][2]/5;
			// Position = SPEED/5 (On bouge le véhicule en fonction de sa vitesse calculée plus haut)
		if (i[j][2] <= 0){ // si la voiture a atteint le mur ou le feu et est arretée
            i[j][2] = StartSPEED; // Reinitialisation de la vitesse
            i[j][4] = false;
            if (i[j][0] >= WIDTH-BALL_RADIUS- j*(BALL_RADIUS*2 + BALL_RADIUS/10 ) - 100){ // si la voiture a atteint le mur
                i[j][3] = true; //END = true
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
	console.log("draw() j = ",j)
	var canvas = document.getElementById('mon_canvas');
    var context = canvas.getContext('2d');

		// on efface le cercle
	//context.clearRect(i[j][0]-BALL_RADIUS+5,i[j][0]-BALL_RADIUS,25,20);
	context.rect(i[j][0]-BALL_RADIUS,i[j][1]-BALL_RADIUS,25,20);
	context.fillStyle = "white";
	context.fill();

	
	console.log(i);
	i[j][0]+=i[j][2]/5;

		// on le redessine
	context.beginPath();
	context.arc(i[j][0], HEIGHT/2, BALL_RADIUS, 0, Math.PI*2);
	context.fillStyle = Colors[j];
	context.fill();
	context.closePath();

	if (flag >0){
		window.requestAnimationFrame(moveCircle);}
}// fin de draw()

function change_feu(){
	var canvas = document.getElementById('mon_canvas');
    var context = canvas.getContext('2d');
	if (FRouge == false){

		/*context.beginPath();
		context.arc(WIDTH-DFM, HEIGHT/2-(BALL_RADIUS+20), 10, 0, Math.PI*2);
		context.fillStyle = Colors[j];
		context.fill();
		context.closePath();
		 A DEBUG */

        context.beginPath();
		context.moveTo(WIDTH-DFM, HEIGHT/2-(BALL_RADIUS+10));
		context.lineTo(WIDTH-DFM,HEIGHT/2-(BALL_RADIUS+30));
		context.lineWidth = 20;
		context.strokeStyle = "red";
		context.stroke();
		context.closePath();

		FRouge = true;}
    else{

        /*context.beginPath();
		context.arc(WIDTH-DFM, HEIGHT/2-(BALL_RADIUS+20), 10, 0, Math.PI*2);
		context.fillStyle = "green";
		context.fill();
		context.closePath();
		 A DEBUG */

		context.beginPath();
		context.moveTo(WIDTH-DFM, HEIGHT/2-(BALL_RADIUS+10));
		context.lineTo(WIDTH-DFM,HEIGHT/2-(BALL_RADIUS+30));
		context.lineWidth = 20;
		context.strokeStyle = 'green';
		context.stroke();
		context.closePath();

		FRouge = false;}
    if (i[j][3] == false){ // si le vehicule n'est pas arreté au mur de fin
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

function DoNothing(){
	//ne fait rien
	var Nothing = null;
}

function init(){

    var canvas = document.getElementById('mon_canvas');
    var context = canvas.getContext('2d');
	
	alert

		//création des objets véhicules
	for (k = 1; k <=i.length; k++){
	//                 [             X                    ,   Y     , Vitesse  ,END  , DFA ,       DAA       ,décel]
		i[BALLS - k] = [x+k*(BALL_RADIUS*2+BALL_RADIUS/10),HEIGHT/2 ,StartSPEED,false,false,WIDTH-BALL_RADIUS,0]
		// Véhicule i = (x,y, speed, End: Move: Le véhicule a atteint le mur ?,
		// DFA: Move: Le véhicule a atteint la distance de freinage ?,
		// DAA: Distance avant que le vehicule doive s'arrêter, Vitesse de decelération)
	

		//cercle du vehicule
	context.beginPath();
	context.arc(i[BALLS -k][0], i[BALLS -k][1], BALL_RADIUS, 0, Math.PI*2);
	context.fillStyle = Colors[BALLS-k];
	context.fill();
	context.closePath();
	}

		//route
	context.beginPath();
	context.moveTo(0, HEIGHT/2-(BALL_RADIUS+3));
	context.lineTo(WIDTH,HEIGHT/2-(BALL_RADIUS+3));
	context.stroke();
	context.closePath();

	context.beginPath();
	context.moveTo(0, HEIGHT/2+(BALL_RADIUS+3));
	context.lineTo(WIDTH,HEIGHT/2+(BALL_RADIUS+3));
	context.stroke();
	context.closePath();

		//feu

	/*context.beginPath();
	context.arc(WIDTH-DFM, HEIGHT/2-(BALL_RADIUS+20), 10, 0, Math.PI*2);
	context.fillStyle = "green";
	context.fill();
	context.closePath();
	 A DEBUG */

	context.beginPath();
	context.moveTo(WIDTH-DFM, HEIGHT/2-(BALL_RADIUS+10));
	context.lineTo(WIDTH-DFM, HEIGHT/2-(BALL_RADIUS+30));
	context.lineWidth = 20;
	context.strokeStyle = 'green';
	context.stroke();
	context.closePath();

	console.log("///////////Init Ok///////////");
	}// fin de init()