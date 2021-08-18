module.exports.validateSignupInput =(
    email,
    password

) =>{
    const errors ={}
    if( email.trim() === '')
    {
        errors.email ="Email không được để trống"
    }
    if(password.trim()=== '')
    {
        errors.password ='Mật khẩu không được để trống'
    }


    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput= (
    email,
    password 
) =>{
    const errors ={}
    if( email.trim() === '')
    {
        errors.email ="Email không được để trống"
    }
    if(password.trim()=== '')
    {
        errors.password ='Mật khẩu không được để trống'
    }


    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}