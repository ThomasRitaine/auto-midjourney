<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ThomasRitaine/auto-midjourney">
    <img src="docs/image/logo-whitebg.webp" alt="Logo" style="width:100%;max-width:500px;">
  </a>

<h3 align="center">Auto Midjourney</h3>

  <p align="center">
    A web application that brings Efficiency to AI Art Generation, Management and Social Sharing.
    <br />
    <a href="https://github.com/ThomasRitaine/auto-midjourney"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/ThomasRitaine/auto-midjourney">View Demo</a>
    ·
    <a href="https://github.com/ThomasRitaine/auto-midjourney/issues">Report Bug</a>
    ·
    <a href="https://github.com/ThomasRitaine/auto-midjourney/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#environment-variables">Environment Variables</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#folder-structure">Folder Structure</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Collection Page Screenshot][collections-screenshot]](https://labs.ai-art.tv)

A toolkit for AI art generation and management:

- **Automated Art Generation**: Utilize Midjourney within Discord for creating AI-driven art.
- **Discord Automation**: Automates interactions for image generation, upscaling and download.
- **Image Management**: Webp conversion and optimization tool, intuitive UI to download, delete, see prompt, etc.
- **User Account System**: Managed via Passport.js with JWT for secure sessions.
- **Social Media Integration**: Post favorited art to Twitter and Instagram with GPT-4 generated descriptions.
- **Developer Focus**: Detailed documentation, Docker-based dev and prod environement, and GitHub Actions for CI/CD.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This project was built using a range of technologies, ensuring robustness and efficiency:

- [![Docker][Docker-shield]][Docker-url]
- [![Node.js][Node.js-shield]][Node.js-url]
- [![TypeScript][TypeScript-shield]][TypeScript-url]
- [![Express][Express-shield]][Express-url]
- [![Prisma][Prisma-shield]][Prisma-url]
- [![Passport][Passport-shield]][Passport-url]
- [![JWT][JWT-shield]][JWT-url]
- [![GPT-4][GPT-4-shield]][GPT-4-url]
- [![GitHub Actions][GitHubActions-shield]][GitHubActions-url]
- [![Bootstrap][Bootstrap.com]][Bootstrap-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

Ensure you have the following installed:

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/ThomasRitaine/auto-midjourney.git
   ```
2. Navigate to the project directory:
   ```sh
   cd auto-midjourney
   ```
3. Set up your environment variables:
   - Copy `.env.example` to a new `.env` file.
   - Fill in the necessary details in `.env`, see the next section.
4. Start the environment:
   - For development environment:
     ```sh
     docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
     ```
   - For production environment:
     ```sh
     docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
     ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file.\
The **example values** provided below are **purely illustrative and not valid** for actual use. Replace them with your specific keys, tokens, and passwords.

| Variable Name                            | Description                                                 | Example Value                                                            |
| ---------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------ |
| `DATABASE_NAME`                          | Name of the database.                                       | `auto_midjourney_db`                                                     |
| `DATABASE_USER_NAME`                     | Username for database access.                               | `dbuser`                                                                 |
| `DATABASE_USER_PASSWORD`                 | Password for the database user.                             | `dbpassword`                                                             |
| `JWT_SECRET`                             | Secret key for JWT authentication.                          | `PDq5bpczSuM365fqv89jXgQJp838fSHh`                                       |
| `SERVER_ID`                              | Discord server ID where the bot operates.                   | `123456789012345678`                                                     |
| `CHANNEL_ID`                             | Discord channel ID for interacting with the Midjourney bot. | `987654321098765432`                                                     |
| `SALAI_TOKEN`                            | Discord token for authentication.                           | `xEfxFcqNUN7paax8fG7QHz99.2a53S9.rrX2KZgdhyCTEQLnsH5ut92i6zu3mb2iRJqFb9` |
| `OPENAI_API_KEY`                         | API key for accessing OpenAI services.                      | `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`                    |
| `SOCIAL_MEDIA_POSTING_INTERVAL_MINUTES`  | Interval in minutes for social media bot to post.           | `60`                                                                     |
| `SOCIAL_MEDIA_POSTING_VARIATION_MINUTES` | Variation in minutes for the posting interval.              | `15`                                                                     |
| `TWITTER_OAUTH1_CONSUMER_API_KEY`        | OAuth1 Consumer API Key for Twitter.                        | `9ik24sZdHMZeRMM927EiqS3gH`                                              |
| `TWITTER_OAUTH1_CONSUMER_API_SECRET`     | OAuth1 Consumer API Secret for Twitter.                     | `7vr9mksKkkMqi45njSTt9NhhC5RChmp3Fbm3yoLAS428nQoiw3`                     |
| `TWITTER_OAUTH2_CLIENT_ID`               | OAuth2 Client ID for Twitter.                               | `rG9n6402A3dbUJKzXTNX4oWHJ`                                              |
| `TWITTER_OAUTH2_CLIENT_SECRET`           | OAuth2 Client Secret for Twitter.                           | `267rF6_-Jm3987vaSxTd9vZF64AX8krbq9gPzE_4Tj8JLH4fh3C`                    |
| `INSTAGRAM_USER_NAME`                    | Instagram account username for the bot.                     | `thomas_ritaine_auto_midjourney`                                         |
| `INSTAGRAM_USER_PASSWORD`                | Instagram account password for the bot.                     | `3^3bW9W^A*4N#uyur9`                                                     |

Please ensure to replace these example values with actual data relevant to your setup.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

In the development environment, you can access the following services:

| Service Name  | URL                                            | Description                                                                                                                                            |
| ------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Application   | [http://localhost](http://localhost)           | The main application, running on Node.js.                                                                                                              |
| Adminer       | [http://localhost:8080](http://localhost:8080) | Adminer provides a web interface for database management, particularly useful for direct SQL queries and database schema inspection.                   |
| Prisma Studio | [http://localhost:5555](http://localhost:5555) | Prisma Studio offers a more user-friendly GUI for viewing and editing data in your database, ideal for those who prefer not to work directly with SQL. |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FOLDER STRUCTURE AND EXPLANATIONS -->

## Folder Structure

```
.
├── .github/workflows/        # GitHub Actions workflows for CI/CD.
├── docs/                     # Project documentation and resources.
│   └── image/                # Images used to illustrate the documentation.
├── image/                    # Contains all AI generated images.
├── node_modules/             # Contains all npm packages installed for the project.
├── prisma/                   # Prisma ORM configurations and schemas.
│   ├── migrations/           # Database migration files.
│   └── schema.prisma         # Prisma database schema.
├── public/                   # Public static files served by the application
│   ├── script/               # JavaScript files for front-end functionality.
│   └── style/                # CSS files for styling the application.
├── src/                      # Source code of the project.
│   ├── middlewares/          # Middleware functions for Express.
│   ├── routes/               # HTTP route definitions for the application.
│   ├── services/             # Modular services for specific functionalities.
│   │   ├── auth/             # Services for authentication and authorization.
│   │   ├── instagram/        # Services related to Instagram integration.
│   │   ├── midjourney/       # Services for interacting with Midjourney via Discord.
│   │   ├── openai/           # Services utilizing OpenAI for content generation.
│   │   ├── prisma-crud/      # CRUD operations using Prisma ORM.
│   │   ├── social-media-bot/ # Services for social media bot functionalities.
│   │   └── twitter/          # Twitter integration and posting services.
│   ├── util/                 # Utility functions and helpers.
│   ├── views/                # EJS templates for rendering views.
│   └── app.ts                # Main application setup file.
├── .dockerignore             # Specifies files to ignore in Docker builds.
├── .env                      # Your personal environment variables, do not commit
├── .env.example              # Example environment variables setup.
├── .eslintignore             # Files and folders ignored by ESLint.
├── .eslintrc.yml             # ESLint configuration and rules.
├── .gitignore                # Specifies files to be ignored by Git.
├── .prettierrc               # Prettier code formatting configurations.
├── docker-compose.dev.yml    # Docker compose file for the development environment.
├── docker-compose.prod.yml   # Docker compose file for the production environment.
├── docker-compose.yml        # Common docker compose config between dev and prod.
├── Dockerfile                # Instructions to build the app production Docker image.
├── package-lock.json         # Locked versions of installed npm packages.
├── package.json              # npm packages, configurations and scripts.
├── README.md                 # High level project documentation.
└── tsconfig.json             # TypeScript configuration file.
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

This is a personal project, and its primary goal is not widespread popularity. As such, there is no formal roadmap for future features. The project will evolve based on my personal interests and the new technologies I wish to explore.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

I welcome community involvement:

- **Issues**: Feel free to open issues to report bugs or request features.
- **Pull Requests**: Contributions via pull requests are also welcome.
- **Forking**: Feel free to fork and adapt the project as you like with proper credit.

Keep in mind that updates and new features will be implemented as per my discretion and interest in the technology.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Thomas Ritaine - [@ai_art_tv](https://twitter.com/ai_art_tv) - thomas@ritaine.com

Project Link: [https://github.com/ThomasRitaine/auto-midjourney](https://github.com/ThomasRitaine/auto-midjourney)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

A special thanks to the following resources and individuals who have contributed to the success of this project:

- [midjourney-api](https://github.com/erictik/midjourney-api) - For the initial inspiration and API reference for interacting with Midjourney over Discord.
- [Midjourney](https://www.midjourney.com/) - For the inspiration and AI art generation capabilities.
- [OpenAI](https://openai.com/) - For the GPT-4 model used in content generation.
- [Node.js](https://nodejs.org/) - For the JavaScript runtime environment.
- [Prisma](https://www.prisma.io/) - For the database access and management.
- [Docker](https://www.docker.com/) - For containerizing the application.

This project stands on the shoulders of these incredible technologies and the communities behind them.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/ThomasRitaine/auto-midjourney.svg?style=for-the-badge
[contributors-url]: https://github.com/ThomasRitaine/auto-midjourney/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ThomasRitaine/auto-midjourney.svg?style=for-the-badge
[forks-url]: https://github.com/ThomasRitaine/auto-midjourney/network/members
[stars-shield]: https://img.shields.io/github/stars/ThomasRitaine/auto-midjourney.svg?style=for-the-badge
[stars-url]: https://github.com/ThomasRitaine/auto-midjourney/stargazers
[issues-shield]: https://img.shields.io/github/issues/ThomasRitaine/auto-midjourney.svg?style=for-the-badge
[issues-url]: https://github.com/ThomasRitaine/auto-midjourney/issues
[license-shield]: https://img.shields.io/github/license/ThomasRitaine/auto-midjourney.svg?style=for-the-badge
[license-url]: https://github.com/ThomasRitaine/auto-midjourney/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/thomas-ritaine
[collections-screenshot]: docs/image/collections.webp
[TypeScript-shield]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Node.js-shield]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node.js-url]: https://nodejs.org/
[Express-shield]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[Docker-shield]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
[Prisma-shield]: https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[Passport-shield]: https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=passport&logoColor=white
[Passport-url]: http://www.passportjs.org/
[JWT-shield]: https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white
[JWT-url]: https://jwt.io/
[GPT-4-shield]: https://img.shields.io/badge/GPT--4-000000?style=for-the-badge&logo=openai&logoColor=white
[GPT-4-url]: https://www.openai.com/
[GitHubActions-shield]: https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white
[GitHubActions-url]: https://github.com/features/actions
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
