import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatIconModule } from "@angular/material/icon"
import { hiraganaData } from "../data/hiragana"
import { katakanaData } from "../data/katakana"

interface KanaGroup {
  title: string
  characters: any[]
}

@Component({
  selector: "app-kana-chart",
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400">
          {{ showHiragana ? 'Hiragana' : 'Katakana' }} Chart
        </h2>
        
        <div class="flex items-center gap-2">
          <button 
            (click)="toggleKanaType()" 
            class="bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <mat-icon class="mr-2">swap_horiz</mat-icon>
            Switch to {{ showHiragana ? 'Katakana' : 'Hiragana' }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Basic Kana -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <h3 class="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">Basic {{ showHiragana ? 'Hiragana' : 'Katakana' }}</h3>
          
          <div class="grid grid-cols-5 gap-1">
            @for (char of basicKana; track char.romaji) {
              <div class="border dark:border-gray-700 p-2 text-center">
                <div class="text-2xl font-japanese mb-1">{{ char.character }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">{{ char.romaji }}</div>
              </div>
            }
          </div>
        </div>

        <!-- Dakuten Kana -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <h3 class="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">Dakuten {{ showHiragana ? 'Hiragana' : 'Katakana' }}</h3>
          
          <div class="grid grid-cols-5 gap-1">
            @for (char of dakutenKana; track char.romaji) {
              <div class="border dark:border-gray-700 p-2 text-center">
                <div class="text-2xl font-japanese mb-1">{{ char.character }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">{{ char.romaji }}</div>
              </div>
            }
          </div>
        </div>

        <!-- Combination Kana -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <h3 class="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">Combination {{ showHiragana ? 'Hiragana' : 'Katakana' }}</h3>
          
          <div class="grid grid-cols-3 gap-1">
            @for (char of combinationKana; track char.romaji) {
              <div class="border dark:border-gray-700 p-2 text-center">
                <div class="text-2xl font-japanese mb-1">{{ char.character }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">{{ char.romaji }}</div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Detailed Chart -->
      <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 class="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">Complete {{ showHiragana ? 'Hiragana' : 'Katakana' }} Chart</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Left side: Basic and Dakuten -->
          <div>
            <h4 class="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">Basic & Voiced Sounds</h4>
            
            <div class="grid grid-cols-5 gap-1">
              @for (group of basicGroups; track group.title) {
                @for (char of group.characters; track char.romaji) {
                  <div class="border dark:border-gray-700 p-2 text-center">
                    <div class="text-2xl font-japanese mb-1">{{ char.character }}</div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">{{ char.romaji }}</div>
                  </div>
                }
              }
            </div>
          </div>
          
          <!-- Right side: Combinations -->
          <div>
            <h4 class="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">Combination Sounds</h4>
            
            <div class="grid grid-cols-3 gap-1">
              @for (group of combinationGroups; track group.title) {
                @for (char of group.characters; track char.romaji) {
                  <div class="border dark:border-gray-700 p-2 text-center">
                    <div class="text-2xl font-japanese mb-1">{{ char.character }}</div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">{{ char.romaji }}</div>
                  </div>
                }
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .font-japanese {
      font-family: 'Noto Sans JP', sans-serif;
    }
    `
  ]
})
export class KanaChartComponent implements OnInit {
  showHiragana = true
  basicKana: any[] = []
  dakutenKana: any[] = []
  combinationKana: any[] = []
  basicGroups: KanaGroup[] = []
  combinationGroups: KanaGroup[] = []

  ngOnInit() {
    this.organizeKana()
  }

  toggleKanaType() {
    this.showHiragana = !this.showHiragana
    this.organizeKana()
  }

  organizeKana() {
    const data = this.showHiragana ? hiraganaData : katakanaData
    
    // Filter basic kana (a, ka, sa, ta, na, ha, ma, ya, ra, wa rows)
    this.basicKana = data.filter(char => {
      const group = this.showHiragana 
        ? ['あ行', 'か行', 'さ行', 'た行', 'な行', 'は行', 'ま行', 'や行', 'ら行', 'わ行']
        : ['ア行', 'カ行', 'サ行', 'タ行', 'ナ行', 'ハ行', 'マ行', 'ヤ行', 'ラ行', 'ワ行']
      return group.includes(char.group)
    })

    // Filter dakuten kana (ga, za, da, ba, pa rows)
    this.dakutenKana = data.filter(char => {
      const group = this.showHiragana 
        ? ['だくてん', 'はんだくてん']
        : ['ダクテン', 'ハンダクテン']
      return group.includes(char.group)
    })

    // Filter combination kana (kya, sha, etc.)
    this.combinationKana = data.filter(char => {
      const group = this.showHiragana 
        ? ['ようおん', 'ようおん だくてん', 'ようおん はんだくてん']
        : ['ヨウオン', 'ヨウオン ダクテン', 'ヨウオン ハンダクテン']
      return group.includes(char.group)
    })

    // Organize into groups for the detailed chart
    this.organizeGroups()
  }

  organizeGroups() {
    // Basic groups (a, ka, sa, etc.)
    const basicGroupNames = this.showHiragana 
      ? ['あ行', 'か行', 'さ行', 'た行', 'な行', 'は行', 'ま行', 'や行', 'ら行', 'わ行', 'だくてん', 'はんだくてん']
      : ['ア行', 'カ行', 'サ行', 'タ行', 'ナ行', 'ハ行', 'マ行', 'ヤ行', 'ラ行', 'ワ行', 'ダクテン', 'ハンダクテン']
    
    this.basicGroups = []
    
    for (const groupName of basicGroupNames) {
      const chars = (this.showHiragana ? hiraganaData : katakanaData).filter(char => char.group === groupName)
      if (chars.length > 0) {
        this.basicGroups.push({
          title: groupName,
          characters: chars
        })
      }
    }

    // Combination groups
    const combinationGroupNames = this.showHiragana 
      ? ['ようおん', 'ようおん だくてん', 'ようおん はんだくてん']
      : ['ヨウオン', 'ヨウオン ダクテン', 'ヨウオン ハンダクテン']
    
    this.combinationGroups = []
    
    for (const groupName of combinationGroupNames) {
      const chars = (this.showHiragana ? hiraganaData : katakanaData).filter(char => char.group === groupName)
      if (chars.length > 0) {
        this.combinationGroups.push({
          title: groupName,
          characters: chars
        })
      }
    }
  }
}
