class customError extends Error {
    constructor(message, sCode){
        super(message);
        this.statusCode = sCode
    }
}

module.exports = customError