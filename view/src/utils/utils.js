export const mailCheck = function(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}