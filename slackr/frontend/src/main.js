import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl, apiCallPost, displaypage } from './helpers.js';
import { displayform, viewchannels } from './channel.js';

// bootstrap modal js copied from Gorden Wang's tut demo code: 
window.popup = new bootstrap.Modal(document.getElementById('popup')); 

// register submit function reference to Hayden demo code 
// in week5 lecture: https://cgi.cse.unsw.edu.au/~cs6080/raw/lectures/23t3-demo-ass3/src/main.js
document.getElementById('register-submit').addEventListener('click', () => {
	const email = document.getElementById('register-email').value;
	const name = document.getElementById('register-name').value;
	const password = document.getElementById('register-password').value;
	const retype_password = document.getElementById('regitser-confirm-password').value;
	if (password !== retype_password) {
		// if password does not match: pop error message. 
		document.getElementById('popup-content').innerText = "Password does not match!"
		popup.show();
	} else {
		// POST request to register
		apiCallPost('auth/register', {
			email:email, 
			name: name, 
			password: password,
		}, false).then((responsebody) => {
			// store the token, userid in localStorage. 
			// make the current page: dashboard
			globaltoken = responsebody['token'];				
			localStorage.setItem('token', globaltoken); 
			userId = responsebody['userId'];
			localStorage.setItem('userId', userId); 
			currentpage = 'dashboard';
			localStorage.setItem('currentpage', currentpage); 
			displaypage('dashboard'); 	
			viewchannels(globaltoken);		
		}).catch((responseError) => {
			document.getElementById('popup-content').innerText = responseError
			popup.show();
		})
	}
}
)
// Login submit function reference to Hayden demo code 
// in week5 lecture: https://cgi.cse.unsw.edu.au/~cs6080/raw/lectures/23t3-demo-ass3/src/main.js
document.getElementById('login-submit').addEventListener('click', () => {
	const email = document.getElementById('login-email').value;
	const password = document.getElementById('login-password').value;
	console.log(email, password);
	apiCallPost('auth/login', {
		email:email,  
		password: password,
	}, false).then((responsebody) => {
		console.log(responsebody)
		globaltoken = responsebody['token'];
		localStorage.setItem('token', globaltoken);
		userId = responsebody['userId'];
		localStorage.setItem('userId', userId); 
		currentpage = 'dashboard'; 	
		localStorage.setItem('currentpage', currentpage);  
		displaypage('dashboard'); 
		viewchannels(globaltoken);
	}).catch((responseError) => {
		document.getElementById('popup-content').innerText = responseError
		popup.show();
	})
}
)

// logout submit function reference to Hayden demo code 
// in week5 lecture: https://cgi.cse.unsw.edu.au/~cs6080/raw/lectures/23t3-demo-ass3/src/main.js
document.getElementById('logout-submit').addEventListener('click', () => {
	apiCallPost('auth/logout', {}, true).then((responsebody) => {
		console.log(responsebody)
		displaypage('register'); 
		displayform(null, null); 
		localStorage.removeItem('token');
		localStorage.removeItem('currentpage');
		localStorage.removeItem('currentform');
		localStorage.removeItem('curchannelId'); 
		localStorage.removeItem('userId'); 
		localStorage.removeItem('channelId'); 
		localStorage.removeItem('channeltype');
	}).catch((responseError) => {
		document.getElementById('popup-content').innerText = responseError
		popup.show();
	})
})
// login button to go to login form 
document.getElementById('tologin').addEventListener('click', () => {
	displaypage('login');
})

// register button to go to login form 
document.getElementById('toregister').addEventListener('click', () => {
	displaypage('register');
})

// Declare global variables here to stay in the same page when refresh the page. 
let globaltoken = null;
let currentpage = null;
let userId = null; 
if (localStorage.getItem('token') !== null) {
	globaltoken = localStorage.getItem('token');
	currentpage = localStorage.getItem('currentpage');
	userId = localStorage.getItem('userId'); 
}

if (globaltoken === null) {
	displaypage('register');
} else { 
	displaypage(currentpage);
	viewchannels(globaltoken); 
}