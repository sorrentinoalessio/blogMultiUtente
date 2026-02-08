class SocketIoInitializer {
  constructor(io){
    io = io.of('blog')
    io.use(async (socket,next) =>{
        next()
    })


  }  
}
export default SocketIoInitializer;