import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Bulls and Cows",
  description: "Learn how to play Bulls and Cows - The Classic Code-Breaking Game",
};

export default function About() {
  return (
    <main className="min-h-screen pt-24 px-4 md:px-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">How to Play Bulls and Cows</h1>
        
        <div className="space-y-8 text-gray-300">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Game Overview</h2>
            <p>
              Bulls and Cows is a classic code-breaking game where you need to guess a secret 4-digit number.
              Each digit is unique (0-9), and after each guess, you'll receive feedback in the form of Bulls and Cows.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">What are Bulls? 🎯</h2>
            <p>
              A <span className="text-white font-medium">Bull</span> means you've guessed a correct digit in the correct position.
            </p>
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-sm">Example:</p>
              <p className="font-mono mt-2">
                Secret: 5146<br />
                Guess:  2186<br />
                Result: 2 Bulls (1 and 6 are in correct positions)
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">What are Cows? 🐮</h2>
            <p>
              A <span className="text-white font-medium">Cow</span> means you've guessed a correct digit but in the wrong position.
            </p>
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-sm">Example:</p>
              <p className="font-mono mt-2">
                Secret: 5146<br />
                Guess:  1594<br />
                Result: 1 Bull (4), 2 Cows (1, 5)
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Tips</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Each digit appears only once in the secret number</li>
              <li>A digit cannot be both a Bull and a Cow</li>
              <li>Use the feedback from each guess to deduce the secret number</li>
              <li>Try to win in as few attempts as possible!</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}