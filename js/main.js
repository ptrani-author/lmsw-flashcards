const flashcards = [
  ...flashcards_domain_1,
  ...flashcards_domain_2,
  ...flashcards_domain_3,
  ...flashcards_domain_4
];

// Variabili globali
let currentIndex = 0;
let filteredCards = [...flashcards];

// Selettori DOM
const flashcardElement = document.getElementById('flashcard');
const frontFlipHint = document.getElementById('frontFlipHint');
const backFlipHint = document.getElementById('backFlipHint');
const answerContent = document.getElementById('answerContent');
const domainSelector = document.getElementById('domainSelector');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const resetBtn = document.getElementById('resetBtn');
const currentCardNumElement = document.getElementById('currentCardNum');
const totalCardsElement = document.getElementById('totalCards');

// Funzione per verificare la risposta
function checkAnswer(optionElement, optionIndex) {
  // Clear previous feedback
  const options = document.querySelectorAll('.option');
  options.forEach(opt => {
    opt.classList.remove('option-correct', 'option-incorrect');
  });
  
  const card = filteredCards[currentIndex];
  const letter = String.fromCharCode(65 + optionIndex); // Convert 0->A, 1->B, etc.
  
  if (letter === card.correctAnswer) {
    optionElement.classList.add('option-correct');
  } else {
    optionElement.classList.add('option-incorrect');
    
    // Also highlight the correct answer
    options.forEach((opt, i) => {
      const optLetter = String.fromCharCode(65 + i);
      if (optLetter === card.correctAnswer) {
        opt.classList.add('option-correct');
      }
    });
  }
}

// Formattazione potenziata delle risposte
function enhanceAnswerFormat(html) {
  let content = html;
  
  const termsToHighlight = [
    'immediately', 'caution', 'warning', 'remember', 'important', 'critical',
    'prioritize', 'urgent', 'emergency', 'life-threatening', 'safety', 'risk',
    'confidentiality', 'ethical', 'self-determination', 'informed consent'
  ];
  
  termsToHighlight.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    content = content.replace(regex, match =>
      `<span class="key-term">${match}</span>`);
  });
  
  return content;
}

// Aggiornamento della flashcard visualizzata
function updateCard() {
  if (filteredCards.length === 0) {
    alert("No flashcards available for this domain");
    return;
  }
  
  const card = filteredCards[currentIndex];
  
  const cardTypeElement = flashcardElement.querySelector('.card-type');
  const questionTextElement = flashcardElement.querySelector('.question-text');
  const optionsElement = flashcardElement.querySelector('.options');
  
  cardTypeElement.textContent = card.type;
  questionTextElement.innerHTML = card.question;
  
  // Clear previous options
  optionsElement.innerHTML = '';
  
  // Add options
  card.options.forEach((option, index) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'option';
    optionElement.textContent = option;
    
    // Add click handler to each option
    optionElement.addEventListener('click', function() {
      checkAnswer(this, index);
    });
    
    optionsElement.appendChild(optionElement);
  });
  
  // Apply enhanced formatting to the answer
  answerContent.innerHTML = enhanceAnswerFormat(card.answer);
  
  // Update card counter
  currentCardNumElement.textContent = currentIndex + 1;
  totalCardsElement.textContent = filteredCards.length;
  
  // Ensure the card shows the front side
  flashcardElement.classList.remove('flipped');
  
  // Clear any previous answer feedback
  const options = document.querySelectorAll('.option');
  options.forEach(opt => {
    opt.classList.remove('option-correct', 'option-incorrect');
  });
}

// Event Listeners
// Flip to back - ONLY when clicking the flip hint
frontFlipHint.addEventListener('click', () => {
  flashcardElement.classList.add('flipped');
});

// Flip to front
backFlipHint.addEventListener('click', () => {
  flashcardElement.classList.remove('flipped');
});

// Handle domain selection changes
domainSelector.addEventListener('change', function() {
  const domain = this.value;
  
  if (domain === 'all') {
    filteredCards = [...flashcards];
  } else {
    filteredCards = flashcards.filter(card => card.domain === domain);
  }
  
  currentIndex = 0;
  updateCard();
});

// Navigation buttons
nextBtn.addEventListener('click', () => {
  if (currentIndex < filteredCards.length - 1) {
    currentIndex++;
    updateCard();
  }
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCard();
  }
});

// Reset button
resetBtn.addEventListener('click', () => {
  currentIndex = 0;
  updateCard();
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCard();
});