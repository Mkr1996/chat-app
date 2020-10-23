const socket = io()

//Elements 
const $messageForm = document.querySelector('#message-form')
const $messageFormInput= $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $location = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates 
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
//Options 
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () =>{
    //New Message element
    const $newMessage = $messages.lastElementChild

    //Height of the new Message
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //Visible Height
    const visibleHeight = $messages.offsetHeight

    //Height of Messages container
    const containerHeight = $messages.scrollHeight

    //How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }

    console.log(newMessageHeight)

}
socket.on('message', (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})



socket.on('locationMessage', (url)=>{
    console.log(url)
    const html = Mustache.render(locationTemplate,{
        username: url.username,
        url: url.url,
        createdAt: moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room, users})=>{
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()

    //Disable
    $messageFormButton.setAttribute('disabled', 'disabled')
    
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error)=>{
        //enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }

        console.log('Message Delivered')
    })
})

$location.addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    $location.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },()=>{
            $location.removeAttribute('disabled')
            console.log('Location Shared!')
        })
        
    })
})

socket.emit('join', {username, room}, (error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})