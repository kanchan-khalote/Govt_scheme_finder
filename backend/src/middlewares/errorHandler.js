export const errorHandler = (err, req, res, next)=>{
   
    console.error(err);
    const status = err.status === 503 ? 503 : err.name === 'validationError' ? 400 : 500;
    const message = status === 500 ? 'something went wrong on the server' : err.message;

    res.status(status).json({ message });

};