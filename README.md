<p align="center">

  <h2 align="center"> WhatNow preparecenter Platform </h2>
  <p align="center">
    This code repository is dedicated to the server development of the 'WhatNow' platform. 'WhatNow' is designed with a critical mission in mind: to assist communities in effectively preparing for, responding to, and recovering from various hazards. It achieves this by providing tailored, location-specific guidance through key action messages. This platform not only focuses on immediate response strategies but also emphasizes long-term recovery plans, ensuring that communities have the resources and information they need to navigate through and emerge stronger from challenging situations.
  </p>

<p align="center">
   This project was developed in collaboration with the <a href="https://www.ifrc.org/">International Federation of Red Cross and Red Crescent Societies (IFRC)</a> as a part of the <a href="https://www.ucl.ac.uk/computer-science/collaborate/ucl-industry-exchange-network-ucl-ixn">University College London (UCL) Industry Exchange Network (IXN)</a>
</p>

  <p align="center">
    <a href="https://github.com/IFRC-WhatNow-UCL-porject/WhatNow-Server/issues">
      <img alt="GitHub issues" src="https://img.shields.io/github/issues/IFRC-WhatNow-UCL-porject/WhatNow-Server">
    </a>
    <a href="https://github.com/IFRC-WhatNow-UCL-porject/WhatNow-Server/pulls">
      <img alt="GitHub closed pull requests" src="https://img.shields.io/github/issues-pr-closed/IFRC-WhatNow-UCL-porject/WhatNow-Server">
    </a>
     <a href="https://github.com/IFRC-WhatNow-UCL-porject/WhatNow-Server/pulls">
        <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/IFRC-WhatNow-UCL-porject/WhatNow-Server">
    </a>
  </p>
</p>

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Build and Deployment](#build-and-deployment)
  - [Local Builds](#local-builds)
  - [Building and Running Docker Images](#building-and-running-the-docker-images)
  - [Azure Setup](#azure-setup)
- [Testing](#testing)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

## Prerequisites

- Node.js [v19.6.0] or higher is installed.
- npm [9.4.0] is installed.

## Installation

Follow these steps to set up and WhatNow Server locally:

1. Clone the repository:

```bash
git clone https://github.com/IFRC-WhatNow-UCL-porject/WhatNow-Server.git
```

2. Install the dependencies

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

WhatNow server should now be running on http://localhost:5000.

# Azure Setup

This guide provides step-by-step instructions to deploy a Docker container to Azure Web App for Containers using Azure Container Registry.

## Part 1: Deployment using Azure CLI

In this guide, we'll assume the name of the registry is `registryName`. And make sure you have azure CLI installed on your machine.

### Step 1: Azure Login and Create a Container Registry

1. **Log into your azure account**: Make sure you have azure CLI installed on your machine. When the login web is directed, enter your username and password to finish process. After successfullty login, the resource group information should be showed on youe terminal.

   ```bash
   az login
   ```

2. **create a registry**: Container Registry is an Azure service that you can use to create your own private Docker registries. You can create a registry by using the Azure CLI `acr create` command.

   ```bash
   az acr create --name registryName --resource-group mygroup --sku standard --admin-enabled true
   ```

### Step 2: Build and Push Your Docker Container

1. **Build and Push Docker image to Container Registry**:

   ```bash
   az acr build --registry registryName --image serverimage .
   ```

2. Check the Pushed Image:

After pushing, verify that the Docker container image is available in your Azure Container Registry.

## Part 2: Deploy Docker Container to Azure Web App for Containers

### Step 1: Create Azure Web App for Containers

1. In the Azure portal, navigate to the "Create a resource" section.
2. Search for "Web App for Containers" and select it.
3. Choose a unique name for your web app.
4. Configure the necessary settings such as the resource group, operating system, and app service plan.
5. Under "Configure container," choose "Azure Container Registry" as the image source.
6. Provide the registry details and the image path (e.g., `registryName.azurecr.io/whatnow:latest`).

### Step 4: Enable Continuous Deployment

1. In your Azure Web App's settings, navigate to the "Deployment Center" section.
2. Turn on Continuous Deployment (CD) and select the appropriate source repository (e.g., GitHub).
3. Configure the deployment settings as needed, ensuring automatic deployments are triggered upon repository changes.

### Step 5: Finalise and Test

1. Save the configurations and let the CD process deploy your Docker container to the Azure Web App.
2. Once deployed, navigate to the URL of your Azure Web App to access the containerised application.

Remember to replace "registryName" with your actual Azure Container Registry name.

## Testing

Swagger:

- Fisrt `npm run dev`
- Then go to `localhost/api_docs`

Unit test

- if there is no seeder database, uncomment seeder part in app.js to initialize
- run `npm run unit_test` for unit test

## Contributing

If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch with a descriptive name (e.g., feature/awesome-feature).
3. Make your changes and commit them with a clear and concise commit message.
4. Push your changes to your forked repository.
   Create a pull request and describe the changes you've made.

## Acknowledgements

Built at [University College London](https://www.ucl.ac.uk/) in cooperation with [IFRC](https://www.ifrc.org/).

Academic supervision: Prof Graham Roberts
