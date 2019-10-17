const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser((user, done)=>{
    done(null, user)
})
passport.deserializeUser((user, done)=>{
    done(null, user)
})

// definindo a estratégia para login local
passport.use(new LocalStrategy(async(username, password, done)=>{
    const user = await User.findOne({username})
    if(user){
        const isValid = await user.checkPass(password)
        if(isValid){
            return done(null, user)
        }else{
            return done(null, false)
        }
    }else{
        return done(null, false)
    }
}))

//definindo a estratégia para login pelo Facebook
//https://developers.facebook.com/apps
passport.use(new FacebookStrategy({
    clientID: process.env.clientIDFace,
    clientSecret: process.env.clientSecretFace,
    callbackURL: 'http://localhost:3000/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'photos']
}, async(accessToken, refreshToken, profile, done)=>{
    const userDB = await User.findOne({facebookId: profile.id})
    if(!userDB){
        const user = new User({
            name: profile.displayName,
            facebookId: profile.id,
            roles: ['restrito'],
        })
        await user.save()
        done(null, user)
    }else{
        console.log(userDB)
        done(null, userDB)
    }
}))

//definindo a estratégia para login pelo Google
//console.developers.google.com
passport.use(new GoogleStrategy({
    clientID: process.env.clientIDGoog,
    clientSecret: process.env.clientSecretGoog,
    callbackURL: 'http://localhost:3000/google/callback'
}, async(accessToken, refreshToken, err, profile, done)=>{
    const userDB = await User.findOne({googleId: profile.id})
    if(!userDB){
        const user = new User({
            name: profile.displayName,
            googleId: profile.id,
            roles: ['restrito'],
        })
        await user.save()
        done(null, user)
    }else{
        console.log(userDB)
        done(null, userDB)
    }
}))

//usado sempre
//chamado em tudo, toda vez
//pois está associado a todas as rotas
router.use((req, res, next)=>{
    if(req.isAuthenticated()){
        res.locals.user = req.user
        if(!req.session.role){
            req.session.role = req.user.roles[0]
        }
        res.locals.role = req.session.role
    }
    return next()
})

router.get('/change-role/:role', (req, res)=>{
    if(req.isAuthenticated()){
        if(req.user.roles.indexOf(req.params.role) >= 0){
            req.session.role = req.params.role
        }
    }
    res.redirect('/')
})

router.get('/login', (req, res)=>{
    res.render('login')
})

router.get('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})

//passa a estrategia
router.post('/login', passport.authenticate('local', {
    successRedirect: '/restrito/noticias',
    failureRedirect: '/login',
    failureFlash: false
}))

//passa a estrategia
router.get('/facebook', passport.authenticate('facebook', { authType: 'rerequest' }))
router.get('/facebook/callback', 
    passport.authenticate('facebook', 
    {failureRedirect: '/login'}), 
    (req, res)=>{
        res.redirect('/restrito/noticias')
    }
)


//passa a estrategia
router.get('/google', passport.authenticate('google', { authType: 'rerequest', scope:['https://www.googleapis.com/auth/userinfo.profile'] }))
router.get('/google/callback', 
    passport.authenticate('google', 
        {failureRedirect: '/login', successRedirect: '/restrito/noticias'}, 
    )
)


module.exports = router
