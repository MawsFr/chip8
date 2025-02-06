# Typescript Chip8 emulator + Tests (TDD)

This is a [CHIP-8](http://en.wikipedia.org/wiki/CHIP-8) emulator written in Typescript.

<h2 align="center"><a href="https://mawsfr.github.io/chip8/">VIEW DEMO</a></h2>
<h3 align="center"><a href="https://github.com/MawsFr/chip8/tree/main/roms">Download ROMS</a></h3>

> [!WARNING]
> Frontend is not done yet, it's just a simple Vue.js app to display the emulator state. And yes there are bugs. I'm
> planning to make it more user-friendly and add more features.

## What I tried to achieve and how I feel after finishing it

I wanted to create a CHIP-8 emulator in Typescript, using TDD and finally did it after all these years thinking about
it. I wanted to have a good test coverage and a good implementation of all CHIP-8 op-codes. I also turned off Github
Copilot to have a good understanding of what I'm doing. It took me 3 full time days to finish it + 1 day of refactoring.
I didn't pay too much attention to committing often, so the commits are quite big, sorry about that. I was too excited
to see my emulator working ^^
I'm quite satisfied about it as it does what it's supposed to do and I'm happy that I managed to do it in TDD and it was
a very good exercise ! I also learned a lot about CHIP-8 and how it works and solidified my knowledge about Typescript,
TDD and emulators !

## How to run it

1. Clone the repository
2. Run `pnpm install`
3. Run `pnpm run dev`
4. Open your browser and go to `http://localhost:5173/`
5. Click on "Ouvrir un fichier" and select a CHIP-8 ROM (included in this repo)
6. Enjoy ! (Keys are on the Numpad)

## Features

- You can see where the program counter is and execute the next instruction
- You can pause the execution
- You can reset the rom
- You can show a grid on the screen
- You can see the registers, the stack, the memory, the keyboard state, the timers and the screen

## What's Next ?

I hope this will be a project that I'll continue to work and improve. I'll try to use it to continue practising my
Vue.js and typescript. I'm also very excited to try implementing another emulator like GB or NES ! Or maybe I'll try to
make a series of videos about how to create an emulator in Typescript ! Who knows ? ^^
One last idea I have in mind is that I could create an online CHIP-8 interactive course where you can learn how step by
step how to create a CHIP-8 emulator in Typescript. I also want to learn making games for CHIP-8 (with the asm) and
maybe facilitate game creation with a language like Lua or Python.

Too much ^^" ?
