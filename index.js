const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  keys: ['sjhgjfdgfgjf5thgf']
}))

app.get('/signup', (req, res) => {
  res.send(`
    Your id is: ${req.session.userId}
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});



app.post('/signup', async (req, res) => {
  //get access to email, password, passwordConfirmation
  // console.log(req.body);
  const {email, password, passwordConfirmation} = req.body;
  const existingUser = await usersRepo.getOneBy({email: email});
  if (existingUser) {
    return res.send('Email in use');
  }
  if (password !== passwordConfirmation){
    return res.send('Passwords must match');
  } 

  // create a user in our user repo to represent this person
  const user = await usersRepo.create({email, password});

  // store the id of that user inside the users cookie
  req.session.userId = user.id //added by cookie session

  res.send('account created');
});

app.get('/signout', (req, res) => {
  req.session = null;
  res.send('you are logout');
});

app.get('/signin', (req, res) => {
  res.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <button>Sign In</button>
      </form>
    </div>
  `)
});

app.post('/signin', async (req, res) => {
  const {email, password} = req.body;
  const user = await usersRepo.getOneBy({email});
  if (!user) {
   return res.send('email not found');
  }
  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );

  if(!validPassword) {
    return res.send('invalid password');
  }

  req.session.userId = user.id;
  res.send('you are signed in');
})

app.listen(3000, () => {
  console.log('listening')
});