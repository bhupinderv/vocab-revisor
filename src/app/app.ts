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
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  vocabList: VocabItem[] = [];
  currentWord: VocabItem | null = null;
  userAnswer: string = '';
  feedback: string = '';
  wordsRemaining: number = 0;
  completed: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadVocab();
  }

  loadVocab() {
    this.http.get('assets/vocab.txt', { responseType: 'text' }).subscribe(
      (data) => {
        const lines = data.split('\n');
        for (let line of lines) {
          line = line.trim();
          if (!line || line.startsWith('#')) continue;
          const parts = line.split('=');
          if (parts.length === 2) {
            this.vocabList.push({ word: parts[0].trim(), meaning: parts[1].trim() });
          }
        }
        this.wordsRemaining = this.vocabList.length;
        this.pickRandomWord();
      },
      (error) => {
        console.error('Error loading vocab file:', error);
      }
    );
  }

  pickRandomWord() {
    if (this.vocabList.length === 0) {
      this.completed = true;
      this.currentWord = null;
      return;
    }
    const index = Math.floor(Math.random() * this.vocabList.length);
    this.currentWord = this.vocabList[index];
  }

  checkAnswer() {
    if (!this.currentWord) return;

    if (this.userAnswer.trim().toLowerCase() === this.currentWord.meaning.toLowerCase()) {
      this.feedback = `✅ Correct! "${this.currentWord.word}" removed.`;
      this.vocabList = this.vocabList.filter(item => item !== this.currentWord);
    } else {
      this.feedback = `❌ Wrong. Correct meaning: "${this.currentWord.meaning}"`;
    }

    this.userAnswer = '';
    this.wordsRemaining = this.vocabList.length;
    this.pickRandomWord();
  }
}
