//variables :
	// 1 m = 10 px
	var WIDTH = 1010;            // OF SCREEN IN PIXELS
	var HEIGHT = 400;            // OF SCREEN IN PIXELS
	var BALLS = 1;               // IN SIMULATION
	var WALL = 5;                // FROM SIDE IN PIXELS
	var Colors = ["Blue","Orange","Yellow","Brown",'Green']
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
	i[j][4] = false
    if (i[j][2] + ACCELERATION*0.02 <= SPEED_LIMIT/3.6) {  // si le véhicule ne va pas dépasser la limite de vitesse (km/h vers m/s: /3.6)
		i[j][2] += ACCELERATION*0.02;}						// la boucle s'actualise toute les 20 ms d'où le *0.02
    else if (i[j][2] > SPEED_LIMIT/3.6){            		// si le véhicule a dépassé la vitesse limite il freine
		i[j][2] -= ACCELERATION*0.02;}						// ralentir
}// fin accelerate()

function decelerate(){
    if (i[j][4] == false){ 		//Pour n'affecter a Decceleration une valeur une seule fois
        i[j][6] = (i[j][2]*i[j][2])/(2*i[j][5]);     // a = v²/2x
        i[j][4] = true;
		i[j][2] -= i[j][6]*0.02;}
    else{
		i[j][2] -= i[j][6]*0.02;}
}// fin decelerate()

function stop_it(){
    // arret de l'animation
    flag =0;
}// fin stop_it()

function start_it(){
	var canvas = document.getElementById('mon_canvas');
    var context = canvas.getContext('2d');
    // démarrage de l'animation
	
    if (i[j][3] == true){
		context.rect(i[j][0]-BALL_RADIUS,i[j][1]-BALL_RADIUS,25,20); 
		context.fillStyle = "white";
		context.fill();
		
		i[j][0] = 0;
		i[j][3] = false}
    if (flag == 0){       // pour ne lancer qu'une seule boucle
		console.log("blalalalala");
        flag =1;
		moveCircle();
		}
}//fin start_it()

function moveCircle(){
    if (i[j][2] != 0){                // si le demarrage ne se fait pas à vitesse nulle

        if (FRouge == true && i[j][0] < WIDTH-DFM){ // si le feu est rouge et que le vehicule ne l'a pas dépassé
			i[j][5] = (WIDTH-DFM - BALL_RADIUS-i[j][0])/10;} // La distance avant arret est celle du véhicule au feu
        else{
			i[j][5] = (WIDTH-BALL_RADIUS-i[j][0])/10;} // La distance avant arret est celle du véhicule au mur

        //if Distance Avant Arret > distance de freinage + Distance de sécurité:
        if (i[j][5] > ((Math.pow(i[j][2],2))/(2*FRICTION*9.81))+BALL_RADIUS/10 && i[j][4] == false){
			accelerate();}
        else if (i[j][5] <= ((Math.pow(i[j][2],2))/(2*FRICTION*9.81))+BALL_RADIUS/10){ // sinon on freine
			decelerate();}
        else{ //si le feu repasse au vert
			accelerate();}
	}
    else{
		accelerate();}
	console.log("Speed",i[j][2]*3.60);
			
    if (i[j][5]>0 && i[j][2] > 0){ // si la voiture n'a pas atteint la fin et n'est pas arretée
		draw();
		//i[j][0]+=i[j][2]/5;
		}
    else{
		if (i[j][5] == (WIDTH-BALL_RADIUS-i[j][0])/10){
			i[j][3] = true;
			console.log("///////////RESTART///////////"); // RENDRE CA PLUS JOLI
			flag = 0;
			start_it();}
        i[j][2] = StartSPEED;
		i[j][4]= false;}

}// fin de moveCircle

function draw(){
	var canvas = document.getElementById('mon_canvas');
    var context = canvas.getContext('2d');

		// on efface le cercle
	//context.clearRect(i[j][0]-BALL_RADIUS+5,i[j][1]-BALL_RADIUS,25,20);
	context.rect(i[j][0]-BALL_RADIUS,i[j][1]-BALL_RADIUS,25,20); 
	context.fillStyle = "white";
	context.fill();
	
	console.log(i);
	i[j][0]+=i[j][2]/5;

		// on le redessine
	context.beginPath();
	context.arc(i[j][0], HEIGHT/2, BALL_RADIUS, 0, Math.PI*2);
	context.fillStyle = "red";
	context.fill();
	context.closePath();

	if (flag >0){
		//setTimeout(moveCircle(), 20000);
		window.requestAnimationFrame(moveCircle);}
}// fin de draw()

function change_feu(){
	var canvas = document.getElementById('mon_canvas');
    var context = canvas.getContext('2d');
	
	if (FRouge == false){
		
		/*context.beginPath();
		context.arc(WIDTH-DFM, HEIGHT/2-(BALL_RADIUS+20), 10, 0, Math.PI*2);
		context.fillStyle = "red";
		context.fill();
		context.closePath();
		 A DEBUG */
	
        context.beginPath();
		context.moveTo(WIDTH-DFM, HEIGHT/2-(BALL_RADIUS+10));
		context.lineTo(WIDTH-DFM,HEIGHT/2-(BALL_RADIUS+30));
		context.lineWidth = 20;
		context.strokeStyle = 'red';
		context.stroke();
		context.closePath();
		
		FRouge = true;
		console.log('Feu rouge');}
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
		
		FRouge = false;
		console.log('Feu vert');}
    if (i[j][3] == false){ // si le vehicule n'est pas arreté au mur de fin
		start_it();}
}// fin change_feu()

function change_limit(limit){
	SPEED_LIMIT = limit;
	console.log('Limite de vitesse = ', SPEED_LIMIT);
}// fin de change_limit()

function change_acc(acc){
	ACCELERATION = acc;
	console.log('accélération véhicule = ', ACCELERATION);
}// fin de change_acc

function init(){

    var canvas = document.getElementById('mon_canvas');
    var context = canvas.getContext('2d');
	
		//création des objets véhicules
	for (k = 0; k <i.length; k++){ 
	//                       [             X                    ,   Y     , Vitesse  ,END  , DFA ,       DAA       ,décel]
		i[BALLS-1 - k] = [0+k*(BALL_RADIUS*2+BALL_RADIUS/10),HEIGHT/2 ,StartSPEED,false,false,WIDTH-BALL_RADIUS,0]
		// Véhicule i = (x,y, speed, End: Move: Le véhicule a atteint le mur ?,
		// DFA: Move: Le véhicule a atteint la distance de freinage ?,
		// DAA: Distance avant que le vehicule doive s'arrêter, Vitesse de decelération)
	}
	
		//cercle du vehicule
	context.beginPath();
	context.arc(i[j][0], i[j][1], BALL_RADIUS, 0, Math.PI*2);
	context.fillStyle = "red";
	context.fill();
	context.closePath();
	
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