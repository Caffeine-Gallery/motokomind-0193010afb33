import Bool "mo:base/Bool";
import List "mo:base/List";

import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Option "mo:base/Option";
import Random "mo:base/Random";
import Text "mo:base/Text";
import Char "mo:base/Char";
import Buffer "mo:base/Buffer";

actor Wordle {
  // List of 5-letter words
  let words : [Text] = ["APPLE", "BEACH", "CHAIR", "DANCE", "EAGLE", "FLAME", "GRAPE", "HOUSE", "IMAGE", "JUICE"];

  // Game state
  stable var currentWord : Text = "";
  stable var attempts : Nat = 0;
  stable var gameOver : Bool = false;

  // Initialize a new game
  public func newGame() : async () {
    let randomBytes = await Random.blob();
    let randomIndex = Nat8.toNat(Random.byteFrom(randomBytes)) % words.size();
    currentWord := words[randomIndex];
    attempts := 0;
    gameOver := false;
  };

  // Validate a guess
  public func validateGuess(guess : Text) : async ?[Nat8] {
    if (gameOver or Text.size(guess) != 5) {
      return null;
    };

    attempts += 1;
    if (attempts >= 6) {
      gameOver := true;
    };

    let result = Buffer.Buffer<Nat8>(5);
    for (_ in Iter.range(0, 4)) {
      result.add(0);
    };

    let guessChars = Buffer.fromArray<Char>(Iter.toArray(Text.toIter(Text.toUppercase(guess))));
    let wordChars = Buffer.fromArray<Char>(Iter.toArray(Text.toIter(currentWord)));

    // Check for correct letters in correct positions
    for (i in Iter.range(0, 4)) {
      if (guessChars.get(i) == wordChars.get(i)) {
        result.put(i, 2); // Green
        guessChars.put(i, ' ');
        wordChars.put(i, ' ');
      };
    };

    // Check for correct letters in wrong positions
    for (i in Iter.range(0, 4)) {
      if (guessChars.get(i) != ' ') {
        let index = Buffer.indexOf<Char>(guessChars.get(i), wordChars, Char.equal);
        switch (index) {
          case (?foundIndex) {
            result.put(i, 1); // Yellow
            wordChars.put(foundIndex, ' ');
          };
          case null {
            result.put(i, 0); // Gray
          };
        };
      };
    };

    if (guess == currentWord) {
      gameOver := true;
    };

    ?Buffer.toArray(result);
  };

  // Get game status
  public func getGameStatus() : async (Bool, Nat) {
    (gameOver, attempts)
  };
}
