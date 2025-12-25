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
})
export class App implements OnInit {
  activeList: VocabItem[] = [];
  errorList: VocabItem[] = [];

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

    // Move error list → active list
    this.activeList = [...this.errorList];
    this.errorList = [];

    this.roundNumber++;
    this.successPercentage = 0;
    //this.feedback = `🔁 Starting List<${this.roundNumber}>`;
    this.feedback = '';

    this.pickRandomWord();
  }

  startNewRound() {
    this.totalWordsInRound = this.activeList.length;
    this.correctInRound = 0;
    this.successPercentage = 0;
    this.answeredInRound = 0;
  }
}
