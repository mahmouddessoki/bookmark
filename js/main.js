


let siteName = document.getElementById("site-name");
let siteUrl = document.getElementById("site-url");
let bookmarkList = document.getElementById("bookmark-list")
let bookmarkSearch = document.getElementById("search-input");
let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
let validCheck = document.querySelectorAll(".fa-check")
let inValidCheck = document.querySelectorAll(".fa-circle-exclamation")
let addOrEdit = document.querySelectorAll("#bookmark-form button")
let filteredBookmarks;
let lastRandomId = null;
let bookToEdit = null;
let nameRegx = /^[a-zA-Z0-9]{3,}[\sa-zA-Z]*$/
let urlRegx = /^https?:\/\/[a-zA-Z0-9\-\.]{3,}(\.[a-zA-Z]{2,})+(\:[0-9]+)?(\/[^\s]*)?$/
displayBookmarks()


siteName.addEventListener('input', function () {
    if (nameRegx.test(siteName.value)) {
        siteName.style.cssText = `
        border:3px solid rgb(25, 135, 84)
        `
        validCheck[0].style.display = "block"
        inValidCheck[0].style.display = "none"
    } else {
        siteName.style.cssText = `
        border:3px solid rgb(220, 53, 69)
        `
        validCheck[0].style.display = "none"
        inValidCheck[0].style.display = "block"


    }
})
siteUrl.addEventListener('input', function () {
    // siteUrl.classList.add(["border","border-3"])
    if (urlRegx.test(siteUrl.value)) {
        siteUrl.style.cssText = `
        border:3px solid rgb(25, 135, 84)
        
        `
        validCheck[1].style.display = "block"
        inValidCheck[1].style.display = "none"
    } else {
        siteUrl.style.cssText = `
        border:3px solid rgb(220, 53, 69)
        `
        validCheck[1].style.display = "none"
        inValidCheck[1].style.display = "block"


    }
})

/**
 * this function is used to add the bookmarks to the bookmark list
 */
function addBookmark() {
    if (validateInputs()) {
        let exist = -1;


        exist = bookmarks.findIndex(function (bookmark) {
            return bookmark.name.toLowerCase() === siteName.value.toLowerCase().trim()
        })




        if (exist == -1) {
            const bookmark = {
                name: siteName.value.trim(),
                url: siteUrl.value.trim(),
                id: generateId()
            }
            bookmarks.push(bookmark);
            localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
            clearInputs()
            displayBookmarks()
            Swal.fire({
                title: 'Success!',
                html: 'Your <span class="fw-bold">Bookmark</span> Is Added successfully.',
                icon: 'success',

            });
        } else {
            Swal.fire({
                title: 'Already Exists!',
                icon: 'error',
                html: `<p class='text-capitalize mb-0'>
                you cant add the same <span class='fw-bold'>bookmark name</span> more than once
                </p>`,
                confirmButtonText: 'Try Another Name'
            });
        }
    }



}

/**
 * this function is used to display the bookmarks in the bookmark list
 */
function displayBookmarks(current) {
    if (current === undefined) {
        current = bookmarks
        console.log(current)
    }
    let cartoona = ``;
    for (let i = 0; i < current.length; i++) {

        cartoona += `
                        <tr>
                            <td>${i + 1}</td>
                            <td class="text-capitalize fw-medium" title="${current[i].url}" >
                            
                            ${current[i].name}
                            
                            </td>
                            <td>
                                <a target="_blank" href="${current[i].url}" class="btn btn-success text-capitalize">
                                    <i class="fa-solid fa-eye"></i>
                                    <span id="visit">visit</span>
                                </a>
                            </td>
                            <td>
                                <button type="button" onclick="deleteBookmark(${current[i].id})" class="btn btn-danger text-capitalize">
                                    <i class="fa-solid fa-trash"></i>
                                    <span id="del">delete</span>
                                </button>
                            </td>
                            <td>
                            
                                <button type="button" onclick="fillInputs(${current[i].id})" class="btn btn-info text-white text-capitalize">
                                <i class="fa-solid fa-pen-to-square"></i>
                                <span id="edit">edit</span>
                                </button>

                            
                            </td>
                        </tr>
        
        `

    }

    bookmarkList.innerHTML = cartoona;
}



function clearInputs() {
    siteName.value = "";
    siteUrl.value = "";
    validCheck[0].style.display = "none"
    validCheck[1].style.display = "none"
    siteUrl.style.cssText = ` border:none `
    siteName.style.cssText = ` border:none `
}


function deleteBookmark(id) {
    let index = bookmarks.findIndex(function (bookmark) {
        return bookmark.id == id
    })


    Swal.fire({
        title: 'Are you sure?',
        html: `Do you really want to delete this <span class=fw-bold>bookmark</span>? 
        This action cannot be undone.`,
        icon: 'warning', // Warning icon
        showCancelButton: true, // Adds a Cancel button
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
        confirmButtonColor: '#d33', // Red color for the confirm button
        cancelButtonColor: '#3085d6', // Default blue for the cancel button
    }).then((result) => {
        if (result.isConfirmed) {
            // If the user confirms
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                html: 'The <span class=fw-bold>bookmark</span> has been deleted successfully.',
            });
            bookmarks.splice(index, 1);
            localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
            displayBookmarks()
            search()
            // Add your delete logic here
        } else if (result.isDismissed) {
            // If the user cancels
            Swal.fire({
                icon: 'info',
                title: 'Cancelled',
                html: 'Your <span class=fw-bold>bookmark</span> is safe!',
            });
        }
    });









}

function fillInputs(id) {
    bookToEdit = bookmarks.filter(function (bookmark) {
        return bookmark.id == id
    })[0]

    siteName.value = bookToEdit.name
    siteUrl.value = bookToEdit.url
    addOrEdit[0].classList.replace("d-block", "d-none")
    addOrEdit[1].classList.replace("d-none", "d-block")


}

function editBookmark() {
    if (bookToEdit.name.toLowerCase() != siteName.value.toLowerCase()
        || bookToEdit.url.toLowerCase() != siteUrl.value.toLowerCase()) {
        bookToEdit.name = siteName.value.trim();
        bookToEdit.url = siteUrl.value.trim();
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
        displayBookmarks()
        clearInputs()
        addOrEdit[1].classList.replace("d-block", "d-none")
        addOrEdit[0].classList.replace("d-none", "d-block")
        Swal.fire({
            title: 'Success!',
            html: 'Your <span class=fw-bold>Bookmark</span> Is Edited successfully.',
            icon: 'success',

        });
    } else {
        clearInputs()
        addOrEdit[0].classList.replace("d-none", "d-block")
        addOrEdit[1].classList.replace("d-block", "d-none")
        Swal.fire({
            title: 'No Edits Added!',
            html: 'Your <span class=fw-bold>Bookmark</span> Is As It Was.',
            icon: 'info',

        });


    }

}



function search() {
    let searchValue = bookmarkSearch.value.toLowerCase()

    filteredBookmarks = [];
    if (searchValue) {


        filteredBookmarks = bookmarks.filter(function (bookmark) {
            return bookmark.name.toLowerCase().includes(searchValue.toLowerCase())
        })
        displayBookmarks(filteredBookmarks)




    } else {
        displayBookmarks()
    }




}




function validateInputs() {
    let name = siteName.value.trim();
    let url = siteUrl.value.trim();

    let isValid = false
    if (name && url) {
        if (nameRegx.test(name) && urlRegx.test(url)) {
            isValid = true
        } else {
            isValid = false
            Swal.fire({
                html: `
                    <div id="error-alert" class= "d-flex flex-column" role="alert">
                     <p class="text-capitalize fw-bold fs-5 text-start mb-0">

                        Site Name or Url is not valid, Please follow the rules below :

                    <p/>

                    <ul class="fa-ul text-start">
                    <li><span class="fa-li"><i class="fa-solid fa-check-square"></i></span>Site name must contain at least 3 characters</li>
                    <li><span class="fa-li"><i class="fa-solid fa-check-square"></i></span>Site URL must be a valid one</li>
                    </ul>
                    
                    </div>
                   
                    
       
                `,
                icon: 'error',
                confirmButtonText: 'Try Again'
            });

        }
    } else {
        Swal.fire({
            html: `
                    <div id="error-alert" class= "d-flex flex-column" role="alert">
                     <p class="text-capitalize fw-bold fs-5 text-start mb-0">

                        Site Name or Url is not valid, Please follow the rules below :

                    <p/>

                    <ul class=" text-start list-unstyled">
                    <li class="d-flex column-gap-2 align-items-start mb-2"><i class="fa-solid text-danger align-self-center fa-check-square"></i>Site name must contain at least 3 characters</li>
                    <li class="d-flex column-gap-2 align-items-start"><i class="fa-solid text-danger fa-check-square"></i>Site URL must be a valid one , it must follows the following rules</li>
                      <ul class="list-unstyled px-3 mt-2">
                        <li> <i class="fa-solid text-danger fa-asterisk"></i> Start with <strong>http://</strong> or <strong>https://</strong>.</li>
                        <li class="my-2"> <i class="fa-solid text-danger fa-asterisk"></i> Include a valid domain name (e.g., <strong>example</strong>).</li>
                        <li> <i class="fa-solid text-danger fa-asterisk"></i> Use a valid TLD (e.g., <strong>.com</strong>, <strong>.org</strong>).</li>
                        

                        

                    </ul>

                    <p class="mt-2 mb-0">
                    E.g. https://www.example.com 
                    Or http://example.com <br>
                    </p>
                
                    

                        
                           
                    
                    </ul>
                    
                    </div>
                   
                    
       
                `,
            icon: 'error',
            confirmButtonText: 'Try Again'
        });
    }
    return isValid;

}


function generateId() {
    let randomID = Math.floor(Math.random() * 10000);
    if (randomID == lastRandomId) {
        generateId()
    }
    lastRandomId = randomID
    return randomID;

}



