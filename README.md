# york-think-tank-website
A work in progress website for the York Think Tank, using Strapi for the content management system (CMS)/ backend, Sveltekit for the frontend.

## Strapi
Strapi is a FOSS headless CMS that let you define content types (like the pojects, journals and forums) and instantly get a REST API. 
This is choosen as it comes with an UI at `/admin`, non-technical users can just login and see a UI to write, edit and publish articles like a regular CMS, without needing to write a CMS from scrach. 
### How to run Strapi
1. clone the repo
2. Install docker and docker compose
3. Run `docker compose up` in the root of the repo
4. cd into `content-management-system`
5. Run `npm install` to install the dependencies
6. Run `npm run develop` to start the Strapi server
7. Open `http://localhost:1337/admin` in your browser to access the Strapi
8. Your changes will be in the `scr/api/` so need to commit that to the repo
## Frontend
The frontend will be written with Svelte and consume the Strapi endpoints, this will be created first, with dummy data.

## License
This project is licensed under the MIT License, see the [LICENSE](LICENSE) file for details.