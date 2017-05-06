
//rturn str
function direction(y, yDir, x, xDir,str,newY,newX) {
	
    'use strict';
	
	newY += yDir;
	newX += xDir;
	if ((0 < newY) && (newY <= iDimY) && (0 < newX) && (newX <= iDimX)) {
		if (aGameMap[newY][newX] == aGameMap[y][x]) {
			str += String(aGameMap[newY][newX]);
			str = direction(y, yDir, x, xDir,str,newY,newX);
			}
		}
	return str;
}