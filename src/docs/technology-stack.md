# Architecture Overview

This document provides an overview of the technologies and architectural patterns used in the AURA application.

## Frontend (aura-frontend)

The frontend is a single-page application built with [React](https://reactjs.org/).

* **Framework/Library:** [React](https://reactjs.org/) (v18)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **UI Toolkit:** [Chakra UI](https://chakra-ui.com/)
* **Routing:** [React Router](https://reactrouter.com/) (v6)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand)
* **Data Fetching/Caching:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
* **Forms:** [TanStack Form](https://tanstack.com/form/latest), [Zod](https://zod.dev/) (validation)
* **Styling:** [Chakra UI](https://chakra-ui.com/) (Component-based styling), [Emotion](https://emotion.sh/)
* **Markdown Rendering:** [React Markdown](https://github.com/remarkjs/react-markdown), [Remark Gfm](https://github.com/remarkjs/remark-gfm), [Rehype Slug](https://github.com/rehypejs/rehype-slug), [Rehype Autolink Headings](https://github.com/rehypejs/rehype-autolink-headings)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Testing:** [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), [MSW (Mock Service Worker)](https://mswjs.io/)
* **Utilities:** [UUID](https://github.com/uuidjs/uuid)

---

## Backend (AURA API)

The backend is a [Node.js](https://nodejs.org/) application providing a RESTful API for the frontend.

* **Language/Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Database:** [PostgreSQL](https://www.postgresql.org/) (via `pg` client)
* **Authentication:**
  * [Passport.js](http://www.passportjs.org/) (Core middleware)
  * Active Directory/LDAP Strategy (`passport-activedirectory`, `ldapjs`)
  * [JSON Web Tokens (JWT)](https://jwt.io/) (`jsonwebtoken`)
  * Session Management (`express-session`)
* **Key Libraries:**
  * [CORS](https://github.com/expressjs/cors) (Cross-Origin Resource Sharing)
  * [dotenv](https://github.com/motdotla/dotenv) (Environment variables)
  * [json2csv](https://github.com/zemirco/json2csv) (JSON to CSV conversion)
  * [UUID](https://github.com/uuidjs/uuid) (Unique identifiers)
* **Testing:** [Vitest](https://vitest.dev/), [Supertest](https://github.com/visionmedia/supertest)

---

## Microservices

#### AMER Authentication Service (`amer-auth-service`)

A dedicated [Node.js](https://nodejs.org/) microservice deployed in the AMER region to handle authentication against the specific AMER Active Directory domain.

* **Language/Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Authentication:**
  * [Passport.js](http://www.passportjs.org/)
  * Active Directory/LDAP Strategy (`passport-activedirectory`, `ldapjs`)
  * [JSON Web Tokens (JWT)](https://jwt.io/) (`jsonwebtoken`)
  * Session Management (`express-session`)
* **Logging:** [Winston](https://github.com/winstonjs/winston)
* **Key Libraries:**
  * [CORS](https://github.com/expressjs/cors)
  * [dotenv](https://github.com/motdotla/dotenv)
* **Testing:** [Jest](https://jestjs.io/), [Supertest](https://github.com/visionmedia/supertest)

---

## Infrastructure & DevOps

This section outlines the tools and platforms used for building, deploying, and running the AURA application.

* **CI/CD:** [GitLab CI/CD](https://docs.gitlab.com/ee/ci/)
* **Containerization:** [Docker](https://www.docker.com/), [Podman](https://podman.io/)
* **Artifact Repository:** [JFrog Artifactory](https://jfrog.com/artifactory/)
* **Operating System:** [Red Hat Enterprise Linux (RHEL) 9](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux)
* **Monitoring/Logging:** [Elastic Stack (Elasticsearch, Logstash, Kibana)](https://www.elastic.co/elastic-stack/)
* **Hosting/Orchestration:** Self-hosted on [VMware](https://www.vmware.com/) infrastructure
* **Configuration Management:** Manual configuration (No dedicated tools)
* **Networking/Load Balancing:** [Nginx](https://www.nginx.com/) (Used as reverse proxy / load balancer)
* **Secrets Management:** Stored securely within [GitLab CI/CD Variables](https://docs.gitlab.com/ee/ci/variables/)