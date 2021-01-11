const bcrypt = require('bcrypt')
const mysqlConnection = require('../db/db')
const { Sequelize } = require('sequelize')
const jwt = require('jsonwebtoken')
const Role = require('./role')

const User = mysqlConnection.define('Users', {
    firstname: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isAlpha: true
        }
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isAlpha: true
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            max: 2
        }
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isAlpha: true
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true,
        default: null,
        validate: {
            len: [6,]
        },
        set(val) {
            if(val!=null) {
                this.setDataValue('password', bcrypt.hashSync(val, 8)) 
            }
        }
    },
    token: {
        type: Sequelize.STRING,
        default: null,
        allowNull: true
    },
    resetPasswordToken: {
        type: Sequelize.STRING,
        default: null,
        allowNull: true
    },
    createdAt: {
        type: 'TIMESTAMP',
        // defaultValue:  Sequelize.literal(`CURRENT_TIMESTAMP`),
        allowNull: false
    },
    updatedAt: {
        type: 'TIMESTAMP',
        // defaultValue: Sequelize.literal(`CURRENT_TIMESTAMP`),
        allowNull: false
    }
});

// // hash password
// User.beforeUpdate(async (user, options) => {
//     if (user.changed("password") && user.password != null) {
//         user.password = await bcrypt.hash(user.password, 8)
//     }
// })
// User.beforeCreate(async (user, options) => {
//     if (user.changed("password") && user.password != null) {
//         user.password = await bcrypt.hash(user.password, 8)
//     }
// })

// generate id token

User.afterCreate(async (user, options) => {
    const token = jwt.sign({ id: user.id, role_id: user.role_id }, process.env.RESET_TOKEN_SECRET_KEY, { expiresIn: '1h' })
    user.resetPasswordToken = token
    await User.update({
        resetPasswordToken: token
    },{
        where: {
            id: user.id
        }
    })
})

// generate token method
User.prototype.generateToken = async function (action = null) {
    const user = this.dataValues
    if (action == "resetPassword") {
        const token = jwt.sign({ id: user.id, role_id: user.role_id }, process.env.RESET_TOKEN_SECRET_KEY, { expiresIn: '1h' })
        return token
    }
    else {
        const token = jwt.sign({ id: user.id, role_id: user.role_id }, process.env.ACCESS_TOKEN_SECRET_KEY)
        return token
    }
}

// model association between user and roles
User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id', targetKey: 'id' });

module.exports = User