const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    roles: {
        type: [String],
        enum: ['restrito', 'admin']
    },
    googleId: String,
    facebookId: String,
    name: String,
})


UserSchema.pre('save', async function(next){
    const user = this
    if(!user.isModified('password')){
        return next()
    }
    try{
        user.password = await getHash(10, user.password)
        return next()
    }catch(e){
        console.log(e)
        process.exit()
    }
})

const getHash = async(loops, senha) =>{
    try {
        const salt = await bcrypt.genSalt(loops)
        const generated = await bcrypt.hash(senha, salt)
        return generated
    } catch (error) {
        throw new Error('Erro gerando Senha Criptografada')        
    }
}

UserSchema.methods.checkPass = function(senha){
    return new Promise((resolve, reject)=>{
        bcrypt.compare(senha, this.password, (err, isMatch)=>{
            if(err) reject(err)
            else resolve(isMatch)
        })
    })
}


//MODEL PRECISA SER ASSOCIADO DEPOIS DE UserSchema.pre
//pra poder ligar o schema inteiro com a funcao (pre save) no model
//e tambem pra ter o método checkPass incluido
const User = mongoose.model('User', UserSchema)

module.exports = User








