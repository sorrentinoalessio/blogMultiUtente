class SocketIoInitializer {
  constructor(io){
    io = io.of('todolist')
    io.use(async (socket,next) =>{
        next()
    })


  }  
}
export default SocketIoInitializer;