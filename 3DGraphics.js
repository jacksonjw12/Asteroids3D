
function Camera(pos,rot,fov){

	this.gotHit = false;
	this.gotHitPunish = 0;
	this.fireBullet = false;
	this.position = new point3d(-10,-40,20);
	this.rotation = new point3d(Math.PI/2-.2,0,0)
	this.fov = Math.PI/2;
	this.stepsSinceBullet = 10;
	this.vel = new point3d(0,0,0);
	if(pos != undefined){
		this.position = pos;
		this.rotation = rot;
		this.fov = fov;
	}
	this.forward = function(){
		return new point3d(-Math.cos(Math.PI/2-this.rotation.z)*Math.sin(this.rotation.x),Math.sin(Math.PI/2-this.rotation.z)*Math.sin(this.rotation.x),Math.sin(-Math.PI/2+this.rotation.x));
		
	}
	this.left = function(){
		return new point3d(-Math.cos(-this.rotation.z)*Math.sin(this.rotation.x),Math.sin(-this.rotation.z)*Math.sin(this.rotation.x),0);

	}
	this.up = function(){
		return new point3d(-Math.cos(Math.PI/2-this.rotation.z)*Math.sin(this.rotation.x+Math.PI/2),Math.sin(Math.PI/2-this.rotation.z)*Math.sin(this.rotation.x+Math.PI/2),Math.sin(this.rotation.x));

	}
	

	this.vel = new point3d(0,0,0);

}


function Keyboard(){
	this.keysDown = [];
	var keys = this.keysDown
	this.prevTime = new Date();
	document.addEventListener('keydown', function(event){
	
		var keyChar = String.fromCharCode(event.keyCode);
		if(keys.indexOf(keyChar) == -1){
			
			keys.push(keyChar);
		}


		});

	document.addEventListener('keyup', function(event){
		
		var keyChar = String.fromCharCode(event.keyCode);
		
		if(keys.indexOf(keyChar) > -1){

			keys.splice(keys.indexOf(keyChar),1);
		}


	})
	
	this.vel = new point3d(0,0,0)
	this.rotVel = new point3d(0,0,0)
	this.rotWay = 1;
	this.doMovement = function(camera){
		var dC = new Date();
		var dt = dC-this.prevTime

		var rotSp = .05
		var movement = new point3d(0,0,0)
		if(this.keysDown.indexOf("Q") > -1){
			//camera.position.z+=10;
			movement.z++;

		}
		if(this.keysDown.indexOf("E") > -1){
			//camera.position.z-=10;
			movement.z--;

		}

		if(this.keysDown.indexOf("W") > -1){
			//camera.position.y+=10;
			movement.y++;

		}

		if(this.keysDown.indexOf("S") > -1){
			//camera.position.y-=10;
			movement.y--;
		}
		if(this.keysDown.indexOf("A") > -1){
			//camera.position.x+=10;
			movement.x++;
		}
		if(this.keysDown.indexOf("D") > -1){
			//camera.position.x-=10;
			movement.x--;
		}
		var prevRot = camera.rotation.copyScale(1);
		if(this.keysDown.indexOf("&") > -1){
			camera.rotation.x+=.05*rotSp;
			
		}
		if(this.keysDown.indexOf("(") > -1){
			camera.rotation.x-=.05*rotSp;
			
		}
		if(this.keysDown.indexOf("%") > -1){
			camera.rotation.z-=.05*rotSp * this.rotWay;
			
		}
		if(this.keysDown.indexOf("'") > -1){
			camera.rotation.z+=.05*rotSp * this.rotWay;
			
		}
		if(this.keysDown.indexOf(" ") > -1 && camera.stepsSinceBullet > 10){
			camera.fireBullet = true;
		}
		this.rotVel.add( camera.rotation.vectorTo(prevRot));

		//console.log(this.keysDown)

		movement.normalize();
		var speed = -.8

		var forward = camera.forward();
		var left = camera.left();
		var up = camera.up();

		var deltaf = forward//.scale(movement.x)
		deltaf.scale(speed*-movement.y/5)
		camera.position.add(deltaf);
		var deltal = left
		deltal.scale(speed*movement.x/10)
		camera.position.add(deltal)
		var deltau = up
		deltau.scale(speed*-movement.z/10)
		camera.position.add(deltau)
		deltaf.add(deltau)
		deltaf.add(deltal)
		deltaf.scale(1/10)
		var moveSpeed = 4;
		this.vel.add( deltaf )
		//console.log(this.vel)
		// this.vel.scale(1/deltaf.magnitude())
		camera.rotation = prevRot;
		//console.log(dt)
		camera.position.add(this.vel.copyScale(dt/30*moveSpeed))
		camera.vel =this.vel.copyScale(1000/30*moveSpeed)
		this.vel.scale(9.9/10)
		this.rotVel.cap(.04);
		camera.rotation.add(this.rotVel.copyScale(dt/30))
		this.rotVel.scale(9.9/10)
		this.prevTime = dC

		if(camera.rotation.x > Math.PI){
			this.rotWay = -1;
			camera.rotation.x = -Math.PI

		}
		if(camera.rotation.x > 0 && this.rotWay == -1){
			this.rotWay = 1;
			
		}

	}




}





function point2d(x,y){
	this.x = x;
	this.y = y;
}

function point3d(x,y,z){
	this.x = x;
	this.y = y;
	this.z = z;
	this.latestProject;
	this.project = function(camera){
		projectX = Math.cos(camera.rotation.y) * (Math.sin(camera.rotation.z) * (this.y - camera.position.y) + Math.cos(camera.rotation.z) * (this.x - camera.position.x)) - Math.sin(camera.rotation.y) * (this.z - camera.position.z);
		projectY = Math.sin(camera.rotation.x) * (Math.cos(camera.rotation.y) * (this.z - camera.position.z) + Math.sin(camera.rotation.y) * (Math.sin(camera.rotation.z) * (this.y - camera.position.y) + Math.cos(camera.rotation.z) * (this.x - camera.position.x))) + Math.cos(camera.rotation.x) * (Math.cos(camera.rotation.z) * (this.y - camera.position.y) - Math.sin(camera.rotation.z) * (this.x - camera.position.x)) ;
		projectZ = Math.cos(camera.rotation.x) * (Math.cos(camera.rotation.y) * (this.z - camera.position.z) + Math.sin(camera.rotation.y) * (Math.sin(camera.rotation.z) * (this.y - camera.position.y) + Math.cos(camera.rotation.z) * (this.x - camera.position.x))) - Math.sin(camera.rotation.x) * (Math.cos(camera.rotation.z) * (this.y - camera.position.y) - Math.sin(camera.rotation.z) * (this.x - camera.position.x));
		var ez = 1 / Math.tan(camera.fov / 2);
		var screenX = (projectX ) * (ez / projectZ) ;
		var screenY = -(projectY) * (ez / projectZ);
		screenX *= canvas.height;
		screenY *= -canvas.height;
		screenX += canvas.width/2
		screenY += canvas.height/2

		if(projectZ > 0 ){
			this.latestProject = new point3d(-100,-100,-100)
		}
		else{
			this.latestProject = new point3d(screenX,screenY,projectZ)
		}
		return this.latestProject;
		
	}

	this.difference = function(otherPoint){
		var dx = this.x-otherPoint.x;
		var dy = this.y-otherPoint.y;
		var dz = this.z-otherPoint.z;

		var p = new point3d(dx,dy,dz);
		return p.magnitude();

	}
	this.vectorTo = function(otherPoint){
		var dx = this.x-otherPoint.x;
		var dy = this.y-otherPoint.y;
		var dz = this.z-otherPoint.z;

		var p = new point3d(dx,dy,dz);
		return p;
	}

	this.magnitude = function(){
		return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)
	}

	this.normalize = function(){
		var magnitude = Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
		if(magnitude != 0){
			this.x = this.x/magnitude;
			this.y = this.y/magnitude;
			this.z = this.z/magnitude;
		}
		

	}
	this.cap = function(num){
		if(this.x > num){
			this.x = num;
		}if(this.y > num){
			this.y = num;
		}if(this.z > num){
			this.z = num;
		}
		if(this.x < -num){
			this.x = -num;
		}if(this.y < -num){
			this.y = -num;
		}if(this.z < -num){
			this.z = -num;
		}
	}
	this.add = function(otherpoint){
		this.x += otherpoint.x;
		this.y += otherpoint.y;
		this.z += otherpoint.z;
	}
	this.times = function(otherpoint){//dot product
		return new point3d(this.x*otherpoint.x,this.y*otherpoint.y,this.z*otherpoint.z)
	}

	this.scale = function(scalar){
		this.x *=scalar;
		this.y *=scalar;
		this.z *=scalar;
	}
	this.copyScale = function(scalar){
		var x_ = this.x* scalar;
		var y_ = this.y* scalar;
		var z_ = this.z* scalar;
		return new point3d(x_,y_,z_);
	}

}


function Model(faces, points,centerPoint,isBullet=false){
	this.faces = faces;
	this.points = points;
	this.center = new point3d(0,0,0)
	this.rotation = new point3d(0,0,0)
	this.velocity = new point3d(0,0,0)
	this.stepsToExpire = -1;//live forever!
	this.isBullet = isBullet
	this.hits = 0;
	this.xRange = [0,0];
	this.yRange = [0,0];
	this.zRange = [0,0]
	if(isBullet){
		this.stepsToExpire = 100;
	}

	this.getRanges = function(){
		var xMax = points[0].x;
		var yMax = points[0].y;
		var zMax = points[0].z;
		var xMin = points[0].x;
		var yMin = points[0].y;
		var zMin = points[0].z;
		for(var p = 1; p<points.length; p++){
			if(points[p].x > xMax){xMax = points[p].x}
			else if(points[p].x < xMin){xMin = points[p].x}
			if(points[p].y > yMax){yMax = points[p].y}
			else if(points[p].y < yMin){yMin = points[p].y}
			if(points[p].z > zMax){zMax = points[p].z}
			else if(points[p].z < zMin){zMin = points[p].z}

		}
		this.xRange = [xMin,xMax];
		this.yRange = [yMin,yMax];
		this.zRange = [zMin,zMax];

	}
	this.getRanges();
	if(centerPoint != undefined){
		this.center = centerPoint;
	}
	this.translate = function(vector){
		//console.log(this)
		//console.log("translate")
		for(var p = 0; p<this.points.length; p++){
			this.points[p].add(vector);
		}
		this.center.add(vector)
		this.getRanges();
	}
	this.scale = function(scalar){
		//console.log(this)
		//console.log("translate")
		var centerPlaceHolder = this.center.copyScale(1);
		this.translate(this.center.copyScale(-1))	
		for(var p = 0; p<this.points.length; p++){
			var dx = this.points[p].x-this.center.x
			var dy = this.points[p].y-this.center.y
			var dz = this.points[p].z-this.center.z

			var centerCorrectedPoint = new point3d(dx,dy,dz)
			centerCorrectedPoint.scale(scalar);
			centerCorrectedPoint.add(this.center);
			this.points[p] = centerCorrectedPoint;
		}
		this.translate(centerPlaceHolder)

		
	}
	this.pointsClone = function(){
		var arr = [];
		for(var p = 0; p<this.points.length; p++){
			arr.push(points[p].copyScale(1))
		}
		return arr;
	}
	this.copy = function(){
		var mCopy = new Model(this.faces, this.pointsClone())
		console.log("copied")
		return mCopy;
	}



}
Array.prototype.clone = function() {
	return this.slice(0);
};
function Face(points,a,b,c,color,d){
		//this.color = shadeColor1(color,t*a.latestProject.x*t/25 * Math.pow(Math.abs(b.z-a.z)*Math.abs(c.z-d.z)*Math.abs(a.z-d.z)*Math.abs(b.z-c.z), .25)/-5 * (c.z-d.z)/(Math.abs(c.z-d.z)+.1) );
		//find normal
		//console.log(points[0])
		var v1 = new point3d(points[1].x-points[0].x,points[1].y-points[0].y,points[1].z-points[0].z)
		var v2 = new point3d(points[2].x-points[0].x,points[2].y-points[0].y,points[2].z-points[0].z)

		var i = v1.y*v2.z-v1.z*v2.y
		var j = v1.z*v2.x-v1.z*v2.x
		var k = v1.x*v2.y-v1.y*v2.x
		var normal = new point3d(i,j,k)
		normal.normalize()
		//console.log(k)

		//this.color = color;
		this.color = ColorLuminance(color,normal.z/15)
		this.a = a;
		this.b = b;
		this.c = c;
		if(d != undefined){
			this.d = d;
		}
		
		//this.z = -this.a.z;
}


function Polygon(a,b,c,color,d){
		this.color = color;
		//this.color = shadeColor1(color,a.latestProject.x );

		this.a = a;
		this.b = b;
		this.c = c;
		if(d != undefined){
			this.d = d;
			this.z = Math.sqrt(a.z*a.z+b.z*b.z+c.z*c.z+d.z*d.z);
		}
		else{
			this.z = Math.sqrt(a.z*a.z+b.z*b.z+c.z*c.z);

		}
		
}

var colors = ["red","green","blue","orange","purple","black"];
var colorNum = 0;
function getColor(){

	
	colorNum++;
	if(colorNum > colors.length-1){
		colorNum = 0;
	}
	return colors[colorNum];
}


function modelFromObj(obj, sideWays, centerPoint,isBullet=false){
	var points = []
	var faces = []
	var currentColor = "#000000";
	for(var l = 0; l<obj.length; l++){
		if(obj[l].charAt(0) == "v"){
			var coords = obj[l].split(" ");
			if(sideWays){
				var x = 1*(coords[1])
				var z = 1*(coords[2])
				var y = 1*(coords[3])
				points.push(new point3d(x,y,z))
			}
			else{
				var x = 1*(coords[1])
				var y = 1*(coords[2])
				var z = 1*(coords[3])
				points.push(new point3d(x,y,z))
			}
			
		}
		else if(obj[l].charAt(0) == "u"){
			var lineSplit = obj[l].split(" ");
			var color = "#" + lineSplit[1]
			currentColor = color;
		}
		else if(obj[l].charAt(0) == "f"){
			var pointIndexes = obj[l].split(" ");
			var a = 1*(pointIndexes[1]);
			var b = 1*(pointIndexes[2]);
			var c = 1*(pointIndexes[3]);
			//console.log(pointIndexes[1])
			if(pointIndexes.length == 5){
				var d = 1*(pointIndexes[4]);
				var ps = [points[a-1],points[b-1],points[c-1],points[d-1]]
				console.log(currentColor)

				faces.push(new Face(ps,a,b,c,currentColor,d))
			}
			else{
				var ps = [points[a-1],points[b-1],points[c-1]]
				faces.push(new Face(ps,a,b,c,currentColor))
			}
			
		}
		
	}
	//console.log(points[0])

	if(centerPoint != undefined){
		return new Model(faces, points, centerPoint,isBullet)
	}
	return new Model(faces,points,new point3d(0,0,0),isBullet)
}



function ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}


function shadeColor1(color, percent) { 
    var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

function Physics() {
	this.prevTime = new Date();

	this.doPhysics = function(objs,camera){
		var clip = 1000;
		var currentTime = new Date();
		var dt = currentTime-this.prevTime;
		dt/=1000
		for(var i = 0; i < objs.length; i++){
			if(objs[i].isBullet && objs[i].stepsToExpire > 0){
				objs[i].stepsToExpire--;
			}
			if(objs[i].stepsToExpire == 0){
				objs.splice(i,1)
				continue;
			}


			objs[i].translate(objs[i].velocity.copyScale(dt))
			if(objs[i].center.x > clip){
				objs[i].translate(-clip,0,0)
				objs[i].velocity.x*=-1
			}
			else if(objs[i].center.x < -clip){
				objs[i].translate(new point3d(clip,0,0))
				objs[i].velocity.x*=-1
			}
			if(objs[i].center.y > clip){
				objs[i].translate(0,-clip,0)
				objs[i].velocity.y*=-1
			}
			else if(objs[i].center.y < -clip){
				objs[i].translate(new point3d(0,clip,0))
				objs[i].velocity.y*=-1
			}
			if(objs[i].center.z > clip){
				objs[i].translate(0,0,-clip)
				objs[i].velocity.z*=-1
			}
			else if(objs[i].center.z < -clip){
				objs[i].translate(new point3d(0,0,clip))
				objs[i].velocity.z*=-1
			}
			var isHit = function(obj1,obj2){
				var xHit = true;
				var yHit = true;
				var zHit = true;


				if(obj1.xRange[0] >obj2.xRange[1] || obj2.xRange[0] > obj1.xRange[1]){
					xHit = false;
				}
				if(obj1.yRange[0] >obj2.yRange[1] || obj2.yRange[0] > obj1.yRange[1]){
					yHit = false;
				}
				if(obj1.zRange[0] >obj2.zRange[1] || obj2.zRange[0] > obj1.zRange[1]){
					zHit = false;
				}
				/*if((obj1.xRange[0] > obj2.xRange[0] && obj1.xRange[0] < obj2.xRange[1]) ||(obj1.xRange[1] > obj2.xRange[0] && obj1.xRange[1] < obj2.xRange[1] ) || (obj1.xRange[0] < obj2.xRange[0] && obj1.xRange[1] > obj2.xRange[1]) || ((obj1.xRange[0] < obj2.xRange[0] && obj1.xRange[1] > obj2.xRange[1]))){
					
						xHit = true;
					
				}
				
				
				if((obj1.yRange[0] > obj2.yRange[0] && obj1.yRange[0] < obj2.yRange[1] )||(obj1.yRange[1] > obj2.yRange[0] && obj1.yRange[1] < obj2.yRange[1]) || (obj1.yRange[0] < obj2.yRange[0] && obj1.yRange[1] > obj2.yRange[1]) || ((obj1.yRange[0] < obj2.yRange[0] && obj1.yRange[1] > obj2.yRange[1]))){
					
						yHit = true;
					
				}
				if((obj1.zRange[0] > obj2.zRange[0] && obj1.zRange[0] < obj2.zRange[1] )||(obj1.zRange[1] > obj2.zRange[0] && obj1.zRange[1] < obj2.zRange[1] )   || (obj1.zRange[0] < obj2.zRange[0] && obj1.zRange[1] > obj2.zRange[1]) || ((obj1.zRange[0] < obj2.zRange[0] && obj1.zRange[1] > obj2.zRange[1]))){

						zHit = true;
					
				}*/
				
				if(xHit && yHit && zHit){
					
					return true;
				}
				return false;

			}


			if(objs[i].isBullet){//bullet hit physics
				for(var j = 0; j<objs.length;j++){
					if(!objs[j].isBullet && objs[i] != undefined	){

						if(isHit(objs[i],objs[j])){
							objs[i].stepsToExpire = 0;

							objs[j].scale(.9);
							objs[j].hits++;
							if(objs[j].hits > 3){
								console.log("removed");
								objs.splice(j,1)
							}
							break;


						}

						/*if(objs[i].center.difference(objs[j].center) < 10){
							objs[i].stepsToExpire = 0;

							objs[j].scale(.9);
							objs[j].hits++;
							if(objs[j].hits > 10){
								objs.splice(j,1)
							}
							break;


						}
						else{
							for(var u = 0; u< objs[j].points.length; u++){
								if(objs[i].center.difference(objs[j].points[u]) < 10){
									objs[i].stepsToExpire = 0;

									objs[j].scale(.9);
									objs[j].hits++;
									if(objs[j].hits > 3){
										objs.splice(j,1)
									}
									break;


								}
							}
						}*/
						
						
					}
				}
			}
			else{
				var cam = {}
				var sizeCam = 5;
				cam.xRange = [camera.position.x-sizeCam,camera.position.x+sizeCam]
				cam.yRange = [camera.position.y-sizeCam,camera.position.y+sizeCam]
				cam.zRange = [camera.position.z-sizeCam,camera.position.z+sizeCam]
				if(isHit(cam,objs[i])){
					camera.gotHit = true;
					if(camera.gotHitPunish < 10){
						camera.gotHitPunish = 15;

					}
				}
				
			}

		}
		this.prevTime = currentTime;
	}
}
function inScreen(a,b,c,d){
	var screen = false;
	if(a.x > 0 && a.x < canvas.width && a.y > 0 && a.y < canvas.height){
		screen = true;
	}
	if(b.x > 0 && b.x < canvas.width && b.y > 0 && b.y < canvas.height){
		screen = true;
	}
	if(c.x > 0 && c.x < canvas.width && c.y > 0 && c.y < canvas.height){
		screen = true;
	}
	if(d.x > 0 && d.x < canvas.width && d.y > 0 && d.y < canvas.height){
		screen = true;
	}
	return screen;

}
function Renderer(){
	console.log("renderer")

	this.renderUI = function(scene,canvas){
		var size1 = 8;
		var size2 = size1-1

		canvas.context.beginPath();
		canvas.context.moveTo(0,canvas.height);
		canvas.context.lineTo(canvas.width/size1,size2*canvas.height/size1)
		canvas.context.lineTo(size2*canvas.width/size1,size2*canvas.height/size1)
		canvas.context.lineTo(canvas.width,canvas.height)
		canvas.context.closePath();
		canvas.context.fillStyle = "rgba(0,0,0,.2)"
		canvas.context.fill();
		canvas.context.beginPath();
		canvas.context.moveTo(0,0);
		canvas.context.lineTo(canvas.width/size1,canvas.height/size1)
		canvas.context.lineTo(size2*canvas.width/size1,canvas.height/size1)
		canvas.context.lineTo(canvas.width,0)
		canvas.context.closePath();
		canvas.context.fillStyle = "rgba(0,0,0,.2)"
		canvas.context.fill();

		canvas.context.beginPath();
		canvas.context.moveTo(0,0);
		canvas.context.lineTo(canvas.width/size1,canvas.height/size1)
		canvas.context.lineTo(canvas.width/size1,size2*canvas.height/size1)
		canvas.context.lineTo(0,canvas.height)
		canvas.context.closePath();
		canvas.context.fillStyle = "rgba(0,0,0,.2)"
		canvas.context.fill();
		canvas.context.beginPath();
		canvas.context.moveTo(canvas.width,0);
		canvas.context.lineTo(size2*canvas.width/size1,canvas.height/size1)
		canvas.context.lineTo(size2*canvas.width/size1,size2*canvas.height/size1)
		canvas.context.lineTo(canvas.width,canvas.height)
		canvas.context.closePath();
		canvas.context.fillStyle = "rgba(0,0,0,.2)"
		canvas.context.fill();


		canvas.context.beginPath();
		canvas.context.moveTo(0, 0);
		canvas.context.lineTo(canvas.width/size1, canvas.height/size1);
		canvas.context.lineTo(size2*canvas.width/size1, canvas.height/size1);
		canvas.context.lineTo(canvas.width, 0);

		canvas.context.moveTo(0,canvas.height)
		canvas.context.lineTo(canvas.width/size1, size2*canvas.height/size1);
		canvas.context.lineTo(size2*canvas.width/size1, size2*canvas.height/size1);
		canvas.context.lineTo(canvas.width, canvas.height);

		canvas.context.moveTo(canvas.width/size1,canvas.height/size1)
		canvas.context.lineTo(canvas.width/size1,size2*canvas.height/size1)
		canvas.context.moveTo(size2*canvas.width/size1,canvas.height/size1)
		canvas.context.lineTo(size2*canvas.width/size1,size2*canvas.height/size1)

		canvas.context.lineWidth = 8;

		canvas.context.strokeStyle = '#4f4fff';
		if(scene.camera.gotHit){
			if(scene.camera.gotHitPunish > 0){
				scene.camera.gotHitPunish--;
				if(scene.camera.gotHitPunish % 2 == 0){
					canvas.context.strokeStyle = '#ff4f4f';

				}
			}
			if(scene.camera.gotHitPunish == 0){
				scene.camera.gotHit = false;
			}

		}
		canvas.context.stroke();
		canvas.context.lineWidth = 4;

		canvas.context.strokeStyle = '#000000';
		canvas.context.stroke();
		canvas.context.lineWidth = 1;
		canvas.context.fillStyle = "white"
		canvas.context.font = "15px Courier New";
		canvas.context.fillText(scene.objects.length,10,100)


	}
	

	this.render = function(scene,canvas,stepCount){
		canvas.context.fillStyle = "#000000"
		canvas.context.fillRect(0,0,canvas.width,canvas.height)
		var origin = new point3d(0,0,0)
		var originProject = origin.project(scene.camera);
		//canvas.context.fillRect(originProject.x-2.5,originProject.y-2.5,5,5)
		//console.log(JSON.stringify(scene))
					//console.log(1)

		var polys = []
		for(var o = 0; o<scene.objects.length;o++){//project points and create polygons from model faces
			//var angle = scene.objects[o].rotation.x
			//console.log("render")
			var center = scene.objects[o].center;
			var timeCheck1 = new Date();

			for(var p = 0; p<scene.objects[o].points.length;p++){
				
				scene.objects[o].points[p].project(scene.camera);

				
				
			}
			var timeCheck2 = new Date();
			//console.log(timeCheck2-timeCheck1)
			for(var f = 0; f<scene.objects[o].faces.length;f++){
				var face = scene.objects[o].faces[f]
				// console.log(f)
				// console.log(fac2*				// console.log(scene.objects[o].points[face.a])
				var a = scene.objects[o].points[face.a-1].latestProject;
				var b = scene.objects[o].points[face.b-1].latestProject;
				var c = scene.objects[o].points[face.c-1].latestProject;
				if(face.d != undefined){
					var d = scene.objects[o].points[face.d-1].latestProject;
					polys.push(new Polygon(a,b,c,face.color,d))
					//console.log(123)
				}
				else{
					polys.push(new Polygon(a,b,c,face.color))
				}
				
			}

		}
		
		polys.sort(function(a,b){return b.z-a.z});//sort by dist from camera
		//console.log(JSON.stringify(polys[0]))

		for(var i = 0; i<polys.length;i++){

			if(polys[i].d != undefined){
				if(polys[i].a.z > -10 || polys[i].b.z > -10 ||polys[i].c.z > - 10){
					
				}
				else if(inScreen(polys[i].a,polys[i].b,polys[i].c,polys[i].d)){
					var a = polys[i].a;
					var b = polys[i].b
					var c = polys[i].c
					var d = polys[i].d
					

					/*var g = {"top":a,"bot":a,"left":a,"right":a}
					if(b.y > top){g.top = b}
					if(c.y > top){g.top = c}
					if(d.y > top){g.top = d}
					
					if(b.y < bot){g.bot = b}
					if(c.y < bot){g.bot = c}
					if(d.y < bot){g.bot = d}
					
					
					if(b.x < left){g.left = b}
					if(c.x < left){g.left = c}
					if(d.x < left){g.left = d}
					
					if(b.x > right){g.right = b}
					if(c.x > right){g.right = b}
					if(d.x > right){g.right = b}
					g.right.x+=100;
					g.left.x-=100;
					g.top.y+=10;
					g.top.y-=1;*/

					//canvas.context.fillStyle = polys[i].color;

					canvas.context.beginPath();
					canvas.context.moveTo(a.x, a.y)
					canvas.context.lineTo(b.x, b.y)
					canvas.context.lineTo(c.x, c.y)
					canvas.context.lineTo(d.x, d.y)
					canvas.context.lineTo(a.x, a.y)

					canvas.context.closePath();
					
					canvas.context.fillStyle = polys[i].color;

					canvas.context.fill();
					canvas.context.strokeStyle = "black";
					canvas.context.stroke();
					//
					//canvas.context.fill();
				}
			}
			else{
				if(polys[i].a.z > 10 || polys[i].b.z>10 ||polys[i].c.z > 10){
					
				}
				else{

					var a = polys[i].a;
					var b = polys[i].b
					var c = polys[i].c
					

					canvas.context.fillStyle = polys[i].color;
					canvas.context.beginPath();
					canvas.context.moveTo(a.x, a.y)
					canvas.context.lineTo(b.x, b.y)
					canvas.context.lineTo(c.x, c.y)
					canvas.context.lineTo(a.x, a.y)

					canvas.context.closePath();

					canvas.context.fill("evenodd");
					//canvas.context.fill();
				}
			}
			


			
		}


	}

	//console.log(this.render)

	

}


function Scene(objs,cam,keys){
	
	this.objects = objs;
	this.camera = cam;
	this.keyboard = keys;





	this.addObject = function(obj){
		this.objects.push(obj)
	}




	
}






function Graphics(c) {

	
	
	console.log("graphics")
	this.canvas = {"width":c.width,"height":c.height,"context":c.getContext('2d')};
	
	this.renderer = new Renderer();
	this.physics = new Physics();
	this.stepCount = 0;
	this.scene = undefined;

	this.setStep = function(f){
		this.step = f;
	}

	this.stepRunner = function(){
		//console.log("________________________________________")
		var t = new Date();
		this.stepCount++;
		//console.log(this.stepCount)
		if(this.scene != undefined ){
			this.scene.keyboard.doMovement(this.scene.camera);

			this.renderer.render(this.scene,this.canvas,this.stepCount);
			this.renderer.renderUI(this.scene,this.canvas)
			this.physics.doPhysics(this.scene.objects,this.scene.camera)

		}
	

		this.step();
		var self = this;
		var tn = new Date();
		var dtWait = 10-(tn-t)
		//console.log(dtWait)
		if(true){
			window.setTimeout(function(){self.stepRunner()},1)

		}
	}


	


	this.addCamera = function(pos, rot){
		this.camera = new Camera(pos,rot,Math.PI/2);
		camera = this.camera;
	}
	this.addCamera = function(){
		this.camera = new Camera();
		camera = this.camera;

	}

	this.setScene = function(s){
		this.scene = s;
	}

	this.addTestScene = function(){
		//var points = [new point3d(-1,-1,0),new point3d(-1,1,0),new point3d(1,1,0),new point3d(1,-1,0),
					  //new point3d(-1,-1,2),new point3d(-1,1,2),new point3d(1,1,2),new point3d(1,-1,2),]
		//var faces = [new Face(0,1,2,3),new Face(4,5,6,7),new Face(0,1,5,4),new Face(1,2,6,5),new Face(2,3,7,6),new Face(0,3,7,4)];
		//var obj = new Model(faces,points);
		//scene.addObject(obj)

		//console.log(obj)
		
		console.log("done adding test scene")
	}
	
	this.begin = function(){
		if(this.scene != undefined){
			console.log("begin")
			//console.log(this.scene)
			this.stepRunner();
		}
		else{
			console.log("no scene defined, use Graphics.setScene(s)")
		}
		

	}


	
}







