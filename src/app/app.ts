import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface VocabItem {
  word: string;
  meaning: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'], // Make sure this path is correct!
})
export class App implements OnInit {
  // Existing properties
  showPrompt = false; // New property to control the visibility of the prompt

  activeList: VocabItem[] = [];
  errorList: VocabItem[] = [];
  finalErrorList: VocabItem[] = [];

  currentWord: VocabItem | null = null;
  userAnswer = '';
  feedback = '';

  roundNumber = 0;
  completed = false;
  totalWordsInRound = 0;
  correctInRound = 0;
  successPercentage = 0;
  answeredInRound = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadVocab();
  }

  loadVocab() {
    this.http.get('/assets/vocab.txt', { responseType: 'text' }).subscribe((text) => {
      this.activeList = text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'))
        .map((line) => {
          const [word, meaning] = line.split('=');
          return { word: word.trim(), meaning: meaning.trim() };
        });

      this.pickRandomWord();
    });
    this.startNewRound();
  }

  pickRandomWord() {
    if (this.activeList.length === 0) {
      this.advanceRound();
      return;
    }

    const index = Math.floor(Math.random() * this.activeList.length);
    this.currentWord = this.activeList[index];
  }

  checkAnswer() {
    if (!this.currentWord) return;

    const correct = this.userAnswer.trim().toLowerCase() === this.currentWord.meaning.toLowerCase();

    // Remove from active list
    this.activeList = this.activeList.filter((v) => v !== this.currentWord);
    this.answeredInRound++;

    if (correct) {
      this.correctInRound++;
      this.feedback = `✅ Correct`;
    } else {
      this.feedback = `❌ Wrong — ${this.currentWord.meaning}`;
      this.errorList.push(this.currentWord);
    }

    this.successPercentage =
      this.totalWordsInRound === 0
        ? 0
        : Math.round((this.correctInRound / this.answeredInRound) * 100);

    this.userAnswer = '';
    this.pickRandomWord();
  }

  advanceRound() {
    if (this.errorList.length === 0) {
      this.completed = true;
      this.currentWord = null;
      return;
    }

    // prepare next round using errorList
    this.addErrorsToFinalList();

    // Move error list → active list
    this.activeList = [...this.errorList];
    this.errorList = [];

    this.roundNumber++;
    this.successPercentage = 0;
    //this.feedback = `🔁 Starting List<${this.roundNumber}>`;
    this.feedback = '';

    // Show the prompt before advancing to the next round
    this.showPrompt = true;

    this.pickRandomWord();
  }

  startNewRound() {
    this.totalWordsInRound = this.activeList.length;
    this.correctInRound = 0;
    this.successPercentage = 0;
    this.answeredInRound = 0;
  }

  handlePromptResponse(continueGame: boolean) {
    console.log('User selected to ' + (continueGame ? 'continue' : 'exit'));
    this.showPrompt = false; // Hide the prompt
    console.log('showPrompt set to ' + this.showPrompt);
    console.log('continueGame set to ' + continueGame);
    console.log('Error list length: ' + this.errorList.length);

    if (continueGame) {
      console.log('Continuing to next round');
      //this.advanceRound();
    } else {
      // Exit the program (mark as completed)
      this.completed = true;
      this.currentWord = null;
    }
  }

  addErrorsToFinalList() {
    // Add unique errors to finalErrorList
    /*
    this.errorList.forEach(item => {
      const alreadyExists = this.finalErrorList.some(
        e => e.word === item.word
      );
  
      if (!alreadyExists) {
        this.finalErrorList.push({
          word: item.word,
          meaning: item.meaning
        });
      }
    });
    */

    // Add all errors including duplicates to finalErrorList
    this.errorList.forEach((item) => {
      this.finalErrorList.push({
        word: item.word,
        meaning: item.meaning,
      });
    });
  }
}
