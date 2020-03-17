(function () {
  const base_url = 'https://lighthouse-user-api.herokuapp.com'
  const index_url = base_url + '/api/v1/users/'
  const data = []
  const dataPanel = document.querySelector('#data-panel')
  const socialList = document.querySelector('#social-list')
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  const pagination = document.getElementById('pagination')
  const displaybtn = document.querySelector('.displaybtn')

  let paginationData = []
  const item_page = 12
  let mode = 'cardmode'
  let currentPage = 1



  axios.get(index_url)
    .then((res) => {
      data.push(...res.data.results)
      console.log(data)
      getTotalPages(data)
      getpageData(1, data)
    }).catch(err => console.log(err))

  dataPanel.addEventListener('click', function (e) {
    if (e.target.matches('.fa-info-circle') ||
      e.target.matches('.rounded-circle')) {
      const show_url = index_url + e.target.dataset.id
      axios.get(show_url)
        .then(res => {
          const index = res.data
          showsocialList(index)
        })
        .catch(err => console.log(err))
    }
  })


  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / item_page) || 1
    let pagecontent = ''
    for (let i = 0; i < totalPages; i++) {
      pagecontent += `<li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>`
    }
    pagination.innerHTML = pagecontent
  }

  function showsocialList(index) {
    socialList.innerHTML = `<div class="col-sm-6" id="social-image">
                            <img src="${index.avatar}" alt="">
                          </div> 
                          <div class="col-sm-6">
                            <h3 class="title text-center mb-4">${index.name} ${index.surname} (${index.age}y)</h3>
                            <p id="social-date" class="ml-2"><i class="fa fa-birthday-cake"></i>  ${index.birthday}</p>
                            <p id="social-region" class="ml-2"><i class="fa fa-location-arrow"></i> ${index.region}</p>
                            <p id="social-gender" class="ml-2"><i class="fa fa fa-venus-mars"></i> ${index.gender}</p>
                            <p id="social-email" class="ml-2"><i class="fa fa fa-envelope"></i> ${index.email}</p>
                          </div> `
  }
  function displayDataList(data) {
    let html_content = ''
    data.forEach((item) => {
      html_content += `
          <div class="card listcard mb-4">
            <div class="like-btn"><i class="fa fa-info-circle" data-target="#listmodal" data-toggle="modal" data-id="${item.id}"></i></div>
            <img class="rounded-circle" src="${item.avatar}" alt="Card image cap" data-target="#listmodal" data-toggle="modal" data-id="${item.id}">
            <div class="card-body">
            <h5 class="card-text text-center">${item.name} ${item.surname}</h5>
          </div>
          </div>
        `
    })
    dataPanel.innerHTML = html_content
  }

  searchForm.addEventListener('submit', event => {  //搜尋監聽
    event.preventDefault()
    console.log('click!')
    let input = searchInput.value.toLowerCase()
    let results = data.filter(
      result => result.name.toLowerCase().includes(input)
    )
    getTotalPages(results)
    getpageData(1, results)

  })

  //監聽分頁
  pagination.addEventListener('click', function (e) {
    console.log(e.target.dataset.page)
    if (e.target.tagName === 'A') {
      getpageData(e.target.dataset.page)
      currentPage = e.target.dataset.page
    }
  })

  function getpageData(pagenum, data) {
    paginationData = data || paginationData
    let offset = (pagenum - 1) * item_page
    let pageData = paginationData.slice(offset, offset + item_page)
    displayData(pageData)
  }

  function displayList(data) {
    let htmlContent = '<ul class="list-group list-group-flush col-12">'
    data.forEach(function (item, index) {
      htmlContent += `
                     <li class="list-group-item d-flex justify-content-around align-items-center">${item.name}(${item.age}y)<img class="rounded-circle newsrc" src="${item.avatar}" alt="Card image cap" data-target="#listmodal" data-toggle="modal" data-id="${item.id}">
                     <p>${item.gender}</p></li>
                     
                     `
    })
    htmlContent += `</ul>`
    dataPanel.innerHTML = htmlContent
  }

  displaybtn.addEventListener('click', function (e) {
    if (e.target.matches('.fa-th')) {
      mode = 'cardmode'
    } else if (e.target.matches('.fa-bars')) {
      mode = 'listmode'
    }
    getpageData(currentPage, paginationData)
  })

  function displayData(data) {
    if (mode === 'cardmode') {
      displayDataList(data)
    } else if (mode === 'listmode') {
      displayList(data)
    }
  }


})()



