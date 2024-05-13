/*
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
import { apiCall, apiCallPost, apiPut, apiJoinLeave, isoTodate, smallform, largeform } from './helpers.js'; 

// display the public and private channels on the side, there are two div elements for public and private channels. 
const displaychannel = (channel_type) => {
    document.getElementById('public-channels').style.display = 'none';
    document.getElementById('private-channels').style.display = 'none';
    document.getElementById(`${channel_type}`).style.display = 'block'; 
}

// display the channel details form and create a new channel form here. 
export const displayform = (formname, channelId) => {
	document.getElementById('new-channel').style.display = 'none'; 
	document.getElementById('channel-details').style.display = 'none'; 
    
    // if formname is not null means it needs to display a from
    if (formname !== null) {   
        document.getElementById(`${formname}`).style.display = 'block';
        document.getElementById(`${formname}`).style.backgroundColor = '#e8ecee'; 
        largeform(formname);  
        // responsive
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 600) {
                smallform(formname); 
            } else {
                largeform(formname); 
            }   
        }); 
        
        // changne the height based on different form
        if (formname === 'new-channel') {
            document.getElementById(`${formname}`).style.height = '300px'; 
        } else {
            document.getElementById(`${formname}`).style.height = '450px'; 
            // when showing the channel details, make a GET request to get all details. 
            apiCall('channel', localStorage.getItem('token'), channelId)
            .then((responsebody) => {
                // console.log(responsebody);
                document.getElementById('channel-name').value = responsebody["name"]; 
                document.getElementById('channel-description').value = responsebody["description"]; 
                document.getElementById('channel-private').innerText = responsebody["private"]; 
                document.getElementById('channel-timestamp').innerText = isoTodate(responsebody["createdAt"]); 
                document.getElementById('channel-creator').innerText = responsebody["creator"];
            }); 
        }
        
    }    
}

// Fetch all the channels and construct element in html. 
const construct_channel_list = (channels_list, channel) => {
    const div1 = document.createElement('div'); 
    div1.id = "channel"; 
    channels_list.appendChild(div1);
    const h4 = document.createElement('h4');
    const channel_members = channel.members;
    const userId = parseInt(localStorage.getItem('userId'), 10); 

    // if user is a member of the channel, the user can see details and leave. 
    // create details and leave button.
    if (channel_members.includes(userId)) {
        const details = document.createElement('button'); 
        details.classList.add("details-channel");
        const leave = document.createElement('button'); 
        leave.classList.add("details-channel");
        div1.appendChild(h4);
        div1.appendChild(details); 
        div1.appendChild(leave); 
        h4.innerText = channel.name;
        details.innerText = "Details"; 
        leave.innerText = "Leave"; 
        details.dataset.channelId = channel.id;   
        leave.dataset.channelId = channel.id; 
        details.addEventListener('click', (event) => {
            const currentform = 'channel-details'; 	
            localStorage.setItem('currentform', currentform); 
            localStorage.setItem('curchannelId', event.currentTarget.dataset.channelId)
            displayform('channel-details', event.currentTarget.dataset.channelId);                
        });  
        
        // leave request send to backend
        leave.addEventListener('click', (event) => {
            apiJoinLeave('channel', {}, event.currentTarget.dataset.channelId, localStorage.getItem('token'), 'leave')
            .then((responsebody) => {
                localStorage.removeItem('curchannelId');
                localStorage.removeItem('currentform'); 
                displayform(null, null) ; 
                window.location.reload();
            }).catch((responseError) => {
                document.getElementById('popup-content').innerText = responseError
                window.popup.show();
            })
        })
    } else {
        // if user is not a member of the channel, the user can only join. 
        // create join button.
        const join = document.createElement('button'); 
        join.classList.add("join-channel");
        div1.appendChild(h4);
        div1.appendChild(join); 
        h4.innerText = channel.name;
        join.dataset.channelId = channel.id;
        join.innerText = "Join"; 

        // send join request to the backend server
        join.addEventListener('click', (event) => {
            apiJoinLeave('channel', {}, event.currentTarget.dataset.channelId, localStorage.getItem('token'), 'join')
            .then((responsebody) => {
                localStorage.removeItem('curchannelId');
                localStorage.removeItem('currentform'); 
                displayform(null, null) ; 
                window.location.reload();
            }).catch((responseError) => {
                document.getElementById('popup-content').innerText = responseError
                window.popup.show();
            })
        })
    }
}
// code is copied from Gorden Wang on ed forum: https://edstem.org/au/courses/13869/discussion/1655273
const deleteAllChildren = (parentTag) => {
    while (parentTag.hasChildNodes()) {
        parentTag.firstChild.remove();
    }
}

export const viewchannels = (globaltoken) => {
    apiCall('channel', globaltoken, null)
	.then((responsebody) => {
        const channels = responsebody['channels'];
		const public_channels_list = document.getElementById('public-channels-list');
        const private_channels_list = document.getElementById('private-channels-list');

        // clear all children under public/private channel lists
        deleteAllChildren(public_channels_list); 
        deleteAllChildren(private_channels_list);

        // for every channel fetched by the request
        for (const channel of channels) {
            const privacy = channel.private; 
            const channel_members = channel.members;
            const userId = parseInt(localStorage.getItem('userId'), 10);    
            if (privacy) {
                // if this is a private channel, user needs to be in the channel to see it, otherwise the user cannot see the channel. 
                if (channel_members.includes(userId)) {
                    construct_channel_list(private_channels_list, channel); 
                }
            } else {
                // the user should be able to see all public channels. 
                construct_channel_list(public_channels_list, channel); 
            }
        }       
	}).catch((responseError) => {
		document.getElementById('popup-content').innerText = responseError
		window.popup.show();
	});
};

// create channel buttons
document.getElementById("create-channel").addEventListener('click', () => {
    currentform = 'new-channel'; 	
    localStorage.setItem('currentform', currentform); 
	displayform('new-channel', null);
})

// submit create channel buttons
document.getElementById('submit-create-channel').addEventListener('click', () => {
    let privacy = false;
	const name = document.getElementById('new-channel-name').value;
	const private_channel = document.getElementById('new-channel-private').value;
	const description = document.getElementById('new-channel-description').value;
    if (private_channel === "true") {
        privacy = true;
    }

    apiCallPost('channel', {
        name: name, 
        private: privacy,
        description: description
    }, localStorage.getItem('token')).then((responsebody) => {
        const channelId = responsebody['channelId'];				
        localStorage.setItem('channelId', channelId);	
        viewchannels(localStorage.getItem('token'));		
        displayform(null, null);
        localStorage.removeItem('currentform');
    }).catch((responseError) => {
        document.getElementById('popup-content').innerText = responseError
        window.popup.show();
    })
})

// save channel details changes. 
document.getElementById('save-channel-details').addEventListener('click', () => {
    const channel_name = document.getElementById('channel-name').value; 
    const channel_description = document.getElementById('channel-description').value; 
    apiPut('channel', {
        name: channel_name, 
        description: channel_description
    }, localStorage.getItem('token'), localStorage.getItem('curchannelId'))
    .catch((responseError) => {
        document.getElementById('popup-content').innerText = responseError
        window.popup.show();
    }); 
    viewchannels(localStorage.getItem('token')); 
})

// leave channel details form
document.getElementById('cancel-channel-details').addEventListener('click', () => {
    currentform = null; 	
    localStorage.removeItem('currentform');
    localStorage.removeItem('curchannelId'); 
    displayform(currentform, localStorage.getItem('curchannelId'));
})

// leave create channel details form
document.getElementById('cancel-create-channel').addEventListener('click', () => {
    currentform = null; 	
    localStorage.removeItem('currentform'); 
    localStorage.removeItem('curchannelId'); 
    displayform(currentform, localStorage.getItem('curchannelId'));
})

// switch to puclic channel lists
document.getElementById('public-channel').addEventListener('click', () => {
    channel_type = 'public-channels'; 
    localStorage.setItem('channeltype', channel_type); 
    displaychannel(channel_type); 
    localStorage.removeItem('channel-type'); 
    displayform(null, null); 
})

// switch to private channel lists
document.getElementById('private-channel').addEventListener('click', () => {
    channel_type = 'private-channels'; 
    localStorage.setItem('channeltype', channel_type); 
    displaychannel(channel_type); 
    localStorage.removeItem('channel-type'); 
    displayform(null, null); 
})

let currentform = null;
let channel_type = 'public-channels'; 
if (localStorage.getItem('currentform') !== null) {
	currentform = localStorage.getItem('currentform');
}

if (localStorage.getItem('channeltype') !== null) {
	channel_type = localStorage.getItem('channeltype'); 
}

displayform(currentform, localStorage.getItem('curchannelId'));
displaychannel(channel_type); 
