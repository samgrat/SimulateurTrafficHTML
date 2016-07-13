//variables :
	// 1 m = 10 px
	var WIDTH = 1010;            // OF SCREEN IN PIXELS
	var HEIGHT = 500;            // OF SCREEN IN PIXELS
	var BALLS = 1;               // IN SIMULATION
	var WALL = 5;                // FROM SIDE IN PIXELS
	//var WALL_FORCE = 400;        // ACCELERATION PER MOVE
	//var SPEED_LIMIT = 30;        // FOR ball VELOCITY
	var SPEED = 1;              // m  / s : vitesse de départ
	var StartSPEED = SPEED;
	var ACCELERATION = 1.39;     // m / s²
	var DECELERATION = 0;
	var BALL_RADIUS = 10;        // FOR ballS IN PIXELS
	var SPEED_LIMIT = 40;         // km / h
	//var OFFSET_START = 20;       // FROM WALL IN PIXELS
	//var FRAMES_PER_SEC = 40;     // SCREEN UPDATE RATE
	var END = new Boolean(false);             // Fin de l'animation ?
	var FRICTION = 0.8;          // Coefficient cinétique de friction
	var MASS = 1500;             // Kg Poids du vehicule
	var flag = 0;                // critère d'arret
	var x = 0;                   // position du véhicule
	var DFA = 0;                   // distance de freinage atteinte ?

	var i = [
		x+BALL_RADIUS*2,
		HEIGHT/2,
		BALL_RADIUS];

	console.log(i);

///////////////////////////////////////////////////////////////////////////////////////

function accelerate(){
    if (SPEED + ACCELERATION*0.02 <= SPEED_LIMIT/3.6) {  // si le véhicule ne va pas dépasser la limite de vitesse (km/h vers m/s: /3.6)
		SPEED += ACCELERATION*0.02;}						// la boucle s'actualise toute les 20 ms d'où le *0.02
    else if (SPEED > SPEED_LIMIT/3.6){            		// si le véhicule a dépassé la vitesse limite il freine
		SPEED -= ACCELERATION*0.02;}						// ralentir
}// fin accelerate()

function decelerate(){
    if (DFA == 0){ 		//Pour n'affecter a Decceleration une valeur une seule fois
        DECELERATION = (SPEED*SPEED)/(2*((WIDTH-BALL_RADIUS-x)/10));     // a = v²/2x
        DFA = 1;
		SPEED -= DECELERATION*0.02;}
    else{
		SPEED -= DECELERATION*0.02;}
}// fin decelerate()

function stop_it(){
    // arret de l'animation
    flag =0;
}// fin stop_it()

function start_it(){
    // démarrage de l'animation
    if (END == true){
        i[0] = 0;
		END = false}
    if (flag == 0){       // pour ne lancer qu'une seule boucle
        flag =1;
		window.requestAnimationFrame(moveCircle);
		}
}//fin start_it()

function moveCircle(){
    if (SPEED != 0){                // si le demarrage ne se fait pas à vitesse nulle

        //if    distance au mur      >      distance de freinage       + Distance de sécurité    :
        if ((WIDTH-BALL_RADIUS-i[0])/10 > ((Math.pow(SPEED,2)/(2*FRICTION*9.81))+BALL_RADIUS/10 && DFA == 0)){
			accelerate();} //accélérer
        else{
			decelerate();} //ralentir
	}
    else{
        console.log("Speed 1 ",SPEED);
		accelerate();}

    if (i[0]<WIDTH-BALL_RADIUS && SPEED > 0){ // si la voiture n'a pas atteint la fin et n'est pas arretée
		draw();
		//i[0]+=SPEED/5;
		}
    else{
        END = true;
        SPEED = StartSPEED;
        DFA= 0;
		console.log("///////////END = true///////////")
		stop_it();}

}// fin de moveCircle

function draw(){
	var canvas = document.getElementById('mon_canvas');
    var context = canvas.getContext('2d');

		// on efface le cercle
	context.clearRect(i[0]-i[2],i[1]-i[2],20,20);
	/*context.rect(i[0]-i[2],i[1]-i[2],20,20); 
	context.fillStyle = "white";
	context.fill();*/
	console.log(i);

	console.log("translating... ","x= ",i[0]);
	i[0]+=SPEED/5;

		// on le redessine
	context.beginPath();
	context.arc(i[0], HEIGHT/2, BALL_RADIUS, 0, Math.PI*2);
	context.fillStyle = "red";
	context.fill();
	context.closePath();
	console.log("x2= ",i[0]);

	if (flag >0){
		console.log("///////////requestAnimationFrame///////////")
		//setTimeout(moveCircle(), 20000);
		window.requestAnimationFrame(moveCircle);}
}// fin de draw()


function init(){

    var canvas = document.getElementById('mon_canvas');
    var context = canvas.getContext('2d');

		//cercle du vehicule
	context.beginPath();
	context.arc(i[0], i[1], i[2], 0, Math.PI*2);
	context.fillStyle = "red";
	context.fill();
	context.closePath();
	
		//route
	context.beginPath();
	context.moveTo(0, HEIGHT/2-(i[2]+3));
	context.lineTo(WIDTH,HEIGHT/2-(i[2]+3));
	context.stroke();
	context.closePath();
	
	context.beginPath();
	context.moveTo(0, HEIGHT/2+(i[2]+3));
	context.lineTo(WIDTH,HEIGHT/2+(i[2]+3));
	context.stroke();
	context.closePath();
	
	console.log("///////////Init Ok///////////")
	}// fin de init()