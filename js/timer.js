var started = false;
var init = 0;
var segs = 0;

function showTime(start){
	if (started) {
		if (segs==0) {
			segs = 59;
		}else{
			segs--;
		}

		if (segs==59) {
			init--;
			if (init==-1) {
				return 'end';
			}
		}
	}else{
		init = start;
		started = true;
	}
	minutes = (init >= 10)? init : '0' + init;
	seconds = (segs >= 10)? segs : '0' + segs;
	return minutes + ':' + seconds;
}

function timediff(start, now){
	let time_now = now.split(':');
	let minutes = start - parseInt(time_now[0]);
	let segs = 60 - parseInt(time_now[1]);

	if(segs < 60){
		minutes--;
	}else{
		segs = 0;
	}
	minutes = (minutes >= 10)? minutes : '0' + minutes;
	segs = (segs >= 10)? segs : '0' + segs;
	return minutes + ':' + segs;
}

