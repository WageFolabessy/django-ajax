
const postBox = document.getElementById("post-box")
const spinnerBox = document.getElementById("spinner-box")
const loadBtn = document.getElementById("load-btn")
const endBox = document.getElementById("end-box")

const postForm = document.getElementById("post-form")
const title = document.getElementById("id_title")
const description = document.getElementById("id_description")
const csrf = document.getElementsByName("csrfmiddlewaretoken")
const alertBox = document.getElementById("alert-box")
const addPostBtn = document.getElementById("add-post-btn")

const url = window.location.href

const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

const deleted = localStorage.getItem("title")
if(deleted){
    handleAlert("danger", `post ${deleted} has been deleted`)
    localStorage.clear()
}

const likeUnlikePosts = () => {
    const likeUnlikeForms = [...document.getElementsByClassName("like-unlike-forms")]
    likeUnlikeForms.forEach(form => form.addEventListener('submit', e=>{
        e.preventDefault()
        const clickedId = e.target.getAttribute('data-form-id')
        const clickedBtn = document.getElementById(`like-unlike-${clickedId}`)

        $.ajax({
            type: 'POST',
            url: "/like-unlike/",
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'pk': clickedId,
            },
            success: function(response){
                clickedBtn.textContent = response.liked ? `Unlike (${response.count})`: `Like (${response.count})`
            },
            error: function(error){
                console.log(error)
            },
        })
    }))
}

let visible = 3
const getData = () => {
    $.ajax({
        type: 'GET',
        url: `/data/${visible}/`,
        success: function(response){
            console.log(response)
            const data = response.data
            setTimeout(()=>{
                spinnerBox.classList.add("not-visible")
                console.log(data)
                data.forEach(element => {
                    postBox.innerHTML += `
                        <div class="card mb-2 shadow-lg">
                            <div class="card-body">
                                <h5 class="card-title">${element.title}</h5>
                                <p class="card-text">${element.description}</p>
                            </div>
                            <div class="card-footer">
                                <div class="row">
                                    <div class="col-1">
                                        <a href="${url}${element.id}" class="btn btn-primary">Details</a>
                                    </div>
                                    <div class="col-2">
                                        <form class="like-unlike-forms" data-form-id="${element.id}">
                                            <button href="#" class="btn btn-success" id="like-unlike-${element.id}">${element.liked ? `Unlike (${element.count_likes})`: `Like (${element.count_likes})`}</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                });
                likeUnlikePosts()
            }, 100)
            console.log(response.size)
            if(response.size === 0){
                endBox.textContent = "No posts added yet..."
            }
            else if(response.size <= visible){
                loadBtn.classList.add("not-visible")
                endBox.textContent = "No posts to load..."
            }
        },
        error: function(error){
            console.log(error)
        }
    })
}

loadBtn.addEventListener("click", ()=>{
    spinnerBox.classList.remove("not-visible")
    visible += 3
    getData()
})

postForm.addEventListener("submit", e =>{
    e.preventDefault()
    $.ajax({
        type: 'POST',
        url: "",
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': title.value,
            'description': description.value,
        },
        success: function(response){
            postBox.insertAdjacentHTML('afterbegin', `
            <div class="card mb-2 shadow-lg">
                <div class="card-body">
                    <h5 class="card-title">${response.title}</h5>
                    <p class="card-text">${response.description}</p>
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col-1">
                            <a href="${url}${response.id}" class="btn btn-primary">Details</a>
                        </div>
                        <div class="col-2">
                            <form class="like-unlike-forms" data-form-id="${response.id}">
                                <button href="#" class="btn btn-success" id="like-unlike-${response.id}">Like (0)</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            `)
            likeUnlikePosts()
            $('#addPostModal').modal('hide')
            handleAlert('success', "New post added")
            addPostBtn.addEventListener("click", () => {
                alertBox.classList.add("not-visible")
            })
            alertBox.classList.remove("not-visible")
            postForm.reset()
        },
        error: function(error){
            console.log(error)
            $('#addPostModal').modal('hide')
            handleAlert('danger', "Opps! Something went wrong")
            addPostBtn.addEventListener("click", () => {
                alertBox.classList.add("not-visible")
            })
            alertBox.classList.remove("not-visible")
        }
    })
})

getData()
