/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file) {
    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }
    
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

// POST request
export const apiCallPost = (path, body, authed) => {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:5005/' + path, {
            method: 'POST',
            body: JSON.stringify(body), 
            headers: {
                'Content-type': 'application/json',
                'Authorization': authed ? `Bearer ${localStorage.getItem('token')}` : undefined, 
            }            
        })
            .then((response) => response.json())
            .then((body) => {
                // console.log(body);
                if (body.error) {
                    reject(body['error']);
                } else {
                    resolve(body);
                }    
            })
    })
};


export const apiJoinLeave = (path, body, queryString, token, request) => {
    return new Promise ((resolve, reject) => {
        // console.log(queryString);
        let url = path + '/' + queryString + '/' + request;
        fetch('http://localhost:5005/' + url, {
            method: 'POST',
            body: JSON.stringify(body), 
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                reject(data['error']);
            } else {
                // console.log(data['channels']); 
                resolve(data);
            }
        });
    })
};


export const apiCall = (path, token, queryString) => {
    return new Promise ((resolve, reject) => {
        // console.log(queryString);
        let url = '';
        if (queryString === null) {
            url = path;
        } else {
            url = path + '/' + queryString; 
        }
        fetch('http://localhost:5005/' + url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                reject(data['error']);
            } else {
                // console.log(data['channels']); 
                resolve(data);
            }
        });
    })
};

export const apiPut = (path, body, token, queryString) => {
    return new Promise ((resolve, reject) => {
        // console.log(queryString);
        let url = path + '/' + queryString;
        fetch('http://localhost:5005/' + url, {
            method: 'PUT',
            body: JSON.stringify(body), 
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                reject(data['error']);
            } else {
                // console.log(data['channels']); 
                resolve(data);
            }
        });
    })
};

const RenderRegister = (pagename) => {
	document.getElementById(`${pagename}`).style.display = 'flex';
    document.getElementById(`${pagename}`).style.flexDirection = 'column';
    document.getElementById(`${pagename}`).style.justifyContent = 'center';
    document.getElementById(`${pagename}`).style.alignItems = 'center';
}

export const smallform = (formname) => {
    document.getElementById(`${formname}`).style.marginLeft = '10px'; 
    document.getElementById(`${formname}`).style.marginRight = '10px'; 
    document.getElementById(`${formname}`).style.paddingLeft = '5px'; 
    document.getElementById(`${formname}`).style.paddingRight = '5px'; 
    document.getElementById(`${formname}`).style.width = '50%';
}

export const largeform = (formname) => {
    document.getElementById(`${formname}`).style.width = '60%';
    document.getElementById(`${formname}`).style.marginRight = '30px'; 
    document.getElementById(`${formname}`).style.marginLeft = '30px'; 
    document.getElementById(`${formname}`).style.paddingLeft = '10px';
    document.getElementById(`${formname}`).style.paddingRight = '10px'; 
    document.getElementById(`${formname}`).style.paddingTop = '10px';      
}


// display page function reference to Hayden demo code in week5 lecture: https://cgi.cse.unsw.edu.au/~cs6080/raw/lectures/23t3-demo-ass3/src/main.js
export const displaypage = (pagename) => {
	document.getElementById('dashboard').style.display = 'none'; 
	document.getElementById('register').style.display = 'none'; 
	document.getElementById('login').style.display = 'none'; 
	if (pagename === 'register' || pagename === 'login') {
		RenderRegister(pagename);
	} else {
		document.getElementById(`${pagename}`).style.display = 'block';
	}
}

// convert ISO to date
// isoTodate fucntion reference: https://stackoverflow.com/questions/25159330/how-to-convert-an-iso-date-to-the-date-format-yyyy-mm-dd
export const isoTodate = (iso) => {
    let new_date = new Date(iso);
    let year = new_date.getFullYear();
    let month = new_date.getMonth()+1;
    let date = new_date.getDate();
    let hours = new_date.getHours();
    let mins = new_date.getMinutes(); 
    let sec = new_date.getSeconds(); 
    if (month < 10) {
        month = '0' + month;
    }
    if (date < 10) {
        date = '0' + date;
    }
    if (hours < 10) {
        hours = '0' + month;
    }
    if (mins < 10) {
        mins = '0' + mins;
    }
    if (sec < 10) {
        sec = '0' + sec;
    }
    
    return year + '/' + month + '/' + date + '/' + hours + ':' + mins + ':' + sec;  
}
