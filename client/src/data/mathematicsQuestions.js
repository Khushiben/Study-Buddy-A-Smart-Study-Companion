export const mathematicsQuestions = {
  chapters: [
    {
  name: "Multiplication",
  questions: [

    // 🔹 2×2 (First–Cross–Last)
    {
      shortcut: "(2×2) First–Cross–Last → (a×c) | (a×d + b×c) | (b×d).",
      text: "What is 23 × 14?",
      options: ["312", "322", "332", "342"],
      correct: "322",
    },
    {
      shortcut: "First–Cross–Last method.",
      text: "What is 47 × 36?",
      options: ["1592", "1692", "1792", "1892"],
      correct: "1692",
    },
    {
      shortcut: "First–Cross–Last method.",
      text: "What is 58 × 27?",
      options: ["1566", "1564", "1576", "1586"],
      correct: "1566",
    },

    // 🔹 3×3 (Expand Pattern)
    {
      shortcut: "(3×3) Expand Pattern → 1-2-3-2-1",
      text: "What is 123 × 456?",
      options: ["55088", "56088", "57088", "58088"],
      correct: "56088",
    },
    {
      shortcut: "Expand Pattern method.",
      text: "What is 234 × 321?",
      options: ["74014", "75114", "75214", "75314"],
      correct: "75114",
    },
    {
      shortcut: "Expand Pattern method.",
      text: "What is 145 × 236?",
      options: ["34220", "34120", "34320", "34420"],
      correct: "34220",
    },

    // 🔹 3×2
    {
      shortcut: "(3×2) → (c×e) | (b×e + c×d) | (a×e + b×d) | (a×d)",
      text: "What is 123 × 45?",
      options: ["5535", "5525", "5545", "5555"],
      correct: "5535",
    },
    {
      shortcut: "3×2 pattern.",
      text: "What is 234 × 56?",
      options: ["13104", "13114", "13204", "13304"],
      correct: "13104",
    },
    {
      shortcut: "3×2 pattern.",
      text: "What is 312 × 24?",
      options: ["7488", "7588", "7688", "7788"],
      correct: "7488",
    },

    // 🔹 ×99 / ×999
    {
      shortcut: "(99×n) → (n-1) | (100-n)",
      text: "What is 47 × 99?",
      options: ["4553", "4653", "4753", "4853"],
      correct: "4653",
    },
    {
      shortcut: "99×n method.",
      text: "What is 84 × 99?",
      options: ["8216", "8316", "8416", "8516"],
      correct: "8316",
    },
    {
      shortcut: "(999×n) → (n-1) | (1000-n)",
      text: "What is 123 × 999?",
      options: ["122877", "123877", "124877", "125877"],
      correct: "122877",
    },

    // 🔹 ×11 Trick
    {
      shortcut: "(×11) → Keep digits same, middle = sum of digits",
      text: "What is 23 × 11?",
      options: ["243", "253", "263", "273"],
      correct: "253",
    },
    {
      shortcut: "×11 method.",
      text: "What is 45 × 11?",
      options: ["485", "495", "505", "515"],
      correct: "495",
    },
    {
      shortcut: "×11 method.",
      text: "What is 67 × 11?",
      options: ["727", "737", "747", "757"],
      correct: "737",
    },

    // 🔹 ×101 / ×1001 / ×10001 (Repeating Trick)
    {
      shortcut: "(×101) → repeat number with gap → n0n",
      text: "What is 23 × 101?",
      options: ["2323", "2303", "2333", "2313"],
      correct: "2323",
    },
    {
      shortcut: "(×1001) → repeat number → n n",
      text: "What is 45 × 1001?",
      options: ["45045", "4545", "44545", "45545"],
      correct: "45045",
    },
    {
      shortcut: "(×10001) → repeat number → n00n",
      text: "What is 67 × 10001?",
      options: ["670067", "6767", "670067", "671067"],
      correct: "670067",
    },

      ],
    },
     {
  name: "Squares & Cubes",
  questions: [

    // 🔹 Normal Squares (3)
    {
      shortcut: "(ab)² → write as (a²) | (2ab) | (b²), then calculate from right to left and handle carry.",
      text: "What is 23²?",
      options: ["519", "529", "539", "549"],
      correct: "529",
    },
    {
      shortcut: "(ab)² → write as (a²) | (2ab) | (b²), then calculate from right to left and handle carry.",
      text: "What is 78²?",
      options: ["5984", "6084", "6184", "6284"],
      correct: "6084",
    },
    {
      shortcut: "Square pattern method.",
      text: "What is 92²?",
      options: ["8364", "8464", "8564", "8664"],
      correct: "8464",
    },

    // 🔹 Squares ending with 5
    {
      shortcut: "(n5)² → n×(n+1) | 25 (no carry needed).",
      text: "What is 25²?",
      options: ["615", "625", "635", "645"],
      correct: "625",
    },
    {
      shortcut: "(n5)² → n×(n+1) | 25 (no carry needed).",
      text: "What is 45²?",
      options: ["1925", "2025", "2125", "2225"],
      correct: "2025",
    },
    {
      shortcut: "Ending with 5 trick.",
      text: "What is 65²?",
      options: ["4125", "4225", "4325", "4425"],
      correct: "4225",
    },

    // 🔹 Cubes (3)
    {
      shortcut: "(ab)³ → write as (a³) | (3a²b) | (3ab²) | (b³), then solve from right to left with carry.",
      text: "What is 12³?",
      options: ["1628", "1728", "1828", "1928"],
      correct: "1728",
    },
    {
      shortcut: "Cube pattern → (a³ | 3a²b | 3ab² | b³), calculate right to left.",
      text: "What is 13³?",
      options: ["2097", "2197", "2297", "2397"],
      correct: "2197",
    },
    {
      shortcut: "Cube pattern method.",
      text: "What is 15³?",
      options: ["3275", "3375", "3475", "3575"],
      correct: "3375",
    },

  ],
}
],
  
};