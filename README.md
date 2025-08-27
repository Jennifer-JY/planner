# Planview

_This project is a work-in-progress. I’m continuously learning and improving it_

## 🎬 Demo

![Login as a guest user, see the calendar and add todo.](docs/demo-calendar.gif)

## Description

PlanView is a calendar app inspired by the way I plan my own life. It provides a clean month overview and lets users click on individual dates to edit their daily content.

- 🔐 Users can register and log in to manage their own calendars.

  - **Note:**
    You can click **“Try it out as a guest”** to use the calendar just like a logged-in user.

- 📝 The text editor is built with Tiptap, supporting:

  - Rich text formatting: bold, italic, and different font families

  - Text highlighting and custom colours for better visual organisation

This project focuses on simplicity, clarity, and real-world usability.

## 📝 Usage Tips

- Click on a date to open the editor.
- Add your to-do items and click Save to store them.
- Return to the date to view your saved content.

**Note:**

- You can click **“Try it out as a guest”** to use the calendar just like a logged-in user.

## 🛠️ Tech Stack

- Next.js

- TypeScript

- Tailwind CSS

- Auth.js (for authentication)

- Prisma + Neon (PostgreSQL database)

## 🚀 Live Demo

[Planview on Vercel](https://planner-drab-two.vercel.app/)

## Clone the repo

```bash
# Clone with SSH (if you have SSH keys set up)
git clone git@github.com:Jennifer-JY/planner.git

# OR clone with HTTPS
# git clone https://github.com/Jennifer-JY/planner.git
```

## Installation

```bash
pnpm install
```

## Usage

```bash
pnpm run dev
```

## Run tests

```bash
pnpm run test
```

## Project status

👩🏻‍💻 In progress

- All major features are implemented
- Currently refining UI/UX, cleaning up code, and adding tests
