# My Expenses

App for tracking expenses across wallets, cards and cash, in Costa Rican colones (₡).

**Stack:** React + TypeScript + Vite · Tailwind CSS v4 · Bootstrap Icons

## Getting started

```
npm install   # first time only
npm run dev
```
or go to the next github pages url:
https://jose0305rm.github.io/My_Expenses/

## Features

* Wallets (create, edit, delete), each showing its total balance.
* Multiple cards per wallet and a single cash account, each with a starting balance.
* Log expenses (red) and add funds/deposits (green) with amount, date and description; edit or delete them.
* History with filters (all / expenses / deposits) and a totals summary.
* Balances can never go negative (when adding an expense, editing amounts or deleting deposits).

## Privacy

There is no server or database: everything is stored in each visitor's browser `localStorage` (key `control-gastos:data:v1`). Anyone who opens the project from the portfolio sees only their own data, and you see only yours.

Data is lost if the user clears their browser data, and it is not synced across devices.
