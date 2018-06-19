(function() {
	var delay = 15000; // ms
	var oldArtist = '';
	var oldTitle = '';
	var audio = null;

	function getTags() {
		fetch('https://api.utopicradio.com/Tags/', {
			mode: 'cors'
		})
		.then(r => r.json())
		.then(r => {
			if (oldTitle !== r.title || oldArtist !== r.artist) {
				updateView(r);
				oldArtist = r.artist;
				oldTitle = r.title;
			}
		});
		setTimeout(getTags, delay);
	}

	function updateView(tags) {
		Array.from(document.querySelectorAll('[data-cover]')).forEach(element => {
			element.style.backgroundImage = 'url(' + tags.cover + ')';
		});
		Array.from(document.querySelectorAll('[data-artist]')).forEach(element => {
			element.innerText = tags.artist;
		});
		Array.from(document.querySelectorAll('[data-title]')).forEach(element => {
			element.innerText = tags.title;
		});
	}

	function play() {
		if (audio === null) {
			audio = new Audio;
			audio.src = 'https://utopicradio.com/listen';
			audio.volume = document.querySelector('[data-volume]').value;
			audio.play().then(() => {
				Array.from(document.querySelectorAll('[data-play-stop]')).forEach(element => {
					element.classList.remove('play-stop--stopped');
					element.classList.add('play-stop--playing');
				});
			});
		}
	}

	function stop() {
		audio.pause();
		audio.src = ''; // stop data
		audio = null;
		Array.from(document.querySelectorAll('[data-play-stop]')).forEach(element => {
			element.classList.remove('play-stop--playing');
			element.classList.add('play-stop--stopped');
		});
	}

	function bindEvents() {
		Array.from(document.querySelectorAll('[data-play-stop]')).forEach(element => {
			element.addEventListener('click', e => {
				if (element.classList.contains('play-stop--stopped')) {
					play();
				} else {
					stop();
				}
			});
		});
		Array.from(document.querySelectorAll('[data-volume]')).forEach(element => {
			element.addEventListener('input', e => {
				if (audio !== null) {
					audio.volume = element.value;
				}
			});
		});
	}

	bindEvents();
	getTags();
})();