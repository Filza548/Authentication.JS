const url = "https://kgkwctjqsxzvvemciwcl.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtna3djdGpxc3h6dnZlbWNpd2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0Nzg3MzIsImV4cCI6MjA2NzA1NDczMn0.F_iWk8_4vf3RQQJp3cPaqn3FtarYYWUuwXOWpSYcq5U"

const { createClient } = supabase

let merge = createClient(url, key)
console.log(createClient);
console.log(merge);

// Check and display user profile if logged in
async function displayUserProfile() {
    try {
        const {
            data: { user },
            error,
        } = await merge.auth.getUser();
        // console.log(user);

        if (error) throw error;
        // console.log('user data', user);
        if (user) {
            if (document.getElementById('profile-avatar')) {
                document.getElementById('profile-avatar').src =
                    user.user_metadata?.avatar_url || 'https://www.gravatar.com/avatar/?d=mp';
                document.getElementById('profile-name').textContent = user.user_metadata?.full_name || user.email;
                document.getElementById('profile-email').textContent = user.email;
            }
            // console.log(window.location.pathname.includes('/Authentication.JS/index.html'));
            // todo
            if (window.location.pathname.includes('/Authentication.JS/index.html')) {
                window.location.href = '/Authentication.JS/post.html';
            }
        } else if (!window.location.pathname.includes('/Authentication.JS/index.html') && !window.location.pathname.includes('/Authentication.JS/login.html')) {
            window.location.href = '/Authentication.JS/index.html';
        }
    } catch (error) {
        console.error('Error:', error);
        if (!window.location.pathname.includes('/Authentication.JS/index.html') && !window.location.pathname.includes('/Authentication.JS/login.html')) {
            window.location.href = '/Authentication.JS/index.html';
        }
    }
}

displayUserProfile();



// Logout button functionality
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn &&
    logoutBtn.addEventListener('click', async () => {
        try {
            const { error } = await merge.auth.signOut();
            if (error) throw error;
            window.location.href = '/Authentication.JS/login.html';
        } catch (error) {
            console.error('Logout error:', error.message);
            alert('Logout failed');
        }
    });


let btnLogin = document.querySelector(".btnLogin")
btnLogin && btnLogin.addEventListener("click", (event) => {
    event.preventDefault();
    let emailInput = document.querySelector(".email")
    let passInput = document.querySelector(".pass")
    let email = emailInput.value.trim()
    let pass = passInput.value.trim()

    // console.log(email);
    // console.log(pass);

    if (email === "" || pass === "") {
        alert("Please fill in both Email and Password fields.")
        return
    }


    async function user() {
        const { data, error } = await merge.auth.signUp({
            email: email,
            password: pass,
        })

        if (error) {
            alert("error" + error.message)
        }
        else {
            alert("Sign-Up successfully")
            console.log(data);

            window.location.href = '/Authentication.JS/post.html'

            // window.location.thref = "/authentication/login/login.html"

            emailInput.value = ""
            passInput.value = ""
        }



    }

    user();

})

// google sign up ... working
const connectWithGoogle = document.getElementById("btnConnectWithGoogle")
connectWithGoogle && connectWithGoogle.addEventListener("click", async () => {
    try{
        const redirectTo = window.location.hostname === '127.0.0.1'
        ? window.location.origin + 'Authentication.JS/post.html' : window.location.origin + 'Authentication.JS///Authentication.JS/post.html'
        const { data, error } = await merge.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // redirectTo: window.location.origin + '/Authentication.JS/post.html',
				// redirectTo: 'https://filza548.github.io/Authentication.JS/',
				queryParams: { access_type: 'offline', prompt: 'consent' },

            },
        })
        console.log(data);
        console.log(error);
    
  
    }
    catch(error){
        console.log(error);
        
    }
      })
    

// facebook sign up 
const btnConnectWithfacebook = document.getElementById("btnConnectWithfacebook")
btnConnectWithfacebook && btnConnectWithfacebook.addEventListener("click", async () => {


    const { data, error } = await merge.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
            redirectTo: `http://example.com/auth/callback`,
        },
    })
    console.log(data);
    console.log(error);


})

// console.log("hellow every one kaisw ha");



// add a post //

const postbtn = document.getElementById("submitpost");
const loaderOverlay = document.getElementById('loader-overlay');


function showLoader() {
	loaderOverlay.style.display = 'flex';
}

function hideLoader() {
	loaderOverlay.style.display = 'none';
}


postbtn && postbtn.addEventListener("click", async()=>{
//    const {data:{user}} = await merge.auth.getUser();
   const usertitle = document.getElementById('title').value.trim()
const userdescription = document.getElementById('description').value.trim();


if (!usertitle || !userdescription) {
			Swal.fire({
				icon: 'warning',
				title: 'Missing Fields',
				text: 'Please enter both a title and a description.',
				confirmButtonColor: '#125b9a',
			});
			return;
		}

		showLoader();
		postbtn.disabled = true;

		try {
			const {
				data: { user },
				error: authError,
			} = await merge.auth.getUser();

			if (authError || !user) throw authError || new Error('User not found.');

			const { data, error } = await merge.from("posts").insert({
				user_id: user.id,
				title: usertitle,
				description: userdescription,
			});

            if (error) {
				console.error(error);
				Swal.fire({
					icon: 'error',
					title: 'Post Failed',
					text: 'There was a problem creating the post.',
					confirmButtonColor: '#125b9a',
				});
			} else {
				Swal.fire({
					icon: 'success',
					title: 'Post Created',
					text: 'Your post has been successfully created!',
					timer: 1500,
					showConfirmButton: false,
				});
				document.getElementById('title').value = '';
				document.getElementById('description').value = '';
			}
		} catch (err) {
			console.error(err);
			Swal.fire({
				icon: 'error',
				title: 'Unexpected Error',
				text: 'Something went wrong. Please try again.',
				confirmButtonColor: '#125b9a',
			});
		} finally {
			hideLoader();
			postbtn.disabled = false;
		}
	});





