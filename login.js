const url = "https://kgkwctjqsxzvvemciwcl.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtna3djdGpxc3h6dnZlbWNpd2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0Nzg3MzIsImV4cCI6MjA2NzA1NDczMn0.F_iWk8_4vf3RQQJp3cPaqn3FtarYYWUuwXOWpSYcq5U"

const { createClient } = supabase

let merge = createClient(url, key)
console.log(createClient);
console.log(merge);


let btnLogin = document.querySelector(".btnLogin")
btnLogin.addEventListener("click", () => {
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
        const { data, error } = await merge.auth.signInWithPassword({
            email: email,
            password: pass,
        })

        if (error) {
            alert("error" + error.message)
        }
        else {
            alert("Login successfully")
            console.log(data);

            window.location.href = "/Authentication.JS/post.html","_blank"

            emailInput.value = ""
            passInput.value = ""
        }



    }

    user()

})


const connectWithGoogle = document.getElementById("btnConnectWithGoogle")
connectWithGoogle.addEventListener("click", async () => {

        const { data, error } = await merge.auth.signInWithOAuth({
      provider: 'google',
        options: {
             redirectTo: window.location.origin + '/authentication/post/post.html',
					queryParams: { access_type: 'offline', prompt: 'consent' }
        },
    })

    console.log(data);
console.log(error);
   
})



const btnConnectWithfacebook = document.getElementById("btnConnectWithfacebook")
btnConnectWithfacebook.addEventListener("click", async() =>{

    
  const { data, error } = await merge.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
    redirectTo: `http://example.com/auth/callback`,
  },
  })
  
console.log(data);
console.log(error);

})






