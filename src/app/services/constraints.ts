/* min: 576p, ideal: 720p, max: 1080p  */
export const regularConstraints = {
    audio: true,
    video: {
        width: { min: 1024, ideal: 1280 },
        height: { min: 576, ideal: 720 }
    }
};


/*  min: 240p, ideal: 360p, max: 480p */
export const lowMobileConstraints = {
    audio: true,
    video: {
        width: { min: 240, ideal: 360, },
        height: { min: 426, ideal: 640, },
    }
}

export const regularMobileConstraints = {
    audio: true,
    video: {
        width: { min: 360, ideal: 480 },
        height: { min: 640, ideal: 854 },
    }
}


export const networkSpeedTest = () => {
    let userImageLink = "https://f000.backblazeb2.com/file/public-data/instagram_beta_post.jpg"; 
            let time_start, end_time; 
            var speed;

            // The size in bytes 
            let downloadSize = 4350000 ; 
            let downloadImgSrc = new Image(); 
  
            downloadImgSrc.onload = function () { 
                end_time = new Date().getTime(); 
                displaySpeed(); 
            }; 
            time_start = new Date().getTime(); 
            downloadImgSrc.src = userImageLink;  
  
            function displaySpeed() { 
                let timeDuration = (end_time - time_start) / 1000; 
                let loadedBits = downloadSize * 8; 
                
                /* Converts a number into string 
                   using toFixed(2) rounding to 2 */
                let Mbps = (((loadedBits / timeDuration) / 1024) / 1024).toFixed(2); 
                console.log(`Your internet connection speed is: ${Mbps}`+ 'Mbps'); 
                speed = Mbps;
            } 

            return speed;
}

/* get devices width */

export const deviceWidth = () => {
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    return width;
}
