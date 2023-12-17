
export function Email(email)
{
    let re = /\S+@\S+\.\S+/
    return (re.test(email))
}


export function ID(ID)
{
    let x = [...ID.split('')]
    return (x.length == 24 && x[23] <= 'f')
}