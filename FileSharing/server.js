if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

let http = require('http').Server(app);
let io = require('socket.io')(http);
let path = require('path');
let router = express.Router();

app.use(express.static(__dirname + 'views'));
app.use('/html', express.static(path.join(__dirname, '/views/html')));
app.use('/css', express.static(path.join(__dirname, '/views/css')));
app.use('/images', express.static(path.join(__dirname, '/views/images')));
app.use('/', express.static(path.join(__dirname, 'views/filesharing.js')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/html/main.html');
});
app.get('/dangers', function(req, res){
    res.sendFile(__dirname + '/views/html/dangers.html');
});
app.get('/dropbox', function(req, res){
    res.sendFile(__dirname + '/views/html/dropbox.html');
});
app.get('/droplr', function(req, res){
    res.sendFile(__dirname + '/views/html/droplr.html');
});
app.get('/googledrive', function(req, res){
    res.sendFile(__dirname + '/views/html/googledrive.html');
});
app.get('/index', function(req, res){
    res.sendFile(__dirname + '/views/html/main.html');
});
app.get('/mega', function(req, res){
    res.sendFile(__dirname + '/views/html/mega.html');
});
app.get('/NextCloud', function(req, res){
    res.sendFile(__dirname + '/views/html/NextCloud.html');
});
app.get('/sharing', function(req, res){
    res.sendFile(__dirname + '/views/html/sharing.html');
});
app.get('/filesharing', function(req, res){
    res.sendFile(__dirname + '/views/html/filesharing.html');
});


const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(3000)
