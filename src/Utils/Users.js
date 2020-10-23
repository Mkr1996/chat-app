const users = []

// addUser, removeUser, getUser, getUsersInRoom 

const addUser = ({id, username, room}) =>{
  //clean the data 
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  if(!username || !room){
      return {
          error: 'Username and room are required!'
      }
  }

  //Check for existing user 
  const existingUser = users.find((user)=>{
      return user.room === room && user.username === username
  })

  //Validate User Name
  if(existingUser){
      return {
          error: 'Username is in use. Try Again!'
      }
  }

  //Store user 
  const user = {id, username, room}
  users.push(user)
  return {user}
}

//Removing Users based on id
const removeUser = (id) => {
    //Find the user by index
    const index = users.findIndex((user)=> user.id === id)

    //Remove the item at that index with matching id and return
    if (index !== -1){
        return users.splice(index, 1)[0]
    }
}

//Getting certain user
const getUser = (id) =>{
    return users.find((user) => user.id === id)
}


//Getting all users in a certain rom
const getUsersInRoom = (room) =>{
    return users.filter((user) => user.room === room.trim().toLowerCase())
}

module.exports = {
    addUser,
    getUser,
    removeUser,
    getUsersInRoom
}