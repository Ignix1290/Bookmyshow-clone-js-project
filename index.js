console.log("index.js loaded");

window.addEventListener("DOMContentLoaded", () =>{

//location functionality
//city modal fuctionality
let city = document.getElementById("location-container");
let modalContainer = document.getElementById("city-modal-container");
let cityModal = document.querySelector(".city-modal");

city.addEventListener("click", () => {
    modalContainer.classList.toggle("active");
    input.value = "";
});

window.addEventListener("click", (e)=>{
    if(modalContainer.classList.contains("active") && !cityModal.contains(e.target) && !city.contains(e.target)){
        modalContainer.classList.remove("active");
    }
});

//city options functionality
let input = document.querySelector("input[placeholder='Search for your city']");
let citySelection = document.querySelector(".city-selection");
let cityContainer = document.getElementById("location");

if(localStorage.getItem("city-name") !== null){
    cityContainer.textContent = localStorage.getItem("city-name");
}else{
    cityContainer.textContent = "Select a city";
}

let apiKey = "a2c9544463msh7d38a96d9a51069p1431e7jsn66bbba57fa2d";

let options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
};

async function listOfCities(searchTerm = ""){
    try{
        let api = "";
        if(searchTerm.trim() === ""){
            api = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=10`;
        }else{
            api = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(searchTerm)}&limit=10`
        }
        const response = await fetch(api, options)
        if(!response.ok){
            throw new Error("response is not ok");
        }
        const data = await response.json();
        //console.log(data.data);
        citySelection.innerHTML = ""; // clear previous cities
        data.data.forEach(cityName => {
            //console.log(cityName.city);
            let cityElement = document.createElement("p");
            cityElement.classList.add("city-options");
            cityElement.textContent = cityName.city;

            cityElement.addEventListener("click", () => {
                cityContainer.textContent = cityElement.textContent;
                if(localStorage.getItem("city-name") !== null){
                    localStorage.removeItem("city-name");
                }
                localStorage.setItem("city-name", cityContainer.textContent);
                modalContainer.classList.remove("active");
            });

            citySelection.appendChild(cityElement);
        });
    }catch(error){ 
        console.log(error);
    }
}

listOfCities();

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

input.addEventListener("input", debounce(() => {
    let searchTerm = input.value.trim();
    listOfCities(searchTerm);
}, 400));


// let cityOptions = document.querySelectorAll(".city-options");
// let cityContainer = document.getElementById("location");
// cityOptions.forEach((cityOption)=>{
//     cityOption.addEventListener("click", ()=>{
//         cityContainer.textContent = cityOption.textContent;
//         modalContainer.classList.remove("active");
//     });
// });


// list of movies
let movieInput = document.querySelector("input[placeholder='Search for Movies, Events, Plays, Sports and Activities']");
let movieApiKey = "7c8f47ca";
let movieSearchModal = document.getElementById("movie-search-modal-container");

movieInput.addEventListener("focus", () => {
    movieSearchModal.style.display = "block";
});

document.addEventListener("click", (e) => {
    if(!movieSearchModal.contains(e.target) && e.target !== movieInput){
        movieSearchModal.style.display = "none";
    }
});

movieInput.addEventListener("input", ()=>{
    let movieName = movieInput.value.trim();
    listOfMovies(movieName, true);
});

async function listOfMovies(movieName = "", isModal = false) {
    try {
        let movieApi = "";
        if (movieName.trim() === "") {
            movieApi = `http://www.omdbapi.com/?s=batman&apikey=${movieApiKey}`;
        } else {
            movieApi = `http://www.omdbapi.com/?s=${encodeURIComponent(movieName)}&apikey=${movieApiKey}`;
        }

        let response = await fetch(movieApi);
        if (!response.ok) throw new Error("Response is not ok");

        let data = await response.json();
        let targetContainer = isModal
            ? document.getElementById("movie-search-modal")
            : document.getElementById("movie-cards");

        targetContainer.innerHTML = "";

        if (data.Search) {
            for (const movie of data.Search) {
                if (isModal) {
                    const titleItem = document.createElement("p");
                    titleItem.textContent = movie.Title;
                    titleItem.classList.add("search-title");
                    titleItem.addEventListener("click", () => {
                        window.location.href = `movie-details.html?id=${movie.imdbID}&fromSearch=true`;
                    });
                    targetContainer.appendChild(titleItem);
                } else {
                    const detailsRes = await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${movieApiKey}`);
                    const details = await detailsRes.json();

                    const card = document.createElement("div");
                    card.classList.add("movie-card");
                    card.innerHTML = `
                        <img src="${details.Poster !== "N/A" ? details.Poster : 'https://via.placeholder.com/220x300?text=No+Image'}" alt="${details.Title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 10px;">
                        <h3>${details.Title}</h3>
                        <p>⭐ IMDb: ${details.imdbRating}</p>
                    `;

                    card.addEventListener("click", () => {
                        window.location.href = `movie-details.html?id=${movie.imdbID}`;
                    });

                    targetContainer.appendChild(card);
                }
            }
        } else {
            targetContainer.innerHTML = "<p>No results found.</p>";
        }
    } catch (error) {
        console.log(error);
    }
}


listOfMovies();

async function getMovieDetails(){
    let urlParam = new URLSearchParams(window.location.search);
    let movieId = urlParam.get("id");
    let isFromSearch = urlParam.get("fromSearch") === "true";
    
    if(!movieId){
        console.error("Movie id not found");
        return;
    }

    try{
        let response = await fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=${movieApiKey}`);
        if(!response){
            throw new Error("Response is not ok");
        }

        let data = await response.json();
        console.log(data);

        document.querySelector(".movie-poster").src = data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/300x400?text=No+Image";
        document.querySelector(".movie-title").textContent = data.Title;
        document.querySelector(".movie-rating").textContent = `⭐ ${data.imdbRating} / 10`;
        document.querySelector(".movie-runtime").textContent = data.Runtime;
        document.querySelector(".movie-genre").textContent = data.Genre;
        document.querySelector(".movie-rated").textContent = data.Rated;
        document.querySelector(".movie-released-date").textContent = data.Released;
        document.querySelector(".movie-plot").textContent = data.Plot;
        document.querySelector(".movie-cast-members").textContent = data.Actors;
        document.querySelector(".movie-director-name").textContent = data.Director;
        document.querySelector(".movie-writers-names").textContent = data.Writer;

    }catch(error){
        console.log(error);
    }

    let buttonContainer = document.getElementById("button-container");
    if(isFromSearch){
        buttonContainer.innerHTML = `
        <button class="rent-button">Rent 119</button>
        <button class="buy-button">Buy 489</button>
        `;
    }else{
        buttonContainer.innerHTML = `
        <button class="book-button">Book Tickets</button>
        `;

        let bookTickets = document.querySelector(".book-button");
        bookTickets.addEventListener("click", ()=>{
            window.location.href = `booking.html?id=${movieId}`;
        });
    }
    // console.log("fromSearch param:", urlParam.get('fromSearch'));
    // console.log("isFromSearch final value:", isFromSearch);
}

getMovieDetails();


async function movieBooking(){
    let urlParam = new URLSearchParams(window.location.search);
    let movieId = urlParam.get("id");

    try{
        let response = await fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=${movieApiKey}`);
        //console.log(response);
        if(!response){
            throw new Error("Response is not ok");
        }

        let movie = await response.json();
        //console.log(movie.Title);

        document.querySelector(".booking-movie-title").textContent = movie.Title;
        document.querySelector(".booking-movie-rated").textContent = movie.Rated;
        document.querySelector(".booking-movie-genre").textContent = movie.Genre;
    }catch(error){
        console.log(error);
    }
}

movieBooking();


function generateBookingDays(){
    let bookingDayContainer = document.getElementById("booking-day");
    let weekdays = ["SUN", "MON", "TUE", "WED", "THR", "FRI", "SAT"];
    let months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    bookingDayContainer.innerHTML = "";

    let today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);

        const day = weekdays[date.getDay()];
        const dayNum = date.getDate();
        const month = months[date.getMonth()];

        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");

        if (i === 0) {
            dayDiv.classList.add("selected"); // highlight today by default
        }
        dayDiv.innerHTML = `
            <p>${day}</p>
            <p>${dayNum}</p>
            <p>${month}</p>
        `;

        bookingDayContainer.appendChild(dayDiv);
    }

    bookingDayContainer.addEventListener("click", (e)=>{
        if(e.target.closest(".day")){
            document.querySelectorAll(".day").forEach(el => el.classList.remove("selected"));
            e.target.closest(".day").classList.add("selected");
        }
    });
}

generateBookingDays();

document.querySelectorAll(".showtime").forEach(timeEl => {
  timeEl.addEventListener("click", () => {
    /*  grab fresh data right NOW, not earlier */
    const movieTitle = document
      .querySelector(".booking-movie-title")
      .textContent.trim();

    const selectedDayEl = document.querySelector(".day.selected");
    const day   = selectedDayEl.children[0].textContent.trim();
    const date  = selectedDayEl.children[1].textContent.trim();
    const month = selectedDayEl.children[2].textContent.trim();

    const selectedTime = timeEl.textContent.trim();

    const theaterName = timeEl
      .closest(".booking-theater-details")
      .querySelector(".theater-name p")
      .textContent.trim();

    /* store everything */
    localStorage.setItem("selectedMovie",   movieTitle);
    localStorage.setItem("selectedDay",     day);
    localStorage.setItem("selectedDate",    date);
    localStorage.setItem("selectedMonth",   month);
    localStorage.setItem("selectedTime",    selectedTime);
    localStorage.setItem("selectedTheater", theaterName);

    window.location.href = "seats.html";
  });
});



});


// seats page logic
window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded on seats.html");

  //retrieving all data from localstorage 
  document.querySelector(".seats-movie-title").textContent = localStorage.getItem("selectedMovie");
  document.querySelector(".seats-theater").textContent = localStorage.getItem("selectedTheater");
  document.querySelector(".seats-city").textContent = localStorage.getItem("city-name");
  document.querySelector(".seats-day").textContent = localStorage.getItem("selectedDay");
  document.querySelector(".seats-month").textContent = localStorage.getItem("selectedMonth");
  document.querySelector(".seats-date").textContent = localStorage.getItem("selectedDate");
  document.querySelector(".seats-time").textContent = localStorage.getItem("selectedTime");

  const closeIcon = document.querySelector(".seats-header-right i");
  closeIcon.addEventListener("click", () => {
    console.log("Seats Close Clicked");
    window.history.back();
  });

  const storedTime = (localStorage.getItem("selectedTime") || "").trim();
  document.querySelectorAll(".seat-showtime").forEach(timeEl => {
    const thisTime = timeEl.textContent.trim();

    if (thisTime === storedTime) {
      timeEl.classList.add("time-selected");
    } else {
      timeEl.classList.remove("time-selected");
    }

    timeEl.addEventListener("click", () => {
      document
        .querySelectorAll(".seat-showtime")
        .forEach(el => el.classList.remove("time-selected"));

      timeEl.classList.add("time-selected");

      localStorage.setItem("selectedTime", thisTime);
      document.querySelector(".seats-time").textContent = localStorage.getItem("selectedTime");
    });
  });


  let seatRow = document.querySelectorAll(".seat-row");
  seatRow.forEach(row =>{
    let rowLetter = row.dataset.row;

    for(let i = 1; i <= 16; i++){
        const seat = document.createElement("div");
        seat.classList.add("seat");
        seat.textContent = `${rowLetter}${i}`;

        if(i == 9){
            let gap = document.createElement("div");
            gap.classList.add("seat-gap");
            row.appendChild(gap);
        }
        row.appendChild(seat);

        //seat click functionality
        seat.addEventListener("click", ()=>{
            seat.classList.toggle("selected");
            updatePaymentVisibility();
        });
    }
  });

  let paymentContainer = document.getElementById("seat-payment-container");
  let seatPaymentButton = document.getElementById("seat-payment");
  function updatePaymentVisibility(){
    // console.log("button clicked");
    let selectedSeats = document.querySelectorAll(".seat.selected");
    let totalPrice = 0;

    selectedSeats.forEach(seat =>{
        let section = seat.closest("[data-price]");
        if(section){
            let price = parseInt(section.dataset.price);
            totalPrice += price;
        }
    });

    if(selectedSeats.length > 0){
        paymentContainer.style.display = "flex";
        seatPaymentButton.textContent = `Pay Rs. ${totalPrice}`;
    }else{
        paymentContainer.style.display = "none";
    }
    // console.log(totalPrice);
  }

  let seatNoteModal = document.getElementById("seat-modal-container");
  seatPaymentButton.addEventListener("click", ()=>{
    seatNoteModal.style.display = "flex";
    document.body.style.overflow = "hidden" //disable scroll
  });

  document.querySelector(".seat-note-close").addEventListener("click", ()=>{
    seatNoteModal.style.display = "none";
    document.body.style.overflow = "auto"; //enable scroll
  });

  document.getElementById("seat-note-cancel").addEventListener("click", ()=>{
    seatNoteModal.style.display = "none";
    document.body.style.overflow = "auto";
  });

  document.getElementById("seat-note-ok").addEventListener("click", ()=>{
      //getting all the data to store in localstorage, so that I can get those data in booking summary page
  let selectedSeats = document.querySelectorAll(".seat.selected");
  let selectedSeatNames = Array.from(selectedSeats).map(seat => seat.textContent.trim());
  let ticketCount = selectedSeats.length;
  let priceBlock = selectedSeats[0].closest("[data-price]");
  let seatPrice = parseInt(priceBlock.dataset.price);
  let seatType = priceBlock.classList.contains("seat-recliner")
                 ? "RECLINER"
                 : priceBlock.classList.contains("seat-prime")
                 ? "PRIME"
                 : "CLASSIC";
  let seatSubtotal = seatPrice * ticketCount;
  let seatTotal = seatSubtotal + 35.00;

  console.log("Saving to localStorage...");
  localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
  localStorage.setItem("selectedSeatNames", JSON.stringify(selectedSeatNames));
  localStorage.setItem("ticketCount", ticketCount);
  localStorage.setItem("seatPrice", seatPrice);
  localStorage.setItem("seatType", seatType);
  localStorage.setItem("seatSubtotal", seatSubtotal);
  localStorage.setItem("seatTotal", seatTotal);
  window.location.href = "booking-summary.html";
  });
});


//booking summary logic 
window.addEventListener("DOMContentLoaded", ()=>{
  console.log("DOM fully loaded on booking-summary.html");

  const closeIcon = document.querySelector(".seats-header-right i");
  closeIcon.addEventListener("click", () => {
    console.log("Booking Summary Close Clicked");
    window.history.back();
  });

  let seatType = document.querySelector(".booking-summary-seatType");
  let seatStoredType = localStorage.getItem("seatType");
  let seatSubtotal = document.querySelector(".booking-summary-seatSubtotal");
  let total = document.querySelector(".booking-summary-total");
  let ticketCount = parseInt(localStorage.getItem("ticketCount"));
  let selectedSeatNames = JSON.parse(localStorage.getItem("selectedSeatNames"));

  seatType.textContent = `${seatStoredType} - ${selectedSeatNames} (${ticketCount} ${ticketCount === 1? "Ticket" : "Tickets"})`;
  seatSubtotal.textContent = "Rs." + parseFloat(localStorage.getItem("seatSubtotal")).toFixed(2);
  total.textContent = "Rs." + parseFloat(localStorage.getItem("seatTotal")).toFixed(2);
  //console.log(seatType, seatSubtotal, total);
  document.querySelector("#booking-summary-button span:first-child").textContent = `TOTAL: Rs. ${total.textContent}`;

  const mTicket = document.getElementById("m-ticket");
  const boxOfficePickup = document.getElementById("box-office-pickup");

  function selectTicket(block, value) {
    block.querySelector('input[type="radio"]').checked = true;
    localStorage.setItem("selectedTicketOption", value); 
  }

  selectTicket(mTicket, "M-Ticket");

  mTicket.addEventListener("click", () => selectTicket(mTicket, "M-Ticket"));
  boxOfficePickup.addEventListener("click", () => selectTicket(boxOfficePickup, "Box Office Pickup"));

  document.getElementById("booking-summary-button").addEventListener("click", ()=>{
    window.location.href = "payment.html";
  })
});


//payment page logic
window.addEventListener("DOMContentLoaded", ()=>{

    //logic for radio button block
    document.querySelectorAll(".upi").forEach(upi =>{
        upi.addEventListener("click", () => {
            upi.querySelector("input[type=radio]").checked = true;
        });
    });

    //payment method functionality
    let payByUpi = document.getElementById("payByUpi");
    let payByCard = document.getElementById("payByCard");

    payByUpi.classList.add("active-option");

    [payByUpi, payByCard].forEach((method)=>{
        method.addEventListener("click", ()=>{
            //remove from both
            payByUpi.classList.remove("active-option");
            payByCard.classList.remove("active-option");
            //add to current one
            method.classList.add("active-option");
        });
    });

    document.querySelectorAll(".upi").forEach(upi => {
        upi.addEventListener("click", ()=>{
            document.getElementById("upi-details-container").style.display = "block";

            const upiName = upi.querySelector("span").textContent;
            document.querySelector(".upi-selected").textContent = upiName;
        });
    });

    // Back button functionality
    document.querySelector("#upi-details-header i").addEventListener("click", () => {
        document.getElementById("upi-details-container").style.display = "none";
    });
});