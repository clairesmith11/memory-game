const rainbow = '<i class="fas fa-rainbow fa-5x"></i>';
const umbrella = '<i class="fas fa-umbrella fa-5x"></i>';
const bolt = '<i class="fas fa-bolt fa-5x"></i>';
const cloud = '<i class="fas fa-cloud-rain fa-5x"></i>';
const moon = '<i class="fas fa-moon fa-5x"></i>';
const snow = '<i class="fas fa-snowflake fa-5x"></i>';
const sun = '<i class="far fa-sun fa-5x"></i>';
const wind = '<i class="fas fa-wind fa-5x"></i>';
const meteor = '<i class="fas fa-meteor fa-5x"></i>';
const cold = '<i class="fas fa-temperature-low fa-5x"></i>';

const cards = [
    { icon: rainbow, position: Math.floor(Math.random() * 19), id: 'rainbow-1' },
    { icon: rainbow, position: Math.floor(Math.random() * 19), id: 'rainbow-2' },
    { icon: umbrella, position: Math.floor(Math.random() * 19), id: 'umbrella-1' },
    { icon: umbrella, position: Math.floor(Math.random() * 19), id: 'umbrella-2' },
    { icon: bolt, position: Math.floor(Math.random() * 19), id: 'bolt-1' },
    { icon: bolt, position: Math.floor(Math.random() * 19), id: 'bolt-2' },
    { icon: cloud, position: Math.floor(Math.random() * 19), id: 'cloud-1' },
    { icon: cloud, position: Math.floor(Math.random() * 19), id: 'cloud-2' },
    { icon: moon, position: Math.floor(Math.random() * 19), id: 'moon-1' },
    { icon: moon, position: Math.floor(Math.random() * 19), id: 'moon-2' },
    { icon: snow, position: Math.floor(Math.random() * 19), id: 'snow-1' },
    { icon: snow, position: Math.floor(Math.random() * 19), id: 'snow-2' },
    { icon: sun, position: Math.floor(Math.random() * 19), id: 'sun-1' },
    { icon: sun, position: Math.floor(Math.random() * 19), id: 'sun-2' },
    { icon: wind, position: Math.floor(Math.random() * 19), id: 'wind-1' },
    { icon: wind, position: Math.floor(Math.random() * 19), id: 'wind-2' },
    { icon: meteor, position: Math.floor(Math.random() * 19), id: 'meteor-1' },
    { icon: meteor, position: Math.floor(Math.random() * 19), id: 'meteor-2' },
    { icon: cold, position: Math.floor(Math.random() * 19), id: 'cold-1' },
    { icon: cold, position: Math.floor(Math.random() * 19), id: 'cold-2' }
];

// Display and sort cards grid
cards.sort((a, b) => a.position - b.position).map((card) => {
    $('.cards-container').append(`
    <div class="cards">
            <div class=card-body id=${card.id}>
                <div class=card-body__card-front ></div>
                <div class=card-body__card-back>${card.icon}</div>
            </div>
  
    </div>`);
});

let gameTimer;

// Initialize game
const init = () => {
    // Beginning state
    state = {
        numFlipped: 0,
        timeElapsed: 0,
        moves: 0,
        selectedCards: [],
        correctPairs: 0,
    };
    // All cards face down
    $('.card-body').removeClass('clicked');
    // Set score box values
    $('.score-box__moves-counter').html(state.moves);
    // Set game timer and display time
    gameTimer = setInterval(() => {
        state.timeElapsed = state.timeElapsed + 1000;
        $('.time-elapsed').html(convertTime(state.timeElapsed));
    }, 1000);
};

// Call initial state on page load
$(document).ready(init());


// Convert miliseconds to readable timer format
const convertTime = (miliseconds) => {
    let totalSeconds = Math.floor(miliseconds / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds - minutes * 60;
    let sec = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ':' + sec;
};

// Calculate a final rating based on number of moves and time to complete
const calcRating = (time, moves) => {
    let rating;
    if (time < 45000 && moves < 40) {
        rating = `<span>&#x2606;&#x2606;&#x2606;&#x2606;&#x2606;</span>`;
    } else if (time > 45000 && time < 100000 || moves > 40 && moves < 50) {
        rating = `<span>&#x2606;&#x2606;&#x2606;&#x2606;</span>`;
    } else if (time > 100000 && time < 150000 || moves > 50 && moves < 60) {
        rating = `<span>&#x2606;&#x2606;&#x2606;</span>`;
    } else {
        rating = `<span>&#x2606;&#x2606;</span>`;
    }

    return rating;
};

// Flip cards back and forth
const toggleCard = (e) => {
    let id;
    let parentElement;

    if (e.target.parentElement.id === '') {
        parentElement = $(e.target).parent().parent();
    } else {
        parentElement = $(e.target).parent();
    }

    id = '#' + parentElement[0].id;
    $(id).toggleClass('clicked');

};

// Display modal with stats when game is won
const gameIsWon = () => {
    $('.num-moves').html(state.moves);
    $('.final-time-elapsed').html(convertTime(state.timeElapsed));
    $('.rating').html(calcRating(state.timeElapsed, state.moves));
    clearInterval(gameTimer);
    $('.win-modal').addClass('show-modal');
};

// Click on hidden card
$('.card-body__card-front').click((e) => {
    // 1.) Flip card over if there are fewer than 2 cards revealed
    if (state.numFlipped < 2) {
        toggleCard(e);
        state.moves = state.moves + 1;
        $('.score-box__moves-counter').html(state.moves);
        // 2.) Record flipped card
        state.selectedCards.push(e.target.parentElement.id);
        console.log(state.selectedCards);
        state.numFlipped = state.numFlipped + 1;
    }
    // 3.) Compare the two cards
    if (state.numFlipped === 2) {
        compareCards();
    }
});

// Click on revealed card
$('.card-body__card-back').click((e) => {
    toggleCard(e);
    // Reduce number flipped
    state.numFlipped = state.numFlipped - 1;
    // Remove unselected card from selected cards array
    state.selectedCards = state.selectedCards.filter(card => card !== id);
});

// Click on play again or reset
$('button').click(() => {
    location.reload();
});


// Compare flipped cards
const compareCards = () => {
    // If cards match, fade them out after 1.5 seconds
    // Reset state variables
    // Check to see whether game has been won
    if (state.selectedCards[0].split('-')[0] === state.selectedCards[1].split('-')[0]) {
        console.log(state.selectedCards);
        setTimeout(() => {
            state.selectedCards.map(card => {
                $('#' + card).fadeOut();
            });
            state.correctPairs = state.correctPairs + 1;
            state.numFlipped = 0;
            state.selectedCards = [];
            if (state.correctPairs === 10) {
                gameIsWon();
            }
        }, 1500);
    } else {
        // Flip unmatched cards back over after 1.5 seconds and reset selected cards
        setTimeout(() => {
            console.log('no match');
            $('.card-body').removeClass('clicked');
            state.numFlipped = 0;
            state.selectedCards = [];
        }, 1500);
    }
};


