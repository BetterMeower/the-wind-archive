<!--
	Formatted date display with hover text.
	Mostly taken straight from Appel Level Database.
-->

<script>
	/**
	 * @file good thing I had already made a date display for appel level database
	 * *yoink with some tweaks*
	 */

	function epochToRelative(timestamp) {
    	var msPerMinute = 60 * 1000;
    	var msPerHour = msPerMinute * 60;
    	var msPerDay = msPerHour * 24;
    	var msPerMonth = msPerDay * 30;
    	var msPerYear = msPerDay * 365;
    	var current = new Date().getTime();
    	var elapsed = current - timestamp;

    	if (elapsed < msPerMinute) {
			var seconds = Math.round(elapsed/1000);
        	if (1 < Math.round(elapsed/1000)) {
            	return `${Math.round(elapsed/1000)} seconds ago`; 
        	} else if (Math.round(elapsed/1000) == 0 || seconds.startsWith("-")) {
				return "just now";
			} else {
            	return `${Math.round(elapsed/1000)} second ago`;
        	}  
    	} else if (elapsed < msPerHour) {
        	if (1 < Math.round(elapsed/msPerMinute)) {
            	return `${Math.round(elapsed/msPerMinute)} minutes ago`;
        	} else {
            	return `${Math.round(elapsed/msPerMinute)} minute ago`;
        	}  
    	} else if (elapsed < msPerDay) {
        	if (1 < Math.round(elapsed/msPerHour)) {
            	return `${Math.round(elapsed/msPerHour)} hours ago`; 
        	} else {
            	return `${Math.round(elapsed/msPerHour)} hour ago`;
        	}  
    	} else if (elapsed < msPerMonth) {
        	if (1 < Math.round(elapsed/msPerDay)) {
            	return `${Math.round(elapsed/msPerDay)} days ago`;
        	} else {
            	return `${Math.round(elapsed/msPerDay)} day ago`;
        	}
    	} else if (elapsed < msPerYear) {
        	if (1 < Math.round(elapsed/msPerMonth)) {
            	return `${Math.round(elapsed/msPerMonth)} months ago`;
        	} else {
            	return `${Math.round(elapsed/msPerMonth)} month ago`;
       		}
    	} else {
        	if (1 < elapsed/msPerYear) {
            	return `${Math.round(elapsed/msPerYear)} years ago`;
        	} else {
            	return `${Math.round(elapsed/msPerYear)} year ago`;
        	}
    	}
	}
	 
	// 32-bit UTC time (1 is 1 second instead of 1 millisecond)
	export let date = 0;

	let text, title;

	$: {
		const _date = new Date(date * 1000);
		text = epochToRelative(_date.getTime())
		title = `Time is in your local timezone (UTC+${-(_date.getTimezoneOffset()/60)}).
12-hour time: ${_date.toLocaleString([], {hourCycle: "h11"})}
24-hour time: ${_date.toLocaleString([], {hourCycle: "h23"})}
ISO: ${_date.toISOString()}`;
		setInterval(function() {
			text = epochToRelative(_date.getTime())
		}, 1000)
	}
</script>

<span {title} class="date">
	{text}
</span>

<style>
	.date {
		font-family: Simvoni-Italic, sans-serif;
		text-decoration: 2px underline dotted;
	}
</style>